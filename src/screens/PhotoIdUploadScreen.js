import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
var global_style = require('./components/style');
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import FileViewer from 'react-native-file-viewer';
import DropDownPicker from 'react-native-custom-dropdown';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
} from '../services/ConstantStorageKey';
import {upload_document} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');

var id_names_array = [];

export default class PhotoIdUploadScreen extends Component {
  constructor() {
    super();
    this.state = {
      traveller_id: '',
      booking_id: '',
      nonce: '',
      id_name: '',
      id_number: '',
      member_name: '',
      photo_uri: '',
      authKey: '',
      orderid: '',
      userid: '',
    };
    id_names_array.push(
      {
        label: 'Aadhar Card',
        value: 'Aadhar Card',
      },
      {
        label: 'Pan Card',
        value: 'Pan Card',
      },
      {
        label: 'Voter Id',
        value: 'Voter Id',
      },
      {
        label: 'Driving License',
        value: 'Driving License',
      },
    );
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
    if (this.state.photo_uri !== '') {
      FileViewer.open(this.state.photo_uri);
    } else {
      let result = await DocumentPicker.getDocumentAsync();
      if (result.type == 'success') {
        this.setState({photo_uri: result.uri});
      }
    }
  }

  async uploadDocsToServer() {
    if (this.state.member_name == '') {
      alert('Please enter member name');
      return;
    } else if (this.state.id_number == '') {
      alert('Please enter id number');
      return;
    } else if (this.state.photo_uri == '') {
      alert('Please attcahed photo Id');
      return;
    }

    let formData = new FormData();
    formData.append('traveller_id', this.state.userid);
    formData.append('booking_id', this.state.orderid);
    formData.append('nonce', this.state.authKey);
    formData.append('type', 'photo_id');
    formData.append('id_number', this.state.id_number);
    formData.append('member_name', this.state.member_name);
    formData.append('id_name', this.state.id_name);

    let uri = this.state.photo_uri;

    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('file', {
      uri: 'file://' + uri,
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
            'Your photo-ID have been shared with the agent. Please hit refresh to view in the document folder',
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
          <View style={styles.scrollArea}>
            <View style={styles.details}>
              <Text style={styles.details_heading}>Member Name</Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.details_field}
                  onChangeText={member_name => this.setState({member_name})}
                />
                <Icon name="pencil" style={styles.icon} />
              </View>
            </View>
            <View style={styles.details}>
              <Text style={styles.details_heading}>ID Number</Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.details_field}
                  onChangeText={id_number => this.setState({id_number})}
                />
                <Icon name="pencil" style={styles.icon} />
              </View>
            </View>
            <View style={styles.details}>
              <Text style={styles.details_heading}>ID Name</Text>
              <View>
                <DropDownPicker
                  items={id_names_array}
                  placeholder="filter id name"
                  defaultValue={id_names_array[0].value}
                  showArrow={false}
                  arrowSize={15}
                  containerStyle={{
                    height: 45,
                    width: '95%',
                  }}
                  style={{
                    backgroundColor: '#fafafa',
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                    padding: 5,
                    backgroundColor: 'white',
                  }}
                  dropDownStyle={{
                    backgroundColor: '#FFFFFF',
                  }}
                  onChangeItem={item => this.setState({id_name: item.value})}
                />
              </View>
            </View>
            <Text style={[styles.heading_text, {textAlign: 'center'}]}>
              Upload Photo ID
            </Text>
            <TouchableOpacity
              style={styles.image_container}
              onPress={() => this.loadImageFromGallery()}>
              {this.state.photo_uri == '' && (
                <Image
                  source={
                    this.state.photo_uri
                      ? {uri: this.state.photo_uri}
                      : require('../assets/images/add_passport.png')
                  }
                  resizeMode="contain"
                  style={styles.image3}
                />
              )}
              {this.state.photo_uri !== '' && (
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
            </View>
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
    height: '100%',
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
