import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StyleSheet, SafeAreaView, Text, View, Image, ScrollView, Modal, TouchableOpacity } from 'react-native'
import { ListItem, Input } from 'react-native-elements'
// import RNPickerSelect from 'react-native-picker-select';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import AuthButtons from '../components/authButtons'
import { sendToDevice } from '../actions'
import firebase from '../utils/firebase'

class SettingScreen extends Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef();
    this.state = {
      user: null,
      modalVisible: false,
      modalSpeedVisible: false,
      newPin: '',
      speed: 0,
      breaking: false,
      pasReverse: false,
      light: false,
      reverse: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.pinInput = React.createRef();
  }
  // handleSpeedInputChange(target, value) {
  //   console.log(target, value)
  //   this.setState({
  //     [target]: { value }
  //   })
  // }
  handleInputChange(target, value) {
    this.setState({
      [target]: { value }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const np = JSON.stringify(nextProps.bluetooth.value)
    const cp = JSON.stringify(this.props.bluetooth.value)

    var shuldUpdate = true
    if (np != cp) {
      return true;
    }
    return shuldUpdate
  }

  _checkCode = (code) => {
    this.setModalVisible(false)
    this.props.sendToDevice(`CP${code}`)
    this.setState({ newPin: '' })
  }

  _setSpeed = _ => {
    this.setSpeedModalVisible(false)
    this.props.sendToDevice(`CF${this.state.speed}`)
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setSpeedModalVisible(visible) {
    this.setState({ modalSpeedVisible: visible });
  }

  componentDidMount() {
    this.props.sendToDevice('T')
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user })
    })
    let { p, O, J, s } = this.props.bluetooth.value
    let { isConnected } = this.props.bluetooth

    if(isConnected){
      this.setState({breaking: (p == '0' ? false : true)})
      this.setState({pasReverse: (s == '0'? false: true)})
      this.setState({light: (O == '0' ? false : true)})
      this.setState({reverse: (J == '0' ? false : true)})
    }
  }

  static navigationOptions = {
    headerShown: false,
  }

  render() {
    const { user } = this.state
    let { F } = this.props.bluetooth.value
    let { isConnected } = this.props.bluetooth

    let saveSpeedButtonModal = (parseInt(this.state.speed) >= 0 && parseInt(this.state.speed) <= 50) ? false : true

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
                <Text style={styles.title}>Enter new PIN</Text>
                <View style={styles.divider}></View>
              </View>
              <View style={styles.modalBody}>
                <SmoothPinCodeInput
                  ref={this.pinInput}
                  value={this.state.newPin}
                  autoFocus={true}
                  onTextChange={newPin => this.setState({ newPin })}
                  onFulfill={this._checkCode}
                />
              </View>
              <View style={styles.modalFooter}>
                <View style={styles.divider}></View>
                <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                  <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible)
                    }}>
                    <Text style={styles.actionText}>cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Set speed modalwindow */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalSpeedVisible}
        >
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>Enter speed limit</Text>
                <View style={styles.divider}></View>
              </View>
              <View style={styles.modalBody}>

                <Input
                  label={'KM/H'}
                  labelStyle={{ color: '#364F6B' }}
                  inputStyle={{ color: '#FC5185' }}
                  keyboardType={'number-pad'}
                  placeholder={'0-50'}
                  defaultValue={F.toString()}
                  onChangeText={speed => this.setState({speed})}
                />
              </View>
              <View style={styles.modalFooter}>
                <View style={styles.divider}></View>
                <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                  <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                      this.setSpeedModalVisible(!this.state.modalSpeedVisible)
                    }}>
                    <Text style={styles.actionText}>cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ ...styles.actions, backgroundColor: (saveSpeedButtonModal)?"#cccccc": "#21ba45" }}
                    disabled={saveSpeedButtonModal}
                    onPress={() => {
                      this._setSpeed(!this.state.modalSpeedVisible)
                    }}>
                    <Text style={styles.actionText}>save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <ScrollView style={styles.scrollView}>
          <AuthButtons
            currentUser={user}
            onClickLogin={() => this.props.navigation.navigate('Login')}
            onClickLogout={() => {
              firebase.auth().signOut().then(() => this.props.navigation.navigate('Settings'))
            }}
            onClickRegister={() => this.props.navigation.navigate('Register')} />
          <ListItem
            key={2}
            title={'Scan for device'}
            onPress={() => this.props.navigation.navigate('Scan')}
            chevron={{ color: '#FC5185' }}
            bottomDivider
          />

          <ListItem
            key={3}
            title={'Reverse Mode'}
            onChange={(e) => {
              this.props.sendToDevice(`CJ${(e.nativeEvent.value ? 1 : 0)}`)
              this.setState({reverse: e.nativeEvent.value})
            }}
            switch={{
              value: this.state.reverse,
              disabled: !isConnected
            }}
            bottomDivider
          />
          <ListItem
            key={4}
            title={'Light'}
            onChange={(e) => {
              this.props.sendToDevice(`CO${(e.nativeEvent.value ? 1 : 0)}`)
              this.setState({light: e.nativeEvent.value})
            }}
            switch={{
              value: this.state.light,
              disabled: !isConnected
            }}
            bottomDivider
          />
          <ListItem
            key={5}
            title={'Regenerative breaking'}
            onChange={(e) => {
              this.props.sendToDevice(`Cp${(e.nativeEvent.value ? 1 : 0)}`)
              this.setState({breaking: e.nativeEvent.value})
            }}
            switch={{
              value: this.state.breaking,
              disabled: !isConnected
            }}
            bottomDivider
          />
          <ListItem
            key={6}
            title={'Pas reverse'}
            onChange={(e) => {
              this.props.sendToDevice(`Cs${(e.nativeEvent.value ? 1 : 0)}`)
              this.setState({pasReverse: e.nativeEvent.value})
            }}
            switch={{
              value: this.state.pasReverse,
              disabled: !isConnected
            }}
            bottomDivider
          />
          {/* <ListItem
            key={6}
            title={'Speed unit km/h - mph'}
            onChange={(e) => this.props.sendToDevice(`Cr${(e.nativeEvent.value ? 1 : 0)}`)}
            switch={{
              value: unit,
              disabled: !isConnected
            }}
            bottomDivider
          /> */}
          <ListItem
            key={7}
            title={'Set PIN'}
            disabled={!isConnected}
            onPress={() => {
              this.setModalVisible(true);
            }}
            bottomDivider
          />
          <ListItem
            key={8}
            title={'Set speed'}
            disabled={!isConnected}
            onPress={() => {
              this.setSpeedModalVisible(true);
            }}
            bottomDivider
          />

        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    paddingBottom: 20,
  },
  space: {
    paddingBottom: 10
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
});

const mapDispatchToProps = dispatch => ({
  serialParser: (data) => dispatch(serialParser(data)),
  setWriteSubcription: (data) => dispatch(setWriteSubcription(data)),
  sendToDevice: (data) => dispatch(sendToDevice(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)