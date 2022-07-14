import {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_AGENT_LOGO,
} from '../services/ConstantStorageKey';
import QRCode from 'react-native-qrcode-svg';
import * as React from 'react';
import renderIf from '../utility/renderif';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';

export default class ShowQRCode extends Component {
  constructor() {
    super();
    this.state = {
      order_id: '',
      background_image: '',
      agent_logo: '',
    };
  }
  async componentDidMount() {
    const order_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({order_id: order_key});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    const agent_logo = await AsyncStorage.getItem(STORAGE_KEY_AGENT_LOGO);
    this.setState({
      background_image: back_image,
      agent_logo: agent_logo,
    });
  }

  render() {
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
          <Image
            source={
              this.state.agent_logo
                ? {uri: this.state.agent_logo}
                : require('../assets/icon.png')
            }
            resizeMode="contain"
            style={styles.image}></Image>
          <View style={styles.rect} />
          <View style={styles.rect2}>
            {renderIf(this.state.order_id != '')(
              <QRCode
                style={{alignSelf: 'center'}}
                size={250}
                value={this.state.order_id}
              />,
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginTop: '20%',
    alignSelf: 'center',
  },
  rect: {
    width: width,
    height: 1,
    borderTopWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    marginTop: 40,
  },
  rect2: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 40,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
