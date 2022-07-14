import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import FileViewer from 'react-native-file-viewer';
import {saveData} from '../services/CommonStorage';
import {document_fetch} from '../services/ConstantURLS';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_DOCS,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {Alert} from 'react-native';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

const _handlePressButtonAsync = async url => {
  await WebBrowser.openBrowserAsync(url);
};

function downloadFile(url, type) {
  let filename = url.split('/');
  filename = filename[filename.length - 1];
  let fileUri = FileSystem.documentDirectory + filename;
  FileSystem.downloadAsync(url, fileUri)
    .then(({uri}) => {
      if (type == 1) {
        openShareDialogAsync(uri);
      } else {
        saveFile(uri);
      }
    })
    .catch(error => {
      Alert.alert('Error', "Couldn't download file");
    });
}

async function saveFile(fileUri) {
  try {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
      } catch (err) {
        console.log('err: ', ' / ' + err);
      }
      const readGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const writeGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!readGranted && !writeGranted) {
        return;
      }
    }

    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    Promise.resolve();
    if (status === 'granted') {
      FileSystem.getContentUriAsync(fileUri).then(cUri => {
        FileViewer.open(cUri);
      });
    }
  } catch (error) {
    Promise.reject(error);
  }
}

let openShareDialogAsync = async cUri => {
  if (!(await Sharing.isAvailableAsync())) {
    alert(`Uh oh, sharing isn't available on your platform`);
    return;
  }

  await Sharing.shareAsync(cUri);
};

export default class FlightDetails extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      refreshing: true,
      authKey: null,
      userid: 0,
      orderid: 0,
    };
  }

  async componentDidMount() {
    this.setState({refreshing: true});
    await AsyncStorage.getItem(STORAGE_KEY_DOCS).then(value => {
      const docsData = value != null ? JSON.parse(value) : null;
      this.setState({data: docsData.documents.flight, refreshing: false});
    });
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});
    const orderidS = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({orderid: orderidS});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
  }

  flightStatusScreen = data => {
    this.props.navigation.navigate('FlightStatus', {
      flight_status: data,
    });
  };

  async getDocsData() {
    fetch(document_fetch, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
      }),
      body:
        'booking_id=' +
        this.state.orderid +
        '&traveller_id=' +
        this.state.userid +
        '&nonce=' +
        this.state.authKey, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        console.log('responseText: ', ' / ' + JSON.stringify(responseText));
        saveData(responseText, STORAGE_KEY_DOCS);
        this.setState({
          data: responseText.documents.flight,
          refreshing: false,
        });
      })
      .catch(error => {});
  }
  renderItemComponent = data => {
    return (
      <View
        style={{
          width: '95%',
          height: 165,
          backgroundColor: '#ffffff',
          margin: 15,
          borderRadius: 5,
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#000000',
              marginEnd: 5,
              marginStart: 10,
              marginTop: 5,
              fontSize: 20,
            }}>
            {data.item.flt_no}
          </Text>
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              alignSelf: 'flex-end',
              marginEnd: 5,
              marginTop: 5,
            }}
            onPress={() => downloadFile(data.item.url, 1)}>
            <Image
              source={require('../assets/images/share.png')}
              resizeMode="contain"
              style={{
                width: 50,
                height: 30,
                alignSelf: 'flex-end',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
          }}>
          <View
            style={{
              padding: 5,
              borderColor: 'gray',
              borderRadius: 3,
              borderWidth: 1,
            }}>
            <Text style={{color: 'gray', fontSize: 16}}>Sector</Text>
            <Text numberOfLines={1} style={{color: 'black', fontSize: 16}}>
              {data.item.flt_dep}-{data.item.flt_arrcity}
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              borderRadius: 5,
              borderColor: 'gray',
              borderColor: 'gray',
              borderRadius: 3,
              borderWidth: 1,
            }}>
            <Text style={{color: 'gray', fontSize: 16}}>Date of Journey</Text>
            <Text numberOfLines={1} style={{color: 'black', fontSize: 16}}>
              {data.item.flt_date}
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              borderRadius: 5,
              borderColor: 'gray',
              borderColor: 'gray',
              borderRadius: 3,
              borderWidth: 1,
            }}>
            <Text style={{color: 'gray', fontSize: 16}}>Time</Text>
            <Text numberOfLines={1} style={{color: 'black', fontSize: 16}}>
              {data.item.dep_time}-{data.item.arr_time}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{margin: 5}}
            onPress={() => this.flightStatusScreen(data.item)}>
            <Image
              source={require('../assets/images/checkstatus_up.png')}
              resizeMode="contain"
              style={{
                width: 100,
                height: 50,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{margin: 5}}
            onPress={() => _handlePressButtonAsync(data.item.web_checkin)}>
            <Image
              source={require('../assets/images/webcheckin.png')}
              resizeMode="contain"
              style={{
                width: 100,
                height: 50,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{margin: 5}}
            onPress={() => downloadFile(data.item.url, 0)}>
            <Image
              source={require('../assets/images/download_up.png')}
              resizeMode="contain"
              style={{
                width: 100,
                height: 50,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
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
          <View>
            <FlatList
              style={{height: height - 170}}
              data={this.state.data}
              renderItem={item => this.renderItemComponent(item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.ItemSeparator}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginStart: 100,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('FlightTicket')}>
                <Image
                  source={require('../assets/images/upload.png')}
                  resizeMode="contain"
                  style={{
                    width: 150,
                    height: 60,
                    alignSelf: 'center',
                    margin: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.getDocsData()}>
                <Image
                  source={require('../assets/images/refresh.png')}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'flex-end',
                    margin: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image_imageStyle: {},
});
