import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Weather from './Weather';
import CurrencyConverter from './CurrencyConverter';
import Home from './Home';
import {Image} from 'react-native';
import Global from '../utility/Global';
import CustomerPanel from './CustomerPanel';

const Tab = createBottomTabNavigator();

export default function BottomTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        style: {
          backgroundColor: Global.footer_color
            ? Global.footer_color
            : '#000000',
        },
        tabBarStyle: {
          textAlign: 'center',
          fontSize: 12,
        },
        tabBarInactiveTintColor: 'lightgray',
        tabBarActiveBackgroundColor: Global.footer_color
          ? Global.footer_color
          : '#000000',
        tabBarInactiveBackgroundColor: Global.footer_color
          ? Global.footer_color
          : '#000000',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({props}) => (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/images/head_home.png')}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Weather"
        component={Weather}
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({props}) => (
            <Image
              style={{width: 50, height: 50}}
              source={require('../assets/images/weather_up.png')}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Currency Converter"
        component={CurrencyConverter}
        options={{
          tabBarLabel: 'Currency',
          tabBarIcon: ({props}) => (
            <Image
              style={{width: 50, height: 50}}
              source={require('../assets/images/currencyconverter_up.png')}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="T-Panel"
        component={CustomerPanel}
        options={{
          tabBarLabel: 'T-Panel',
          tabBarIcon: ({props}) => (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/images/user_icon_login.png')}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
