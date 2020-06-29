import React, { Component } from 'react';
import Icon from 'react-native-ionicons'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { View, Text, StyleSheet, Image, SafeAreaView, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { ListItem, FlatList, Button } from 'react-native-elements'

import { connectDevice, startScanForDevice, stopScaning, sendToDevice, setValue, disconnectDevice } from '../actions'

const { width, height } = Dimensions.get('window');
class ScanScreen extends Component {
  constructor(props) {
    super(props)
    this.focusListener = null
    this.willBlurListener = null
    this.checkPin = false
    this.pinInput = React.createRef();
  }
  state = {
    code: '',
    modalVisible: false,
    auth: false,
    checkPin: false,
  };

  _checkCode = (code) => {
    this.props.sendToDevice(`X${code}`)
    this.checkPin = true
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      this.props.scanForDevice()
    });

    this.willBlurListener = navigation.addListener('willBlur', () => {
      // this.props.stopScaning()
    });
  }
  componentDidUpdate() {
    if(this.checkPin){
      const { X } = this.props.bluetooth.value

      if (X !== null) {
        this.checkPin = false
        if (X == 0) {
          this.pinInput.current.shake()
            .then(() => this.setState({ code: '' })).catch(console.error);
        } else {
          this.setState({ code: '' })
          this.setModalVisible(false)
          this.props.sendToDevice(`M`)
          this.props.sendToDevice(`S`)
          this.props.sendToDevice(`T`)
          this.props.sendToDevice(`t`)

          this.props.navigation.navigate('Home')
        }
        this.props.setValue('X', null)
      }
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.willBlurListener.remove();
    // this.props.stopScaning()
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  }

  render() {
    const { deviceList, isScanning } = this.props.bluetooth
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>Enter PIN to connect</Text>
                <View style={styles.divider}></View>
              </View>
              <View style={styles.modalBody}>
                <SmoothPinCodeInput
                  ref={this.pinInput}
                  value={this.state.code}
                  autoFocus={true}
                  onTextChange={code => this.setState({ code })}
                  onFulfill={this._checkCode}
                />
              </View>
              <View style={styles.modalFooter}>
                <View style={styles.divider}></View>
                <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                  <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                      this.props.scanForDevice()
                      this.setModalVisible(false);
                    }}>
                    <Text style={styles.actionText}>cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View>
          <Button
          disabled={isScanning}
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
                onPress={() => {
                  this.setModalVisible(true)
                  this.props.connectDevice(device)
                }}
                chevron
              />)
            })
          }
        </View>
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "80%",
    borderRadius: 5
  }, modalHeader: {

  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000"
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray"
  }, modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  modalFooter: {
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  actionText: {
    color: "#fff"
  }
})

const mapStateToProps = state => ({
  bluetooth: state.bluetooth
})

const mapDispatchToProps = dispatch => {
  return {
    disconnectDevice: ()=> dispatch(disconnectDevice()),
    setValue: (key, value) => dispatch(setValue(key, value)),
    stopScaning: () => dispatch(stopScaning()),
    sendToDevice: (data) => dispatch(sendToDevice(data)),
    scanForDevice: () => dispatch(startScanForDevice()),
    connectDevice: (device) => {
      dispatch(connectDevice(device))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)