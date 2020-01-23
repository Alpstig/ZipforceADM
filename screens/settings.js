import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, Text, View, Image, Picker } from 'react-native'
import { ListItem } from 'react-native-elements'
import AuthButtons from '../components/authButtons'

import firebase from '../utils/firebase'

export default class SettingScreen extends Component {
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
    this.changeSettings = this.changeSettings.bind(this)
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user })
    })
  }

  changeSettings(target, e) {
    this.setState({ [target]: { value: e.nativeEvent.value } })
  }

  static navigationOptions = {
    headerShown: false,
  }

  render() {
    const { direction, light, recovery, unit, user } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
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
          onChange={(e) => this.changeSettings('direction', e)}
          switch={{
            value: direction.value,
            disabled: direction.disabled
          }}
          bottomDivider
        />
        <ListItem
          key={4}
          title={'Light'}
          onChange={(e) => this.changeSettings('light', e)}
          switch={{
            value: light.value,
            disabled: light.disabled
          }}
          bottomDivider
        />
        <ListItem
          key={5}
          title={'Regenerative breaking'}
          onChange={(e) => this.changeSettings('recovery', e)}
          switch={{
            value: recovery.value,
            disabled: recovery.disabled
          }}
          bottomDivider
        />
        <ListItem
          key={6}
          title={'Speed unit km/h - mph'}
          onChange={(e) => this.changeSettings('unit', e)}
          switch={{
            value: unit.value,
            disabled: unit.disabled
          }}
          bottomDivider
        />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 25 }}>Select Speed</Text>
        </View>
        <Picker>
          <Picker.Item label='off' value='Off' />
          <Picker.Item label='1' value='1' />
          <Picker.Item label='2' value='2' />
          <Picker.Item label='3' value='3' />
          <Picker.Item label='4' value='4' />
          <Picker.Item label='5' value='5' />
          <Picker.Item label='6' value='6' />
        </Picker>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  space: {
    paddingBottom: 10
  }
})