
import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view'
import { View, Text, StyleSheet, Image } from 'react-native';
import { ListItem, FlatList } from 'react-native-elements'

export default function ScanScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                <Image source={require('../assets/logo.png')} style={{ width: 265, height: 60 }} />
            </View>
            <View>
                <ListItem
                    title={'Zipforce ABC123'}
                    leftIcon={<Ionicons name={'ios-bluetooth'} size={30} color={'#0A3D91'} />}
                    onPress={() => navigation.navigate('Home', {
                        deviceId: 86,
                    })}
                    chevron
                />
                <ListItem
                    title={'Zipforce ABC123'}
                    leftIcon={<Ionicons name={'ios-bluetooth'} size={30} color={'#0A3D91'} />}
                    onPress={() => navigation.navigate('Home', {
                        deviceId: 86,
                    })}
                    chevron
                />
                <ListItem
                    title={'Zipforce ABC123'}
                    leftIcon={<Ionicons name={'ios-bluetooth'} size={30} color={'#0A3D91'} />}
                    onPress={() => navigation.navigate('Home', {
                        deviceId: 86,
                    })}
                    chevron
                />
                <ListItem
                    title={'Zipforce ABC123'}
                    leftIcon={<Ionicons name={'ios-bluetooth'} size={30} color={'#0A3D91'} />}
                    onPress={() => navigation.navigate('Home', {
                        deviceId: 86,
                    })}
                    chevron
                />
                <ListItem
                    title={'Zipforce ABC123'}
                    leftIcon={<Ionicons name={'ios-bluetooth'} size={30} color={'#0A3D91'} />}
                    onPress={() => navigation.navigate('Home', {
                        deviceId: 86,
                    })}
                    chevron
                />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
})