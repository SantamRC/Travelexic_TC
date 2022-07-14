import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getUserDetailsURL, nonceForUserDetails} from '../services/ConstantURLS';
var global_style = require('./components/style');
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_username_key,
  STORAGE_KEY_userProfiling_key,
  STORAGE_KEY_user_logged_in,
} from '../services/ConstantStorageKey';
const {width, height} = Dimensions.get('window');
import data from '../utility/Countries';
import {saveDataString, saveData} from '../services/CommonStorage';
import renderif from '../utility/renderif';
import auth, {firebase} from '@react-native-firebase/auth';
import {ScrollView} from 'react-native-gesture-handler';

// Default render of country flag
const defaultFlag = data.filter(obj => obj.name === 'India')[0].flag;

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      flag: defaultFlag,
      modalVisible: false,
      phoneNumber: '',
      countyCode: '91',
      name: '',
      email_id: '',
      new_user: 0,
      refreshing: true,
      verificationId: null,
      recaptchaVerifier: React.createRef(),
      isModalVisible: false,
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      confirm: null,
      firebase_config: {
        apiKey: 'AIzaSyBCexHDInWi7j5q7Ba8u4JJDbpljoygcT0',
        authDomain: 'travelexic-196705.firebaseapp.com',
        databaseURL: 'https://travelexic-196705.firebaseio.com',
        projectId: 'travelexic-196705',
        storageBucket: 'travelexic-196705.appspot.com',
        messagingSenderId: '752546061885',
        appId: '1:752546061885:android:13913dde3bc8f24d',
      },
    };
  }

  sendVerification = () => {
    if (this.state.isModalVisible == true) {
      this.setState({isModalVisible: false});
    }
    if (!this.state.name.trim()) {
      alert('Please Enter Name');
      return;
    }
    if (!this.state.phoneNumber.trim()) {
      alert('Please Enter Nummber');
      return;
    }
    if (!this.state.email_id.trim()) {
      alert('Please Enter Email');
      return;
    }

    this.handleSendCode();
  };

  handleSendCode = () => {
    // Request to send OTP
    let phoneNumber = '+' + this.state.countyCode + this.state.phoneNumber;
    console.log('PhoneNumber: ', ' / ' + phoneNumber);
    if (this.validatePhoneNumber(phoneNumber)) {
      auth()
        .signInWithPhoneNumber(phoneNumber, true)
        .then(confirmResult => {
          console.log('confirmResult: ' + confirmResult);
          this.setState({
            confirm: confirmResult,
            isModalVisible: true,
            verificationId: confirmResult._verificationId,
          });
        })
        .catch(error => {
          alert(error.message);
          console.log(error);
        });
    } else {
      alert('Invalid Phone Number');
    }
  };

  validatePhoneNumber = phoneNumber => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(phoneNumber);
  };

  showModal() {
    this.setState({modalVisible: true});
  }
  hideModal() {
    this.setState({modalVisible: false});
  }

  async registredUserData() {
    if (!this.state.name.trim()) {
      alert('Please Enter Name');
      return;
    }
    if (!this.state.phoneNumber.trim()) {
      alert('Please Enter Nummber');
      return;
    }
    //Check for the Email TextInput
    if (!this.state.email_id.trim()) {
      alert('Please Enter Email');
      return;
    }

    let formDate = new FormData();

    formDate.append('username', this.state.countyCode + this.state.phoneNumber);
    formDate.append('email', this.state.email_id);
    formDate.append('nonce', nonceForUserDetails);
    formDate.append('device', Platform.OS);

    this.setState({refreshing: true});
    fetch(getUserDetailsURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        this.setState({refreshing: false});
        if (responseText.status == 'success') {
          saveDataString(responseText.auth_key, STORAGE_KEY_auth_key);
          saveDataString('' + responseText.user_id, STORAGE_KEY_userid_key);
          saveDataString('' + this.state.name, STORAGE_KEY_username_key);
          saveDataString('true', STORAGE_KEY_user_logged_in);

          var userData = {
            isMale: true,
            imagePath: '',
            mobile_no: this.state.phoneNumber,
            full_name: this.state.name,
            email_id: this.state.email_id,
            dob: '',
          };

          saveData(userData, STORAGE_KEY_userProfiling_key);
          firebase.auth().signOut();
          this.props.navigation.navigate('Home');
          Alert.alert('User register successfully');
        } else {
          Alert.alert('Error: ', responseText.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  showOTPMessage() {
    alert('Please enter complete OTP numbers');
  }

  submitOTP = () => {
    if (this.state.input1 == '') {
      this.showOTPMessage();
    } else if (this.state.input2 == '') {
      this.showOTPMessage();
    } else if (this.state.input3 == '') {
      this.showOTPMessage();
    } else if (this.state.input4 == '') {
      this.showOTPMessage();
    } else if (this.state.input5 == '') {
      this.showOTPMessage();
    } else if (this.state.input6 == '') {
      this.showOTPMessage();
    } else {
      var otp =
        this.state.input1 +
        this.state.input2 +
        this.state.input3 +
        this.state.input4 +
        this.state.input5 +
        this.state.input6;
      this.setState({isModalVisible: false});
      this.confirmVerificationCode(otp);
    }
  };

  async confirmVerificationCode(code) {
    console.log('Code: ', ' / ' + code);
    console.log('verificationId: ', ' / ' + this.state.verificationId);
    const credential = auth.PhoneAuthProvider.credential(
      this.state.verificationId,
      code,
    );
    auth()
      .signInWithCredential(credential)
      .then(result => {
        console.log(result);
        this.registredUserData();
      })
      .catch(error => {
        // alert('error: ', ' / ' + error);
        console.log('error: ', ' / ' + error);
        let userErrorMessage;
        if (error.code === 'auth/invalid-verification-code') {
          userErrorMessage = 'Sorry, that code was incorrect.';
        } else if (error.code === 'auth/user-disabled') {
          userErrorMessage = 'Sorry, this phone number has been blocked.';
        } else {
          userErrorMessage =
            "Sorry, we couldn't verify that phone number at the moment. " +
            'Please try again later. ' +
            '\n\nIf the issue persists, please contact support.';
        }
        alert(userErrorMessage);
      });
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({isModalVisible: false});
        this.registredUserData();
      }
    });
  }

  render() {
    const countryData = data;
    return (
      <ScrollView style={{flex: 1, paddingTop: 20, backgroundColor: '#e4e5e5'}}>
        <SafeAreaView>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="#3F51B5"
            translucent={true}
            barStyle="light-content"
          />
          <ImageBackground
            source={require('../assets/splash.png')}
            style={global_style.bg_image}>
            {/* <Image
              source={require('../assets/images/user_icon_login.png')}
              resizeMode="contain"
              style={styles.image2}
           /> */}
            <View
              style={{
                marginTop: 280,
                width: width,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.rect}>
                <Image
                  source={require('../assets/images/user_icon_small_login.png')}
                  resizeMode="contain"
                  style={styles.image3}
                />
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="rgba(242,236,236,1)"
                  style={styles.textInput}
                  onChangeText={name => this.setState({name})}
                  value={this.state.name}
                />
              </View>

              <View style={styles.rect}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.showModal()}>
                  <Text style={styles.image4}>{this.state.flag}</Text>
                </TouchableOpacity>

                <TextInput
                  keyboardType="phone-pad"
                  autoCompleteType="tel"
                  placeholder="88888888"
                  placeholderTextColor="rgba(242,236,236,1)"
                  style={styles.textInput2}
                  onChangeText={phoneNumber => {
                    this.setState({phoneNumber});
                  }}
                  value={this.state.phoneNumber}
                />
              </View>

              <View style={styles.rect}>
                <Image
                  source={require('../assets/images/email_login.png')}
                  resizeMode="contain"
                  style={styles.image5}
                />

                <TextInput
                  placeholder="E Mail -ID"
                  placeholderTextColor="rgba(242,236,236,1)"
                  style={styles.textInput3}
                  onChangeText={email_id => this.setState({email_id})}
                  value={this.state.email_id}
                />
              </View>
              <View
                style={{
                  width: width - 100,
                  height: 40,
                  borderRadius: 7,
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0000FF',
                    width: '30%',
                    borderRadius: 8,
                    alignSelf: 'center',
                  }}
                  onPress={() => this.sendVerification()}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#ffffff',
                      alignSelf: 'center',
                      textAlign: 'center',
                      padding: 5,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={require('../assets/images/logo_travelexic_login.png')}
              resizeMode="contain"
              style={styles.image6}
            />

            <Modal
              animationType="fade"
              transparent={false}
              visible={this.state.modalVisible}>
              <View style={{flex: 1}}>
                <View style={{flex: 1, marginTop: '10%'}}>
                  <FlatList
                    data={countryData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => this.selectCountry(item.name)}>
                        <View style={styles.countryStyle}>
                          <Text style={styles.countryTextStyle1}>
                            {item.flag}
                          </Text>
                          <Text style={styles.countryTextStyle2}>
                            {item.name}
                          </Text>
                          <Text style={styles.countryTextStyle3}>
                            ({item.dial_code})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                <TouchableOpacity
                  rounded
                  onPress={() => this.hideModal()}
                  style={styles.closeButtonStyle}>
                  <Text style={styles.textStyle}> Cancel </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            {renderif(this.state.isModalVisible)(
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Modal
                  animationType="slide"
                  transparent
                  backdropOpacity={0.3}
                  visible={this.state.isModalVisible}
                  presentationStyle="overFullScreen"
                  onDismiss={() => {
                    this.setState({isModalVisible: false});
                  }}
                  onRequestClose={() => {
                    this.setState({isModalVisible: false});
                  }}>
                  <View style={styles.viewWrapper}>
                    <ImageBackground
                      source={require('../assets/images/bg_dialogue.png')}
                      imageStyle={{
                        flex: 1,
                        resizeMode: 'cover',
                        justifyContent: 'center',
                      }}
                      style={{
                        width: 315,
                        height: 315,
                        padding: 5,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 315,
                          height: 315,
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            width: 160,
                            height: 52,
                            marginTop: -30,
                            marginEnd: -10,
                            alignSelf: 'flex-end',
                            resizeMode: 'cover',
                          }}
                          source={require('../assets/images/otp_header.png')}
                        />

                        <Text
                          style={{
                            fontSize: 23,
                            marginTop: 20,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                          }}>
                          Enter the code received
                        </Text>
                        <View
                          style={{
                            fontSize: 15,
                            margin: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_1"
                            onChangeText={value => {
                              this.setState({input1: value});
                              if (value) this.refs.input_2.focus();
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_2"
                            onChangeText={value => {
                              this.setState({input2: value});
                              if (value) this.refs.input_3.focus();
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_3"
                            onChangeText={value => {
                              this.setState({input3: value});
                              if (value) this.refs.input_4.focus();
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_4"
                            onChangeText={value => {
                              this.setState({input4: value});
                              if (value) this.refs.input_5.focus();
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_5"
                            onChangeText={value => {
                              this.setState({input5: value});
                              if (value) this.refs.input_6.focus();
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            maxLength={1}
                            style={styles.input}
                            secureTextEntry={true}
                            ref="input_6"
                            onChangeText={value => {
                              this.setState({input6: value});
                            }}
                          />
                        </View>
                        <TouchableOpacity onPress={() => this.submitOTP()}>
                          <Image
                            style={{
                              width: 155,
                              height: 30,
                              margin: 5,
                              alignSelf: 'center',
                              resizeMode: 'cover',
                            }}
                            source={require('../assets/images/otp_confirm.png')}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.sendVerification()}>
                          <Text
                            style={{
                              color: '#137ae4',
                              padding: 5,
                              fontSize: 18,
                              fontWeight: 'bold',
                              margin: 5,
                            }}>
                            Resend OTP
                          </Text>
                        </TouchableOpacity>
                        {/* <Text
                          numberOfLines={1}
                          style={{
                            color: '#b0b2b3',
                            alignSelf: 'center',
                            alignItems: 'center',
                          }}>
                          -----------------------------------------------------------------------------
                        </Text>
                        <Text style={{color: '#b0b2b3'}}>
                          Didn't receive OTP check your registered email
                        </Text> */}
                      </View>
                    </ImageBackground>
                  </View>
                </Modal>
              </View>,
            )}
          </ImageBackground>
        </SafeAreaView>
      </ScrollView>
    );
  }

  async selectCountry(country) {
    // Get data from Countries.js
    const countryData = data;
    try {
      // Get the country code
      const countryCode = countryData.filter(obj => obj.name === country)[0]
        .dial_code;
      // Get the country flag
      const countryFlag = countryData.filter(obj => obj.name === country)[0]
        .flag;
      // Update the state then hide the Modal
      this.setState({countyCode: countryCode, flag: countryFlag});
      this.hideModal();
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: wp('100%'),
    height: height,
  },

  image2: {
    width: width,
    height: 139,
    marginTop: 20,
  },
  rect: {
    width: width - 100,
    height: 40,
    backgroundColor: 'rgba(7,7,7,1)',
    borderRadius: 7,
    marginTop: 20,
  },
  image3: {
    width: 25,
    height: 22,
    marginTop: 7,
    marginLeft: 4,
  },
  placeholder: {
    top: 0,
    left: 32,
    position: 'absolute',

    color: '#121212',
    height: 37,
    width: 210,
    backgroundColor: 'rgba(2,2,2,1)',
    borderRadius: 10,
  },
  textInput: {
    top: 0,
    left: 32,
    position: 'absolute',
    color: 'white',
    height: '100%',
    width: '80%',
    backgroundColor: 'rgba(2,2,2,1)',
    borderRadius: 10,
    marginLeft: '5%',
  },
  rectStack: {
    width: width,
    height: 37,
    marginTop: 54,
    marginLeft: 50,
  },
  rect2: {
    top: 0,
    left: 0,
    width: width - 100,
    height: 37,
    position: 'absolute',
    backgroundColor: 'rgba(7,7,7,1)',
    borderRadius: 7,
  },
  image4: {
    padding: 4,
    fontSize: 25,
  },
  textInput2: {
    top: 0,
    left: 32,
    position: 'absolute',

    color: 'white',
    height: '100%',
    width: '80%',
    backgroundColor: 'rgba(2,2,2,1)',
    borderRadius: 10,
    marginLeft: '5%',
  },
  rect2Stack: {
    width: width,
    height: 37,
    marginTop: 30,
    marginLeft: 50,
  },
  rect3: {
    top: 0,
    left: 0,
    width: width - 100,
    height: 37,
    position: 'absolute',
    backgroundColor: 'rgba(7,7,7,1)',
    borderRadius: 7,
  },
  image5: {
    width: 25,
    height: 22,
    marginTop: 7,
    marginLeft: 4,
  },
  textInput3: {
    top: 0,
    left: 32,
    position: 'absolute',

    color: 'white',
    height: '100%',
    width: '80%',
    backgroundColor: 'rgba(2,2,2,1)',
    borderRadius: 10,
    marginLeft: '5%',
  },
  rect3Stack: {
    width: width,
    height: 37,
    marginTop: 30,
    marginLeft: 50,
  },
  materialButtonPrimary: {
    height: 31,
    width: width - 200,
    borderRadius: 10,
    marginTop: 28,
    marginLeft: 100,
    justifyContent: 'center',
  },
  image6: {
    width: '30%',
    height: '10%',
    position: 'absolute',
    bottom: '0%',
    right: '5%',
  },
  iconStyle: {
    borderWidth: 1,
    borderColor: '#fff',
    width: 20,
  },

  countryStyle: {
    flex: 1,
    alignContent: 'flex-start',
    color: '#000000',
    shadowRadius: 5,
    flexDirection: 'row',
  },
  countryTextStyle1: {
    fontSize: 30,
    fontWeight: 'normal',
    color: '#000000',
    width: '15%',
    textAlign: 'center',
  },
  countryTextStyle2: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    width: '65%',
  },
  countryTextStyle3: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    width: '20%',
    textAlign: 'center',
  },
  closeButtonStyle: {
    margin: 10,
    color: '#5a52a5',
  },
  textStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    width: '100%',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 180,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  textInputPop: {
    width: '80%',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 8,
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  input: {
    color: '#000000',
    height: 50,
    width: '14%',
    padding: 5,
    margin: 3,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#b0b2b3',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
