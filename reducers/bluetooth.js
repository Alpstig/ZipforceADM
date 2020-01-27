import {
  CONNECT_PENDING, CONNECT_SUCCESS, CONNECT_FAILURE, START_SCAN,
  DISCONNECT_PENDING, DISCONNECT_SUCCESS, DISCONNECT_FAILURE,
} from '../actionTypes/bluetooth'

import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';

const initialState = {
  manager: new BleManager(),
  pending: false,
  error: false,
  isScanning: false,
  isConnected: false,
  deviceNames: [],
  device: {},
  deviceList: [],
  params:[]
}

const bluetooth = (state = initialState, action) => {
  switch (action.type) {
    case START_SCAN:
      return{
        ...state,
        isScanning:true,
        isConnected:false,
        deviceNames: [],
        deviceList: []
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
        device: action.payload
      };

    case DISCONNECT_PENDING:
      return {
        ...state,
        pending: true,
        error: false,
      };

    case DISCONNECT_SUCCESS:
      return {
        ...state,
        pending: false,
        isConnected: false,
      };

    default:
      return state;
  }
}

export default bluetooth