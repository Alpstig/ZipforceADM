import React, { Component } from 'react';
import Icon from 'react-native-ionicons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { ListItem, FlatList, Button } from 'react-native-elements'
import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';

import { connectDevice } from '../actions'

class ScanScreen extends Component {
  constructor(props) {
    super(props)
    this.manager = new BleManager()
    this.timeOut
    this.state = {
      isON: false,
      isConnected: false,
      device: null,
      isScanning: false,
      isScanned: false,
      deviceNames: [],
      deviceList: [],
      error: false,
      errorMsg: "",
    }
  }

  componentDidMount() {
    this.manager.setLogLevel(LogLevel.Verbose);
    
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      const { device, isConnected } = this.props;
      if (isConnected) {
          console.log(this.manager)
          
          // this.manager.cancelDeviceConnection(device.id).then(this._scan())
          
      } else {
        this._scan()
      }
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _connect = (device) => {
    this._stop();
    this.props.connectDevice(device)
    this.props.navigation.navigate('Home')
  }

  _scan = () => {
    this.setState({ isScanning: true, isScanned: false, deviceList: [], deviceNames: [] })
    this.timeOut = setTimeout(this._stop, 5000)
    this.manager.startDeviceScan(null, null, (error, device) => {

      if (device) {
        if (device.name) { // && device.name.startsWith(targetDeviceName)
          if (this.state.deviceNames.indexOf(device.name) == -1) {
            this.setState({
              deviceList: [...this.state.deviceList, device],
              deviceNames: [...this.state.deviceNames, device.name]
            })
          }
        }
      }

      if (error) {
        this.manager.stopDeviceScan()
        clearTimeout(this.timeOut)
        this.setState({ isON: false, isScanning: false, isScanned: false, error: true, errorMsg: error.message })
        return
      }
    });
  }
  _stop = () => {
    this.manager.stopDeviceScan()
    this.setState({ isScanning: false, isScanned: true, error: false })
    clearTimeout(this.timeOut)
    console.log('scan stop')
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  }

  render() {
    const { deviceList } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View>
          <Button
            title={'Scan'}
            onPress={() => { this._scan() }}
          />
        </View>
        <View>
          {
            deviceList.map((device) => {
              return (<ListItem
                key={device.id}
                title={device.name}

                leftIcon={<Icon name={'bluetooth'} size={30} color={'#0A3D91'} />}
                onPress={() => this._connect(device)}
                chevron
              />)
            })
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
  }
})

const mapStateToProps = state => {
  const { device, isConnected } = state.bluetooth
  return { device, isConnected }
};

const mapDispatchToProps = dispatch => ({
  connectDevice: (device) => dispatch(connectDevice(device))
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)