import React, {Component} from 'react';
import RNImageToPdf from 'react-native-image-to-pdf';

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
import * as DocumentPicker from 'expo-document-picker';
var global_style = require('./components/style');
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import {currentDatePassport} from '../utility/Common';
const {width, height} = Dimensions.get('window');
import FileViewer from 'react-native-file-viewer';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {upload_document} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PassportCopy extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      passport_number: '',
      expiry_date: '',
      pdf_url: '',
      authKey: '',
      userid: '',
      orderid: '',
      first_image: '',
      second_image: '',
      background_image: '',
      picker: false,
    };
  }

  async componentDidMount() {
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const orderId = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({orderid: orderId});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
      expiry_date: currentDatePassport(),
    });
  }
  async loadImageFromGallery(tp) {
    if (this.state.first_image !== '' && tp == 1) {
      FileViewer.open(this.state.first_image);
    } else if (this.state.second_image !== '' && tp == 2) {
      FileViewer.open(this.state.second_image);
    } else {
      let result = await DocumentPicker.getDocumentAsync({type: 'image/*'});
      console.log('result: ', ' / ' + JSON.stringify(result));
      if (result.type == 'success') {
        if (tp == 1) {
          this.setState({first_image: result.uri});
        } else if (tp == 2) {
          this.setState({second_image: result.uri});
        }
        if (this.state.first_image != '' && this.state.second_image) {
          this.convertImagesInToPDF(
            this.state.first_image,
            this.state.second_image,
          );
        }
      }
    }
  }

  showDatePicker() {
    return (
      <DatePicker
        showIcon={false}
        style={{width: 150, marginLeft: -35}}
        date={this.state.expiry_date}
        mode="date"
        placeholder="select date"
        format="DD/MM/YYYY"
        minDate="01/01/2022"
        maxDate="21/05/2050"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        ref={picker => {
          this.datePicker = picker;
        }}
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={date => {
          this.setState({expiry_date: date});
        }}
      />
    );
  }

  async convertImagesInToPDF(firstImg, secondImg) {
    try {
      console.log('FirstImage: ', ' / ' + firstImg);
      console.log('secondImg: ', ' / ' + secondImg);
      // const options = {
      //   imagePaths: [(firstImg, secondImg)],
      //   name: 'passport.pdf',
      //   quality: 0.7, // optional compression paramter
      // };
      const options = {
        imagePaths: [firstImg, secondImg],
        name: 'passport.pdf',
        maxSize: {
          width: 900,
          height: Math.round((height / width) * 900),
        },
        quality: 0.7, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdf_url: pdf.filePath});
      console.log(pdf.filePath);
    } catch (e) {
      console.log('Error: ', ' / ' + e);
    }
  }

  async loadPDFFromGallery() {
    if (this.state.pdf_url !== '') {
      FileViewer.open(this.state.pdf_url);
    } else {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (result.type == 'success') {
        this.setState({pdf_url: result.uri});
      }
    }
  }

  async uploadDocsToServer() {
    if (this.state.first_name == '') {
      alert('Please enter first name');
      return;
    } else if (this.state.last_name == '') {
      alert('Please enter second name');
      return;
    } else if (this.state.passport_number == '') {
      alert('Please enter passport number');
      return;
    } else if (this.state.expiry_date == '') {
      alert('Please enter expiry date');
      return;
    } else if (this.state.pdf_url == '') {
      alert('Please enter attcahed passport pdf OR screenshot');
      return;
    }

    let formData = new FormData();
    formData.append('traveller_id', this.state.userid);
    formData.append('booking_id', this.state.orderid);
    formData.append('nonce', this.state.authKey);
    formData.append('type', 'passport');
    formData.append('first_name', this.state.first_name);
    formData.append('last_name', this.state.last_name);
    formData.append('passno', this.state.passport_number);
    formData.append('exp_date', this.state.expiry_date);

    let uri = this.state.pdf_url;

    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('file', {
      uri: 'file://' + uri,
      name: `file.${fileType}`,
      type: `*/${fileType}`,
    });

    console.log('formData: ', ' / ' + JSON.stringify(formData));

    fetch(upload_document, {
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
          alert('' + responseText.msg);
        }
      })
      .catch(error => {
        console.log('error: ', ' / ' + error);
      });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <ImageBackground
          source={
            this.state.background_image
              ? {uri: this.state.background_image}
              : require('../assets/images/bg_home1.png')
          }
          resizeMode="cover"
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View style={styles.heading}>
            <Text style={styles.heading_text}>
              The below information is mandatory and will be shared with the
              tour organizer along with the passport.
            </Text>
          </View>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}>
              <View style={styles.container_details}>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>First Name</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={styles.details_field}
                      onChangeText={first_name =>
                        this.setState({first_name})
                      }></TextInput>
                    <Icon name="pencil" style={styles.icon}></Icon>
                  </View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.details_heading}>Last Name</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={styles.details_field}
                      onChangeText={last_name =>
                        this.setState({last_name})
                      }></TextInput>
                    <Icon name="pencil" style={styles.icon}></Icon>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={[styles.details, styles.details2]}>
                    <Text style={styles.details_heading}>Passport Number</Text>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.details_field}
                        onChangeText={passport_number =>
                          this.setState({passport_number})
                        }></TextInput>
                      <Icon name="pencil" style={styles.icon}></Icon>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.details,
                      styles.details2,
                      {marginLeft: '5%'},
                    ]}>
                    <Text style={styles.details_heading}>Expiry Date</Text>
                    <View style={{flexDirection: 'row'}}>
                      {this.showDatePicker()}
                      {/* <Text
                        style={styles.details_field}
                        onPress={() => this.setState({ picker: !this.state.picker })}
                      >
                        {this.state.expiry_date}
                      </Text>
                      <Icon name="pencil" style={styles.icon}></Icon> */}
                    </View>
                  </View>
                </View>
              </View>
              <Text style={[styles.heading_text, {textAlign: 'center'}]}>
                Upload PDF of passport here
              </Text>
              {this.state.pdf_url == '' && (
                <TouchableOpacity
                  style={styles.button_conatainer}
                  onPress={() => this.loadPDFFromGallery()}>
                  <Image
                    source={require('../assets/images/document_icon.png')}
                    resizeMode="contain"
                    style={styles.image1}
                  />
                  <Text style={styles.button_conatainer_text}>Upload</Text>
                </TouchableOpacity>
              )}
              {this.state.pdf_url !== '' && (
                <TouchableOpacity
                  onPress={() => this.loadPDFFromGallery()}
                  style={styles.button_conatainer}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#000000',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    Open File
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={[styles.heading_text, {textAlign: 'center'}]}>
                ----------OR---------
              </Text>
              <Text
                style={[
                  styles.heading_text,
                  {textAlign: 'center', marginTop: 20},
                ]}>
                Upload first page of your passport
              </Text>

              <TouchableOpacity
                style={styles.image_container}
                onPress={() => this.loadImageFromGallery(1)}>
                <Image
                  source={
                    this.state.first_image
                      ? {uri: this.state.first_image}
                      : require('../assets/images/first_dummy__passport.png')
                  }
                  resizeMode="cover"
                  style={styles.image2}
                />
                <Image
                  source={require('../assets/images/add_passport.png')}
                  resizeMode="contain"
                  style={styles.image3}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.heading_text,
                  {textAlign: 'center', marginTop: 20},
                ]}>
                Upload second page of your passport
              </Text>
              <TouchableOpacity
                style={styles.image_container}
                onPress={() => this.loadImageFromGallery(2)}>
                <Image
                  source={
                    this.state.second_image
                      ? {uri: this.state.second_image}
                      : require('../assets/images/second_dummy__passport.png')
                  }
                  resizeMode="contain"
                  style={styles.image2}
                />
                <Image
                  source={require('../assets/images/add_passport.png')}
                  resizeMode="contain"
                  style={styles.image3}
                />
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
            {/* <TouchableOpacity
              style={styles.button_conatainer2}
              onPress={() => alert('save file in personal folder')}>
              <Image
                source={require('../assets/images/save_passport.png')}
                resizeMode="contain"
                style={styles.image1}></Image>
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
    alignContent: 'center',
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
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 400,
  },
  container_details: {
    width: '95%',
    height: 'auto',
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    paddingBottom: 20,
    alignSelf: 'center',
    margin: 10,
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
    fontSize: 16,
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
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  image2: {
    width: '95%',
    height: '95%',
    marginTop: '1.5%',
    marginLeft: '2.5%',
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
    right: '20%',
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
