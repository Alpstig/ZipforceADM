import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screen/home'
import SettingScreen from './screen/settings'
import LoginScreen from './screen/login'
import RegisterScreen from './screen/register'
import StatisticsScreen from './screen/statistics'
import ScanScreen from './screen/scan'

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const SettingsStack = createStackNavigator()

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
// TODO(Krister): Add support for Android icons
            if (route.name === 'Home') {
              iconName = 'ios-bicycle';
            } else if (route.name === 'Statistics') {
              iconName = 'ios-stats';
            } else if (route.name === 'Settings') {
              iconName = 'ios-list';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#FC5185',
          inactiveTintColor: '#364F6B',
        }}
      >
 
        <Tab.Screen name='Home'>
        {
          () => (
            <HomeStack.Navigator>
              <HomeStack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
              <HomeStack.Screen name='Scan' component={ScanScreen} options={{headerShown: false}}/>
            </HomeStack.Navigator>
          )
        }
        </Tab.Screen>
        <Tab.Screen name='Statistics' component={StatisticsScreen} />
        <Tab.Screen name='Settings'>{
          () => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen name='Settings' component={SettingScreen} options={{headerShown: false}}/>
              <SettingsStack.Screen name='Login' component={LoginScreen} />
              <SettingsStack.Screen name='Register' component={RegisterScreen} />
            </SettingsStack.Navigator>
          )
        }
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationNativeContainer>
  )
}
