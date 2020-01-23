import {
  CONNECT_PENDING, CONNECT_SUCCESS, CONNECT_FAILURE,
  DISCONNECT_PENDING, DISCONNECT_SUCCESS, DISCONNECT_FAILURE,
} from '../actionTypes/bluetooth'

export const connectDevice = device => {
  return { type: CONNECT_SUCCESS, payload: device }
}

export const disconnect = () => {
  return { type: DISCONNECT_SUCCESS}
}