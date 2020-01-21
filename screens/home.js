import React, { Component } from 'react';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge'
import { View, Text, Dimensions, StyleSheet, Image, SafeAreaView } from 'react-native'
import ProgressBar from '../components/progressBar'
import moment from 'moment'

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

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <SafeAreaView>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
        </View>

        <View style={styles.speedGuade}>
          <GaugeProgress
            size={size}
            width={thik}
            fill={50}
            cropDegree={cropDegree}
            strokeCap='circle'
            tintColor='#FC5185'
            delay={0}
            backgroundColor='#364F6B'>
            <View style={styles.textView}>
              <Text style={styles.speed}>25</Text>
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
            <Text style={[styles.tableKey, {paddingRight:10}]}>Battery</Text>
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