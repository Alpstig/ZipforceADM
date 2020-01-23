import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Alert, SafeAreaView } from 'react-native'
import { Input, Button } from 'react-native-elements'

import firebase from '../utils/firebase'

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: { value: '', errorText: '' },
      password: { value: '', errorText: '' }
    }
    this.register = this.register.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    if (firebase.auth().currentUser != null) {
      this.props.navigation.navigate('Settings')
    }
  }

  register() {
    const { email, password } = this.state
    
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      .then(() => this.props.navigation.navigate('Settings'))
      .catch((error) => {
        const { code, message } = error
        let target = ''
        switch (code) {
          case 'auth/invalid-email':
            target = 'email'
            break
          case 'auth/email-already-in-use':
            target = 'email'
            break
          case 'auth/weak-password':
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

  handleInputChange(target, value) {
    this.setState({
      [target]: { value }
    })
  }

  render() {
    const { email, password } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.space}>
          <Input
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
            title={'Register'}
            onPress={() => { this.register() }}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
    padding: 30,
  },
  space: {
    paddingBottom: 10
  }
})