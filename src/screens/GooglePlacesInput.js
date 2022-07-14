import React, {Component} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import {View, StatusBar} from 'react-native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDZpbyOP9nC1MeueAun2rwOOxALK4O58_4';

export default class GooglePlacesInput extends Component {
  async getGeoCode(address) {
    const geoCode = await Location.geocodeAsync(address);
    this.props.navigation.navigate('Weather', {
      geoCodeLocation: geoCode,
      geoName: address,
    });
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 10, backgroundColor: '#e4e5e5'}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#3F51B5"
          translucent={true}
          barStyle="light-content"
        />
        <GooglePlacesAutocomplete
          placeholder="Search loaction name"
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          onPress={(data, details = true) => {
            // console.log('locationDATA: ', details.description);
            this.getGeoCode(details.description);
          }}
        />
      </View>
    );
  }
}
