import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge'
import { View, Text, Dimensions, StyleSheet, Image, SafeAreaView } from 'react-native'
import ProgressBar from '../components/progressBar'
import moment from 'moment'
import { decode, encode } from 'base-64';

import { disconnect } from '../actions'

const { width } = Dimensions.get('window');
const size = width - 100;
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
    top: -150,
    left: 0,
    paddingTop: 20,
    paddingHorizontal: 1
  }
}

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.focusListener = null
    this._characteristics = null
    this._RawSubcription = null
    this.state = {
      device: false,
      isScanning: false,
      isScanned: false,
      deviceNames: [],
      deviceList: [],
      error: false,
      errorMsg: "",
      rx: "",
      data: [],
      debug: ''
    }
  }

  _connectToDevice = (device) => {
    device
      .connect()
      .then((device) => {
        this.setState({ connected: true });
        this._device = device;
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        return device.services();
      })
      .then((services) => {
        for (const service of services) {
          service.characteristics().then((characteristics) => {
            this._characteristics = characteristics;
            this._readAndNotify(service);
          });
        }
      });

    this._subscription = device.onDisconnected((error, device) => {
      this.props.disconnect();
      this.props.navigation.navigate('Scan')
    })
  }

  _readAndNotify = (service) => {
    for (const characteristic of this._characteristics) {
      // if (characteristic.isReadable) this._readCharacteristic(characteristic);
      if (characteristic.isNotifiable) this._notifyCharacteristc(characteristic);
    }
  }

  _serialParser = (rxData) => {
    rxData = rxData.replace(/\r?\n|\r/g, '')
    let result = rxData.match(/\#(.*?)\*/gm)
    if (result != null) {
      let resultObj = result.reduce((prev, curr) => {
        curr = curr.replace('*', '')
        curr = curr.replace('#', '')
        let key = curr.slice(0, 1)
        let value = curr.replace(key, '')
        prev.push({ key, value })
        return prev
      }, [])
      rxData = rxData.slice(rxData.lastIndexOf('*') + 1, rxData.lastIndexOf('*') + 200)
      var newState = [...this.state.data]
      resultObj.forEach(obj => {

        var exist = this.state.data.findIndex(x => x.key == obj.key)

        if (exist != -1) {
          newState[exist] = obj
        } else {
          newState.push(obj)
        }
      });

      this.setState({ rx: rxData, data: newState })
    }
    this.setState({ rx: rxData })
  }

  _readCharacteristic = (characteristic) => {
    characteristic
      .read()
      .then((c) => {
        // const value = getDecValue(c)
        console.log(`---------------------------------------------------
        Characteristic UUID : ${characteristic.uuid}
        Read Value : ${c}`); // Read Value
      });
  }

  _notifyCharacteristc = (characteristic) => {
    if (characteristic.uuid == '0000ffe1-0000-1000-8000-00805f9b34fb') {
      console.log('_notifyCharacteristc')
      if (this._RawSubcription == null) {
        this._RawSubcription = characteristic.monitor((error, c) => {
          if (error) this.setState({ error: true, errorMsg: error.message })
          if (c) {
            this._serialParser(this.state.rx + decode(c.value))
          }
        })
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      console.log('CLOSE!!!')
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      const { device, isConnected } = this.props;
      if (isConnected) {
        this._connectToDevice(device)
      } else {
        navigation.navigate('Scan')
      }
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.focusListener.remove();
  }

  static navigationOptions = {
    headerShown: false,
  };

  render() {
    const { data } = this.state
    let speedData = data.find(x => x.key == 'S')
    let speed = 0
    if (speedData != null) {
      speed = parseInt(speedData.value)
    }
    console.log(speed)
    return (
      <SafeAreaView>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>
        <View style={styles.speedGuade}>
          <GaugeProgress
            size={size}
            width={thik}
            fill={speed*2}
            cropDegree={cropDegree}
            strokeCap='circle'
            tintColor='#FC5185'
            delay={0}
            backgroundColor='#364F6B'>
            <View style={styles.textView}>
              <Text style={styles.speed}>{speed}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={[styles.unit, { marginTop: 150, height: 100 }]}>km/h</Text>
            </View>

          </GaugeProgress>
          <View>
            {smalldata.map((data, index) => {
              return (
                <View key={index} style={[minuteHandStyles(), {
                  transform: [{
                    rotate: data + 'deg'
                  }, {
                    translateY: -(25 + 5 / 2 + 80)
                  }
                  ]
                }]}
                />
              );
            })}
          </View>

        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: size }}>
            <ProgressBar
              height={20}
              borderWidth={2}
              fillColor={'#364F6B'}
              barColor={'#FC5185'}
              borderRadius={4}
              borderColor={'#364F6B'}
              progress={0.5}
              duration={500}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.tableKey, { paddingRight: 10 }]}>Battery</Text>
            <Text style={[styles.tableValue]}>50%</Text>
          </View>
        </View>

        <View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>POWER</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>0</Text>
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
              <Text style={[styles.collValue, styles.tableValue]}>0</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>EFFECT (W)</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>100</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={[styles.coll, styles.tableKey]}>DISTANCE</Text>
            </View>
            <View>
              <Text style={[styles.collValue, styles.tableValue]}>1000</Text>
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

const mapStateToProps = state => {
  const { device, isConnected } = state.bluetooth
  return { device, isConnected }
};

const mapDispatchToProps = dispatch => ({
  disconnect: () => dispatch(disconnect()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)