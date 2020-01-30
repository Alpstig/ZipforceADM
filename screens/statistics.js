import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, Image, SafeAreaView, Button, FlatList, TextInput } from 'react-native'

import { sendToDevice } from '../actions'

function Item({ title }) {
  return (
    <Text style={styles.title}>{title}</Text>
  );
}

class StatisticsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sendData: '',
    }
  }

  onChangeText = (sendData) => {
    this.setState({sendData})
  }
  sendToDevice = () => {
    this.props.sendToDevice(this.state.sendData)
    this.setState({sendData:''})
  }

  static navigationOptions = {
    headerShown: false,
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
       
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
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


const mapStateToProps = state => ({
  bluetooth: state.bluetooth
})

const mapDispatchToProps = dispatch => ({
  sendToDevice: (data) => dispatch(sendToDevice(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsScreen)