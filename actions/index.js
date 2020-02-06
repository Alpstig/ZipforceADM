import { decode, encode } from 'base-64';
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
  const { writeSubcription } = getState().bluetooth
  if (writeSubcription != null) {
    dispatch(Log(`<==: ${value}`))
    writeSubcription.writeWithoutResponse(encode(value))
  }
}

export const serialParser = (rxData) => (dispatch, getState) => {
  const { rx } = getState().bluetooth
  let newRxData = rx + rxData
  let result = newRxData.match(/\#[rkmnRSzFJOpPNxKlLq](.*?)\*/gm)
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

export const onDisconnected = () => (dispatch, getState) => {
  const { subscriptionOnDisconnected, device } = getState().bluetooth

  device.onDisconnected((error, deviceonDisconnected) => {
    dispatch(Log(`onDisconnected`))
    dispatch({ type: DISCONNECT_SUCCESS })
  })
}

export const stopScaning = () => (dispatch, getState) => {
  dispatch(Log(`stopScaning`))
  const { scanTimer, manager } = getState().bluetooth
  clearTimeout(scanTimer)
  manager.stopDeviceScan()
  dispatch({ type: STOP_SCAN })
}

export const foundDevice = device => (dispatch, getState) => {
  dispatch(Log(`foundDevice: ${device.name}`))
  dispatch({ type: FOUND_SCAN, payload: { device } })
}

export const startScaning = () => (dispatch, getState) => {
  dispatch(Log(`foundDevice`))
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
  dispatch(Log(`scanForDevice`))

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
    })
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
    dispatch(Log(`notifyCharacteristc: ${characteristic.uuid}`))
    characteristic.monitor((error, c) => {
      // if (error) this.setState({ error: true, errorMsg: error.message })
      if (c) {
        dispatch(Log(`==>: ${decode(c.value)}`))
        dispatch(serialParser(decode(c.value)))
      }
    })
  }
}

export const writeCharacteristc = (characteristic) => (dispatch, getState) => {
  const { writeSubcription } = getState().bluetooth
  if (characteristic.uuid.substring(0, 8) == '0000ffe2') {
    if (writeSubcription == null) {
      dispatch(Log(`writeCharacteristc: ${characteristic.uuid}`))
      dispatch(setWriteSubcription(characteristic))
      dispatch(sendToDevice('M'))
    }
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
      return device.services();
    })
    .then((services) => {
      for (const service of services) {
        service.characteristics().then((characteristics) => {
          for (const characteristic of characteristics) {
            if (characteristic.isWritableWithoutResponse) dispatch(writeCharacteristc(characteristic));
            if (characteristic.isNotifiable) dispatch(notifyCharacteristc(characteristic));
          }
        });
      }
      dispatch(initScreens())
    });


}

export const disconnectDevice = () => (dispatch, getState) => {
  const { device, subscriptionOnDisconnected } = getState().bluetooth

  if (subscriptionOnDisconnected != null) {
    subscriptionOnDisconnected.remove()
  }

  if (device != null) {
    device.cancelConnection().then(result => dispatch({ type: DISCONNECT_SUCCESS }))
  } else {
    dispatch({ type: DISCONNECT_SUCCESS })
  }
}