import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StyleSheet, SafeAreaView, Text, View, Image, Linking } from 'react-native'
import { ListItem, FlatList, Button } from 'react-native-elements'
import { sendToDevice } from '../actions'


class StatisticsScreen extends Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    const np = nextProps.bluetooth.value
    const cp = this.props.bluetooth.value

    //N, x, q, K, l, L
    if(np.N !== cp.N){
      return true
    }
    if(np.x !== cp.x){
      return true
    }
    if(np.q !== cp.q){
      return true
    }
    if(np.K !== cp.K){
      return true
    }
    if(np.l !== cp.l){
      return true
    }
    if(np.L !== cp.L){
      return true
    }

    if(nextProps.bluetooth.isConnected !== this.props.bluetooth.isConnected){
      return true
    }
    return false;
  }
  componentDidMount() {
    this.props.sendToDevice('T')
    this.props.sendToDevice('t')
  }

  static navigationOptions = {
    headerShown: false,
  }

  render() {
    let { isConnected } = this.props.bluetooth
    let { N, x, q, K, l, L} = this.props.bluetooth.value
        return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <Button
            title={'Update'}
            disabled={!isConnected}
            onPress={() => {
              this.props.sendToDevice('T')
              this.props.sendToDevice('t')
            }}
          />
        <ListItem
          key={8}
          title={'Charges made'}
        rightElement={<Text>{N}</Text>}
          bottomDivider
        />
        <ListItem
          key={9}
          title={'Distance covered'}
        rightElement={<Text>{x}</Text>}
          bottomDivider
        />
        <ListItem
          key={10}
          title={'Version'}
        rightElement={<Text>{q}</Text>}
          bottomDivider
        />
        <ListItem
          key={11}
          title={'Chassi-ID'}
        rightElement={<Text>{l}</Text>}
          bottomDivider
        />
        <ListItem
          key={12}
          title={'PCB-ID'}
        rightElement={<Text>{L}</Text>}
          bottomDivider
        />
        <ListItem
          key={13}
          title={'Bluetooth name'}
        rightElement={<Text>{K}</Text>}
          bottomDivider
        />
        <ListItem
          key={14}
          title={'Zipforce web'}
          onPress={()=>Linking.openURL('https://zipforce.se')}
          chevron={{ color: '#FC5185' }}
          bottomDivider
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsScreen)