import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  convertDateForTrips,
  addMoreDays,
  differenceBetweenTwoDates,
} from '../utility/Common';
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';
import {saveDataString} from '../services/CommonStorage';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {Text, FlatList} from 'react-native';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

export default class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripsData: [],
      background_image: '',
    };
  }

  async componentDidMount() {
    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;

    let myTripsArray = [];
    for (let index = 0; index < visitData.data.length; index++) {
      myTripsArray.push({
        order_id: visitData.data[index].order_id,
        tour_date: visitData.data[index].tour_date,
        agency_name: visitData.data[index].AgencyName,
        agent_logourl: visitData.data[index].AgentLogourl,
        tour_name: visitData.data[index].tour_name,
        booking_id: visitData.data[index].booking_id,
        total_tour_days: visitData.data[index].total_tour_days,
      });
    }

    this.setState({tripsData: myTripsArray});

    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
  }

  getTripStatus = value => {
    var diff = differenceBetweenTwoDates(value);
    if (diff == 0) {
      return <Text style={{color: 'orange'}}>ONGOING</Text>;
    } else {
      return <Text style={{color: 'red'}}>{diff} Day from departure</Text>;
    }
  };

  changeData = index => {
    saveDataString('' + index, STORAGE_KEY_ACTIVE_DATA_KEY);
    this.props.navigation.push('Home');
  };

  renderItemComponent = data => {
    return (
      <TouchableOpacity onPress={() => this.changeData(data.index)}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            width: width - 10,
            height: 'auto',
            flex: 1,
            marginTop: 40,
            alignContent: 'center',
            alignSelf: 'center',
            padding: 5,
            alignContent: 'space-between',
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              width: '40%',
              height: 'auto',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <Image
              source={{uri: data.item.agent_logourl}}
              resizeMode="cover"
              style={{
                width: 50,
                height: 50,
                overflow: 'hidden',
                marginTop: -30,
                marginStart: 15,
                backgroundColor: '#ffffff',
                borderRadius: 50,
                padding: 10,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: 'gray',
                fontWeight: 'bold',
              }}>
              {data.item.booking_id}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {data.item.tour_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              width: '60%',
              height: 'auto',
              marginStart: 5,
              alignContent: 'center',
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: 'gray',
                fontWeight: 'bold',
              }}>
              Status: {this.getTripStatus(data.item.tour_date)}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
              }}>
              Book from {data.item.agency_name} on
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
              }}>
              Date- {convertDateForTrips(data.item.tour_date)} -{' '}
              {addMoreDays(data.item.tour_date, data.item.total_tour_days)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View style={styles.scrollArea2}>
            <FlatList
              data={this.state.tripsData}
              renderItem={item => this.renderItemComponent(item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.ItemSeparator}
              onRefresh={this.handleRefresh}
              contentContainerStyle={{paddingBottom: 300}}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollArea2: {
    top: '2%',
    width: width,
    height: 'auto',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'column',
  },
  image_imageStyle: {},
  itemContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    width: width - 10,
    height: 'auto',
    flex: 1,
    margin: 10,
    alignContent: 'center',
    alignSelf: 'center',
  },
});
