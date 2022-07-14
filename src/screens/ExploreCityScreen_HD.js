import React, {Component} from 'react';
import MapView, {Callout, Marker} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  YellowBox,
} from 'react-native';
import renderIf from '../utility/renderif';
import {getollocalpins_new} from '../services/ConstantURLS';
import {FlatList} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-custom-dropdown';
const {width, height} = Dimensions.get('window');
import {Button} from 'native-base';
import {
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_CITY_ID,
  STORAGE_KEY_CITY_TYPE,
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
var map_height = 200;
const webViewScript = `
setTimeout(function() { 
  window.postMessage(document.documentElement.scrollHeight); 
}, 500);
true; // note: this is required, or you'll sometimes get silent failures
`;

export default class ExploreCityScreen_HD extends Component {
  constructor() {
    super();
    this.state = {
      status: false,
      list: false,
      map: true,
      mapheight: 200,
      webheight: 200,
      button_location: '40%',
      buttonType: '0',
      allPlaceDataArray: [],
      allPlacesFilterType: [],
      mainDataForFilter: [],
      dataType: 'about',
      location_id: '',
      order_id: '',
      cityNameArray: [],
      cityNameArrayLocationIDName: [],
      cityNamePlaceHolder: '',
      isApiCall: true,
      markers: [],
      cityLong: 0.0,
      cityLat: 0.0,
      shoppingText: '',
      eatText: '',
      data_id: 0,
      nearby_recommended: true,
    };
  }

  setStatusFilter = locationNameFilter => {
    this.setState({
      locationNamePlaceHolder: locationNameFilter,
    });
    this.setDatalistPlace([
      ...this.state.cityNameArrayLocationIDName.filter(
        e => e.name === locationNameFilter,
      ),
    ]);
  };

  ShowHideTextComponentView = () => {
    if (this.state.status == true) {
      this.setState({status: false});
    } else {
      this.setState({status: true});
    }
  };
  ShowHideTextbutton = () => {
    if (this.state.map == true) {
      this.setState({map: false});
      this.setState({list: true});
      this.setState({mapheight: 400});
      this.setState({button_location: '80%'});
    } else if (this.state.map == false) {
      this.setState({map: true});
      this.setState({list: false});
      this.setState({mapheight: 200});
      this.setState({button_location: '40%'});
    }
  };

  async componentDidMount() {
    YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    var city_id = await AsyncStorage.getItem(STORAGE_KEY_CITY_ID);
    var city_type = await AsyncStorage.getItem(STORAGE_KEY_CITY_TYPE);
    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id === null) {
      index_id = 0;
    }
    this.setState({data_id: index_id});

    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;
    const visitParseData = visitData.data[this.state.data_id].resREGFinal;
    if (visitParseData.length > 0) {
      var cityNamesArray = [];
      var cityNamesLocationIdArray = [];
      var cityname = '';
      for (let index = 0; index < visitParseData.length; index++) {
        cityNamesArray.push({
          label: visitParseData[index].location,
          value: visitParseData[index].location,
        });
        cityNamesLocationIdArray.push({
          id: visitParseData[index].locationID,
          name: visitParseData[index].location,
        });
        if (city_id == null) {
          city_id = visitParseData[index].locationID;
          if (city_id == visitParseData[index].locationID) {
            cityname = visitParseData[index].location;
          }
        } else {
          if (city_id == visitParseData[index].locationID) {
            cityname = visitParseData[index].location;
          }
        }
      }

      this.setState({
        cityNameArray: cityNamesArray,
        cityNamePlaceHolder: cityname,
        cityNameArrayLocationIDName: cityNamesLocationIdArray,
      });
    }

    if (city_type == null) {
      city_type = 'about';
    }
    this.setState({
      order_id: order_id_key,
      dataType: city_type,
      location_id: city_id,
    });

    if (city_type == 'about') {
      this.selectionOnPress('0');
    } else if (city_type == 'eat') {
      this.selectionOnPress('1');
    } else if (city_type == 'see') {
      this.selectionOnPress('2');
    } else if (city_type == 'buy') {
      this.selectionOnPress('3');
    }

    if (this.state.isApiCall && this.state.location_id !== null) {
      var type = this.state.dataType;
      await this.getollocalpinsData(type);
    }
  }

  async getollocalpinsData(requestType) {
    this.setState({isApiCall: false});
    let formData = new FormData();
    formData.append('booking_id', this.state.order_id);
    formData.append('type', requestType);
    let placeDataArray = [];
    let placesFilterType = [];

    this.setState({
      allPlaceDataArray: placeDataArray,
      allPlacesFilterType: placesFilterType,
      mainDataForFilter: placeDataArray,
      cityLong: 0.0,
      cityLat: 0.0,
    });

    fetch(getollocalpins_new, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'successful') {
          if (this.state.dataType == 'about') {
            Object.keys(responseText).forEach(cityWiseData => {
              if (this.state.location_id == '') {
                this.setState({location_id: cityWiseData});
              }
              if (this.state.location_id == cityWiseData) {
                this.setState({
                  shoppingText: responseText[cityWiseData].shopping,
                  eatText: responseText[cityWiseData].food,
                  cityLong: parseFloat(responseText[cityWiseData].longitude),
                  cityLat: parseFloat(responseText[cityWiseData].latitude),
                });
              }
            });
          } else {
            Object.keys(responseText).forEach(cityWiseData => {
              if (this.state.location_id == '') {
                this.setState({location_id: cityWiseData});
              }
              if (this.state.location_id == cityWiseData) {
                Object.keys(responseText[cityWiseData]).forEach(categoryKey => {
                  if (
                    responseText[cityWiseData][categoryKey].image != null &&
                    responseText[cityWiseData][categoryKey].image != ''
                  ) {
                    placesFilterType.push({
                      type: categoryKey,
                      image_url: responseText[cityWiseData][categoryKey].image,
                    });
                    for (
                      let index = 0;
                      index <
                      responseText[cityWiseData][categoryKey].places.length;
                      index++
                    ) {
                      if (
                        responseText[cityWiseData][categoryKey].places[index]
                          .longitude != ''
                      ) {
                        placeDataArray.push({
                          coordinate: {
                            longitude: parseFloat(
                              responseText[cityWiseData][categoryKey].places[
                                index
                              ].longitude,
                            ),
                            latitude: parseFloat(
                              responseText[cityWiseData][categoryKey].places[
                                index
                              ].latitude,
                            ),
                          },
                          type: categoryKey,
                          place_id:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].place_id,
                          place_name:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].place_name,
                          longitude:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].longitude,
                          latitude:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].latitude,
                          description:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].description,
                          timing:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].timing,
                          closeday:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].closeday,
                          ticket_prices:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].ticket_prices,
                          address:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].address,
                          contact_no:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].contact_no,
                          img_url:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].img_url,
                          city_id:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].city_id,
                          time_required_to_visit:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].time_required_to_visit,
                          category:
                            responseText[cityWiseData][categoryKey].places[
                              index
                            ].category,
                        });
                      }
                    }
                  }
                });
              }
            });
            this.setState({
              allPlaceDataArray: placeDataArray,
              allPlacesFilterType: placesFilterType,
              mainDataForFilter: placeDataArray,
              cityLong: parseFloat(placeDataArray[0].longitude),
              cityLat: parseFloat(placeDataArray[0].latitude),
            });
          }
        } else {
          Alert.alert('Sorry! something is wrong...');
        }
        this.setState({isApiCall: true});
      })
      .catch(error => {});
  }
  setDatalist = filterData => {
    this.setState({allPlaceDataArray: filterData});
  };

  filterDataAccordingType = requestType => {
    let placesNewFilter = [];
    this.state.mainDataForFilter.filter(e => {
      if (e.type === requestType) {
        placesNewFilter.push(e);
      }
    });
    this.setDatalist(placesNewFilter);
  };

  setDatalistPlace = filterData => {
    this.setState({location_id: filterData[0].id});
    if (this.state.isApiCall) {
      this.getollocalpinsData(this.state.dataType);
    }
  };

  renderFilterComponent = data => {
    return (
      <TouchableOpacity
        onPress={() => this.filterDataAccordingType(data.item.type)}>
        <Image
          source={{uri: data.item.image_url}}
          resizeMode="contain"
          style={styles.scroll_image}></Image>
      </TouchableOpacity>
    );
  };

  renderItemComponent = data => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('PlaceDetails', {
            place_details: data.item,
          })
        }>
        <View style={styles.list_container}>
          <Image
            source={data.item.img_url ? {uri: data.item.img_url} : null}
            resizeMode="cover"
            style={styles.container_image}
          />
          <View style={styles.container_details}>
            <Text numberOfLines={1} style={styles.container_details_heading}>
              {data.item.place_name}
            </Text>
            <Text numberOfLines={2} style={styles.container_details_data}>
              {data.item.address}
            </Text>
          </View>
          <Text
            style={{
              marginStart: 2,
              marginEnd: 4,
              width: 105,
              height: 20,
              fontSize: 12,
              textAlign: 'center',
              color: '#2680EB',
            }}>
            More info
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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

  async selectionOnPress(userType) {
    this.setState({selectedButton: userType});
    this.setState({buttonType: userType});
    if (userType == 0) {
      this.setState({dataType: 'about'});
      await this.getollocalpinsData('about');
    } else if (userType == 1) {
      this.setState({dataType: 'eat'});
      await this.getollocalpinsData('eat');
    } else if (userType == 2) {
      this.setState({dataType: 'see'});
      await this.getollocalpinsData('see');
    } else if (userType == 3) {
      this.setState({dataType: 'buy'});
      await this.getollocalpinsData('buy');
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={{backgroundColor: '#e4e5e5'}}>
          <View
            style={{
              width: 70,
              margin: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/new_eatseebuy.png')}
              resizeMode="contain"
              style={{width: 45, height: 45}}
            />
            <Text style={{fontSize: 18}}>Explore</Text>
            <DropDownPicker
              items={this.state.cityNameArray}
              placeholder="Filter Location"
              defaultValue={this.state.cityNamePlaceHolder}
              arrowSize={20}
              showArrow={false}
              containerStyle={{
                height: 40,
                marginTop: 5,
                width: width - 220,
                marginLeft: 1,
              }}
              style={{backgroundColor: '#e4e5e5'}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setStatusFilter(item.value)}
            />
          </View>
          <View>
            {renderIf(this.state.cityLat !== 0.0)(
              <MapView
                style={{
                  width: width,
                  height: this.state.mapheight,
                  alignSelf: 'center',
                }}
                initialRegion={{
                  latitude: this.state.cityLat,
                  longitude: this.state.cityLong,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                {this.state.allPlaceDataArray.map(marker => {
                  return (
                    <Marker key={Math.random()} {...marker}>
                      <View>
                        <Image
                          source={require('../assets/images/small_location_icon.png')}
                          resizeMode="contain"
                          style={{width: 20, height: 30}}
                        />
                      </View>
                      <Callout
                        onPress={() =>
                          this.props.navigation.navigate('PlaceDetails', {
                            place_details: marker,
                          })
                        }>
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            width: 100,
                            flexDirection: 'row',
                            height: '100%',
                          }}>
                          <View
                            style={{
                              borderColor: 'green',
                              borderWidth: 1,
                              margin: 5,
                              width: 40,
                              height: 40,
                              borderRadius: 40,
                            }}>
                            <WebView
                              source={{uri: marker.img_url}}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                              }}
                            />
                          </View>

                          <Text
                            numberOfLines={2}
                            style={{
                              fontSize: 10,
                              width: '60%',
                              color: '#000000',
                              alignSelf: 'center',
                            }}>
                            {marker.place_name}
                          </Text>
                        </View>
                      </Callout>
                    </Marker>
                  );
                })}
              </MapView>,
            )}
            <TouchableOpacity
              style={[
                {
                  width: '30%',
                  height: 60,
                  position: 'absolute',
                  right: '3%',
                  borderRadius: 25,
                },
                {top: this.state.button_location},
              ]}
              onPress={this.ShowHideTextbutton}>
              {this.state.map === true ? (
                <Image
                  source={require('../assets/images/map_view.png')}
                  resizeMode="contain"
                  style={{width: '100%', height: 60}}
                />
              ) : (
                <Image
                  source={require('../assets/images/list_view.png')}
                  resizeMode="contain"
                  style={{width: '100%', height: 60}}
                />
              )}
            </TouchableOpacity>
          </View>
          {renderIf(this.state.buttonType != 0)(
            <View
              style={{
                width: 'auto',
                padding: 5,
                flexDirection: 'row',
                alignContent: 'center',
                alignSelf: 'center',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 20,
              }}>
              <Button
                style={
                  this.state.nearby_recommended
                    ? styles.button_bg_active
                    : styles.button_bg
                }
                title="Near by"
                onPress={() => {
                  this.setState({
                    nearby_recommended: !this.state.nearby_recommended,
                  });
                }}>
                <Text
                  style={
                    this.state.nearby_recommended
                      ? styles.button_text_small_active
                      : styles.button_text_small
                  }>
                  Near by
                </Text>
              </Button>
              <Button
                style={
                  this.state.nearby_recommended
                    ? styles.button_bg
                    : styles.button_bg_active
                }
                title="Recommended"
                onPress={() => {
                  this.setState({
                    nearby_recommended: !this.state.nearby_recommended,
                  });
                }}>
                <Text
                  style={
                    this.state.nearby_recommended
                      ? styles.button_text_small
                      : styles.button_text_small_active
                  }>
                  Recommended
                </Text>
              </Button>
            </View>,
          )}

          <View>
            <View
              style={{
                width: '95%',
                height: 45,
                backgroundColor: 'transparent',
                top: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                style={styles.button_type}
                onPress={() => this.selectionOnPress('0')}>
                <Image
                  source={require('../assets/images/explore_about.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50}}
                  onPress={() => {}}
                />
                <Text style={{textAlign: 'center', padding: 2, fontSize: 16}}>
                  About
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button_type}
                onPress={() => this.selectionOnPress('1')}>
                <Image
                  source={require('../assets/images/explore_eat.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50}}
                  onPress={() => {}}
                />
                <Text style={{textAlign: 'center', padding: 2, fontSize: 16}}>
                  Eat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button_type}
                onPress={() => this.selectionOnPress('2')}>
                <Image
                  source={require('../assets/images/explore_see.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50}}
                  onPress={() => {}}
                />
                <Text style={{textAlign: 'center', padding: 2, fontSize: 16}}>
                  See
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button_type}
                onPress={() => this.selectionOnPress('3')}>
                <Image
                  source={require('../assets/images/explore_shop.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50}}
                  onPress={() => {}}
                />
                <Text style={{textAlign: 'center', padding: 2, fontSize: 16}}>
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
            {renderIf(this.state.buttonType == 0)(
              <View style={styles.scrollArea3}>
                <Text style={styles.about_heading}>
                  What to BUY and What to Eat ?
                </Text>
                <View
                  style={{
                    padding: 15,
                    fontSize: 18,
                  }}>
                  <WebView
                    useWebKit={true}
                    style={{height: this.state.webheight}}
                    automaticallyAdjustContentInsets={false}
                    scrollEnabled={false}
                    source={{
                      html:
                        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
                        this.state.shoppingText +
                        '</body></html>',
                    }}
                    onMessage={event => {
                      this.setState({
                        webheight: parseInt(event.nativeEvent.data),
                      });
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={webViewScript}
                    domStorageEnabled={true}></WebView>
                </View>
                <View
                  style={{
                    padding: 15,
                    fontSize: 18,
                  }}>
                  <WebView
                    useWebKit={true}
                    style={{height: this.state.webheight}}
                    automaticallyAdjustContentInsets={false}
                    scrollEnabled={false}
                    source={{
                      html:
                        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
                        this.state.eatText +
                        '</body></html>',
                    }}
                    onMessage={event => {
                      this.setState({
                        webheight: parseInt(event.nativeEvent.data),
                      });
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={webViewScript}
                    domStorageEnabled={true}></WebView>
                </View>
              </View>,
            )}
            {renderIf(this.state.buttonType == 1)(
              <View style={styles.scrollArea3}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 18,
                    padding: 5,
                    color: '#000000',
                  }}>
                  Tap Your Prefences
                </Text>
                <View style={styles.scrollArea2}>
                  <Image
                    source={require('../assets/images/left_arrow.png')}
                    resizeMode="contain"
                    style={styles.left_scroll_image}
                    onPress={() => alert(arrowLeft)}></Image>
                  <Image
                    source={require('../assets/images/right_arrow.png')}
                    resizeMode="contain"
                    style={styles.right_scroll_image}
                    onPress={() => alert(arrowRight)}></Image>
                  <View style={{paddingRight: 10, paddingLeft: 10}}>
                    <FlatList
                      horizontal
                      data={this.state.allPlacesFilterType}
                      renderItem={item => this.renderFilterComponent(item)}
                      keyExtractor={(item, index) => index.toString()}
                      onRefresh={this.handleRefresh}
                    />
                  </View>
                </View>
                <Text style={styles.list_heading}>List View</Text>
                <View>
                  <FlatList
                    data={this.state.allPlaceDataArray}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this.handleRefresh}
                  />
                </View>
              </View>,
            )}
            {renderIf(this.state.buttonType == 2)(
              <View style={[styles.scrollArea3]}>
                <Text style={styles.slide_heading}>Tap Your Prefences</Text>
                <View style={styles.scrollArea2}>
                  <Image
                    source={require('../assets/images/left_arrow.png')}
                    resizeMode="contain"
                    style={styles.left_scroll_image}></Image>
                  <Image
                    source={require('../assets/images/right_arrow.png')}
                    resizeMode="contain"
                    style={styles.right_scroll_image}></Image>
                  <View style={styles.scrollArea_contentContainerStyle2}>
                    <FlatList
                      horizontal
                      data={this.state.allPlacesFilterType}
                      renderItem={item => this.renderFilterComponent(item)}
                      keyExtractor={(item, index) => index.toString()}
                      onRefresh={this.handleRefresh}
                    />
                  </View>
                </View>
                <Text style={styles.list_heading}>List View</Text>
                <View style={styles.scrollArea3}>
                  <FlatList
                    data={this.state.allPlaceDataArray}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.ItemSeparator}
                    onRefresh={this.handleRefresh}
                  />
                </View>
              </View>,
            )}
            {renderIf(this.state.buttonType == 3)(
              <View style={[styles.scrollArea3]}>
                <Text style={styles.slide_heading}>Tap Your Prefences</Text>
                <View style={styles.scrollArea2}>
                  <Image
                    source={require('../assets/images/left_arrow.png')}
                    resizeMode="contain"
                    style={styles.left_scroll_image}
                  />
                  <Image
                    source={require('../assets/images/right_arrow.png')}
                    resizeMode="contain"
                    style={styles.right_scroll_image}
                  />
                  <View style={styles.scrollArea_contentContainerStyle2}>
                    <FlatList
                      horizontal
                      data={this.state.allPlacesFilterType}
                      renderItem={item => this.renderFilterComponent(item)}
                      keyExtractor={(item, index) => index.toString()}
                      onRefresh={this.handleRefresh}
                    />
                  </View>
                </View>
                <Text style={styles.list_heading}>List View</Text>
                <View style={styles.scrollArea3}>
                  <FlatList
                    data={this.state.allPlaceDataArray}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.ItemSeparator}
                    contentContainerStyle={{flex: 1}}
                    onRefresh={this.handleRefresh}
                  />
                </View>
              </View>,
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  about_heading: {
    textAlign: 'center',
    fontSize: 20,
    padding: 5,
    color: '#9B9B9B',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 200,
  },
  slide_heading: {
    textAlign: 'left',
    fontSize: 20,
    padding: 5,
    color: '#9B9B9B',
  },
  scrollArea2: {
    width: width,
    height: 85,
  },
  scrollArea3: {
    top: 40,
    width: width,
    height: 'auto',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'column',
  },
  scrollArea_contentContainerStyle2: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  scroll_image: {
    width: 90,
    height: 85,
    borderRadius: 10,
  },
  left_scroll_image: {
    width: 20,
    height: 85,
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    zIndex: 100,
  },
  right_scroll_image: {
    width: 20,
    height: 85,
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    zIndex: 100,
  },
  list_heading: {
    textAlign: 'left',
    fontSize: 20,
    padding: 5,
    fontWeight: 'bold',
    marginStart: 5,
  },
  list_container: {
    width: '95%',
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 10,
  },
  container_image: {
    height: 75,
    width: 75,
    borderRadius: 100,
  },
  container_details: {
    width: '55%',
    paddingLeft: 5,
  },
  container_details_heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  container_details_data: {
    fontSize: 16,
    color: '#000000',
  },
  container_details2: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    height: 20,
  },
  container_image2: {
    height: 20,
  },
  button_text_small: {
    color: '#ffffff',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  button_text_small_active: {
    color: '#000000',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  button_bg_active: {
    width: 150,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 40,
    margin: 10,
  },
  button_bg: {
    width: 150,
    backgroundColor: '#000000',
    borderRadius: 20,
    height: 40,
    margin: 10,
  },
  button_type: {
    alignSelf: 'center',
    padding: 5,
    margin: 5,
    backgroundColor: '#ffffff',
    width: 80,
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
