import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SliderBox} from 'react-native-image-slider-box';
import {
  STORAGE_KEY_CITY_ID,
  STORAGE_KEY_CITY_TYPE,
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_CITY_LAT,
  STORAGE_KEY_CITY_LONG,
  STORAGE_KEY_CITY_NAME,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';
import {saveDataString} from '../services/CommonStorage';
import {Linking} from 'react-native';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

export default class KnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {locationNames: [], background_image: ''};
  }

  async componentDidMount() {
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id == null) {
      index_id = 0;
    }

    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;

    const visitParseData = visitData.data[index_id].resREGFinal;

    if (visitParseData.length > 0) {
      let locationNamesArray = [];

      for (let index = 0; index < visitParseData.length; index++) {
        var imgs = [];

        Object.keys(visitParseData[index].daysActivity).forEach(days => {
          {
            Object.keys(visitParseData[index].daysActivity[days]).forEach(
              visit => {
                if (visit != 'Date') {
                  if (
                    visitParseData[index].daysActivity[days][visit].img_url !=
                    ''
                  ) {
                    imgs.push(
                      visitParseData[index].daysActivity[days][visit].img_url,
                    );
                  }
                }
              },
            );
          }
        });
        locationNamesArray.push({
          location_id: visitParseData[index].locationID,
          location_name: visitParseData[index].location,
          location_latitude: visitParseData[index].location_latitude,
          location_longitude: visitParseData[index].location_longitude,
          img_url: imgs,
          checkIn: visitParseData[index].checkIn,
          checkOut: visitParseData[index].checkOut,
        });
      }
      this.setState({locationNames: locationNamesArray});
    } else {
      Alert.alert('Sorry! no know more data found...');
    }
  }

  openGps = (lat, lng, fullAddress) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}?q=${fullAddress}`;
    Linking.openURL(url);
  };

  renderItemComponent = data => {
    console.log('data: ', ' / ' + JSON.stringify(data));
    return (
      <View>
        <View style={styles.data_container}>
          <SliderBox
            images={data.item.img_url}
            sliderBoxHeight={200}
            dotColor="purple"
            inactiveDotColor="#fff"
            paginationBoxVerticalPadding={20}
            autoplay
            circleLoop
            resizeMethod={'resize'}
            resizeMode={'cover'}
            paginationBoxStyle={{
              position: 'absolute',
              bottom: 0,
              padding: 0,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              padding: 0,
              margin: 0,
              backgroundColor: '#e6e6e6',
            }}
            ImageComponentStyle={{width: width, marginTop: 0}}
            imageLoadingColor="#2196F3"
          />

          <View style={styles.rectStack}>
            <View style={styles.rect}>
              <Text style={styles.loremIpsum}>
                Date - {data.item.checkIn} - {data.item.checkOut}
              </Text>
            </View>
            <View style={styles.rect2}>
              <View style={styles.baliRow}>
                <Text style={styles.bali}>{data.item.location_name}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.place_details}>
          <TouchableOpacity
            style={styles.section}
            onPress={() =>
              this.openGps(
                data.item.location_latitude,
                data.item.location_longitude,
                data.item.location_name,
              )
            }>
            <Image
              source={require('../assets/images/map.png')}
              resizeMode="contain"
              style={styles.map_image}></Image>
            <Image
              source={require('../assets/images/hotel_location.png')}
              resizeMode="contain"
              style={styles.location_image}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.section}
            onPress={() => {
              saveDataString(
                '' + data.item.location_name,
                STORAGE_KEY_CITY_NAME,
              );
              saveDataString(
                '' + data.item.location_latitude,
                STORAGE_KEY_CITY_LAT,
              );
              saveDataString(
                '' + data.item.location_longitude,
                STORAGE_KEY_CITY_LONG,
              );
              this.props.navigation.navigate('Weather');
            }}>
            <Text
              style={{
                width: '35%',
                padding: 5,
                fontSize: 12,
                color: 'gray',
              }}>
              Weather
            </Text>
            <ImageBackground
              source={require('../assets/images/weatherblue.png')}
              resizeMode="contain"
              style={styles.weather_image}>
              <Text
                style={{
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 12,
                  paddingTop: '10%',
                }}>
                60º
              </Text>
              <Image
                source={require('../assets/images/stromweather.png')}
                resizeMode="contain"
                style={styles.weather_status}></Image>
            </ImageBackground>
            <Text
              style={{
                width: '30%',
                fontSize: 10,
                color: 'gray',
                textAlign: 'left',
                paddingTop: '5%',
              }}>
              MIN:60ºC
              {'\n'}
              MAX:60ºC
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rooming}>
          <TouchableOpacity
            style={styles.rooming_data}
            onPress={() => {
              saveDataString('' + data.item.location_id, STORAGE_KEY_CITY_ID);
              saveDataString('eat', STORAGE_KEY_CITY_TYPE);
              this.props.navigation.navigate('ExploreCityScreen_HD');
            }}>
            <Image
              source={require('../assets/images/explorerestaurant.png')}
              resizeMode="contain"
              style={styles.rooming_image}></Image>
            <Text style={styles.rooming_text}>Explore Restaurants</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rooming_data}
            onPress={() => {
              saveDataString('' + data.item.location_id, STORAGE_KEY_CITY_ID);
              saveDataString('buy', STORAGE_KEY_CITY_TYPE);
              this.props.navigation.navigate('ExploreCityScreen_HD');
            }}>
            <Image
              source={require('../assets/images/exploreshopping.png')}
              resizeMode="contain"
              style={styles.rooming_image}></Image>
            <Text style={styles.rooming_text}>Explore Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rooming_data}
            onPress={() => {
              saveDataString('' + data.item.location_id, STORAGE_KEY_CITY_ID);
              saveDataString('see', STORAGE_KEY_CITY_TYPE);
              this.props.navigation.navigate('ExploreCityScreen_HD');
            }}>
            <Image
              source={require('../assets/images/exploresightseeing.png')}
              resizeMode="contain"
              style={styles.rooming_image}></Image>
            <Text style={styles.rooming_text}>Explore Sightseeing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{backgroundColor: '#e4e5e5'}}>
        <ImageBackground
          source={
            this.state.background_image
              ? {uri: this.state.background_image}
              : require('../assets/images/bg_home1.png')
          }
          resizeMode="cover"
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View>
            <View style={styles.header}>
              <View style={styles.header_container}>
                <TouchableOpacity
                  style={styles.header_button_active}
                  onPress={() => this.props.navigation.navigate('DayPlan')}>
                  <Text style={styles.header_button_text_active}>Day Plan</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.header_container}>
                <TouchableOpacity style={styles.header_button}>
                  <Text style={styles.header_button_text}>Know More</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.scrollArea2}>
              <FlatList
                data={this.state.locationNames}
                renderItem={item => this.renderItemComponent(item)}
                keyExtractor={item => item.location_id.toString()}
                ItemSeparatorComponent={this.ItemSeparator}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{paddingBottom: 300}}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

ItemSeparator = () => (
  <View
    style={{
      height: 2,
      backgroundColor: 'rgba(0,0,0,0.5)',
      marginLeft: 10,
      marginRight: 10,
    }}
  />
);

const styles = StyleSheet.create({
  image_imageStyle: {},
  header: {
    padding: 0,
    width: width,
    top: 10,
    height: '8%',
    flexDirection: 'row',
    zIndex: 100,
  },
  header_container: {
    width: '50%',
    height: 50,
    top: 10,
    alignItems: 'center',
  },
  header_button: {
    width: '90%',
    height: 45,
    padding: 2,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  header_button_active: {
    width: '90%',
    height: 45,
    padding: 2,
    backgroundColor: 'black',
    borderRadius: 100,
    color: '#fff',
  },
  header_button_text: {
    textAlign: 'center',
    top: '20%',
    color: 'black',
    fontSize: 18,
  },
  header_button_text_active: {
    textAlign: 'center',
    top: '20%',
    color: '#fff',
    fontSize: 18,
  },
  scrollArea2: {
    top: 20,
    width: width - 10,
    height: 'auto',
    flexGrow: 1,
    flexDirection: 'column',
  },
  data_container: {
    width: width,
    height: 'auto',
  },
  rect: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  loremIpsum: {
    color: 'rgba(255,255,255,1)',
    height: 'auto',
    width: '100%',
    paddingLeft: 5,
    fontSize: 18,
  },
  rect2: {
    top: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    position: 'absolute',
    flexDirection: 'row',
  },
  bali: {
    paddingLeft: 5,
    color: 'rgba(255,255,255,1)',
    fontSize: 25,
  },
  baliRow: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 0,
    marginTop: 0,
  },
  rectStack: {
    width: width,
    height: '25%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  place_details: {
    width: '100%',
    bottom: 0,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  section: {
    width: '50%',
    bottom: 0,
    height: '100%',
    flexDirection: 'row',
  },
  map_image: {
    width: '30%',
    height: '90%',
  },
  location_image: {
    width: '70%',
    height: '100%',
  },
  weather_image: {
    width: 50,
    height: '100%',
  },
  weather_status: {
    position: 'absolute',
    width: 20,
    height: '80%',
    bottom: 0,
    right: '10%',
  },
  rooming: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 5,
  },
  rooming_data: {
    width: '33%',
    height: '100%',
  },
  rooming_image: {
    width: '100%',
    height: '70%',
  },
  rooming_text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
  },
});
