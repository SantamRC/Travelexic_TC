import React, {Component} from 'react';
import {ImageBackground, StatusBar, View} from 'react-native';
import {
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_AUTH_TOKEN_KEY,
} from '../services/ConstantStorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
var global_style = require('./components/style');
import * as Permissions from 'expo-permissions';
import renderif from '../utility/renderif';

export default class CustomerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background_image: '',
      fileurl: 'https://sotcconnect.travelexic.com/setcookie?id=',
      auth_token: '',
      permission_check: false,
    };
  }

  async componentDidMount() {
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    const auth_token = await AsyncStorage.getItem(STORAGE_KEY_AUTH_TOKEN_KEY);
    this.setState({
      background_image: back_image,
      auth_token: auth_token,
    });

    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    Promise.resolve();
    if (status === 'granted') {
      this.setState({permission_check: true});
    } else {
      this.setState({permission_check: false});
    }
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20, backgroundColor: '#e4e5e5'}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#3F51B5"
          translucent={true}
          barStyle="light-content"
        />
        <ImageBackground
          source={
            this.state.background_image
              ? {uri: this.state.background_image}
              : require('../assets/images/bg_home1.png')
          }
          resizeMode="cover"
          style={global_style.bg_image}>
          <WebView
            style={{width: 'auto', height: 'auto', flex: 1}}
            source={{
              uri: this.state.fileurl + this.state.auth_token,
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}
