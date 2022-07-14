import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
var global_style = require('./components/style');
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_GROUP_STATUS,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';
import {getExhibitor, nonceDriver} from '../services/ConstantURLS';
const {width, height} = Dimensions.get('window');
import {FlatList} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-custom-dropdown';
import {SafeAreaView} from 'react-native';
import {YellowBox} from 'react-native';
import {color} from 'react-native-elements/dist/helpers';

export default class ImportantContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importantNumbers: [],
      importantNumbersFilter: [],
      locationName: [],
      tour_handler_Number: '',
      tour_handler_Name: '',
      driver_Name: '',
      driver_Number: '',
      locationNamePlaceHolder: '',
      driver_title: 'Driver',
      background_image: '',
      order_id: '',
      tourSupportData: [],
    };
  }

  setDatalist = filterData => {
    this.setState({importantNumbersFilter: filterData});
  };

  setStatusFilter = locationNameFilter => {
    console.log('locationNameFilter', ' / ' + locationNameFilter);
    this.setState({
      locationNamePlaceHolder: locationNameFilter,
    });
    this.setDatalist([
      ...this.state.importantNumbers.filter(
        e => e.location === locationNameFilter,
      ),
    ]);
  };

  async componentDidMount() {
    YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
    const groupStatus = await AsyncStorage.getItem(STORAGE_KEY_GROUP_STATUS);
    console.log('groupStatus: ', ' / ' + groupStatus);
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id == null) {
      index_id = 0;
    }

    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({order_id: order_id_key});

    if (groupStatus == 0) {
      this.setState({driver_title: 'Driver'});
    } else {
      this.setState({driver_title: 'Tour Manager'});
    }
    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;
    const visitParseData = visitData.data[index_id].resREGFinal;

    this.setState({
      tour_handler_Name: visitData.data[index_id].tour_handler.Name,
      tour_handler_Number: visitData.data[index_id].tour_handler.contact_number,
      driver_Name: visitData.data[index_id].SelectedCar.DriverName,
      driver_Number: visitData.data[index_id].SelectedCar.DriverMobile,
    });

    if (visitParseData.length > 0) {
      let importantArray = [];
      let locationArray = [];
      for (let index = 0; index < visitParseData.length; index++) {
        importantArray.push({
          location: visitParseData[index].location,
          contact_no: visitParseData[index].contact_no,
          Mechanic: visitParseData[index].Mechanic,
          Police: visitParseData[index].Police,
          Ambulance: visitParseData[index].Ambulance,
        });
        locationArray.push({
          label: visitParseData[index].location,
          value: visitParseData[index].location,
        });
      }

      this.setState({
        locationNamePlaceHolder: locationArray[0].value,
        importantNumbers: importantArray,
        locationName: locationArray,
        importantNumbersFilter: importantArray,
      });
    } else {
      Alert.alert('Sorry! no visit data found...');
    }

    //for Tour Support
    this.getTourSupportService();
  }

  renderItemComponent = data => {
    return (
      <View
        style={{
          top: 20,
          width: '90%',
          height: 100,
          margin: 15,
          borderWidth: 0.5,
          borderColor: '#fff',
          backgroundColor: 'rgba(74,74,74,0.38)',
          borderRadius: 10,
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <View style={styles.tourStack}>
          <Text style={styles.tourManagerName}>{data.item.name}</Text>
        </View>
        <View style={{top: 10}}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('whatsapp://send?phone=' + data.item.number);
            }}>
            <Image
              source={require('../assets/images/new_whatsapp.png')}
              resizeMode="contain"
              style={styles.image5}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('tel:${' + data.item.number + '}');
            }}
            style={styles.image6_touchable}>
            <Image
              source={require('../assets/images/new_call.png')}
              resizeMode="contain"
              style={styles.image6}></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  async getTourSupportService() {
    let formData = new FormData();
    formData.append('booking_id', this.state.order_id);
    formData.append('nonce', nonceDriver);

    let exhibitorArray = [];

    fetch(getExhibitor, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        console.log('responseText: ', ' / ' + JSON.stringify(responseText));
        if (responseText.status == 'success') {
          for (
            let index = 0;
            index < responseText.data.support.length;
            index++
          ) {
            exhibitorArray.push({
              name: responseText.data.support[index].name,
              number: responseText.data.support[index].number,
            });
          }
          this.setState({
            tourSupportData: exhibitorArray,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  openExtraWeb = url_name => {
    Linking.openURL(url_name).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  render() {
    return (
      <View style={{backgroundColor: '#e4e5e5'}}>
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
          <View style={{zIndex: 100, position: 'relative'}}>
            <DropDownPicker
              items={this.state.locationName}
              placeholder="Filter Location"
              defaultValue={this.state.locationNamePlaceHolder}
              showArrow={false}
              arrowSize={15}
              containerStyle={{
                height: 50,
                marginTop: 50,
                width: width - 50,
                marginLeft: 25,
              }}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setStatusFilter(item.value)}
            />
          </View>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}>
              <View style={styles.rect6}>
                <Text style={styles.police}>Police</Text>
                <Image
                  source={require('../assets/images/police.png')}
                  resizeMode="contain"
                  style={styles.image3}></Image>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'tel:${' +
                        this.state.importantNumbersFilter[0].Police +
                        '}',
                    );
                  }}>
                  <Image
                    source={require('../assets/images/new_call.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rect6}>
                <Text style={styles.police}>Hospital</Text>
                <Image
                  source={require('../assets/images/hospital.png')}
                  resizeMode="contain"
                  style={styles.image3}
                />
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'tel:${' +
                        this.state.importantNumbersFilter[0].Ambulance +
                        '}',
                    );
                  }}>
                  <Image
                    source={require('../assets/images/new_call.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rect6}>
                <Text style={styles.police}>Hotel</Text>
                <Image
                  source={require('../assets/images/hotel.png')}
                  resizeMode="contain"
                  style={styles.image3}></Image>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'tel:${' +
                        this.state.importantNumbersFilter[0].contact_no +
                        '}',
                    );
                  }}>
                  <Image
                    source={require('../assets/images/new_call.png')}
                    resizeMode="contain"
                    style={styles.image4}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <View style={styles.scrollArea2}>
            <View
              style={{
                alignSelf: 'center',
                margin: 15,
                flexDirection: 'column',
                width: '10%',
                alignSelf: 'center',
                justifyContent: 'space-between',
                marginBottom: 390,
              }}>
              <Image
                source={require('../assets/images/connect_us.png')}
                resizeMode="contain"
                style={{width: 35, height: 150}}
              />
              <TouchableOpacity
                style={{width: 35, height: 35, margin: 3}}
                onPress={() =>
                  this.openExtraWeb(
                    'https://www.instagram.com/thomascookofficial/?hl=en',
                  )
                }>
                <Image
                  source={require('../assets/images/insta_icon.png')}
                  resizeMode="contain"
                  style={{width: 35, height: 35}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: 35, height: 35, margin: 3}}
                onPress={() =>
                  this.openExtraWeb(
                    'https://www.facebook.com/ThomasCookIndiaLimited/',
                  )
                }>
                <Image
                  source={require('../assets/images/facebook_icon.png')}
                  resizeMode="contain"
                  style={{width: 35, height: 35}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: 35, height: 35, margin: 3}}
                onPress={() =>
                  this.openExtraWeb('https://twitter.com/tcookin')
                }>
                <Image
                  source={require('../assets/images/twitter_icon.png')}
                  resizeMode="contain"
                  style={{width: 35, height: 35}}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle2}>
              <View style={styles.rect7Stack}>
                <View style={styles.rect7}>
                  <Text style={styles.tourManager}>
                    {this.state.driver_title}
                  </Text>
                  <View style={styles.tourStack}>
                    <Text style={styles.tourManagerName}>
                      {this.state.driver_Name}
                    </Text>
                    <Image
                      source={require('../assets/images/tourmanager.png')}
                      resizeMode="contain"
                      style={styles.image8}
                    />
                  </View>
                </View>
                <View style={styles.contact_numbers}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'whatsapp://send?phone=' + this.state.driver_Number,
                      );
                    }}>
                    <Image
                      source={require('../assets/images/new_whatsapp.png')}
                      resizeMode="contain"
                      style={styles.image5}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'tel:${' + this.state.driver_Number + '}',
                      );
                    }}
                    style={styles.image6_touchable}>
                    <Image
                      source={require('../assets/images/new_call.png')}
                      resizeMode="contain"
                      style={styles.image6}></Image>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rect7Stack}>
                <View style={styles.rect7}>
                  <Text style={styles.tourManager}>Agent Contact</Text>
                  <View style={styles.tourStack}>
                    <Text style={styles.tourManagerName}>
                      {this.state.tour_handler_Name}
                    </Text>
                    <Image
                      source={require('../assets/images/tourmanager.png')}
                      resizeMode="contain"
                      style={styles.image8}></Image>
                  </View>
                </View>
                <View style={styles.contact_numbers}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'whatsapp://send?phone=' +
                          this.state.tour_handler_Number,
                      );
                    }}>
                    <Image
                      source={require('../assets/images/new_whatsapp.png')}
                      resizeMode="contain"
                      style={styles.image5}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'tel:${' + this.state.tour_handler_Number + '}',
                      );
                    }}
                    style={styles.image6_touchable}>
                    <Image
                      source={require('../assets/images/new_call.png')}
                      resizeMode="contain"
                      style={styles.image6}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    top: 20,
                    color: 'rgba(254,254,254,1)',
                    height: 'auto',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}>
                  Tour Support
                </Text>
                <SafeAreaView style={{flex: 1}}>
                  <FlatList
                    data={this.state.tourSupportData}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this.handleRefresh}
                    numColumns={1}
                    contentContainerStyle={{paddingBottom: 300}}
                  />
                </SafeAreaView>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rect: {
    height: 50,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#ffffff',
    marginTop: '30%',
  },
  image7: {
    bottom: 10,
    left: '5%',
    width: 30,
    height: 30,
    position: 'absolute',
  },
  text: {
    bottom: 10,
    position: 'absolute',
    color: 'grey',
    fontSize: 24,
    textAlign: 'center',
    height: 30,
    left: 0,
    right: 0,
  },
  scrollArea: {
    height: 160,
    marginTop: 0,
    width: width,
  },
  scrollArea_contentContainerStyle: {
    height: '100%',
    paddingRight: 20,
  },
  rect6: {
    width: 150,
    height: '80%',
    backgroundColor: 'rgba(74,74,74,0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
    borderRadius: 10,
    top: '5%',
    marginLeft: 5,
    marginRight: 5,
  },
  police: {
    top: 0,
    left: 0,
    color: 'rgba(255,255,255,1)',
    height: 'auto',
    textAlign: 'center',
    fontSize: 22,
  },
  image3: {
    top: 0,
    left: 50,
    width: 40,
    height: 40,
  },
  image4: {
    width: '80%',
    height: 30,
    top: 15,
    left: '10%',
  },
  scrollArea2: {
    width: width,
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollArea_contentContainerStyle2: {
    height: 'auto',
    paddingBottom: 300,
    alignSelf: 'center',
    width: '90%',
    marginEnd: '10%',
  },
  rect7: {
    width: '100%',
    height: 170,
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: '#fff',
    backgroundColor: 'rgba(74,74,74,0.38)',
    borderRadius: 10,
  },
  tourManager: {
    color: 'rgba(254,254,254,1)',
    height: 'auto',
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  tourManagerName: {
    top: 0,
    color: 'rgba(254,254,254,1)',
    height: 'auto',
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    left: 0,
  },
  image8: {
    width: 50,
    height: 50,
    marginLeft: '40%',
  },
  tourStack: {
    width: '100%',
    height: 'auto',
  },
  rect7Stack: {
    width: '100%',
    height: 170,
    marginTop: 15,
    alignSelf: 'center',
  },
  contact_numbers: {
    top: '70%',
  },
  image5: {
    left: '5%',
    width: '40%',
    height: 45,
  },
  image6: {
    left: '10%',
    width: '80%',
    height: 45,
    position: 'absolute',
  },
  image6_touchable: {
    width: '50%',
    left: '50%',
    height: 45,
    position: 'absolute',
  },
});
