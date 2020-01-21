import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, SafeAreaView } from 'react-native'

export default class StatisticsScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', paddingBottom: 10 }}>
        <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
      </View>
      <View>
          <Text>Statistics</Text>
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