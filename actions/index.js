import { decode, encode } from 'base-64';

import {
  CONNECT_PENDING, CONNECT_SUCCESS, CONNECT_FAILURE, START_SCAN, STOP_SCAN, FOUND_SCAN, SUBSCRIPTION_ON_DISCONNECTED,
  DISCONNECT_PENDING, DISCONNECT_SUCCESS, DISCONNECT_FAILURE, SET_DATA, SET_RX, SET_WRITE_SUBCRIPTION
} from '../actionTypes/bluetooth'

export const setWriteSubcription = data => (dispatch, getState) => {
  dispatch({type: SET_WRITE_SUBCRIPTION, payload: data})
}

export const setData = data => (dispatch, getState) => {
  dispatch({ type: SET_DATA, payload: data })
}

export const setRx = rx => (dispatch, getState) => {
  dispatch({ type: SET_RX, payload: rx })
}
export const sendToDevice = value => (dispatch, getState) => {
  const { writeSubcription} = getState().bluetooth
  if (writeSubcription!= null) {
    console.log('Sending to device:', value)

    writeSubcription.writeWithoutResponse(encode(value))
  }
}

export const serialParser = (rxData) => (dispatch, getState) => {
  const { rx, data } = getState().bluetooth
  let newRxData = rx + rxData

  let result = newRxData.match(/\#(.*?)\*/gm)
  if (result != null) {
    let resultObj = result.reduce((prev, curr) => {
      curr = curr.replace('*', '')
      curr = curr.replace('#', '')
      let key = curr.slice(0, 1)
      let value = curr.replace(key, '')
      prev.push({ key, value })
      return prev
    }, [])
    newRxData = newRxData.slice(newRxData.lastIndexOf('*') + 1, newRxData.lastIndexOf('*') + 200)
    var newState = [...data]
    resultObj.forEach(obj => {


      let existData = data.findIndex(x => x.key == obj.key)
      let existState = newState.findIndex(x => x.key == obj.key)

      if (existData == -1 && existState == -1) {
        newState.push(obj)
      } else {
        if(existState != -1){
          newState[existState] = obj
        }
        if(existData != -1){
          newState[existData] = obj
        }
      }
    });
    console.log(newState)
    dispatch(setData(newState))
  }
  dispatch(setRx(newRxData))
}

export const onDisconnected = () => (dispatch, getState) => {
  const { subscriptionOnDisconnected, device } = getState().bluetooth

  const temp = device.onDisconnected((error, deviceonDisconnected) => {
    console.log('onDisconnected')
    dispatch({ type: DISCONNECT_SUCCESS })
  })
  dispatch({ type: SUBSCRIPTION_ON_DISCONNECTED, payload: { subscriptionOnDisconnected, temp } })
}

export const stopScaning = () => (dispatch, getState) => {
  console.log('stopScaning')
  const { scanTimer, manager } = getState().bluetooth
  clearTimeout(scanTimer)
  manager.stopDeviceScan()
  dispatch({ type: STOP_SCAN })
}

export const foundDevice = device => (dispatch, getState) => {
  console.log('foundDevice')
  dispatch({ type: FOUND_SCAN, payload: { device } })
}

export const startScaning = () => (dispatch, getState) => {
  console.log('startScaning')
  const scanTimer = setTimeout(() => {
    dispatch(stopScaning())
  }, 5000)
  dispatch({ type: START_SCAN, payload: { scanTimer } })
}
export const stateChangeFinnish = () => (dispatch, getState) => {
  const { manager } = getState().bluetooth
  const subscription = manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      dispatch(scanForDevice())
      subscription.remove();
    }
  }, true);
}
export const startScanForDevice = () => (dispatch, getState) => {
  const { manager } = getState().bluetooth
  const subscription = manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      dispatch(scanForDevice())
      subscription.remove();
    }
  }, true);
}

export const scanForDevice = () => (dispatch, getState) => {
  console.log('scanForDevice')

  const { isScanning, manager, device, isConnected } = getState().bluetooth
  if(isConnected){
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
    })
  }
}

export const connectDevice = (device) => (dispatch, getState) => {
  dispatch(stopScaning())
  dispatch({ type: CONNECT_SUCCESS, payload: device })
  dispatch(onDisconnected())
}

export const disconnectDevice = () => (dispatch, getState) => {
  const { device, subscriptionOnDisconnected } = getState().bluetooth

  if(subscriptionOnDisconnected != null){
    subscriptionOnDisconnected.remove()
  }

  if (device != null) {
    device.cancelConnection().then(result => dispatch({ type: DISCONNECT_SUCCESS }))
  } else {
    dispatch({ type: DISCONNECT_SUCCESS })
  }
}