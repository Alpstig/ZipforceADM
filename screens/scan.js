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

import { connectDevice, startScanForDevice } from '../actions'

class ScanScreen extends Component {
  constructor(props) {
    super(props)
    this.focusListener = null
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      // const { device, isConnected } = this.props.bluetooth;
      this.props.scanForDevice()
    });
  }
  componentDidUpdate() {
    const { isConnected } = this.props.bluetooth
    if (isConnected) {
      this.props.navigation.navigate('Home')
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  }

  render() {
    const { deviceList } = this.props.bluetooth
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View>
          <Button
            title={'Scan'}
            onPress={() => this.props.scanForDevice()}
          />
        </View>
        <View>
          {
            deviceList.map((device) => {
              return (<ListItem
                key={device.id}
                title={device.name}

                leftIcon={<Icon name={'bluetooth'} size={30} color={'#0A3D91'} />}
                onPress={() => this.props.connectDevice(device)}
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

const mapStateToProps = state => ({
  bluetooth: state.bluetooth
})

const mapDispatchToProps = dispatch => ({
  scanForDevice: () => dispatch(startScanForDevice()),
  connectDevice: (device) => {
    dispatch(connectDevice(device))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)