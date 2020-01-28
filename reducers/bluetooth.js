import {
  CONNECT_PENDING, CONNECT_SUCCESS, CONNECT_FAILURE, START_SCAN, STOP_SCAN, FOUND_SCAN, SET_RX, SET_DATA,
  DISCONNECT_PENDING, DISCONNECT_SUCCESS, DISCONNECT_FAILURE,SUBSCRIPTION_ON_DISCONNECTED, SET_WRITE_SUBCRIPTION
} from '../actionTypes/bluetooth'

import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';
import { stopScaning } from '../actions';

const initialState = {
  manager: new BleManager(),
  pending: false,
  error: false,
  isScanning: false,
  isConnected: false,
  deviceNames: [],
  device: null,
  deviceList: [],
  params: [],
  scanTimer: null,
  subscriptionOnDisconnected: null,
  data: [],
  writeSubcription: null, // todo
  rx:''
}

const bluetooth = (state = initialState, action) => {
  switch (action.type) {
    case SET_WRITE_SUBCRIPTION:
      return{
        ...state,
        writeSubcription: action.payload
      }
    case SET_DATA:
      return{
        ...state,
        data: action.payload
      }
      case SET_RX:
      return{
        ...state,
        rx: action.payload
      }
    case START_SCAN:
      return {
        ...state,
        isScanning: true,
        isConnected: false,
        deviceNames: [],
        deviceList: [],
        scanTimer: action.payload.scanTimer
      }
    case STOP_SCAN:
      return {
        ...state,
        isScanning: false,
        scanTimer: null
      };
    case FOUND_SCAN:
      return {
        ...state,
        deviceList:[...state.deviceList, action.payload.device],
        deviceNames:[...state.deviceNames, action.payload.device.name]
      }
    case CONNECT_PENDING:
      return {
        ...state,
        pending: true,
        error: false
      };

    case CONNECT_SUCCESS:
      return {
        ...state,
        pending: false,
        isConnected: true,
        device: action.payload,
        deviceList:[],
        deviceNames:[]
      };

    case DISCONNECT_PENDING:
      return {
        ...state,
        pending: true,
        error: false,
      };
case SUBSCRIPTION_ON_DISCONNECTED:
  return{
    ...state,
    subscriptionOnDisconnected: null
  }
    case DISCONNECT_SUCCESS:
      return {
        ...state,
        pending: false,
        subscriptionOnDisconnected: null,
        device: null,
        isScanning:false,
        isConnected: false,
      };

    default:
      return state;
  }
}

export default bluetooth