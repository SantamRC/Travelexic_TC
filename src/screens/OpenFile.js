import React, {Component} from 'react';
import {ImageBackground, StatusBar, View} from 'react-native';
import {STORAGE_KEY_BACKGROUND_IMAGE} from '../services/ConstantStorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
var global_style = require('./components/style');

export default class OpenFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background_image: '',
    };
  }

  async componentDidMount() {
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
  }
  render() {
    const fileurl = this.props.route.params.fileurl;

    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
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
              uri: fileurl,
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}
