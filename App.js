import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import RNBootSplash from "react-native-bootsplash";
import thunk from 'redux-thunk';
import NavigationService from './NavigationService';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer, applyMiddleware(thunk))

import Icon from 'react-native-ionicons'

import HomeScreen from './screens/home'
import ScanScreen from './screens/scan'
import SettingScreen from './screens/settings'
import LoginScreen from './screens/login'
import RegisterScreen from './screens/register'
import StatisticsScreen from './screens/statistics'
import AuthScreen from './screens/auth'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Auth: AuthScreen,
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