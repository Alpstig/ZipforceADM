import React, { Component } from 'react'
import { View, Text, Alert, StyleSheet, SafeAreaView } from 'react-native'
import { Input, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import firebase from '../utils/firebase'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: { value: '', errorText: '' },
      password: { value: '', errorText: '' }
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.register = this.register.bind(this)
    this.resetPassword = this.resetPassword.bind(this)

    if (firebase.auth().currentUser != null) {
      this.props.navigation.navigate('Settings')
    }
  }

  resetPassword() {
    const { email } = this.state

    firebase.auth().sendPasswordResetEmail(email.value).then(() => {
      Alert.alert(
        'New password sent',
        'Look in your mail for reset instructions',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      )
    }).catch((error) => {
      const { code, message } = error
      let target = ''
      switch (code) {
        case 'auth/invalid-email':
          target = 'email'
          break
        default:
          Alert.alert(
            'Error',
            message,
            [
              { text: 'OK' },
            ],
            { cancelable: false },
          )
          break
      }
      this.setState({ [target]: { value: '', errorText: message } })
    })
  }

  handleInputChange(target, value) {
    this.setState({
      [target]: { value }
    })
  }

  register() {
    const { email, password } = this.state

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
      .then(() => this.props.navigation.navigate('Settings'))
      .catch((error) => {
        const { code, message } = error
        let target = ''
        switch (code) {
          case 'auth/invalid-email':
            target = 'email'
            break
          case 'auth/wrong-password ':
            target = 'password'
            break
          default:
            Alert.alert(
              'Error',
              message,
              [
                { text: 'OK' },
              ],
              { cancelable: false },
            )
            break
        }
        this.setState({ [target]: { value: '', errorText: message } })
      })
  }

  render() {
    const { email, password } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.space}>
          <Input
            label={'Email'}
            labelStyle={{ color: '#364F6B' }}
            inputStyle={{ color: '#FC5185' }}
            textContentType={'username'}
            keyboardType={'email-address'}
            placeholder='Email'
            onChangeText={value => this.handleInputChange('email', value)}
            errorStyle={{ color: 'red' }}
            errorMessage={email.errorText}
          />
        </View>
        <View style={styles.space}>
          <Input
            label={'Password'}
            labelStyle={{ color: '#364F6B' }}
            inputStyle={{ color: '#FC5185' }}
            textContentType={'newPassword'}
            secureTextEntry={true}
            placeholder='Password'
            onChangeText={value => this.handleInputChange('password', value)}
            errorStyle={{ color: 'red' }}
            errorMessage={password.errorText}
          />
        </View>
        <View style={styles.space}>
          <Button
            title={'Login'}
            onPress={() => { this.register() }}
          />
        </View>
        <View style={styles.space}>
          <Button
            title={'Forgot password?'}
            onPress={() => { this.resetPassword() }}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,

  },
  space: {
    paddingBottom: 10
  }
})