import React, {Component} from 'react';
import * as Location from 'expo-location';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
var global_style = require('./components/style');
import {
  convertDateInDayNameShort,
  convertDateInDayNamelong,
  convertDateInMonthDate,
} from '../utility/Common';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  STORAGE_KEY_CITY_LAT,
  STORAGE_KEY_CITY_LONG,
  STORAGE_KEY_CITY_NAME,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCurrentWeatherbylatlongURL} from '../services/ConstantURLS';
import renderif from '../utility/renderif';
const {width, height} = Dimensions.get('window');

var isUpdate = true;

export default class Weather extends Component {
  constructor() {
    super();
    this.state = {
      mainTemp: '',
      mainTemp_max: '',
      mainTemp_min: '',
      mainTemp_type: '',
      mainTemp_date: '',
      listTemp: [],
      temp1: '',
      tempMin1: '',
      tempMax1: '',
      tempType1: '',
      temp2: '',
      tempMin2: '',
      tempMax2: '',
      tempType2: '',
      temp3: '',
      tempMin3: '',
      tempMax3: '',
      tempType3: '',
      temp4: '',
      tempMin4: '',
      tempMax4: '',
      tempType4: '',
      errorLocationMsg: '',
      locationName: '',
      currrentLat: '',
      currentLong: '',
      background_image: '',
      tempDate3: '',
      tempDate2: '',
    };
  }

  async getCurrentLocation() {
    let {status} = await Location.requestForegroundPermissionsAsync();
    //let {status_back} = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        errorLocationMsg: 'Permission to access location was denied',
      });
      alert('Permission to access location was denied');
    } else {
      try {
        let location = await Location.getCurrentPositionAsync({});
        // console.log('location: ', ' / ' + JSON.stringify(location));
        const address = await Location.reverseGeocodeAsync(location.coords);
        // console.log('address: ', ' / ' + JSON.stringify(address));

        this.setState({
          currrentLat: location.coords.latitude,
          currentLong: location.coords.longitude,
          locationName: address[0].city,
        });

        let formData = new FormData();
        formData.append('lat', this.state.currrentLat);
        formData.append('lon', this.state.currentLong);

        await this.getCurrentWeather(formData);
      } catch (e) {
        alert(
          'We could not find your position. Please make sure your location service provider is on',
        );
      }
    }
  }

  async componentDidUpdate() {
    if (this.props.route.params != null) {
      console.log('componentDidUpdate', 'componentDidUpdate');
      let geoCodeLocation = this.props.route.params.geoCodeLocation;
      let geoName = this.props.route.params.geoName;
      if (geoCodeLocation != null) {
        this.props.route.params = null;
        this.setState({
          locationName: geoName,
          currrentLat: geoCodeLocation[0].latitude,
          currentLong: geoCodeLocation[0].longitude,
        });
        isUpdate = false;
        let formData = new FormData();
        formData.append('lat', geoCodeLocation[0].latitude);
        formData.append('lon', geoCodeLocation[0].longitude);
        console.log('formData', ' / ' + JSON.stringify(formData));
        await this.getCurrentWeather(formData);
      }
    }

    return false;
  }

  async componentDidMount() {
    console.log('componentDidMount', 'componentDidMount');
    const cityName = await AsyncStorage.getItem(STORAGE_KEY_CITY_NAME);
    const cityLat = await AsyncStorage.getItem(STORAGE_KEY_CITY_LAT);
    const cityLong = await AsyncStorage.getItem(STORAGE_KEY_CITY_LONG);
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    if (isUpdate) {
      this.setState({
        locationName: cityName,
        currrentLat: cityLat,
        currentLong: cityLong,
      });

      if (this.state.currrentLat != null && this.state.currentLong != null) {
        let formData = new FormData();
        formData.append('lat', this.state.currrentLat);
        formData.append('lon', this.state.currentLong);
        await this.getCurrentWeather(formData);
      } else {
        await this.getCurrentLocation();
      }
    }
  }

  async getCurrentWeather(formData) {
    console.log(JSON.stringify(formData));
    fetch(getCurrentWeatherbylatlongURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == '200') {
          this.setState({
            mainTemp: Math.ceil(responseText.data.current.main.temp),
            mainTemp_max: Math.ceil(responseText.data.current.main.temp_max),
            mainTemp_min: Math.ceil(responseText.data.current.main.temp_min),
            mainTemp_type: responseText.data.forecast.list[0].weather[0].main,
            mainTemp_date: responseText.data.current.dt,
            temp1: responseText.data.forecast.list[1].temp.main,
            tempMax1: Math.ceil(responseText.data.forecast.list[1].temp.max),
            tempMin1: Math.ceil(responseText.data.forecast.list[1].temp.min),
            tempType1: responseText.data.forecast.list[1].weather[0].main,
            tempDate1: responseText.data.forecast.list[1].dt,
            temp2: responseText.data.forecast.list[2].temp.main,
            tempMax2: Math.ceil(responseText.data.forecast.list[2].temp.max),
            tempMin2: Math.ceil(responseText.data.forecast.list[2].temp.min),
            tempType2: responseText.data.forecast.list[2].weather[0].main,
            tempDate2: responseText.data.forecast.list[2].dt,
            temp3: responseText.data.forecast.list[3].temp.main,
            tempMax3: Math.ceil(responseText.data.forecast.list[3].temp.max),
            tempMin3: Math.ceil(responseText.data.forecast.list[3].temp.min),
            tempType3: responseText.data.forecast.list[3].weather[0].main,
            tempDate3: responseText.data.forecast.list[3].dt,
            temp4: responseText.data.forecast.list[4].temp.main,
            tempMax4: Math.ceil(responseText.data.forecast.list[4].temp.max),
            tempMin4: Math.ceil(responseText.data.forecast.list[4].temp.min),
            tempType4: responseText.data.forecast.list[4].weather[0].main,
            tempDate4: responseText.data.forecast.list[4].dt,
          });
        } else {
          Alert.alert('Sorry! something is wrong...');
        }
      })
      .catch(error => {});
  }

  setIconForTempSmall = type => {
    if (type == 'Rain') {
      return (
        <Image
          source={require('../assets/images/rainnyweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    } else if (type == 'Clouds') {
      return (
        <Image
          source={require('../assets/images/stromweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    } else if (type == 'Clear') {
      return (
        <Image
          source={require('../assets/images/sunnyweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    } else if (type == 'Sunny') {
      return (
        <Image
          source={require('../assets/images/cloudweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    } else if (type == 'Snow') {
      return (
        <Image
          source={require('../assets/images/snowfallweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    } else if (type == 'Haze') {
      return (
        <Image
          source={require('../assets/images/sunnyweather.png')}
          resizeMode="contain"
          style={styles.image6}
        />
      );
    }
  };
  setIconForTempBig = type => {
    if (type == 'Rain') {
      return (
        <Image
          source={require('../assets/images/rainnyweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    } else if (type == 'Clouds') {
      return (
        <Image
          source={require('../assets/images/stromweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    } else if (type == 'Clear') {
      return (
        <Image
          source={require('../assets/images/sunnyweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    } else if (type == 'Sunny') {
      return (
        <Image
          source={require('../assets/images/cloudweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    } else if (type == 'Snow') {
      return (
        <Image
          source={require('../assets/images/snowfallweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    } else if (type == 'Haze') {
      return (
        <Image
          source={require('../assets/images/cloudweather_big.png')}
          resizeMode="contain"
          style={styles.image5}
        />
      );
    }
  };

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
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/images/head_home_black.png')}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              alignContent: 'center',
            }}
          />
          <Text
            style={{
              fontSize: 18,
              color: '#000000',
              paddingStart: 10,
              alignItems: 'center',
              alignContent: 'center',
            }}>
            Weather
          </Text>
        </View>
        <View style={styles.group14}>
          <ImageBackground
            source={
              this.state.background_image
                ? {uri: this.state.background_image}
                : require('../assets/images/bg_home1.png')
            }
            resizeMode="cover"
            style={global_style.bg_image}
            imageStyle={styles.image1_imageStyle}>
            <View style={styles.group}>
              <TouchableOpacity style={styles.button}>
                <View style={styles.image3Row}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('GooglePlacesInput')
                    }>
                    <Image
                      source={require('../assets/images/search_weather.png')}
                      resizeMode="contain"
                      style={styles.image3}
                    />
                  </TouchableOpacity>
                  <View style={styles.image3_1Row}>
                    <Image
                      source={require('../assets/images/location_weather.png')}
                      resizeMode="contain"
                      style={styles.image3_1}
                    />
                    <Text style={styles.search_style}>
                      {this.state.locationName}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (isUpdate) {
                        this.getCurrentLocation();
                      }
                    }}>
                    <Image
                      source={require('../assets/images/gps_weather.png')}
                      resizeMode="contain"
                      style={styles.image2}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            {renderif(this.state.mainTemp !== '')(
              <ScrollView
                horizontal={false}
                contentContainerStyle={
                  styles.scrollArea_contentContainerStyle2
                }>
                <View style={styles.group11}>
                  <View style={styles.rect}>
                    <View style={styles.image4Stack}>
                      <ImageBackground
                        source={require('../assets/images/weatherblue_big.png')}
                        resizeMode="contain"
                        style={styles.image4}
                        imageStyle={styles.image4_imageStyle}>
                        <View style={styles.loremIpsum7StackRow}>
                          <View style={styles.loremIpsum7Stack}>
                            <Text style={styles.loremIpsum7}>
                              {this.state.mainTemp}&deg;C{'\n'}
                              {this.state.mainTemp_type}
                            </Text>
                          </View>
                          {this.setIconForTempBig(this.state.mainTemp_type)}
                        </View>
                      </ImageBackground>
                      <Text style={styles.min30CMax30C}>
                        MIN: {this.state.mainTemp_min}&deg;C{'\n'} MAX:
                        {this.state.mainTemp_max}&deg;C
                      </Text>
                    </View>
                    <Text style={styles.thursdayJuly30}>
                      {convertDateInDayNamelong(this.state.mainTemp_date)},
                      {'\n'}
                      {convertDateInMonthDate(this.state.mainTemp_date)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(230,230,230,0.6)',
                    width: '90%',
                    borderRadius: 5,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{margin: 5}}>
                    <Text style={styles.fri}>
                      {convertDateInDayNameShort(this.state.tempDate1)}
                    </Text>
                    {this.setIconForTempSmall(this.state.tempType1)}
                    <Text style={{marginTop: 3}}>
                      {this.state.tempMax1}&deg; / {this.state.tempMin1}&deg;
                    </Text>
                  </View>
                  <View style={{margin: 5}}>
                    <Text style={styles.fri}>
                      {convertDateInDayNameShort(this.state.tempDate2)}
                    </Text>
                    {this.setIconForTempSmall(this.state.tempType2)}
                    <Text style={{marginTop: 3}}>
                      {this.state.tempMax2}&deg; / {this.state.tempMin2}&deg;
                    </Text>
                  </View>
                  <View style={{margin: 5}}>
                    <Text style={styles.fri}>
                      {convertDateInDayNameShort(this.state.tempDate3)}
                    </Text>
                    {this.setIconForTempSmall(this.state.tempType3)}
                    <Text style={{marginTop: 3}}>
                      {this.state.tempMax3}&deg; / {this.state.tempMin3}&deg;
                    </Text>
                  </View>
                  <View style={{margin: 5}}>
                    <Text style={styles.fri}>
                      {convertDateInDayNameShort(this.state.tempDate4)}
                    </Text>
                    {this.setIconForTempSmall(this.state.tempType4)}
                    <Text style={{marginTop: 3}}>
                      {this.state.tempMax4}&deg; / {this.state.tempMin4}&deg;
                    </Text>
                  </View>
                </View>
              </ScrollView>,
            )}
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollArea_contentContainerStyle2: {
    height: height,
  },
  group14: {
    width: wp('100%'),
    height: height,
  },
  image1: {
    width: wp('100%'),
    height: height,
  },
  image1_imageStyle: {},
  group: {
    width: wp('80%'),
    height: 40,
    marginTop: '10%',
    marginLeft: wp('10%'),
  },
  button: {
    height: 40,
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
  },
  search_style: {
    width: '80%',
    textAlign: 'left',
    fontSize: 24,
    marginEnd: 2,
  },
  image3_1: {
    width: 30,
    marginLeft: '2%',
    height: 30,
    marginTop: 2,
  },
  image3: {
    width: 35,
    height: 35,
  },
  image2: {
    width: 35,
    height: 35,
  },
  image3Row: {
    height: 35,
    flexDirection: 'row',
    flex: 1,
    marginRight: '2%',
    marginLeft: '2%',
    marginTop: 2,
  },
  image3_1Row: {
    height: 35,
    flexDirection: 'row',
    flex: 1,
    marginTop: 2,
  },
  group11: {
    width: wp('80%'),
    height: '40%',
    marginTop: '10%',
    marginLeft: wp('10%'),
  },
  rect: {
    width: wp('80%'),
    height: '90%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
  },
  image4: {
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    position: 'absolute',
    flexDirection: 'row',
  },
  image4_imageStyle: {
    opacity: 0.8,
  },
  loremIpsum7: {
    top: 0,
    left: 0,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 22,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  loremIpsum: {
    top: 0,
    left: 3,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
  },
  loremIpsum7Stack: {
    width: '60%',
    height: 'auto',
    marginTop: 0,
  },
  image5: {
    width: '50%',
    height: '80%',
    opacity: 1,
  },
  loremIpsum7StackRow: {
    height: 'auto',
    flexDirection: 'row',
    flex: 1,
    marginRight: 45,
    marginLeft: '20%',
    marginTop: '10%',
  },
  min30CMax30C: {
    top: '30%',
    left: '70%',
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 18,
    fontWeight: 'normal',
  },
  image4Stack: {
    width: 249,
    height: 126,
    marginTop: 16,
    marginLeft: 19,
  },
  thursdayJuly30: {
    color: 'rgba(255,255,255,1)',
    fontSize: 25,
    marginTop: 20,
    marginLeft: 0,
    textAlign: 'center',
  },
  fri: {
    color: '#121212',
    marginLeft: 0,
    textAlign: 'center',
    fontSize: 24,
  },
  image6: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
});
