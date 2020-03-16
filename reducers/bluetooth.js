import {
  CONNECT_PENDING, CONNECT_SUCCESS, CONNECT_FAILURE, START_SCAN, STOP_SCAN, FOUND_SCAN, SET_RX, SET_DATA, LOG_WRITE, SET_CHARACTERISTICS,SET_VALUE,
  DISCONNECT_PENDING, DISCONNECT_SUCCESS, DISCONNECT_FAILURE, SUBSCRIPTION_ON_DISCONNECTED, SET_WRITE_SUBCRIPTION, SET_READ_SUBCRIPTION, LOG_CLEAR
} from '../actionTypes/bluetooth'

import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';
import { act } from 'react-test-renderer';

const initialState = {
  manager: new BleManager(),
  pending: false,
  error: false,
  isScanning: false,
  isLoading: false,
  isConnected: false,
  deviceNames: [],
  device: null,
  deviceList: [],
  params: [],
  scanTimer: null,
  subscriptionOnDisconnected: null,
  data: [],
  value:{
    r:0,
    k:0,
    m:0,
    n:0,
    R:0,
    S:0,
    z:0,
    F:0,
    J:0,
    O:0,
    p:0,
    P:0,
    N:0,
    x:0,
    K:'',
    l:'',
    L:'',
    q:'',
    X:''
  },
  writeSubcription: null,
  readSubcription: null,
  rx: '',
  log: [],
  characteristics: []
}

const bluetooth = (state = initialState, action) => {
  switch (action.type) {
    case SET_VALUE:
      return {
        ...state,
        value: {...state.value, [action.payload.key]: action.payload.value}
      }
    case SET_CHARACTERISTICS:
      return {
        ...state,
        characteristics: action.payload
      }
    case LOG_WRITE:
      return {
        ...state,
        log: [action.payload, ...state.log]
      }
    case LOG_CLEAR:
      return {
        ...state,
        log: []
      }

    case SET_WRITE_SUBCRIPTION:
      return {
        ...state,
        writeSubcription: action.payload
      }
    case SET_READ_SUBCRIPTION:
      return {
        ...state,
        readSubcription: action.payload
      }
    case SET_DATA:
      return {
        ...state,
        data: action.payload
      }
    case SET_RX:
      return {
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
        deviceList: [...state.deviceList, action.payload.device],
        deviceNames: [...state.deviceNames, action.payload.device.name]
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
        deviceList: [],
        deviceNames: []
      };

    case DISCONNECT_PENDING:
      return {
        ...state,
        pending: true,
        error: false,
      };
    case SUBSCRIPTION_ON_DISCONNECTED:
      return {
        ...state,
        subscriptionOnDisconnected: action.payload
      }
    case DISCONNECT_SUCCESS:
      return {
        ...state,
        pending: false,
        subscriptionOnDisconnected: null,
        device: null,
        isScanning: false,
        isConnected: false,
      };

    default:
      return state;
  }
}

export default bluetooth