'use strict';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';

var React = require('react-native');
const {width, height} = Dimensions.get('window');

var {StyleSheet} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  notification_bar: {
    backgroundColor: 'red',
  },
  bg_image: {
    width: wp('100%'),
    height: hp('100%'),
  },

  menu: {
    backgroundColor: 'rgba(0,0,0,1)',

    width: wp('80%'),
    position: 'absolute',
    height: '100%',
    zIndex: 100,
    opacity: 0.8,
  },
  icon_close: {
    marginTop: '4%',
    paddingLeft: '10%',
    color: '#fff',
    fontSize: 40,
    zIndex: 100,
  },
});
