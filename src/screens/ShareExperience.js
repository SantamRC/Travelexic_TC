import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');
import {STORAGE_KEY_BACKGROUND_IMAGE} from '../services/ConstantStorageKey';
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Share from 'react-native-share';

export default class ShareExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background_image: null,
      type: Camera.Constants.Type.back,
      selectPicture: null,
      base64Data: null,
    };
  }

  async componentDidMount() {
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    const {status} = await Camera.requestPermissionsAsync();
    if (!status === 'granted') {
      alert('No access to camera, please enabled camera permission');
    }
  }

  shareonfb() {
    // console.log(
    //   'FileTYPE: ',
    //   ' / ' + this.getExtention(this.state.selectPicture),
    // );
    if (this.state.selectPicture !== null && this.state.base64Data !== null) {
      const shareOptions = {
        title: 'Share via',
        message:
          'Picture shared from Travelexic #Travelexic #Travel #worldtravel',
        social: Share.Social.FACEBOOK,
        url: `data:image/${this.getExtention(
          this.state.selectPicture,
        )};base64,${this.state.base64Data}`,
      };

      Share.shareSingle(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } else {
      alert('Please select picture to share');
    }
  }

  cameraflip() {
    if (this.state.type === Camera.Constants.Type.back) {
      this.setState({
        type: Camera.Constants.Type.front,
      });
    } else {
      this.setState({
        type: Camera.Constants.Type.back,
      });
    }
  }

  getExtention = filename => {
    var result = /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    if (result == 'jpg') {
      result = 'jpeg';
    }
    return result;
  };

  cameraClick = async () => {
    if (this.camera) {
      const options = {
        quality: 0.7,
        base64: true,
        aspect: [4, 3],
        width: 720,
        height: 1280,
      };
      let photo = await this.camera.takePictureAsync(options);
      // console.log('photo: ', ' / ' + JSON.stringify(photo));
      this.setState({
        selectPicture: photo.uri,
        base64Data: photo.base64,
      });
    }
  };

  cameraImagePickerAsync = async () => {
    if (this.state.selectPicture === null) {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
      const options = {
        quality: 0.7,
        base64: true,
        aspect: [4, 3],
        width: 720,
        height: 1280,
      };
      let pickerResult = await ImagePicker.launchImageLibraryAsync(options);
      // console.log('photo: ', ' / ' + JSON.stringify(pickerResult));
      this.setState({
        selectPicture: pickerResult.uri,
        base64Data: pickerResult.base64,
      });
    } else {
      alert('please cancel the last picture');
    }
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <View style={{width: width, height: height}}>
          <ImageBackground
            source={
              this.state.background_image
                ? {uri: this.state.background_image}
                : require('../assets/images/bg_home1.png')
            }
            resizeMode="cover"
            style={global_style.bg_image}
            imageStyle={styles.image1_imageStyle}>
            <View
              style={{
                margin: 10,
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View>
                {this.state.selectPicture !== null && (
                  <View
                    style={{
                      width: 390,
                      height: height - 220,
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        alignSelf: 'flex-end',
                        marginTop: 5,
                        marginBottom: -15,
                        marginEnd: 15,
                      }}
                      onPress={() => {
                        this.setState({selectPicture: null});
                      }}>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          resizeMode: 'cover',
                        }}
                        source={require('../assets/images/close.png')}
                      />
                    </TouchableOpacity>
                    <Image
                      source={
                        this.state.selectPicture
                          ? {uri: this.state.selectPicture}
                          : require('../assets/images/gallery.png')
                      }
                      resizeMode="cover"
                      style={{
                        width: 390,
                        height: height - 280,
                        padding: 5,
                        alignSelf: 'center',
                        marginTop: 10,
                      }}
                    />
                  </View>
                )}
                {this.state.selectPicture === null && (
                  <Camera
                    ref={ref => {
                      this.camera = ref;
                    }}
                    style={{
                      width: 390,
                      height: height - 280,
                      margin: 30,
                      alignSelf: 'center',
                    }}
                    type={this.state.type}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.shareonfb();
                }}>
                <Image
                  source={require('../assets/images/fb_share.png')}
                  resizeMode="cover"
                  style={{
                    width: 140,
                    height: 35,
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  height: 130,
                  width: 390,
                  margin: 10,
                  borderTopEndRadius: 10,
                  borderTopStartRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.cameraImagePickerAsync();
                  }}>
                  <Image
                    source={require('../assets/images/gallery.png')}
                    resizeMode="cover"
                    style={{
                      width: 60,
                      height: 60,
                      marginEnd: 10,
                      marginTop: 10,
                      marginStart: 20,
                      marginBottom: 10,
                      padding: 5,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.cameraClick();
                  }}>
                  <Image
                    source={require('../assets/images/camera_down.png')}
                    resizeMode="cover"
                    style={{width: 60, height: 60, margin: 10, padding: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.cameraflip();
                  }}>
                  <Image
                    source={require('../assets/images/camerarotate.png')}
                    resizeMode="cover"
                    style={{
                      width: 60,
                      height: 60,
                      marginEnd: 20,
                      marginTop: 10,
                      marginStart: 10,
                      marginBottom: 10,
                      padding: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image1_imageStyle: {},
});
