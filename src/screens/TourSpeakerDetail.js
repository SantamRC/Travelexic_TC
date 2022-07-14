import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import renderIf from '../utility/renderif';
import {interestExhibitor, nonceDriver} from '../services/ConstantURLS';
import {
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
} from '../services/ConstantStorageKey';
var global_style = require('./components/style');
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class TourSpeakerDetail extends Component {
  constructor() {
    super();
    this.state = {
      exhibitorArray: [],
      exhibitor_details: '',
      isHave: true,
      order_id: '',
      background_image: '',
      authKey: '',
      userid: '',
    };
  }

  async markShowInterest() {
    let formData = new FormData();
    formData.append('booking_id', this.state.order_id);
    formData.append('traveller_id', this.state.userid);
    formData.append('interest_status', '1');
    formData.append('exhibitor_id', this.state.exhibitor_details.id);
    formData.append('nonce', nonceDriver);

    console.log('formData: ', ' / ' + JSON.stringify(formData));

    fetch(interestExhibitor, {
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
          alert('Your interest request has been send');
          let exhibitorDetails = this.state.exhibitor_details;
          exhibitorDetails.interest_status = 1;
          this.setState({exhibitor_details: exhibitorDetails});
        } else {
          alert('Something wrong, please try again');
        }
      })
      .catch(error => {});
  }

  async componentDidMount() {
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      order_id: order_id_key,
      userid: userid,
      authKey: auth_key,
      background_image: back_image,
    });

    this.updateDataSet();
  }

  updateDataSet() {
    if (this.state.isHave) {
      const exhibitor_details = this.props.route.params.exhibitor_details;
      const exhibitorArray = this.props.route.params.exhibitorArray;
      this.setState({
        exhibitorArray: exhibitorArray,
        exhibitor_details: exhibitor_details,
        isHave: false,
      });
    }
  }

  renderItemComponent = data => {
    return (
      <View style={styles.rect2}>
        <Image
          source={{uri: data.item.logo}}
          resizeMode="contain"
          style={styles.image3}></Image>
        <Text style={styles.xyz2}>{data.item.name}</Text>
        <Text style={styles.management2}>{data.item.category}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState({exhibitor_details: data.item})}>
          <Text style={styles.profile}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
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
          <View style={styles.rect}>
            <Image
              source={{uri: this.state.exhibitor_details.logo}}
              resizeMode="contain"
              style={styles.image}></Image>
            <Text style={styles.xyz}>{this.state.exhibitor_details.name}</Text>
            <Text style={styles.management}>
              {this.state.exhibitor_details.category}
            </Text>
            <Text style={styles.description}>
              {this.state.exhibitor_details.description}
            </Text>
          </View>
          {renderIf(this.state.exhibitor_details.interest_status == 0)(
            <TouchableOpacity onPress={() => this.markShowInterest()}>
              <Image
                source={require('../assets/images/show_interest.png')}
                resizeMode="contain"
                style={styles.image2}></Image>
            </TouchableOpacity>,
          )}
          <Text style={styles.moreManagement}>More Management</Text>
          <View style={styles.scrollArea2}>
            <FlatList
              horizontal
              data={this.state.exhibitorArray}
              renderItem={item => this.renderItemComponent(item)}
              keyExtractor={(item, index) => index.toString()}
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(230,230,230,1)',
  },
  scrollArea2: {
    top: '0%',
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'column',
  },
  rect: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 10,
    marginTop: '5%',
    left: '5%',
  },
  image: {
    width: 150,
    height: 150,
    marginLeft: '30%',
  },
  xyz: {
    color: '#121212',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    width: '60%',
    left: '20%',
    fontSize: 20,
    textAlign: 'center',
  },
  management: {
    color: '#121212',
    width: '60%',
    left: '20%',
    textAlign: 'center',
  },
  description: {
    color: '#121212',
    minHeight: 50,
    width: '90%',
    marginBottom: 10,
    left: '5%',
  },
  image2: {
    width: '50%',
    marginLeft: '25%',
  },
  moreManagement: {
    color: '#121212',
    width: '80%',
    left: '5%',
    fontSize: 24,
    fontWeight: '400',
    marginTop: 10,
  },
  rect2: {
    // borderWidth:1,
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 18,
    marginLeft: 26,
    fontWeight: 'bold',
  },
  image3: {
    width: 75,
    height: 75,
    marginLeft: 40,
  },
  xyz2: {
    color: '#121212',
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  management2: {
    color: 'rgba(155,155,155,1)',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
  },
  button: {
    width: '70%',
    height: 30,
    backgroundColor: '#fbce29',
    borderRadius: 100,
    left: '15%',
  },
  profile: {
    color: '#121212',
    marginTop: '5%',
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
  },
});
