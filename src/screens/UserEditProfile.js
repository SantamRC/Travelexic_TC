import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
var global_style = require('./components/style');
import * as DocumentPicker from 'expo-document-picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY_userProfiling_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {saveData} from '../services/CommonStorage';

export default class UserEditProfile extends Component {
  constructor() {
    super();
    this.state = {
      isMale: true,
      imagePath: '',
      mobile_no: '',
      full_name: '',
      email_id: '',
      dob: '',
      background_image: '',
    };
  }

  async componentDidMount() {
    const userProfileData = await AsyncStorage.getItem(
      STORAGE_KEY_userProfiling_key,
    );
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    const userData =
      userProfileData != null ? JSON.parse(userProfileData) : null;
    if (userData != null) {
      this.setState({
        isMale: userData.isMale,
        imagePath: userData.imagePath,
        mobile_no: userData.mobile_no,
        full_name: userData.full_name,
        email_id: userData.email_id,
        dob: userData.dob,
      });
    }
  }

  async sendDataToServer() {
    if (this.state.mobile_no == '') {
      alert('Please Enter Mobile Number');
      return;
    } else if (this.state.full_name == '') {
      alert('Please Enter name');
      return;
    } else if (this.state.email_id == '') {
      alert('Please Enter email id');
      return;
    } else if (this.state.dob == '') {
      alert('Please Enter DOB');
      return;
    } else if (this.state.imagePath == '') {
      alert('Please attach profile image');
      return;
    } else {
      saveData(this.state, STORAGE_KEY_userProfiling_key);
      alert('Thanks! Your information successfully saved...');
    }
  }

  async loadDocsFromGallery() {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == 'success') {
      this.setState({imagePath: result.uri});
    }
  }

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
          <View>
            <ScrollView horizontal={false}>
              <View style={styles.group21}>
                <View style={styles.rect}>
                  <View style={styles.group20}>
                    <View style={styles.group10}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.loadDocsFromGallery()}>
                        <Icon name="camera" style={styles.icon}></Icon>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.group19}>
                      <Text style={styles.gender2}>Gender</Text>
                      <View style={styles.group12}>
                        <View style={styles.button7Row}>
                          <TouchableOpacity style={styles.button7}>
                            <TouchableOpacity
                              style={styles.button5}
                              onPress={() => this.setState({isMale: true})}>
                              <Text
                                style={
                                  this.state.isMale
                                    ? styles.male2
                                    : styles.female2
                                }>
                                Male
                              </Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button8}>
                            <TouchableOpacity
                              style={styles.button6}
                              onPress={() => this.setState({isMale: false})}>
                              <Text
                                style={
                                  this.state.isMale
                                    ? styles.female2
                                    : styles.male2
                                }>
                                Female
                              </Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles.group13}>
                      <Text style={styles.mobileNo2}>Mobile No.</Text>
                      <TextInput
                        style={styles.enter_filed}
                        placeholder="Enter mobile number"
                        onChangeText={mobile_no => this.setState({mobile_no})}
                        value={this.state.mobile_no}
                      />
                    </View>
                    <View style={styles.group14}>
                      <Text style={styles.fullName2}>Full Name</Text>
                      <TextInput
                        style={styles.enter_filed}
                        placeholder="Enter name"
                        onChangeText={full_name => this.setState({full_name})}
                        value={this.state.full_name}
                      />
                    </View>
                    <View style={styles.group17}>
                      <Text style={styles.emailId2}>Email ID</Text>
                      <TextInput
                        style={styles.enter_filed}
                        placeholder="Enter email id"
                        onChangeText={email_id => this.setState({email_id})}
                        value={this.state.email_id}
                      />
                    </View>
                    <View style={styles.group16}>
                      <Text style={styles.dob2}>DOB</Text>
                      <TextInput
                        style={styles.enter_filed}
                        placeholder="Enter date of birth"
                        onChangeText={dob => this.setState({dob})}
                        value={this.state.dob}
                      />
                    </View>
                    <View style={styles.group18}>
                      <TouchableOpacity
                        style={styles.button9}
                        onPress={() => this.sendDataToServer()}>
                        <Text style={styles.save2}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  group21: {
    width: wp('100%'),
    height: height,
    marginTop: 15,
  },
  rect: {
    width: wp('90%'),
    height: height - 50,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    marginLeft: wp('5%'),
  },
  group20: {
    width: wp('80%'),
    height: height - 100,
    alignItems: 'center',
    marginTop: 34,
    marginLeft: wp('5%'),
  },
  group10: {
    width: 110,
    height: 110,
    marginLeft: 0,
    alignItems: 'center',
  },
  button: {
    width: 110,
    height: 110,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 31,
  },
  icon: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    width: 40,
    height: 44,
    marginTop: 66,
    marginLeft: 67,
  },
  group19: {
    width: 107,
    height: 53,
    marginTop: 20,
    alignItems: 'center',
  },
  gender2: {
    color: '#121212',
    fontSize: 18,
  },
  group12: {
    width: 107,
    height: 25,
    flexDirection: 'row',
    marginTop: 6,
  },
  button7: {
    width: 50,
    height: 25,
    backgroundColor: 'rgba(230, 230, 230,1)',
  },
  button5: {
    width: 50,
    height: 25,
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 5,
  },
  male2: {
    color: 'rgba(255,255,255,1)',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 12,
  },
  button8: {
    width: 50,
    height: 25,
    marginLeft: 7,
  },
  button6: {
    width: 50,
    height: 25,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 5,
  },
  female2: {
    color: '#121212',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 6,
  },
  button7Row: {
    height: 25,
    flexDirection: 'row',
    flex: 1,
  },
  group13: {
    width: wp('80%'),
    height: 52,
    marginTop: 24,
  },
  mobileNo2: {
    color: '#121212',
    fontSize: 16,
    marginLeft: 1,
  },
  group14: {
    width: wp('80%'),
    height: 52,
    marginTop: 24,
  },
  fullName2: {
    color: '#121212',
    fontSize: 16,
    marginLeft: 1,
  },
  group17: {
    width: wp('80%'),
    height: 52,
    marginTop: 24,
  },
  emailId2: {
    color: '#121212',
    fontSize: 16,
    marginLeft: 1,
  },
  group16: {
    width: wp('80%'),
    height: 52,
    marginTop: 24,
  },
  dob2: {
    color: '#121212',
    fontSize: 16,
    marginLeft: 1,
  },
  group18: {
    width: wp('80%'),
    height: 38,
    marginTop: 36,
    marginLeft: 0,
    alignItems: 'center',
  },
  button9: {
    width: 110,
    height: 38,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 20,
    alignItems: 'center',
  },
  save2: {
    color: '#121212',
    fontSize: 23,
    marginTop: 5,
    marginLeft: 0,
  },
  enter_filed: {
    color: '#121212',
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 40,
    paddingStart: 5,
  },
});
