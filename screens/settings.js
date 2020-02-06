import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StyleSheet, SafeAreaView, Text, View, Image, ScrollView } from 'react-native'
import { ListItem } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
import AuthButtons from '../components/authButtons'
import { sendToDevice } from '../actions'
import firebase from '../utils/firebase'

class SettingScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      direction: {
        value: true,
        disabled: false
      },
      light: {
        value: false,
        disabled: false
      },
      recovery: {
        value: false,
        disabled: false
      },
      unit: {
        value: false,
        disabled: false
      }
    }
  }

  componentDidMount() {
    this.props.sendToDevice('T')
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user })
    })
  }

  static navigationOptions = {
    headerShown: false,
  }

  render() {
    const { user } = this.state
    let { r, p, O, J, F, N, x, q, K, l, L} = this.props.bluetooth.value
    let { isConnected } = this.props.bluetooth
    let unit = (r == '0' ? false : true)
    let breaking = (p == '0' ? false : true)
    let light = (O == '0' ? false : true)
    let reverse = (J == '0' ? false : true)
    let KMH_MPH = (r == '0' ? 'km/h' : 'mph')
    return (
      <SafeAreaView style={styles.container}>
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
          onChange={(e) => this.props.sendToDevice(`CJ${(e.nativeEvent.value ? 1 : 0)}`)}
          switch={{
            value: reverse,
            disabled: !isConnected
          }}
          bottomDivider
        />
        <ListItem
          key={4}
          title={'Light'}
          onChange={(e) => this.props.sendToDevice(`CO${(e.nativeEvent.value ? 1 : 0)}`)}
          switch={{
            value: light,
            disabled: !isConnected
          }}
          bottomDivider
        />
        <ListItem
          key={5}
          title={'Regenerative breaking'}
          onChange={(e) => this.props.sendToDevice(`Cp${(e.nativeEvent.value ? 1 : 0)}`)}
          switch={{
            value: breaking,
            disabled: !isConnected
          }}
          bottomDivider
        />
        <ListItem
          key={6}
          title={'Speed unit km/h - mph'}
          onChange={(e) => this.props.sendToDevice(`Cr${(e.nativeEvent.value ? 1 : 0)}`)}
          switch={{
            value: unit,
            disabled: !isConnected
          }}
          bottomDivider
        />
        
        </ScrollView>
        <RNPickerSelect
            onValueChange={(value) => this.props.sendToDevice(`CF${(value)}`)}
            // value={F}
            items={[
                { label: '0', value: '0' },
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '15', value: '15' },
                { label: '20', value: '20' },
                { label: '25', value: '25' },
                { label: '30', value: '30' },
                { label: '35', value: '35' },
                { label: '40', value: '40' },
                { label: '45', value: '45' },
                { label: '50', value: '50' }
            ]}
        >
          <ListItem
          key={7}
          title={'Select speed'}
        rightElement={<Text>{F} {KMH_MPH}</Text>}
          chevron={{ color: '#FC5185' }}
          bottomDivider
        />
        </RNPickerSelect>
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