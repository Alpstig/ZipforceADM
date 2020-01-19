import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import SafeAreaView from 'react-native-safe-area-view';
import { Input, Button } from 'react-native-elements'

import firebase from '../util/firebase'

// TODO(Krister): Design registration page

export default function RegisterScreen({ navigation }) {
  const [inputValue, setInputValue] = useState({ email: { value: '', errorText: '' }, password: { value: '', errorText: '' } })

  if (firebase.auth().currentUser != null) {
    navigation.navigate('Settings')
  }

  const register = () => {
    const { email, password } = inputValue

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      .then(() => navigation.navigate('Settings'))
      .catch((error) => {
        const { code, message } = error
        let target = ''
        switch (code) {
          case 'auth/invalid-email':
            target = 'email'
            break;
          case 'auth/email-already-in-use':
            target = 'email'
            break;
          case 'auth/weak-password':
            target = 'password'
            break;
          default:
            Alert.alert(
              'Error',
              message,
              [
                { text: 'OK' },
              ],
              { cancelable: false },
            );
            break;
        }
        setInputValue({
          ...inputValue,
          [target]: { value: '', errorText: message }
        })
      })
  }
  const handleInputChange = (target, value) => {
    setInputValue({
      ...inputValue,
      [target]: { value, errorText: '' }
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space}>
        <Input
          textContentType={'username'}
          keyboardType={'email-address'}
          placeholder='Email'
          onChangeText={value => handleInputChange('email', value)}
          errorStyle={{ color: 'red' }}
          errorMessage={inputValue.email.errorText}
        />
      </View>
      <View style={styles.space}>
        <Input
          textContentType={'newPassword'}
          secureTextEntry={true}
          placeholder='Password'
          onChangeText={value => handleInputChange('password', value)}
          errorStyle={{ color: 'red' }}
          errorMessage={inputValue.password.errorText}
        />
      </View>
      <View style={styles.space}>
        <Button
          title={'Register'}
          onPress={register}
        />
      </View>
    </SafeAreaView>
  )
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
});