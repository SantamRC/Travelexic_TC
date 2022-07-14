import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  FlatList,
  Modal,
  TextInput,
  Button,
  AppRegistry,
  BackHandler,
} from 'react-native';
import GLOBAL from '../utility/Global';
import renderIf from '../utility/renderif';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {differenceBetweenTwoDates} from '../utility/Common';
import {saveData, saveDataString} from '../services/CommonStorage';
import LinkPreview from 'react-native-link-preview';
import WebView from 'react-native-webview';
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_auth_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BOOKING_key,
  STORAGE_KEY_CITY_TYPE,
  STORAGE_KEY_GROUP_STATUS,
  STORAGE_KEY_FULL_NAME,
  STORAGE_KEY_NO_ADULTS,
  STORAGE_KEY_NO_CHILDREN,
  STORAGE_KEY_TOTAL_ROOM,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_AGENT_LOGO,
  STORAGE_KEY_FCM_TOKEN,
  STORAGE_KEY_ACTIVE_DATA_KEY,
  STORAGE_KEY_CITY_ID,
  STORAGE_KEY_ACTIVE_NOTI_KEY,
  STORAGE_KEY_AUTH_TOKEN_KEY,
} from '../services/ConstantStorageKey';
import {
  bookinglistByUserIDURL,
  change_itinerary,
  userFcmTokenUpdateURL,
  save_poll_response,
  nonceForUserDetails,
} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import Global from '../utility/Global';
import messaging from '@react-native-firebase/messaging';

var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }
  return <Home />;
}
// const headlessTask = () => {
//   return Promise.resolve();
// };
AppRegistry.registerComponent('Home', () => HeadlessCheck);
// AppRegistry.registerHeadlessTask(
//   'ReactNativeFirebaseMessagingHeadlessTask',
//   () => headlessTask,
// );

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationView: false,
      authKey: '',
      userid: '',
      tour_name: '',
      pickup_location: '',
      tour_date: '',
      differenceDate: 0,
      currentPlaceTimeZoneDate: '',
      currentTimeShow: '',
      currentPlaceName: '',
      isLoading: true,
      agentLogourl: '',
      nominationText: '',
      clickHereText: '',
      webLink: '',
      nominationTab: false,
      nominationShow: false,
      isModalVisible: false,
      booking_id: '',
      pickup_location2: '',
      isModalVisibleItinerary: false,
      background_image: '',
      footer_color_new: '',
      exhibitor_button: 'Tour & Speaker',
      isModalVisiblePolling: false,
      fcmToken: '',
      question: '',
      tagLine: '*You can choose single response',
      options: [],
      poll_id: '',
      book_id: '',
      data_id: 0,
      isNotificationRefresh: false,
      remoteMessage: '',
      url: '',
      // isNoti: false,
    };

    Global.footer_color = this;
    GLOBAL.footer_color = '#000000';
  }

  checkVideoAndImage(noti_data) {
    LinkPreview.getPreview(noti_data).then(data => {
      console.debug(data);
      this.setState({url: data.url});
    });
  }

  onAppBootstrap = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      // Register the device with FCM
      if (Platform.OS == 'android')
        await messaging().registerDeviceForRemoteMessages();
      // Get the token
      const token = await messaging().getToken();
      //alert('Token: ' + token);
      console.log('Token: ' + token);
      if (this.state.fcmToken != null || this.state.fcmToken != token) {
        saveDataString('' + token, STORAGE_KEY_FCM_TOKEN);
        this.updateFCMToken(token);
      }
    }
  };

  registredFCMListener() {
    messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage != null) {
        console.log('Background FCM message arrived!', remoteMessage);
        // saveData(true, STORAGE_KEY_ACTIVE_NOTI_KEY);
        this.setState({
          // isNoti: true,
          isNotificationRefresh: true,
          remoteMessage: remoteMessage,
        });
        this.refreshApiData();
      }
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage != null) {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        this.setState({
          isNotificationRefresh: true,
          remoteMessage: remoteMessage,
        });
        this.refreshApiData();
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage != null) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          this.refreshApiData();
        }
      });
  }

  openPolling(data) {
    console.log('POllING: ', ' / ' + JSON.stringify(data));
    if (data.key == '21') {
      this.togglePollingModalVisibility();
      let pollData = [];
      let newString = data.poll_data;
      let newString2 = newString.replace('\\', '');
      pollData = JSON.parse(newString2);
      this.setState({
        question: pollData[0].poll_question,
        tagLine: '*You can choose single response',
      });

      this.setState({
        poll_id: pollData[0].poll_id,
        book_id: pollData[0].booking_id,
      });
      let optionsArray = [];
      let opt = pollData[0].options;
      for (let index = 0; index < opt.length; index++) {
        optionsArray.push({
          option: opt[index].option,
          ans: opt[index].ans,
          key: index,
          type: pollData[0].question_type,
        });
      }
      this.setState({options: optionsArray});
    }
  }

  renderItemPolling(data) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setOptionsData(data.item);
        }}>
        <View
          style={{
            width: '100%',
            height: 'auto',
            alignContent: 'center',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            margin: 5,
            backgroundColor: '#FFFFFF',
            padding: 5,
          }}>
          <Image
            source={
              data.item.ans == 'true'
                ? require('../assets/images/radio_checked.png')
                : require('../assets/images/radio_unchecked.png')
            }
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              alignItems: 'center',
              alignContent: 'center',
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginStart: 5,
              fontFamily: 'opensens_normal',
            }}>
            {data.item.option}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  async setOptionsData(item) {
    var value;
    if (item.ans == 'true') {
      value = 'false';
    } else {
      value = 'true';
    }
    let options = [...this.state.options];
    if (item.type == 'opt_in') {
      var optionArray = [];
      optionArray = this.state.options;
      for (let index = 0; index < optionArray.length; index++) {
        options[index] = {...options[index], ans: 'false'};
      }
    }
    options[item.key] = {...options[item.key], ans: value};
    this.setState({options});
  }

  savePolled() {
    this.togglePollingModalVisibility();
    this.savePollingData();
  }

  async savePollingData() {
    fetch(
      save_poll_response +
        '?poll_id=' +
        this.state.poll_id +
        '&book_id=' +
        this.state.book_id +
        '&nonce=' +
        nonceForUserDetails +
        '&res=' +
        JSON.stringify(this.state.options),
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json', // <-- Specifying the Content-Type
        }),
      },
    )
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'success') {
          alert('Successfuly saved your response...');
        }
      })
      .catch(error => {});
  }

  _handleNotificationResponse = response => {
    var key = response.data.key;
    var title = response.data.title;

    if (key == '1') {
      //Home
    } else if (key == '2') {
      //ReviewDayWiseActivity
    } else if (key == '3') {
      //ReviewDayWiseActivity
    } else if (key == '4') {
    } else if (key == '5') {
      //HotelListFragment
      this.props.navigation.navigate('HotelInfo');
    } else if (key == '6') {
      //ItineraryFragment
      this.props.navigation.navigate('DayPlan');
    } else if (key == '7') {
      //HomeActivity
    } else if (
      key == '0' ||
      key == '8' ||
      key == '9' ||
      key == '10' ||
      key == '11' ||
      key == '12'
    ) {
      //DocumentsFragment
      this.props.navigation.navigate('Documents');
    } else if (key == '13') {
      //HomeActivity
    } else if (key == '14') {
      if (title == 'Day wise Agenda') {
        this.props.navigation.navigate('DayPlan');
      } else if (title == 'Dos and Donts') {
        this.props.navigation.navigate('DoDonts');
      } else if (title == 'Weather Forecast') {
        this.props.navigation.navigate('Weather');
      } else if (title == 'Flight Tickets') {
        this.props.navigation.navigate('FlightTicket');
      } else if (title == 'Eat') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (title == 'Buy') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (title == 'See') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (title == 'About') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (title == 'Information') {
        this.props.navigation.navigate('Notification');
      } else if (title == 'Currency converter') {
        this.props.navigation.navigate('CurrencyConverter');
      } else if (title == 'Feedback') {
        this.props.navigation.navigate('ReviewRating');
      } else if (title == 'Share Experience') {
        this.props.navigation.navigate('ShareExperience');
      } else if (title == 'Important Contact') {
        this.props.navigation.navigate('ImportantContact');
      } else if (title == 'Other document') {
        this.props.navigation.navigate('Documents');
      } else if (title == 'Video') {
        console.log('video notification: ', ' / ' + response.data.body);
        this.checkVideoAndImage(response.data.body);
      }
    } else if (key == '19') {
    } else if (key == '20') {
      this.props.navigation.navigate('Notification');
    } else if (key == '21') {
      if (!this.state.isModalVisiblePolling) {
        this.props.navigation.navigate('Home');
        this.openPolling(response.data);
      }
    } else if (key == '22') {
      this.props.navigation.navigate('ReviewRating');
    } else if (key == '23') {
      this.props.navigation.navigate('TourSpeaker');
    } else if (key == '24') {
      this.props.navigation.navigate('ImportantContact');
    }
  };

  handleBackPress = () => {
    if (this.props.route.name == 'Home') {
      return false;
    } else {
      return true;
    }
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // this.willFocusSubscription();
  }
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   () => {},
    // );
    // var isNoti = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_NOTI_KEY);
    // console.log('isNoti: ', ' / ' + isNoti);
    // if (isNoti == null || isNoti == 'false') {
    //   isNoti = false;
    // }

    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    const userid = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id === null) {
      index_id = 0;
    }

    this.setState({
      userid: userid,
      data_id: index_id,
      authKey: auth_key,
      // isNoti: isNoti,
    });
    const mainData = await AsyncStorage.getItem(STORAGE_KEY_MAIN_ITINERARY);
    const mainItineraryData = mainData != null ? JSON.parse(mainData) : null;

    if (this.state.isLoading) {
      if (mainItineraryData != '' && mainItineraryData != null) {
        if (mainItineraryData.status == 'successful') {
          this.setMainItineraryData(mainItineraryData);
        } else {
          await this.getItineraryData();
        }
      } else {
        await this.getItineraryData();
      }
    }
    this.onAppBootstrap();
    this.registredFCMListener();
  }

  async updateFCMToken(token) {
    let formDate = new FormData();
    formDate.append('user_id', this.state.userid);
    formDate.append('auth', this.state.authKey);
    formDate.append('token_id', token);

    this.setState({isLoading: false});
    fetch(userFcmTokenUpdateURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        this.setState({isLoading: true});
      })
      .catch(error => {});
  }

  async refreshApiData() {
    await this.getItineraryData();
  }

  async getItineraryData() {
    console.log(
      'URL: ',
      ' / ' +
        bookinglistByUserIDURL +
        '?traveller_id=' +
        this.state.userid +
        '&Auth=' +
        this.state.authKey,
    );
    this.setState({isLoading: false});
    fetch(
      bookinglistByUserIDURL +
        '?traveller_id=' +
        this.state.userid +
        '&Auth=' +
        this.state.authKey,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json', // <-- Specifying the Content-Type
        }),
      },
    )
      .then(response => response.json())
      .then(responseText => {
        this.setState({isLoading: true});
        if (responseText.status == 'successful') {
          saveData(responseText, STORAGE_KEY_MAIN_ITINERARY);
          saveDataString('' + 0, STORAGE_KEY_ACTIVE_DATA_KEY);
          this.setState({data_id: 0});
          this.setMainItineraryData(responseText);
        } else {
          this.setState({isModalVisibleItinerary: true});
          saveData('', STORAGE_KEY_MAIN_ITINERARY);
          saveDataString('' + 0, STORAGE_KEY_ACTIVE_DATA_KEY);
        }
      })
      .catch(error => {});
  }

  setMainItineraryData = responseText => {
    const id_index = parseInt(this.state.data_id);
    if (responseText.data[id_index].nomination.title != '') {
      this.setState({
        nominationShow: true,
        nominationText: responseText.data[id_index].nomination.title,
        clickHereText: responseText.data[id_index].nomination.button_text,
        webLink: responseText.data[id_index].nomination.link,
      });
    }

    this.setState({
      tour_name: responseText.data[id_index].tour_name,
      pickup_location: responseText.data[id_index].pickup_location,
      tour_date: responseText.data[id_index].tour_date,
      agentLogourl: responseText.data[id_index].AgentLogourl,
      background_image: responseText.data[id_index].app_backgroung,
    });
    if (responseText.data[id_index].hasOwnProperty('auth_token')) {
      saveDataString(
        '' + responseText.data[id_index].auth_token,
        STORAGE_KEY_AUTH_TOKEN_KEY,
      );
    }
    saveDataString(
      '' + responseText.data[id_index].app_backgroung,
      STORAGE_KEY_BACKGROUND_IMAGE,
    );
    saveDataString(
      '' + responseText.data[id_index].AgentLogourl,
      STORAGE_KEY_AGENT_LOGO,
    );

    if (responseText.data[id_index].exhibitor_button != '') {
      this.setState({
        exhibitor_button: responseText.data[id_index].exhibitor_button,
      });
    }

    GLOBAL.footer_color = responseText.data[id_index].app_color;

    saveDataString(
      '' + responseText.data[id_index].total_room,
      STORAGE_KEY_TOTAL_ROOM,
    );
    saveDataString(
      '' + responseText.data[id_index].full_name,
      STORAGE_KEY_FULL_NAME,
    );
    saveDataString(
      '' + responseText.data[id_index].no_of_children,
      STORAGE_KEY_NO_CHILDREN,
    );
    saveDataString(
      '' + responseText.data[id_index].no_of_adults,
      STORAGE_KEY_NO_ADULTS,
    );
    saveDataString(
      '' + responseText.data[id_index].order_id,
      STORAGE_KEY_ORDERID_key,
    );
    saveDataString(
      '' + responseText.data[id_index].booking_id,
      STORAGE_KEY_BOOKING_key,
    );
    saveDataString(
      '' + responseText.data[id_index].group_status,
      STORAGE_KEY_GROUP_STATUS,
    );

    if (this.state.tour_date != '') {
      var differnce = differenceBetweenTwoDates(this.state.tour_date);
      this.setState({differenceDate: differnce});
    }

    if (responseText.data[id_index].resREGFinal.length > 0) {
      saveDataString(
        '' + responseText.data[id_index].resREGFinal[0].locationID,
        STORAGE_KEY_CITY_ID,
      );
    }

    //check current date > from currentPlaceDate
    const visitParseData = responseText.data[id_index].resREGFinal;
    if (visitParseData.length > 0) {
      var isHave = true;
      var currentDateNew = moment(new Date()).format('YYYY-MM-DD HH:mm');

      var placeDays,
        newDate,
        lastDate = '',
        currentDateNewFomat;
      currentDateNewFomat = new Date();

      var currentTime = moment(currentDateNewFomat).format('HH:mm');

      var showTime;
      for (let index = 0; index < visitParseData.length; index++) {
        showTime = '';
        if (isHave) {
          placeDays = visitParseData[index].location_days;
          if (lastDate != '') {
            newDate = moment(lastDate)
              .add(placeDays, 'day')
              .format('YYYY-MM-DD');
            newDate = new Date(newDate);
            if (
              currentDateNewFomat.getTime() == newDate.getTime() ||
              currentDateNewFomat.getTime() < newDate.getTime()
            ) {
              showTime = moment(currentDateNewFomat)
                .tz(visitParseData[index].timezone)
                .format('HH:mm');
              isHave = false;
            }
          } else {
            lastDate = moment(currentDateNew)
              .add(placeDays, 'day')
              .format('YYYY-MM-DD');
            lastDate = new Date(lastDate);
            if (
              currentDateNewFomat.getTime() == lastDate.getTime() ||
              currentDateNewFomat.getTime() < lastDate.getTime()
            ) {
              showTime = moment(currentDateNewFomat)
                .tz(visitParseData[index].timezone)
                .format('HH:mm');
              isHave = false;
            }
          }
          this.setState({
            currentPlaceTimeZoneDate: showTime,
            currentPlaceName: visitParseData[index].location,
            currentTimeShow: currentTime,
          });
        }
      }
    }

    //for Notification token
    const token = AsyncStorage.getItem(STORAGE_KEY_FCM_TOKEN);
    this.setState({fcmToken: token});

    if (this.state.isNotificationRefresh && this.state.remoteMessage != '') {
      this.setState({isNotificationRefresh: false});
      this._handleNotificationResponse(this.state.remoteMessage);
    }
  };

  changeTabStatus = () => {
    if (this.state.nominationTab) {
      this.setState({nominationTab: false});
    } else {
      this.setState({nominationTab: true});
    }
  };

  openWebLink = () => {
    Linking.canOpenURL(this.state.webLink).then(supported => {
      if (supported) {
        Linking.openURL(this.state.webLink);
      }
    });

    this.changeTabStatus();
  };

  toggleMenu = () => {
    this.setState({
      navigationView: !this.state.navigationView,
    });
  };

  togglePollingModalVisibility = () => {
    this.setState({isModalVisiblePolling: !this.state.isModalVisiblePolling});
  };

  screensNavigate = value => {
    if (this.state.navigationView) {
      this.toggleMenu();
    }
    if (value == 1) {
      this.props.navigation.navigate('Documents');
    } else if (value == 2) {
      this.props.navigation.navigate('HotelInfo');
    } else if (value == 3) {
      this.props.navigation.navigate('ImportantContact');
    } else if (value == 4) {
      saveDataString('about', STORAGE_KEY_CITY_TYPE);
      this.props.navigation.navigate('ExploreCityScreen_HD');
    }
  };

  logout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout.',
      [
        {
          text: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: () => {
            AsyncStorage.clear();
            this.props.navigation.replace('SplashScreen');
          },
        },
      ],
      {cancelable: false},
    );
  }

  toggleModalVisibility = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  toggleModalItineraryVisibility = () => {
    this.setState({
      isModalVisibleItinerary: false,
    });
  };

  activateItinerary = () => {
    if (this.state.booking_id == '') {
      alert('Please enter booking id');
    } else if (this.state.pickup_location2 == '') {
      alert('Please enter pickup location');
    } else {
      this.itineraryActivated();
    }
  };

  async itineraryActivated() {
    this.setState({isLoading: false});

    let formDate = new FormData();

    formDate.append('booking_id', this.state.booking_id);
    formDate.append('pickup_location', this.state.pickup_location2);
    formDate.append('traveller_id', this.state.userid);
    formDate.append('nonce', this.state.authKey);

    fetch(change_itinerary, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        this.setState({isLoading: true});
        if (responseText.status == 'success') {
          this.toggleModalVisibility();
          alert(responseText.msg);
          this.forceUpdate();
        } else {
          this.toggleModalVisibility();
          alert(responseText.msg);
        }
      })
      .catch(error => {});
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20, backgroundColor: '#e4e5e5'}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#3F51B5"
          translucent={true}
          barStyle="light-content"
        />
        <View
          style={{
            width: '100%',
            height: 55,
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'center',
            paddingEnd: 5,
          }}>
          <View
            style={{
              width: '80%',
              height: 50,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              marginStart: 30,
            }}>
            <Image
              source={require('../assets/images/head_home_black.png')}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                alignItems: 'center',
                alignContent: 'center',
              }}
            />
            <Text
              style={{
                fontSize: 18,
                color: '#000000',
                paddingStart: 10,
                alignItems: 'center',
                alignContent: 'center',
              }}>
              Home
            </Text>
          </View>
          {renderIf(this.state.agentLogourl != '')(
            <Image
              agentLogourl
              source={{uri: this.state.agentLogourl}}
              resizeMode="contain"
              style={{
                width: 45,
                height: 45,
                marginEnd: 5,
                alignItems: 'center',
                alignItems: 'flex-end',
                alignContent: 'flex-end',
              }}
            />,
          )}
        </View>
        <View style={styles.group5}>
          <ScrollView>
            <ImageBackground
              source={
                this.state.background_image
                  ? {uri: this.state.background_image}
                  : require('../assets/images/bg_home1.png')
              }
              resizeMode="cover"
              style={global_style.bg_image}
              imageStyle={styles.image_imageStyle}>
              {/* start side navigation */}
              {renderIf(this.state.navigationView)(
                <View style={global_style.menu}>
                  <TouchableOpacity onPress={() => this.toggleMenu()}>
                    <Icon3
                      name="md-close"
                      style={global_style.icon_close}></Icon3>
                  </TouchableOpacity>
                  <View style={styles.menu_container}>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('UserProfile');
                      }}>
                      <Icon4 name="user" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menu_container_menu_right}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('HotelInfo');
                      }}>
                      <Icon4 name="building" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>Hotel Details</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu_container}>
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('MyTrips');
                      }}
                      style={styles.menu_container_menu_left}>
                      <Icon4 name="eye" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>My Trips</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menu_container_menu_right}
                      onPress={() => {
                        this.toggleMenu();
                        this.toggleModalVisibility();
                      }}>
                      <Icon4
                        name="newspaper-o"
                        style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>
                        Activate itinerary
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu_container}>
                    {/* <TouchableOpacity
                      onPress={() => {
                        this.toggleMenu();
                      }}
                      style={styles.menu_container_menu_left}>
                      <Icon4 name="folder" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>Archives</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('ShowQRCode');
                      }}>
                      <Icon4 name="qrcode" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>Show QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleMenu();
                        this.refreshApiData();
                      }}
                      style={styles.menu_container_menu_right}>
                      <Image
                        source={require('../assets/images/refresh_up.png')}
                        resizeMode="contain"
                        style={{
                          height: 38,
                          width: '100%',
                          marginTop: '10%',
                        }}></Image>
                      <Text style={styles.menu_textInput}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu_container}>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('TourSpeaker');
                      }}>
                      <Image
                        style={{
                          width: 38,
                          height: 38,
                          resizeMode: 'cover',
                          marginTop: '10%',
                        }}
                        source={require('../assets/images/exhibitor_white.png')}
                      />
                      <Text style={styles.menu_textInput}>
                        {this.state.exhibitor_button}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menu_container_menu_right}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('PrivacyPolicy');
                      }}>
                      <Icon5 name="lock" style={styles.menu_icon}></Icon5>
                      <Text style={styles.menu_textInput}>Privacy Policy</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu_container}>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('ReviewRating'); //Feedback
                      }}>
                      <Icon4 name="star" style={styles.menu_icon}></Icon4>
                      <Text style={styles.menu_textInput}>Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('DoDonts');
                      }}>
                      <Image
                        source={require('../assets/images/dos_dont_up.png')}
                        resizeMode="cover"
                        style={{
                          height: 50,
                          width: 50,
                          marginTop: '5%',
                        }}
                      />
                      <Text style={styles.menu_textInput}>Dos and Don'ts</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu_container}>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.props.navigation.navigate('ShareExperience');
                      }}>
                      <Image
                        source={require('../assets/images/share_ex_white.png')}
                        resizeMode="cover"
                        style={{
                          height: 50,
                          width: 50,
                          marginTop: '5%',
                        }}
                      />
                      <Text style={styles.menu_textInput}>
                        Share Experience
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menu_container_menu_left}
                      onPress={() => {
                        this.toggleMenu();
                        this.logout();
                      }}>
                      <Icon3
                        name="ios-log-out"
                        style={styles.menu_icon}></Icon3>
                      <Text style={styles.menu_textInput}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>,
              )}
              {/* side navigation end */}

              {renderIf(this.state.isModalVisiblePolling)(
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
                    visible={this.state.isModalVisiblePolling}
                    presentationStyle="overFullScreen"
                    onDismiss={() => this.togglePollingModalVisibility()}
                    onRequestClose={() => {
                      this.setState({isModalVisiblePolling: false});
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      }}>
                      <ImageBackground
                        source={require('../assets/images/bg_dialogue.png')}
                        imageStyle={{
                          flex: 1,
                          resizeMode: 'cover',
                          justifyContent: 'center',
                        }}
                        style={{
                          width: 325,
                          height: 325,
                          padding: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 315,
                            height: 315,
                            flexDirection: 'column',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 18,
                            }}>
                            {this.state.question}
                          </Text>
                          <Text
                            style={{
                              color: 'blue',
                              fontSize: 14,
                              marginTop: 5,
                            }}>
                            {this.state.tagLine}
                          </Text>
                          <View style={{width: '100%', height: 210}}>
                            <FlatList
                              style={{marginTop: 15}}
                              data={this.state.options}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={item => this.renderItemPolling(item)}
                            />
                          </View>
                          <Button
                            onPress={() => this.savePolled()}
                            title="Submit"
                            style={{
                              backgroundColor: 'blue',
                              padding: 5,
                              borderRadius: 10,
                              alignSelf: 'center',
                            }}
                          />
                        </View>
                      </ImageBackground>
                    </View>
                  </Modal>
                </View>,
              )}

              {renderIf(this.state.isModalVisible)(
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
                    onDismiss={() => this.toggleModalVisibility()}
                    onRequestClose={() => {
                      this.setState({isModalVisible: false});
                    }}>
                    <View style={styles.viewWrapper}>
                      <View
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: 5,
                          margin: 20,
                          width: '90%',
                        }}>
                        <TouchableOpacity
                          style={{
                            marginTop: -22,
                            marginStart: -20,
                            alignSelf: 'flex-start',
                            padding: 10,
                          }}
                          onPress={() => {
                            this.toggleModalVisibility();
                          }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: 'cover',
                            }}
                            source={require('../assets/images/close.png')}
                          />
                        </TouchableOpacity>
                        <View
                          style={{backgroundColor: '#000000', width: '100%'}}>
                          <Text
                            style={{
                              color: '#FFFFFF',
                              padding: 5,

                              fontSize: 16,
                            }}>
                            Use your booking ID and pickup location to activate
                            your itinerary. Or contact your travel agent for
                            assistance.
                          </Text>
                        </View>
                        <Text
                          style={{
                            marginTop: 20,
                          }}>
                          Booking ID
                        </Text>
                        <TextInput
                          numberOfLines={1}
                          style={{
                            color: '#000000',
                            height: 35,
                            width: '100%',
                            padding: 5,
                            marginTop: 5,
                            marginBottom: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#000000',
                            backgroundColor: '#FFFFFF',
                          }}
                          onChangeText={value => {
                            this.setState({booking_id: value});
                          }}
                        />
                        <Text
                          style={{
                            marginTop: 10,
                          }}>
                          Pickup location
                        </Text>
                        <TextInput
                          numberOfLines={1}
                          style={{
                            color: '#000000',
                            height: 35,
                            width: '100%',
                            padding: 5,
                            marginTop: 5,
                            marginBottom: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#000000',
                            backgroundColor: '#FFFFFF',
                          }}
                          onChangeText={value => {
                            this.setState({pickup_location2: value});
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => this.activateItinerary()}>
                          <Text
                            style={{
                              backgroundColor: '#000000',
                              width: 120,
                              height: 30,
                              margin: 10,
                              fontSize: 16,
                              alignSelf: 'center',
                              textAlign: 'center',
                              color: '#FFFFFF',
                              borderRadius: 15,
                              textAlignVertical: 'center',
                            }}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>,
              )}
              {renderIf(this.state.isModalVisibleItinerary)(
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
                    visible={this.state.isModalVisibleItinerary}
                    presentationStyle="overFullScreen"
                    onDismiss={() => this.toggleModalItineraryVisibility()}
                    onRequestClose={() => {
                      this.setState({isModalVisibleItinerary: false});
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
                          width: 260,
                          height: 260,
                          padding: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 260,
                            height: 260,
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              marginTop: -22,
                              marginStart: -20,
                              alignSelf: 'flex-start',
                              padding: 10,
                            }}
                            onPress={() => {
                              this.toggleModalItineraryVisibility();
                            }}>
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                resizeMode: 'cover',
                              }}
                              source={require('../assets/images/close.png')}
                            />
                          </TouchableOpacity>
                          <Image
                            style={{
                              width: 160,
                              height: 52,
                              marginTop: -45,
                              marginEnd: -5,
                              alignSelf: 'flex-end',
                              resizeMode: 'cover',
                            }}
                            source={require('../assets/images/contact_header.png')}
                          />
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              marginTop: -10,
                              alignSelf: 'flex-start',
                              resizeMode: 'cover',
                            }}
                            source={require('../assets/images/contact_avtar.png')}
                          />
                          <Text
                            style={{
                              fontSize: 20,
                              marginTop: -30,
                              marginStart: 20,
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}>
                            Itinerary status
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              padding: 5,
                              margin: 5,
                              alignSelf: 'center',
                            }}>
                            Please contact your operator to enable an itinerary.
                            You may hit the call button below for any
                            assistance.
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL('tel:${' + +918305650650 + '}');
                            }}>
                            <Image
                              style={{
                                width: 155,
                                height: 33,
                                margin: 5,
                                alignSelf: 'center',
                                resizeMode: 'cover',
                              }}
                              source={require('../assets/images/call.png')}
                            />
                          </TouchableOpacity>
                          {/* <Text
                            style={{
                              alignSelf: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              margin: 5,
                            }}
                          >
                            -Or-
                          </Text>
                          <Text style={{ alignSelf: "center", margin: 5 }}>
                            Explore destinations for your next trip
                          </Text>
                          <TouchableOpacity onPress={() => alert("explore")}>
                            <Image
                              style={{
                                width: 155,
                                height: 33,
                                alignSelf: "center",
                                margin: 5,
                                resizeMode: "cover",
                              }}
                              source={require("../assets/images/explore.png")}
                            />
                          </TouchableOpacity> */}
                        </View>
                      </ImageBackground>
                    </View>
                  </Modal>
                </View>,
              )}
              {renderIf(this.state.url !== '')(
                <Modal
                  animationType="slide"
                  transparent
                  backdropOpacity={0.3}
                  visible={true}
                  presentationStyle="overFullScreen"
                  onDismiss={() => {
                    this.setState({url: ''});
                  }}
                  onRequestClose={() => {
                    this.setState({url: ''});
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}>
                    <ImageBackground
                      source={require('../assets/images/bg_dialogue.png')}
                      imageStyle={{
                        flex: 1,
                        resizeMode: 'cover',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignContent: 'center',
                      }}
                      style={{
                        width: 350,
                        height: 350,
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        style={{
                          marginTop: -22,
                          marginStart: -20,
                          alignSelf: 'flex-start',
                          padding: 10,
                        }}
                        onPress={() => {
                          this.setState({url: ''});
                        }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            resizeMode: 'cover',
                          }}
                          source={require('../assets/images/close.png')}
                        />
                      </TouchableOpacity>
                      <View style={{flex: 1}}>
                        <WebView
                          style={{marginTop: Platform.OS == 'ios' ? 20 : 0}}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          source={{
                            uri: this.state.url,
                          }}
                        />
                      </View>
                    </ImageBackground>
                  </View>
                </Modal>,
              )}
              <View style={styles.HomeHeaderStack}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    padding: 10,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity onPress={() => this.toggleMenu()}>
                    <MaterialCommunityIconsIcon
                      name="menu"
                      style={styles.leftIcon}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {/* {this.state.isNoti && (
                      <Text
                        style={{
                          color: '#FF0000',
                          fontSize: 16,
                          alignSelf: 'center',
                          padding: 3,

                        }}>
                        You have a new message
                      </Text>
                    )} */}
                    <TouchableOpacity
                      style={{
                        width: 45,
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 0,
                        borderColor: '#000000',
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderRadius: 100,
                      }}
                      onPress={() => {
                        // saveData(false, STORAGE_KEY_ACTIVE_NOTI_KEY);
                        // this.setState({isNoti: false});
                        this.props.navigation.navigate('Notification');
                      }}>
                      <Image
                        source={require('../assets/images/notification_new.png')}
                        resizeMode="contain"
                        style={{
                          width: 25,
                          height: 25,
                          alignItems: 'center',
                          alignContent: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    width: '95%',
                    color: '#FFFFFF',
                    fontSize: 25,
                    alignItems: 'center',
                    alignSelf: 'center',
                    textAlign: 'center',
                    margin: 5,
                  }}>
                  {this.state.tour_name}
                </Text>
                <View
                  style={{
                    width: '95%',
                    height: 120,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    borderRadius: 10,
                    flexDirection: 'row',
                    marginRight: '3%',
                    marginLeft: '3%',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 210,
                      marginLeft: 3,
                      marginTop: 5,
                    }}>
                    {renderIf(this.state.differenceDate != 0)(
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 18,
                        }}>
                        {this.state.differenceDate} Days to go
                      </Text>,
                    )}
                    {renderIf(this.state.differenceDate == 0)(
                      <View>
                        <View style={styles.icon3Stack}>
                          <EntypoIcon name="adjust" style={styles.icon3} />
                          <Text
                            style={{
                              top: 1,
                              marginStart: 40,
                              color: 'rgba(255,255,255,1)',
                              fontSize: 20,
                            }}>
                            {this.state.currentTimeShow}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#FFFFFF',
                            }}>
                            {this.state.pickup_location}
                          </Text>
                          <Image
                            source={require('../assets/images/location.png')}
                            resizeMode="contain"
                            style={{width: 10, height: 10, marginStart: 2}}
                          />
                        </View>
                      </View>,
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('DayPlan');
                      }}
                      style={{
                        width: '70%',
                        height: 35,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 100,
                        marginTop: 5,
                      }}>
                      <View style={styles.group8}>
                        <View style={styles.rect4}></View>
                        <Text style={styles.clickForAgenda}>
                          Click for Agenda
                        </Text>
                        <Icon2
                          name="arrow-long-right"
                          style={styles.icon_arrow}></Icon2>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginTop: 30,
                      width: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,1)',
                      height: 70,
                    }}>
                    <View
                      style={{
                        width: 90,
                        height: 37,
                        marginTop: 2,
                        marginLeft: 2,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <EntypoIcon name="adjust" style={styles.icon3} />
                      <Text style={styles.loremIpsum2}>
                        {this.state.currentPlaceTimeZoneDate}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 12,
                          padding: 2,
                          marginStart: 2,
                          color: '#FFFFFF',
                        }}>
                        {this.state.currentPlaceName}
                      </Text>
                      <Image
                        source={require('../assets/images/location.png')}
                        resizeMode="contain"
                        style={{width: 10, height: 10, marginStart: 2}}></Image>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.rect5Stack}>
                <View style={styles.group10}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      this.screensNavigate(1);
                    }}>
                    <Image
                      source={require('../assets/images/new_travel_doc.png')}
                      resizeMode="cover"
                      style={styles.image1}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      this.screensNavigate(2);
                    }}>
                    <Image
                      source={require('../assets/images/new_hotel_details.png')}
                      resizeMode="cover"
                      style={styles.image1}></Image>
                  </TouchableOpacity>
                </View>
                {renderIf(this.state.nominationShow)(
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => this.changeTabStatus()}>
                      <Image
                        source={
                          this.state.nominationTab
                            ? require('../assets/images/button_down_nomination.png')
                            : require('../assets/images/button_up_nomination.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 45,
                          height: 45,
                          marginEnd: -5,
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          alignContent: 'flex-end',
                        }}
                      />
                    </TouchableOpacity>
                    {renderIf(this.state.nominationTab)(
                      <View
                        style={{
                          borderTopLeftRadius: 5,
                          borderBottomLeftRadius: 5,
                          backgroundColor: '#000000',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            alignSelf: 'center',
                          }}>
                          {this.state.nominationText}
                        </Text>
                        <TouchableOpacity onPress={() => this.openWebLink()}>
                          <Text
                            style={{
                              marginEnd: 5,
                              marginLeft: 5,
                              marginBottom: 5,
                              marginTop: 3,
                              fontSize: 13,
                              backgroundColor: '#FFCC00',
                              padding: 5,
                              borderRadius: 10,
                              textAlign: 'center',
                            }}>
                            {this.state.clickHereText}
                          </Text>
                        </TouchableOpacity>
                      </View>,
                    )}
                  </View>,
                )}
              </View>
              <View style={styles.rect6Stack}>
                <View style={styles.rect6}></View>
                <View style={styles.group11}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      this.screensNavigate(3);
                    }}>
                    <Image
                      source={require('../assets/images/new_important_contact.png')}
                      resizeMode="cover"
                      style={styles.image1}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      this.screensNavigate(4);
                    }}>
                    <Image
                      source={require('../assets/images/new_explore_destination.png')}
                      resizeMode="cover"
                      style={styles.image1}></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  leftIcon: {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,1)',
    fontSize: 30,
  },
  group5: {
    height: '100%',
    marginTop: '0%',
    paddingBottom: 20,
  },
  image_imageStyle: {},
  HomeHeader: {
    height: 55,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  group6: {
    top: 40,
    left: 0,
    height: 170,
    position: 'absolute',
    right: 0,
  },
  rect: {
    height: 179,
  },
  rect2: {
    height: 56,
  },
  micePartnerGroup: {
    color: '#FFFFFF',
    fontSize: 25,
    alignSelf: 'center',
    fontWeight: '400',
  },
  rect3: {
    width: '90%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 10,
    flexDirection: 'row',
    marginLeft: '5%',
  },
  group7: {
    width: '55%',
    height: 33,
  },
  button: {
    width: '100%',
    height: 35,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 100,
    marginTop: '5%',
  },
  group8: {
    width: '100%',
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rect4: {
    width: '80%',
    height: 33,
    backgroundColor: '#000000',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    left: -1,
  },
  clickForAgenda: {
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 14,
    textAlign: 'left',
    left: 0,
    padding: 5,
    right: 30,
  },
  icon_arrow: {
    color: 'rgba(128,128,128,1)',
    fontSize: 20,
  },
  loremIpsum: {
    color: 'rgba(255,255,255,1)',
    fontSize: 18,
  },
  buttonFiller: {
    flex: 1,
    justifyContent: 'center',
  },
  group9: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    width: 120,
    height: 70,
    marginLeft: 10,
  },
  icon3: {
    top: 0,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 30,
    left: 0,
  },
  loremIpsum2: {
    top: 1,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 20,
    right: 0,
  },

  icon3Stack: {
    width: 90,
    height: 37,
    marginTop: 2,
    marginLeft: 5,
  },

  baliIndonesia: {
    top: -10,
    left: 0,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 14,
    right: 13,
  },
  icon4: {
    top: -8,
    left: 70,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    fontSize: 14,
    height: 15,
    width: 14,
  },
  baliIndonesiaStack: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 2,
  },
  group7Row: {
    height: 92,
    flexDirection: 'row',
    flex: 1,
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: 15,
  },
  HomeHeaderStack: {
    height: '30%',
  },
  rect5: {
    top: 0,
    left: 0,
    height: 123,
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  rect7Filler: {
    flex: 1,
    flexDirection: 'row',
  },
  rect7: {
    height: 60,
    backgroundColor: 'rgba(222,34,58,1)',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    width: 35,
    flexDirection: 'row',
    marginTop: '30%',
    marginLeft: width - 35,
  },
  icon5Filler: {
    flex: 1,
    flexDirection: 'row',
  },
  icon5: {
    color: 'rgba(255,255,255,1)',
    fontSize: 35,
    height: 40,
    width: width,
    top: 12,
    marginRight: 1,
    marginTop: 0,
  },
  group10: {
    top: 0,
    left: 40,
    position: 'absolute',
    flexDirection: 'row',
    right: 34,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 130,
  },
  image1: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    opacity: 0.7,
  },
  rect5Stack: {
    height: 130,
    marginTop: '20%',
  },
  rect6: {
    top: 0,
    left: 0,
    height: 130,
    position: 'absolute',
    right: 0,
  },
  group11: {
    top: 0,
    left: 40,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 34,
    justifyContent: 'space-around',
    height: 130,
  },
  rect6Stack: {
    height: 130,
    marginTop: 30,
  },
  HomeFooterStackColumn: {},
  HomeFooterStackColumnFiller: {
    flex: 1,
  },
  menu_container: {
    width: '100%',
    height: '15%',
    flexDirection: 'row',
  },
  menu_container_menu_left: {
    width: '50%',
    height: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.4,
    borderRightWidth: 0.4,
    borderRightColor: 'gray',
    alignItems: 'center',
  },
  menu_container_menu_right: {
    width: '50%',
    height: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.4,
    alignItems: 'center',
  },
  menu_icon: {
    color: '#fff',
    fontSize: 38,
    height: 38,
    width: '100%',
    marginTop: '10%',
    textAlign: 'center',
  },
  menu_textInput: {
    color: '#fff',
    height: 19,
    width: '100%',
    textAlign: 'center',
    marginTop: '5%',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
