import { decode, encode } from 'base-64';
import NavigationService from '../NavigationService';
import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';

import {
  CONNECT_PENDING,
  CONNECT_SUCCESS,
  CONNECT_FAILURE,
  START_SCAN,
  STOP_SCAN,
  FOUND_SCAN,
  SUBSCRIPTION_ON_DISCONNECTED,
  DISCONNECT_PENDING,
  DISCONNECT_SUCCESS,
  DISCONNECT_FAILURE,
  SET_DATA,
  SET_RX,
  SET_WRITE_SUBCRIPTION,
  SET_READ_SUBCRIPTION,
  SET_VALUE,
  LOG_CLEAR,
  LOG_WRITE
} from '../actionTypes/bluetooth'

export const setWriteSubcription = data => (dispatch, getState) => {
  dispatch({ type: SET_WRITE_SUBCRIPTION, payload: data })
}
export const setReadSubcription = data => (dispatch, getState) => {
  dispatch({ type: SET_READ_SUBCRIPTION, payload: data })
}

export const setData = data => (dispatch, getState) => {
  dispatch({ type: SET_DATA, payload: data })
}

export const setRx = rx => (dispatch, getState) => {
  dispatch({ type: SET_RX, payload: rx })
}

export const setValue = (key, value) => (dispatch, getState) => {
  dispatch({ type: SET_VALUE, payload: { key, value} })
}

export const initScreens = () => dispatch => {
  dispatch(setData('M'))
}

export const sendToDevice = value => (dispatch, getState) => {
  const { writeSubcription, isConnected, device } = getState().bluetooth
  
  if (writeSubcription != null && isConnected) {
    const {service, characteristicW} = writeSubcription
    device.writeCharacteristicWithResponseForService(
      service, characteristicW, encode(value)
    ).then(result=>{
    }).catch(x=> console.error('writeWithoutResponse ERROR',x))
  }
}

export const serialParser = (rxData) => (dispatch, getState) => {
  const { rx } = getState().bluetooth
  let newRxData = rx + rxData
  let result = newRxData.match(/\#[rkmnRSzFJOpPNxKlLqX](.*?)\*/gm)
  if (result != null) {
    result.forEach(e => {
      e = e.replace('*', '')
      e = e.replace('#', '')
      let key = e.slice(0, 1)
      let value = e.replace(key, '')
      dispatch(setValue(key, value))
    });
    newRxData = newRxData.slice(newRxData.lastIndexOf('*') + 1, newRxData.lastIndexOf('*') + 200)

  }
  dispatch(setRx(newRxData))
}

export const stopScaning = () => (dispatch, getState) => {
  const { scanTimer, manager } = getState().bluetooth
  clearTimeout(scanTimer)
  manager.stopDeviceScan()
  dispatch({ type: STOP_SCAN })
}

export const foundDevice = device => (dispatch, getState) => {
  dispatch({ type: FOUND_SCAN, payload: { device } })
}

export const startScaning = () => (dispatch, getState) => {
  const scanTimer = setTimeout(() => {
    dispatch(stopScaning())
  }, 5000)
  dispatch({ type: START_SCAN, payload: { scanTimer } })
}

export const stateChangeFinnish = () => (dispatch, getState) => {
  const { manager } = getState().bluetooth
  const subscription = manager.onStateChange((state) => {
    if (state === State.PoweredOn) {
      dispatch(scanForDevice())
      subscription.remove();
    }
  }, true);
}

export const startScanForDevice = () => (dispatch, getState) => {
  const { manager } = getState().bluetooth

  const subscription = manager.onStateChange((state) => {
    if (state === State.PoweredOn) {
      dispatch(scanForDevice())
      subscription.remove();
    }
  }, true);
}

export const scanForDevice = () => (dispatch, getState) => {
  const { isScanning, manager, device, isConnected } = getState().bluetooth

  if (isConnected) {
    dispatch(disconnectDevice())
  }
  if (isScanning) {
    dispatch(stopScaning())
  }

  if (device == null) {
    dispatch(startScaning())

    manager.startDeviceScan(null, null, (error, device) => {
      if (device) {
        if (device.name) {
          if (getState().bluetooth.deviceNames.indexOf(device.name) == -1) {
            dispatch(foundDevice(device))
          }
        }
      }

      if (error) {
        dispatch(stopScaning())
        return
      }
    })
  } else {
    device.isConnected().then(connected => {
      if (connected) {
        dispatch(disconnectDevice())
      }
    }).catch(console.error)
  }
}

export const Log = message => (dispatch, getState) => {
  dispatch({ type: LOG_WRITE, payload: message })
}

export const LogClear = () => (dispatch, getState) => {
  dispatch({ type: LOG_CLEAR })
}

export const notifyCharacteristc = (characteristic) => (dispatch, getState) => {
  if (characteristic.uuid.substring(0, 8) == '0000ffe1') {
    characteristic.monitor((error, c) => {
      if(error){
        console.error('notifyCharacteristc',error)
      }
      // if (error) this.setState({ error: true, errorMsg: error.message })
      if (c) {
        dispatch(serialParser(decode(c.value)))
      }
    })
  }
}

export const connectDevice = (device) => (dispatch, getState) => {
  dispatch(stopScaning())
  device
    .connect()
    .then((device) => {
      dispatch({ type: CONNECT_SUCCESS, payload: device })
      dispatch(onDisconnected())
      return device.discoverAllServicesAndCharacteristics();
    })
    .then((device) => {
      const service = '0000ffe0-0000-1000-8000-00805f9b34fb'
      const characteristicN = '0000ffe1-0000-1000-8000-00805f9b34fb'
      const characteristicW = '0000ffe2-0000-1000-8000-00805f9b34fb'

      const readSubcription = device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if(!error){
          dispatch(serialParser(decode(characteristic.value)))
        }
      })

      dispatch(setWriteSubcription({service, characteristicW}))
      dispatch(setReadSubcription(readSubcription))
    }).catch(console.error);
}

export const onDisconnected = () => (dispatch, getState) => {
  const { device, readSubcription  } = getState().bluetooth
  const subscriptionOnDisconnected = device.onDisconnected((error, deviceonDisconnected) => {
    console.log('onDisconnected')
    if(error){
      console.error('onDisconnected', error)
    }else{
      if(readSubcription != null){
        readSubcription.remove()
      }
      if(subscriptionOnDisconnected != null){
        subscriptionOnDisconnected.remove()
      }
      dispatch({ type: DISCONNECT_SUCCESS })
    }
  })
  dispatch({ type: SUBSCRIPTION_ON_DISCONNECTED, payload: subscriptionOnDisconnected })
}

export const disconnectDevice = () => (dispatch, getState) => {
  console.log('disconnectDevice')
  const { device, subscriptionOnDisconnected, readSubcription } = getState().bluetooth

  if (device != null) {
    device.cancelConnection().then(result => {
      if(readSubcription != null){
        readSubcription.remove()
      }
      if(subscriptionOnDisconnected != null){
        subscriptionOnDisconnected.remove()
      }
      dispatch({ type: DISCONNECT_SUCCESS })
    }).catch(x => {
      console.error(x)
    })
  } else {
    dispatch({ type: DISCONNECT_SUCCESS })
  }
}