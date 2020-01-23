import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native'

export default class StatisticsScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>Charges made</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>0</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>Distance covered</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>2000</Text>
            </View>
          </View>
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
  row: { flexDirection: 'row', paddingTop: 15 },
  coll: { paddingRight: 10, width: 250 },
  collValue: { paddingRight: 10, width: 100 },
  tableKey: {
    fontSize: 20,
    color: '#364F6B',
    fontFamily: 'Orbitron-Bold'
  },
  tableValue: {
    fontSize: 20,
    color: '#FC5185',
    fontFamily: 'Orbitron-Bold'
  }
})