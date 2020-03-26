import React, { Component } from 'react';
import { createAppContainer, View, StatusBar } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-ionicons'
import RNBootSplash from "react-native-bootsplash";
import thunk from 'redux-thunk';
import NavigationService from './NavigationService';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers'

const store = createStore(rootReducer, applyMiddleware(thunk))

import HomeScreen from './screens/home'
import ScanScreen from './screens/scan'
import SettingScreen from './screens/settings'
import LoginScreen from './screens/login'
import RegisterScreen from './screens/register'
import StatisticsScreen from './screens/statistics'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Scan: ScanScreen,
},{initialRouteName: 'Scan'});

const SettingsStack = createStackNavigator({
  Settings: SettingScreen,
  Login: LoginScreen,
  Register: RegisterScreen,
});

const StatisticsStack = createStackNavigator({
  Statistics: StatisticsScreen
})

const Navigation = createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeStack,
      Statistics: StatisticsStack,
      Settings: SettingsStack,
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Home') {
            iconName = 'bicycle';
          } else if (routeName === 'Statistics') {
            iconName = 'stats';
          } else if (routeName === 'Settings') {
            iconName = 'list';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: '#FC5185',
        inactiveTintColor: '#364F6B',
      },
    }
  )
);

export default class App extends Component {
  componentDidMount(){
    RNBootSplash.hide({ duration: 2500 });
  }
  render() {
    return (
      <Provider store={store}>
        <Navigation ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      </Provider>
      
    );
  }
}