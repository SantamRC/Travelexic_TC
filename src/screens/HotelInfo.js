import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

var global_style = require('./components/style');
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';

const {width, height} = Dimensions.get('window');

export default class HotelInfo extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      refreshing: true,
      background_image: '',
    };
  }

  async componentDidMount() {
    this.setState({refreshing: true});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id == null) {
      index_id = 0;
    }
    this.setState({background_image: back_image});

    await AsyncStorage.getItem(STORAGE_KEY_MAIN_ITINERARY).then(value => {
      const itineraryData = value != null ? JSON.parse(value) : null;
      this.setState({
        data: itineraryData.data[index_id].resREGFinal,
        refreshing: false,
      });
    });
  }

  renderItemComponent = data => {
    const {navigate} = this.props.navigation;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigate('HotelDetails', {
            hotel_details: data.item,
          })
        }>
        <View style={styles.rect10}>
          <View style={styles.rect10_1}>
            <MaterialIcons
              name="location-on"
              style={styles.icon}></MaterialIcons>
          </View>
          <View style={styles.rect10_2}>
            <Text style={styles.title}>{data.item.location}</Text>
            <View style={styles.rect10_2_1}>
              <Text style={styles.check_in_1}>Check in</Text>
              <Text style={styles.check_in_2}>:</Text>
              <Text style={styles.check_in_1}>{data.item.checkIn}</Text>
            </View>
            <View style={styles.rect10_2_1}>
              <Text style={styles.check_in_1}>Check out</Text>
              <Text style={styles.check_in_2}>:</Text>
              <Text style={styles.check_in_1}>{data.item.checkOut}</Text>
            </View>
          </View>
          <View style={styles.rect10_3}>
            <Image
              source={{uri: data.item.hotel_image}}
              resizeMode="cover"
              style={styles.image2}></Image>

            <TouchableOpacity
              style={styles.rect13}
              onPress={() =>
                navigate('HotelDetails', {
                  hotel_details: data.item,
                })
              }>
              <Text style={styles.open}>Open</Text>
            </TouchableOpacity>
          </View>
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <SafeAreaView>
          <View style={global_style.container}>
            <ImageBackground
              source={
                this.state.background_image
                  ? {uri: this.state.background_image}
                  : require('../assets/images/bg_home1.png')
              }
              resizeMode="cover"
              style={global_style.bg_image}>
              <View style={styles.rect2Stack}>
                <FlatList
                  data={this.state.data}
                  renderItem={item => this.renderItemComponent(item)}
                  keyExtractor={item => item.locationID.toString()}
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                />
              </View>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  scrollArea: {
    width: width,
    height: 'auto',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 300,
  },
  rect10_1: {
    width: '10%',
    height: '100%',
  },
  rect10_2: {
    width: '60%',
    height: '100%',
  },
  rect10_3: {
    width: '30%',
    height: '100%',
  },
  rect10: {
    width: '90%',
    height: 150,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 10,
    marginLeft: '5%',
    flexDirection: 'row',
  },
  icon: {
    color: '#4A90E2',
    fontSize: 40,
    top: '5%',
  },
  rect2Stack: {
    width: width,
    height: height,
    marginTop: '5%',
    marginLeft: 0,
  },
  title: {
    fontSize: 22,
    marginTop: '5%',
    paddingLeft: '5%',
    fontWeight: 'bold',
  },
  rect10_2_1: {
    width: '100%',
    height: 'auto',
    top: '5%',
    flexDirection: 'row',
  },
  check_in_1: {
    width: '45%',
    color: '#9B9B9B',
    paddingLeft: '5%',
  },
  check_in_2: {
    width: '10%',
    color: '#9B9B9B',
  },
  image2: {
    width: '80%',
    height: '50%',
    marginLeft: '10%',
    marginTop: '10%',
    borderRadius: 100,
  },
  rect13: {
    width: '70%',
    height: 20,
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 20,
    marginLeft: '15%',
    marginTop: '10%',
  },
  open: {
    color: 'rgba(255,255,255,1)',
    height: 'auto',
    width: '100%',
    fontSize: 14,
    textAlign: 'center',
  },
});
