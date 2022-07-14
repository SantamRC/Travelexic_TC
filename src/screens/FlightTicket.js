import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
var global_style = require('./components/style');
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import DatePicker from 'react-native-date-picker';
import FileViewer from 'react-native-file-viewer';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
} from '../services/ConstantStorageKey';
import {upload_document} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
import {changeFlightData} from '../utility/Common';

export default class FlightTicket extends Component {
  constructor() {
    super();
    this.state = {
      traveller_id: '',
      booking_id: '',
      nonce: '',
      dep_date: new Date(),
      arr_date: new Date(),
      isdepDate: false,
      isarrDate: false,
      flight_name: '',
      flight_dep: '',
      flight_arr: '',
      flight_uri: '',
      authKey: '',
      orderid: '',
      userid: '',
    };
  }

  async componentDidMount() {
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const orderId = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({orderid: orderId});
  }

  async loadImageFromGallery() {
    if (this.state.flight_uri !== '') {
      FileViewer.open(this.state.flight_uri);
    } else {
      let result = await DocumentPicker.getDocumentAsync();
      if (result.type == 'success') {
        this.setState({flight_uri: result.uri});
      }
    }
  }

  async uploadDocsToServer() {
    if (this.state.flight_arr == '') {
      alert('Please enter flight arrival city name');
      return;
    } else if (this.state.dep_date == '') {
      alert('Please enter departure date');
      return;
    } else if (this.state.arr_date == '') {
      alert('Please enter arrival date');
      return;
    } else if (this.state.flight_dep == '') {
      alert('Please enter flight departure city name');
      return;
    } else if (this.state.flight_name == '') {
      alert('Please enter flight number');
      return;
    } else if (this.state.flight_uri == '') {
      alert('Please attcahed flight screenshot');
      return;
    }

    console.log(
      'FlightDate: ',
      ' / ' + this.state.dep_date + ' -- ' + this.state.arr_date,
    );

    let formData = new FormData();
    formData.append('traveller_id', this.state.userid);
    formData.append('booking_id', this.state.orderid);
    formData.append('nonce', this.state.authKey);
    formData.append('type', 'flight');
    formData.append('dep_date', changeFlightData(this.state.dep_date));
    formData.append('arr_date', changeFlightData(this.state.arr_date));
    formData.append('flight_name', this.state.flight_name);
    formData.append('flight_dep', this.state.flight_dep);
    formData.append('flight_arr', this.state.flight_arr);

    let uri = this.state.flight_uri;

    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('file', {
      uri: uri,
      name: `file.${fileType}`,
      type: `*/${fileType}`,
    });

    console.log('formData:', ' / ' + JSON.stringify(formData));

    fetch(upload_document, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'success') {
          alert(
            'Your tickets have been shared with the agent. Please hit refresh to view in the document folder',
          );
        }
      })
      .catch(error => {});
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <ImageBackground
          source={require('../assets/images/bg_home1.png')}
          resizeMode="cover"
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View style={styles.heading}>
            <Text style={styles.heading_text}>
              The below information will be used to provide you important flight
              status updates.
            </Text>
          </View>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}>
              <View style={styles.container_details}>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>Flight Number</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={styles.details_field}
                      onChangeText={flight_name =>
                        this.setState({flight_name})
                      }></TextInput>
                    <Icon name="pencil" style={styles.icon}></Icon>
                  </View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>Departure Airport</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={styles.details_field}
                      onChangeText={flight_dep =>
                        this.setState({flight_dep})
                      }></TextInput>
                    <Icon name="pencil" style={styles.icon}></Icon>
                  </View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>
                    Departure Date & Time
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.details_field}
                      onPress={() => this.setState({isdepDate: true})}>
                      <Text style={{textAlign: 'center'}}>
                        {changeFlightData(this.state.dep_date)}
                      </Text>
                    </TouchableOpacity>
                    <Icon name="pencil" style={styles.icon} />
                  </View>
                  {this.state.isdepDate && (
                    <DatePicker
                      modal
                      open={this.state.isdepDate}
                      date={this.state.dep_date}
                      onConfirm={date => {
                        this.setState({isdepDate: false, dep_date: date});
                      }}
                      onCancel={() => {
                        this.setState({isdepDate: false});
                      }}
                    />
                  )}
                </View>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>Arrival Airport</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={styles.details_field}
                      onChangeText={flight_arr =>
                        this.setState({flight_arr})
                      }></TextInput>
                    <Icon name="pencil" style={styles.icon}></Icon>
                  </View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>
                    Arrival Date & Time
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.details_field}
                      onPress={() => this.setState({isarrDate: true})}>
                      <Text style={{textAlign: 'center'}}>
                        {changeFlightData(this.state.arr_date)}
                      </Text>
                    </TouchableOpacity>
                    <Icon name="pencil" style={styles.icon} />
                  </View>
                  {this.state.isarrDate && (
                    <DatePicker
                      modal
                      open={this.state.isarrDate}
                      date={this.state.arr_date}
                      onConfirm={date => {
                        this.setState({isarrDate: false, arr_date: date});
                      }}
                      onCancel={() => {
                        this.setState({isarrDate: false});
                      }}
                    />
                  )}
                </View>
              </View>
              <Text style={[styles.heading_text, {textAlign: 'center'}]}>
                Upload Flight Ticket
              </Text>
              <TouchableOpacity
                style={styles.image_container}
                onPress={() => this.loadImageFromGallery()}>
                {this.state.flight_uri == '' && (
                  <Image
                    source={
                      this.state.flight_uri
                        ? {uri: this.state.flight_uri}
                        : require('../assets/images/add_passport.png')
                    }
                    resizeMode="contain"
                    style={styles.image3}
                  />
                )}
                {this.state.flight_uri !== '' && (
                  <View
                    style={{
                      height: '95%',
                      width: '95%',
                      alignSelf: 'center',
                      backgroundColor: '#b7b7b7',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 28,
                        color: '#000000',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}>
                      Open File
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.floating_button_container}>
            <TouchableOpacity
              style={styles.button_conatainer2}
              onPress={() => this.uploadDocsToServer()}>
              <Image
                source={require('../assets/images/share_passport.png')}
                resizeMode="contain"
                style={styles.image1}
              />
              <Text
                style={[
                  styles.button_conatainer_text,
                  {fontSize: 14, width: '80%'},
                ]}>
                Share with coordinator
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button_conatainer2}>
              <Image
                source={require('../assets/images/save_passport.png')}
                resizeMode="contain"
                style={styles.image1}/>
              <Text
                style={[
                  styles.button_conatainer_text,
                  {fontSize: 14, width: '80%'},
                ]}>
                save file in personal folder
              </Text>
            </TouchableOpacity> */}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    width: width,
    backgroundColor: '#fff',
    height: 'auto',
    paddingBottom: 10,
    margin: 10,
    alignSelf: 'center',
  },
  heading_text: {
    width: '90%',
    marginLeft: '5%',
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  scrollArea: {
    width: width,
    height: 'auto',
    backgroundColor: '#fff',
    margin: 10,
    alignSelf: 'center',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 400,
  },
  container_details: {
    width: '95%',
    alignSelf: 'center',
    height: 'auto',
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    paddingBottom: 20,
    marginTop: 5,
  },
  details: {
    width: '90%',
    marginTop: 10,
    marginLeft: '5%',
  },
  details2: {
    width: '40%',
    marginTop: 10,
  },
  details_heading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'grey',
  },
  details_field: {
    borderWidth: 2,
    borderColor: 'rgb(184,184,184)',
    width: '85%',
    borderRadius: 5,
    color: 'black',
    paddingLeft: 10,
    height: 40,
    borderRightWidth: 0,
    justifyContent: 'center',
  },
  icon: {
    color: 'rgba(128,128,128,1)',
    fontSize: 20,
    borderWidth: 2,
    padding: 10,
    marginLeft: -10,
    height: 40,
    borderRadius: 5,
    borderLeftWidth: 0,
    borderColor: 'rgb(184,184,184)',
  },
  button_conatainer: {
    width: '32%',
    height: 60,
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft: '35%',
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  button_conatainer2: {
    width: '90%',
    height: 60,
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: '5%',
  },
  image1: {
    width: 30,
    height: 50,
    marginLeft: '10%',
  },
  button_conatainer_text: {
    width: '60%',
    fontSize: 20,
    height: 40,
    marginTop: 15,
    paddingLeft: 5,
    color: 'grey',
    fontWeight: '200',
  },
  image_container: {
    width: '90%',
    height: 200,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  image3: {
    position: 'absolute',
    height: 50,
    top: '40%',
    left: '30%',
  },
  floating_button_container: {
    width: '60%',
    height: 'auto',
    position: 'absolute',
    bottom: '15%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 2,
    shadowOpacity: 1,
  },
});
