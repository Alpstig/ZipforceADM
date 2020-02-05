import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge'
import { View, Text, Dimensions, StyleSheet, Image, SafeAreaView, Button } from 'react-native'
import ProgressBar from '../components/progressBar'
import moment from 'moment'

import { sendToDevice } from '../actions'

const { width } = Dimensions.get('window');
const size = 250; //width - 150;
const thik = 15;
const cropDegree = 90;
const textOffset = thik;
const textWidth = size - (textOffset * 2);
const textHeight = size * (1 - cropDegree / 360) - (textOffset * 2);
let smalldata = new Array();

for (let i = 0; i < 10; i++) {
  smalldata[i] = i * 30 - 135;
}

const minuteHandStyles = () => {
  return {
    width: 0,
    height: 10,
    position: 'absolute',
    backgroundColor: '#364F6B',
    paddingHorizontal: 1
  }
}

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.focusListener = null
    this.willBlurListener = null
  }

  componentDidUpdate(prevProps) {
    if (!this.props.bluetooth.isConnected) {
      this.props.navigation.navigate('Scan')
    }

    if (prevProps.isFocused !== this.props.isFocused) {
      console.log('CLOSE!!!')
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      const { isConnected, isScanning} = this.props.bluetooth;
      if (!isConnected && !isScanning) {
        this.props.navigation.navigate('Scan')
      }
    });
    // this.willBlurListener = navigation.addListener('didBlur', () => {
    //   console.log('HOME stopScaning')
    //   this.props.stopScaning()
    // });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.focusListener.remove();
  }

  static navigationOptions = {
    headerShown: false,
  };

  render() {
    const MPHConst = 0.6213711922

    let { S, r, k, m, n, R, z } = this.props.bluetooth.value

    let speed = (r == '0' ? S : Math.round(S * MPHConst))
    let KMH_MPH = (r == '0' ? 'km/h' : 'mph')

    let batteryProgress = parseFloat(m/100);


    return (
      <SafeAreaView>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View style={styles.speedGuade}>
          <GaugeProgress
            size={size} //size
            width={thik}
            fill={parseInt(speed*2)}
            cropDegree={cropDegree}
            strokeCap='circle'
            tintColor='#FC5185'
            delay={0}
            backgroundColor='#364F6B'>
            <View style={styles.textView}>
              <Text style={styles.speed}>{speed}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={[styles.unit, { marginTop: 150, height: 100 }]}>{KMH_MPH}</Text>
            </View>

          </GaugeProgress>
          <View style={{position:'absolute', marginTop: 140}}> 
            {smalldata.map((data, index) => {
              return (
                <View key={index} style={[minuteHandStyles(), {
                  transform: [{
                    rotate: data + 'deg'
                  }, {
                    translateY: -(85 + 5 / 2 + 10)
                  }
                  ]
                }]}
                />
              );
            })}
          </View>
        </View>
        <View style={{ alignItems: 'center', margin: 30 }}>
          <View style={{ width: size }}>
            <ProgressBar
              height={20}
              borderWidth={2}
              fillColor={'#364F6B'}
              barColor={'#FC5185'}
              borderRadius={4}
              borderColor={'#364F6B'}
              progress={batteryProgress}
              duration={50}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.tableKey, { paddingRight: 10 }]}>Battery</Text>
            <Text style={[styles.tableValue]}>{m}%</Text>
          </View>
        </View>

        <View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>POWER</Text>
            </View>
            <View>
          <Text style={[styles.collValue, styles.tableValue]}>{R}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>TIME</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>{moment().format('HH:mm')}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>CAD</Text>
            </View>
            <View>
          <Text style={[styles.collValue, styles.tableValue]}>{n}</Text>
            </View>
          </View>
          {/* <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>EFFECT (W)</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>{k}</Text>
            </View>
          </View> */}
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>DISTANCE (m)</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>{z}</Text>
            </View>
          </View>
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
    padding: 50
  },
  speedGuade: {
    position:'relative',
    paddingTop: 20,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', paddingTop: 15 },
  coll: { paddingRight: 10, width: 250 },
  collValue: { paddingRight: 10, width: 100 },
  textView: {
    position: 'absolute',
    paddingTop: 50,
    top: textOffset,
    left: textOffset,
    width: textWidth,
    height: textHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speed: {
    fontSize: 70,
    color: '#FC5185',
    fontFamily: 'Orbitron-Bold'
  },
  tableKey: {
    fontSize: 25,
    color: '#364F6B',
    fontFamily: 'Orbitron-Bold',
    marginLeft: 10
  },
  tableValue: {
    fontSize: 25,
    color: '#FC5185',
    fontFamily: 'Orbitron-Bold'
  },
  unit: {
    fontSize: 40,
    color: '#364F6B',
    fontFamily: 'Orbitron-Bold'
  },
})

const mapStateToProps = state => ({
  bluetooth: state.bluetooth
});

const mapDispatchToProps = dispatch => ({
  sendToDevice: (data) => dispatch(sendToDevice(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)