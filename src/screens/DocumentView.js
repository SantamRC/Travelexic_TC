import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import renderIf from '../utility/renderif';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import FileViewer from 'react-native-file-viewer';

import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import {
  STORAGE_KEY_DOCS,
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {saveData} from '../services/CommonStorage';
import {upload_document} from '../services/ConstantURLS';
import {FlatList} from 'react-native-gesture-handler';
import {document_fetch} from '../services/ConstantURLS';

var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

function downloadFile(url) {
  let filename = url.split('/');
  filename = filename[filename.length - 1];
  let fileUri = FileSystem.documentDirectory + filename;
  FileSystem.downloadAsync(url, fileUri)
    .then(({uri}) => {
      saveFile(uri);
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
    const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
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

export default class DocumentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authKey: '',
      userid: '',
      orderid: '',
      background_image: '',
    };

    if (this.props.route != null) {
      const typeDocs = this.props.route.params.typeDocs;
      this.state = {docsArr: [], type: typeDocs, isShow: true};
    }
  }

  async componentDidMount() {
    const docsDateJSON = await AsyncStorage.getItem(STORAGE_KEY_DOCS);
    const docsData = docsDateJSON != null ? JSON.parse(docsDateJSON) : null;
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({userid: userid});
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    this.setState({authKey: auth_key});
    const orderId = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({orderid: orderId});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    this.getdocsByTypes(docsData);
  }

  getdocsByTypes(docsData) {
    if (this.state.type == 2) {
      this.setState({docsArr: docsData.documents.svoucher});
    } else if (this.state.type == 3) {
      this.setState({docsArr: docsData.documents.visa});
    } else if (this.state.type == 4) {
      this.setState({docsArr: docsData.documents.passport});
    } else if (this.state.type == 5) {
      this.setState({docsArr: docsData.documents.insurance});
    } else if (this.state.type == 6) {
      this.setState({docsArr: docsData.documents.others});
    } else if (this.state.type == 7) {
      this.setState({docsArr: docsData.documents.meta_photo_id});
    }
  }

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
        this.getdocsByTypes(responseText);
      })
      .catch(error => {
        console.log('error: ', ' / ' + error);
      });
  }

  renderItemComponent = data => {
    return (
      <View style={[styles.docs_container]}>
        <Image
          source={require('../assets/images/document_icon.png')}
          resizeMode="contain"
          style={styles.image1}></Image>
        <View style={styles.docs_container_text_div}>
          <Text style={styles.docs_container_text}>
            {data.item.url.replace(/^.*[\\\/]/, '')}
          </Text>
        </View>
        <View style={styles.button_div}>
          <TouchableOpacity onPress={() => downloadFile(data.item.url)}>
            <Image
              source={require('../assets/images/open_button.png')}
              resizeMode="contain"
              style={styles.image2}></Image>
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

  async loadDocsFromGallery() {
    if (this.state.type == 4) {
      this.props.navigation.navigate('PassportCopy');
    } else if (this.state.type == 7) {
      this.props.navigation.navigate('PhotoIdUploadScreen');
    } else {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type == 'success') {
        this.uploadDocsToServer(result.uri);
      }
    }
  }

  async uploadDocsToServer(uri) {
    let formData = new FormData();
    formData.append('traveller_id', this.state.userid);
    formData.append('booking_id', this.state.orderid);
    formData.append('nonce', this.state.authKey);

    if (this.state.type == 2) {
      formData.append('type', 'svoucher');
    } else if (this.state.type == 3) {
      formData.append('type', 'visa');
    } else if (this.state.type == 5) {
      formData.append('type', 'insurance');
    } else if (this.state.type == 6) {
      formData.append('type', 'others');
    }

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
        if (responseText.status == 'success') {
          alert(
            'Your Documents have been shared with the agent. Please hit refresh to view in the document folder',
          );
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
            {renderIf(this.state.isShow)(
              <FlatList
                style={{height: height - 170}}
                data={this.state.docsArr}
                renderItem={item => this.renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={this.handleRefresh}
              />,
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginStart: 100,
              }}>
              <TouchableOpacity onPress={() => this.loadDocsFromGallery()}>
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
  image: {
    width: '40%',
    height: 60,
    alignSelf: 'center',
    margin: 30,
  },
  docs_container: {
    marginTop: '5%',
    width: '95%',
    height: 100,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginLeft: '2.5%',
  },
  image1: {
    width: '10%',
    height: 60,
    marginLeft: '5%',
  },
  docs_container_text_div: {
    width: '55%',
    marginLeft: '5%',
    height: 'auto',
  },
  docs_container_text: {
    paddingTop: '5%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button_div: {
    width: '23%',
    height: 'auto',
  },
  image2: {
    width: '100%',
    height: 50,
  },
});
