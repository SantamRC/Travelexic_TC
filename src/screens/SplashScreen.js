import React, {Component} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY_user_logged_in} from '../services/ConstantStorageKey';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const isUserLoggedIn = await AsyncStorage.getItem(
      STORAGE_KEY_user_logged_in,
    );
    if (isUserLoggedIn == null) {
      setTimeout(() => {
        this.props.navigation.navigate('LoginScreen');
      }, 5000);
    } else {
      this.props.navigation.replace('Home');
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
        <SafeAreaView>
          <ImageBackground
            style={{width: '100%', height: '100%'}}
            source={require('../assets/splash.png')}
          />
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplashScreen;
