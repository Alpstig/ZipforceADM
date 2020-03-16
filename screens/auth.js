import React, { Component } from 'react'
import { View, Text, Alert, StyleSheet, SafeAreaView } from 'react-native'
import { Input, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

export default class AuthScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.space}>
          <Text>Hej Hej</Text>
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