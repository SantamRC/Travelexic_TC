import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import {
  STORAGE_KEY_FULL_NAME,
  STORAGE_KEY_NO_CHILDREN,
  STORAGE_KEY_NO_ADULTS,
  STORAGE_KEY_TOTAL_ROOM,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import Icon from 'react-native-vector-icons/FontAwesome';
var global_style = require('./components/style');

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');

export default class HotelDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      paxNumber: '',
      total_rooms: '',
      background_image: '',
    };
  }

  async componentDidMount() {
    const totalRooms = await AsyncStorage.getItem(STORAGE_KEY_TOTAL_ROOM);
    const userName = await AsyncStorage.getItem(STORAGE_KEY_FULL_NAME);
    const childNumber = await AsyncStorage.getItem(STORAGE_KEY_NO_CHILDREN);
    const adultsNumber = await AsyncStorage.getItem(STORAGE_KEY_NO_ADULTS);
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    var adults = 0,
      child = 0;
    if (adultsNumber != 'null' && adultsNumber != '0') {
      adults = parseInt(adultsNumber);
      if (childNumber != null) {
        child = parseInt(childNumber);
      }

      if (child == 0) {
        this.setState({paxNumber: adults + ' Adult'});
      } else if (child == 1) {
        this.setState({
          paxNumber: adults + ' Adult' + ',' + child + ' child',
        });
      } else if (child >= 1) {
        this.setState({
          paxNumber: adults + ' Adult' + ',' + child + ' children',
        });
      }
    } else {
      if (child == 1) {
        this.setState({
          paxNumber: child + ' child',
        });
      } else if (child >= 1) {
        this.setState({
          paxNumber: child + ' children',
        });
      }
    }

    this.setState({fullname: userName, total_rooms: totalRooms});
  }

  openGps = (lat, lng, fullAddress) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}?q=${fullAddress}`;
    Linking.openURL(url);
  };

  render() {
    const hotelDetails = this.props.route.params.hotel_details;
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
          <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}>
            <View style={styles.rectStack}>
              <View style={styles.rect}>
                <Image
                  source={{uri: hotelDetails.hotel_image}}
                  resizeMode="cover"
                  style={styles.image2}></Image>
                <View style={styles.rect2}>
                  <View style={styles.rect3}>
                    <TouchableOpacity
                      style={styles.rect3}
                      onPress={() =>
                        this.openGps(
                          hotelDetails.location_latitude,
                          hotelDetails.location_longitude,
                          hotelDetails.hotel_name,
                        )
                      }>
                      <Image
                        source={require('../assets/images/googlemapicon.png')}
                        resizeMode="contain"
                        style={styles.image3}
                      />
                    </TouchableOpacity>
                    <View style={styles.group}>
                      <Text numberOfLines={2} style={styles.citrusManaliResort}>
                        {hotelDetails.hotel_name}
                      </Text>
                      <Text numberOfLines={2} style={styles.loremIpsum}>
                        {hotelDetails.hotel_address}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.group3}>
                    <View style={styles.group4}>
                      <TouchableOpacity
                        style={[styles.buttonstyle]}
                        onPress={() => {
                          Linking.openURL(
                            'tel:${' + hotelDetails.contact_no + '}',
                          );
                        }}>
                        <Icon name="phone" size={20} color="black" />
                        <Text style={styles.caption}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.rectStyle}>
                  <View style={styles.BookingBox}>
                    <View style={styles.Row}>
                      <View style={styles.book_id}>
                        <Text>Booking No:- {hotelDetails.hotelVoucher}</Text>
                      </View>
                    </View>

                    <View style={styles.RowPadding}>
                      <View style={styles.inner5}>
                        <Text style={styles.checkIn}>Check in</Text>
                        <Text style={styles.loremIpsum2}>
                          {hotelDetails.checkIn}
                        </Text>
                      </View>
                      <View style={styles.inner5}>
                        <Text style={styles.checkOut}>Check out</Text>
                        <Text style={styles.loremIpsum2}>
                          {hotelDetails.checkOut}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.rectStyle2}>
                  <View style={styles.box}>
                    <View style={styles.Row}>
                      <View style={styles.inner}>
                        <TouchableOpacity
                          style={[styles.buttonstyleForDetails]}>
                          <Text style={styles.captionForDetails}>
                            Customer Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.RowInnerPadding}>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>GUEST NAME</Text>
                      </View>
                      <View style={styles.inner1}>
                        <Text style={styles.textStyle}>:</Text>
                      </View>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>
                          {this.state.fullname}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.Row}>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>PAX</Text>
                      </View>
                      <View style={styles.inner1}>
                        <Text style={styles.textStyle}>:</Text>
                      </View>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>
                          {this.state.paxNumber}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.Row}>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>ROOMS</Text>
                      </View>
                      <View style={styles.inner1}>
                        <Text style={styles.textStyle}>:</Text>
                      </View>
                      <View style={styles.inner5}>
                        <Text style={styles.textStyle}>
                          {this.state.total_rooms} Room
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.rectStyleSpecial}>
                  <View style={styles.box}>
                    <View style={styles.Row}>
                      <View style={styles.inner}>
                        <TouchableOpacity
                          style={[styles.buttonstyleForDetails]}>
                          <Text style={styles.captionForDetails}>
                            Special Instruction
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.RowInnerPadding}>
                      <View style={styles.innerSP}>
                        <Text>{hotelDetails.HotelSpl_inst}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  RowInnerPadding: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  RowPadding: {
    flexDirection: 'row',
    paddingTop: 15,
    alignItems: 'center',
    width: wp('90%'),
    justifyContent: 'center',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 200,
  },
  inner1: {
    flex: 0.1,
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 14,
    color: 'grey',
  },
  innerSP: {flex: 1, textAlign: 'left'},
  inner5: {
    flex: 0.4,
    fontSize: 14,
    paddingLeft: 5,
  },
  book_id: {
    fontSize: 14,
    width: '80%',
  },

  Row: {
    flexDirection: 'row',
  },
  containerbox: {
    width: '100%',
    height: '30%',
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
  BookingBox: {
    width: '100%',
    height: '100%',
    paddingLeft: '5%',
    paddingTop: '5%',
  },
  inner: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  group5: {
    top: 10,
    left: 0,
    width: 54,
    height: 20,
    position: 'absolute',
    justifyContent: 'space-between',
  },
  checkIn: {
    color: 'rgba(155,155,155,1)',
    fontSize: 12,
    width: '100%',
  },
  loremIpsum2: {
    color: '#121212',
    width: 100,
    fontSize: 16,
  },
  group6: {
    top: 10,
    left: 180,
    width: 54,

    position: 'absolute',
    justifyContent: 'space-between',
  },
  checkOut: {
    color: 'rgba(155,155,155,1)',
    fontSize: 12,
    width: '100%',
  },
  caption: {
    color: 'grey',
    fontSize: 16,
    paddingLeft: 5,
  },
  captionForDetails: {
    color: 'white',
    fontSize: 14,
  },
  buttonstyle: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 100,
    elevation: 2,
    minWidth: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbcbcb',
  },
  buttonstyleForDetails: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: 'black',
    elevation: 2,
    minWidth: '50%',
    padding: 16,
  },
  image: {
    top: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  image_imageStyle: {},
  rect: {
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(230, 230, 230,1)',
    bottom: 0,
    right: 0,
    height: '100%',
    paddingBottom: 20,
  },
  rect2: {
    height: 150,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 235,
    marginLeft: 5,
    marginRight: 5,
  },
  rectStyleSpecial: {
    height: '20%',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: wp('5%'),
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
  },
  rectStyle: {
    height: '15%',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: wp('10%'),
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
  },
  rectStyle2: {
    height: '20%',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: wp('5%'),
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
  },
  rect3: {
    flexDirection: 'row',
    width: 360,
    height: 92,
    margin: 0,
    padding: 0,
  },
  rectcheck: {
    flexDirection: 'row',
    marginLeft: 20,
    top: 30,
    height: 92,
    padding: 0,
  },

  rect5: {
    flex: 0.2,
  },
  image3: {
    top: 14,
    left: 0,
    width: 70,
    height: 58,
    position: 'absolute',
    flex: 0,
  },
  rect6: {
    flex: 0.8,
  },
  group: {
    top: 14,
    left: 74,
    width: 126,
    height: 30,
    position: 'absolute',
    flex: 0,
  },
  citrusManaliResort: {
    fontSize: 20,
    color: '#121212',
    textAlign: 'left',
    width: wp('70%'),
  },
  loremIpsum: {
    width: wp('70%'),
    color: 'grey',
    paddingLeft: 5,

    fontSize: 14,
  },
  bf: {
    color: '#121212',
    fontSize: 14,
    marginTop: 5,
    paddingLeft: 5,
  },
  bookgroup: {
    top: 0,
    left: 0,
    height: 60,
    position: 'absolute',
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  group3: {
    top: 100,
    left: 0,
    height: 60,
    position: 'absolute',
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image2: {
    top: 0,
    left: 0,
    width: width,
    height: 231,
    position: 'absolute',
    right: 0,
  },
  rectStack: {
    height: 900,
  },
  rectFiller: {flex: 1},
  group4: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 2,
    width: wp('100%'),
  },

  rect8: {
    flex: 0.37,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  bookingNo: {
    top: 11,
    left: 0,
    position: 'absolute',
    color: 'rgba(0,0,0,1)',
    textAlign: 'left',
    flex: 0,
  },
  rect9: {
    flex: 0.73,
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 0,
    margin: 0,
    flexDirection: 'row',
  },
  rect10: {
    flex: 0.5,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  rect11: {
    flex: 0.5,
    backgroundColor: 'rgba(254, 254, 254,1)',
  },
  rect7: {},
});
