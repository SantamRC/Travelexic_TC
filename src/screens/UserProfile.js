import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import MaterialButton from './components/MaterialButtonDanger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {putUserProfile} from '../services/ConstantURLS';
import {
  STORAGE_KEY_userProfiling_key,
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
} from '../services/ConstantStorageKey';

const {width, height} = Dimensions.get('window');
export default class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      authKey: '',
      userid: '',
      isMale: true,
      imagePath: '',
      mobile_no: '',
      full_name: '',
      email_id: '',
      dob: '',
      select1: false,
      select2: false,
      select3: false,
      select4: false,
      select5: false,
      select6: false,
      select7: false,
      select8: false,
      select9: false,
      select10: false,
      select11: false,
      select12: false,
      select13: false,
      selectedProfile: [],
    };
  }

  async componentDidMount() {
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});

    const userProfileData = await AsyncStorage.getItem(
      STORAGE_KEY_userProfiling_key,
    );
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

  selectProfileData(id) {
    let selectedProfileArray = [];
    selectedProfileArray = this.state.selectedProfile;
    var index = selectedProfileArray.indexOf(id);
    if (id == '196') {
      if (this.state.select1) {
        this.setState({select1: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select1: true});
        selectedProfileArray.push('196');
      }
    } else if (id == '197') {
      if (this.state.select2) {
        this.setState({select2: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select2: true});
        selectedProfileArray.push('197');
      }
    } else if (id == '201') {
      if (this.state.select3) {
        this.setState({select3: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select3: true});
        selectedProfileArray.push('201');
      }
    } else if (id == '198') {
      if (this.state.select4) {
        this.setState({select4: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select4: true});
        selectedProfileArray.push('198');
      }
    } else if (id == '194') {
      if (this.state.select5) {
        this.setState({select5: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select5: true});
        selectedProfileArray.push('194');
      }
    } else if (id == '204') {
      if (this.state.select6) {
        this.setState({select6: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select6: true});
        selectedProfileArray.push('204');
      }
    } else if (id == '195') {
      if (this.state.select7) {
        this.setState({select7: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select7: true});
        selectedProfileArray.push('195');
      }
    } else if (id == '205') {
      if (this.state.select8) {
        this.setState({select8: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select8: true});
        selectedProfileArray.push('205');
      }
    } else if (id == '199') {
      if (this.state.select9) {
        this.setState({select9: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select9: true});
        selectedProfileArray.push('199');
      }
    } else if (id == '202') {
      if (this.state.select10) {
        this.setState({select10: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select10: true});
        selectedProfileArray.push('202');
      }
    } else if (id == '200') {
      if (this.state.select11) {
        this.setState({select11: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select11: true});
        selectedProfileArray.push('200');
      }
    } else if (id == '203') {
      if (this.state.select12) {
        this.setState({select12: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select12: true});
        selectedProfileArray.push('203');
      }
    } else if (id == '206') {
      if (this.state.select13) {
        this.setState({select13: false});
        if (index !== -1) {
          selectedProfileArray.splice(index, 1);
        }
      } else {
        this.setState({select13: true});
        selectedProfileArray.push('206');
      }
    }
    this.setState({selectedProfile: selectedProfileArray});
  }

  async putProfileDataOnServer() {
    let formData = new FormData();
    formData.append('traveller_id', this.state.userid);
    formData.append('user_profile', this.state.selectedProfile);
    formData.append('token_id', '');
    formData.append('nonce', this.state.authKey);

    fetch(putUserProfile, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'success') {
          alert('Thanks! you profile successfully saved...');
        } else {
          alert('Sorry! no data saved...');
        }
      })
      .catch(error => {});
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
        <View style={styles.rect}>
          <View style={styles.rect2}>
            <Image
              source={require('../assets/images/welcome_avtar.png')}
              resizeMode="cover"
              style={styles.button}></Image>
            {/* <Entypo name="camera" style={styles.icon}></Entypo> */}

            <View style={styles.name_box}>
              <Text style={styles.name}>{this.state.full_name}</Text>
            </View>
            <View style={styles.name_box}>
              <Text style={styles.name}>{this.state.email_id}</Text>
            </View>
            <View style={styles.name_box}>
              <Text style={styles.name}>{this.state.mobile_no}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: '5%',
            }}>
            <TouchableOpacity
              style={{
                fontSize: 18,
                marginEnd: 5,
                borderTopRightRadius: 0,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 10,
                backgroundColor: '#4A4A4A',
                padding: 5,
              }}>
              <Text style={{color: '#fff'}}>My Interest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                fontSize: 18,
                marginStart: 5,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 0,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 0,
                backgroundColor: '#fff',
                padding: 5,
              }}
              onPress={() => this.props.navigation.navigate('UserEditProfile')}>
              <Text>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              showsVerticalScrollIndicator={false}>
              <View style={styles.rect4}>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('196')}>
                  <Image
                    source={require('../assets/images/pretwelve_wellness.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('197')}>
                  <Image
                    source={require('../assets/images/prethirteen_photo_fanatics.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('201')}>
                  <Image
                    source={require('../assets/images/preten_solo_traveler.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('198')}>
                  <Image
                    source={require('../assets/images/preeight_nightlife_lovers.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.rect4}>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('194')}>
                  <Image
                    source={require('../assets/images/prefifth_economy_traveler.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('204')}>
                  <Image
                    source={require('../assets/images/preeleven_spiritual_seekers.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('195')}>
                  <Image
                    source={require('../assets/images/pretwo_family_traveler.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('205')}>
                  <Image
                    source={require('../assets/images/prethree_foodies.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.rect4}>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('199')}>
                  <Image
                    source={require('../assets/images/preseven_nature_lovers.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('202')}>
                  <Image
                    source={require('../assets/images/prezero_adventure.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('200')}>
                  <Image
                    source={require('../assets/images/presix_local_culture.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('203')}>
                  <Image
                    source={require('../assets/images/prefourt_history_buffs.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.rect4}>
                <TouchableOpacity
                  style={styles.rect4_1}
                  onPress={() => this.selectProfileData('206')}>
                  <Image
                    source={require('../assets/images/preone_art_design.png')}
                    resizeMode="contain"
                    style={styles.image_1}></Image>
                </TouchableOpacity>
              </View>

              <MaterialButton
                style={styles.materialButtonGrey}></MaterialButton>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rect: {
    width: width,
    height: height,
    backgroundColor: '#E6E6E6',
  },
  rect2: {
    width: width,
    height: '35%',
    shadowColor: '#fff',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 1,
    shadowRadius: 10,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 200,
    borderBottomLeftRadius: 200,
    backgroundColor: '#4A4A4A',
  },
  button: {
    width: '25%',
    height: 120,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 40,
    left: '35%',
    top: '5%',
  },
  icon: {
    color: '#fff',
    fontSize: 30,
    width: '40%',
    height: 40,
    paddingRight: 5,
    position: 'absolute',
    bottom: '40%',
    right: '30%',
    textAlign: 'right',
  },
  name_box: {
    top: '5%',
    width: '80%',
    left: '10%',
    height: 'auto',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  scrollArea: {
    width: width,
    height: 'auto',
    top: '5%',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 500,
  },
  rect4: {
    width: '95%',
    height: 'auto',
    borderColor: '#000000',
    marginTop: '5%',
    marginLeft: '2.5%',
    flexDirection: 'row',
  },
  rect4_1: {
    width: '20%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  image_1: {
    height: 75,
    width: 75,
  },
  materialButtonGrey: {
    height: 40,
    width: '50%',
    top: '5%',
    left: '25%',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});
