import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { ListItem, Button } from 'react-native-elements'

import firebase from '../util/firebase'

export default function SettingsScreen({ navigation }) {
  const [currentUser, setUser] = useState({})
  const [settings, setSettings] = useState({
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
    }
  })

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  })

  const AuthButtons = () => {
    if (currentUser != null) {
      return (
        <View>
          <ListItem
            key={0}
            title={'Logout'}
            onPress={() => {
              firebase.auth().signOut().then(() => navigation.navigate('Settings'))
            }}
            chevron={{ color: '#FC5185' }}
            bottomDivider
          />
        </View>
      )
    } else {
      return (
        <View>
          <ListItem
            key={0}
            title={'Login'}
            onPress={() => navigation.navigate('Login')}
            chevron={{ color: '#FC5185' }}
            bottomDivider
          />
          <ListItem
            key={1}
            title={'Register'}
            onPress={() => navigation.navigate('Register')}
            chevron={{ color: '#FC5185' }}
            bottomDivider
          />
        </View>
      )
    }
  }
  const changeSettings = (target, e) => {
    setSettings({
      ...settings,
      [target]: { value: e.nativeEvent.value }
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <AuthButtons />
      <ListItem
        key={2}
        title={'Reverse Mode'}
        onChange={(e) => changeSettings('direction', e)}
        switch={{
          value: settings.direction.value,
          disabled: settings.direction.disabled
        }}
        bottomDivider
      />
      <ListItem
        key={3}
        title={'Light'}
        onChange={(e) => changeSettings('light', e)}
        switch={{
          value: settings.light.value,
          disabled: settings.light.disabled
        }}
        bottomDivider
      />
      <ListItem
        key={4}
        title={'Regenerative breaking'}
        onChange={(e) => changeSettings('recovery', e)}
        switch={{
          value: settings.recovery.value,
          disabled: settings.recovery.disabled
        }}
        bottomDivider
      />
      <ListItem
        key={4}
        title={'Speed unit km/h - mph'}
        onChange={(e) => changeSettings('unit', e)}
        switch={{
          value: settings.recovery.value,
          disabled: settings.recovery.disabled
        }}
        bottomDivider
      />

    </SafeAreaView>)

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  space: {
    paddingBottom: 10
  }
})