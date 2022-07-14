import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
var global_style = require('./components/style');

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {saveData} from '../services/CommonStorage';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_DOCS,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {document_fetch} from '../services/ConstantURLS';

const {width, height} = Dimensions.get('window');
export default class Documents extends Component {
  constructor() {
    super();
    this.state = {
      upload_button1: true,
      upload_button2: false,
      type: 0,
      authKey: null,
      userid: 0,
      orderid: 0,
      background_image: '',
    };
  }

  async componentDidMount() {
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});
    const orderidS = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({orderid: orderidS});

    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    await this.getDocsData();
  }

  async getDocsData() {
    fetch(document_fetch, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
      }),
      body:
        'booking_id=' +
        this.state.orderid +
        '&traveller_id=' +
        this.state.userid +
        '&nonce=' +
        this.state.authKey, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        console.log('responseText: ', ' / ' + JSON.stringify(responseText));
        saveData(responseText, STORAGE_KEY_DOCS);
      })
      .catch(error => {});
  }

  ShowHideTextbutton = () => {
    if (this.state.upload_button1 == true) {
      this.setState({upload_button1: false});
      this.setState({upload_button2: true});
    } else if (this.state.upload_button1 == false) {
      this.setState({upload_button1: true});
      this.setState({upload_button2: false});
    }
  };

  subScreenDocs = value => {
    if (value == 1) {
      this.props.navigation.navigate('FlightDetails', {typeDocs: 1});
    } else if (value == 2) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 2});
    } else if (value == 3) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 3});
    } else if (value == 4) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 4});
    } else if (value == 5) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 5});
    } else if (value == 6) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 6});
    } else if (value == 7) {
      this.props.navigation.navigate('DocumentView', {typeDocs: 7});
    }
    return;
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#e4e5e5',
        }}>
        <ImageBackground
          source={
            this.state.background_image
              ? {uri: this.state.background_image}
              : require('../assets/images/bg_home1.png')
          }
          resizeMode="cover"
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}>
              <View style={styles.image2Row}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(1)}>
                  <Image
                    source={require('../assets/images/new_flight_details.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(2)}>
                  <Image
                    source={require('../assets/images/new_service_voucher.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.image2Row}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(3)}>
                  <Image
                    source={require('../assets/images/new_evisa.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(4)}>
                  <Image
                    source={require('../assets/images/new_passport_copy.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.image2Row}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(5)}>
                  <Image
                    source={require('../assets/images/new_travelinsurance.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(6)}>
                  <Image
                    source={require('../assets/images/new_others.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 150,
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: 15,
                  marginEnd: 15,
                  marginStart: 35,
                  alignSelf: 'flex-start',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.subScreenDocs(7)}>
                  <Image
                    source={require('../assets/images/photo_id.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* {this.state.upload_button1 === true ? (
            <TouchableOpacity
              style={styles.image9_div}
              onPress={this.ShowHideTextbutton}>
              <Image
                source={require('../assets/images/upload_up.png')}
                resizeMode="contain"
                style={styles.image9}
                onPress={this.ShowHideTextbutton}></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.image9_div}
              onPress={this.ShowHideTextbutton}>
              <ImageBackground
                source={require('../assets/images/box_document.png')}
                resizeMode="cover"
                style={styles.image9_div2_content}>
                <View style={styles.type}>
                  <TouchableOpacity
                    style={styles.type_cat}
                    onPress={() => this.subScreenDocs(1)}>
                    <Image
                      source={require('../assets/images/flight_icon_up.png')}
                      resizeMode="contain"
                      style={styles.cat_image}></Image>
                    <Text style={styles.cat_text}>Flight</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.type_cat}
                    onPress={() => this.subScreenDocs(5)}>
                    <Image
                      source={require('../assets/images/travelinsurance_icon_up.png')}
                      resizeMode="contain"
                      style={styles.cat_image}></Image>

                    <Text style={styles.cat_text}>Insurance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.type_cat}
                    onPress={() => this.subScreenDocs(4)}>
                    <Image
                      source={require('../assets/images/passport_copy_up.png')}
                      resizeMode="contain"
                      style={styles.cat_image}></Image>
                    <Text style={styles.cat_text}>Passport</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.type_cat}
                    onPress={() => this.subScreenDocs(3)}>
                    <Image
                      source={require('../assets/images/e_visa_icon_down_up.png')}
                      resizeMode="contain"
                      style={styles.cat_image}></Image>
                    <Text style={styles.cat_text}>E-Visa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.type_cat}
                    onPress={() => this.subScreenDocs(6)}>
                    <Image
                      source={require('../assets/images/other_icon_up.png')}
                      resizeMode="contain"
                      style={styles.cat_image}></Image>
                    <Text style={styles.cat_text}>Other</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>

              <Image
                source={require('../assets/images/upload_down.png')}
                resizeMode="contain"
                style={styles.image9}></Image>
            </TouchableOpacity>
          )} */}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image_imageStyle: {},
  scrollArea: {
    marginTop: 30,
    alignSelf: 'center',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  scrollArea_contentContainerStyle: {
    height: height + 150,
    width: wp('100%'),
    alignContent: 'center',
    alignItems: 'center',
  },
  image2Row: {
    height: 150,
    flexDirection: 'row',
    margin: 15,
  },
  image4: {
    width: 150,
    height: 150,
    margin: 10,
  },
  image8: {
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    position: 'absolute',
  },
  image9: {
    width: 130,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },
  image9_div: {
    width: '100%',
    height: 120,
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
  },
  image9_div2_content: {
    width: '100%',
    height: 60,
  },
  type: {
    position: 'absolute',
    width: '90%',
    height: '100%',
    marginLeft: '5%',
    top: '-30%',
    flexDirection: 'row',
  },
  type_cat: {
    width: '18%',
    height: '100%',
    marginLeft: '2%',
    borderColor: 'white',
  },
  cat_image: {
    height: '70%',
    width: '100%',
  },
  cat_text: {
    textAlign: 'center',
    fontSize: 10,
  },
});
