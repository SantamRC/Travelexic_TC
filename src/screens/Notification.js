import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';

var global_style = require('./components/style');
import {
  STORAGE_KEY_userid_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {
  notificationHistoryURL,
  save_poll_response,
  nonceForUserDetails,
} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';
import {convertDate} from '../utility/Common';
import renderif from '../utility/renderif';
import {Modal} from 'react-native';
import {Button} from 'react-native';
import {TouchableOpacity} from 'react-native';
import LinkPreview from 'react-native-link-preview';
import WebView from 'react-native-webview';

const {width, height} = Dimensions.get('window');

export default class Notification extends Component {
  constructor() {
    super();
    this.state = {
      order_id: '',
      user_id: '',
      notificationData: [],
      background_image: '',
      isModalVisiblePolling: false,
      question: '',
      tagLine: '*You can choose single response',
      options: [],
      poll_id: '',
      book_id: '',
      url: '',
    };
  }

  async componentDidMount() {
    const user_id_key = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({user_id: user_id_key, order_id: order_id_key});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    this.getNotificationData();
  }

  getIconAccordingToNotification = type => {
    if (type == 'Day wise Agenda') {
      return (
        <Image
          source={require('../assets/images/noti_myplan.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Dos and Donts') {
      return (
        <Image
          source={require('../assets/images/noti_dosdont.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Weather Forecast') {
      return (
        <Image
          source={require('../assets/images/noti_weather.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Flight Tickets') {
      return (
        <Image
          source={require('../assets/images/noti_traveldoc.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (
      type == 'Eat' ||
      type == 'Buy' ||
      type == 'See' ||
      type == 'About'
    ) {
      return (
        <Image
          source={require('../assets/images/noti_eatseebuy.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Information') {
      return (
        <Image
          source={require('../assets/images/noti_info.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Currency converter') {
      return (
        <Image
          source={require('../assets/images/noti_currency.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Feedback') {
      return (
        <Image
          source={require('../assets/images/noti_feedback.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Share Experience') {
      return (
        <Image
          source={require('../assets/images/noti_shareexperience.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Important Contact') {
      return (
        <Image
          source={require('../assets/images/noti_impcontact.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Other document') {
      return (
        <Image
          source={require('../assets/images/noti_otherdoc.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Video') {
      return (
        <Image
          source={require('../assets/images/noti_video.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Polling') {
      return (
        <Image
          source={require('../assets/images/noti_polling.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else if (type == 'Urgent and Important') {
      return (
        <Image
          source={require('../assets/images/noti_important_polling.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    } else {
      return (
        <Image
          source={require('../assets/images/noti_message.png')}
          resizeMode="contain"
          style={styles.image}></Image>
      );
    }
  };

  async getNotificationData() {
    let formDate = new FormData();
    formDate.append('user_id', this.state.user_id);
    formDate.append('booking_id', this.state.order_id);

    let notificationArray = [];

    fetch(notificationHistoryURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'success') {
          Object.keys(responseText).forEach(notificationKey => {
            if (notificationKey == '0') {
              for (
                let index = 0;
                index < responseText[notificationKey].length;
                index++
              ) {
                notificationArray.push({
                  body: responseText[notificationKey][index].body,
                  title: responseText[notificationKey][index].title,
                  key: responseText[notificationKey][index].key,
                  time: responseText[notificationKey][index].time,
                  poll_data: responseText[notificationKey][index].poll_data,
                });
              }
            } else if (notificationKey == '1') {
              for (
                let index = 0;
                index < responseText[notificationKey].length;
                index++
              ) {
                notificationArray.push({
                  body: responseText[notificationKey][index].body,
                  title: responseText[notificationKey][index].title,
                  key: responseText[notificationKey][index].key,
                  time: responseText[notificationKey][index].time,
                });
              }
            }
          });
          notificationArray.sort((a, b) => b.time - a.time);
          this.setState({notificationData: notificationArray});
        } else {
          alert('Sorry! no data found...');
        }
      })
      .catch(error => {});
  }
  togglePollingModalVisibility = () => {
    this.setState({isModalVisiblePolling: !this.state.isModalVisiblePolling});
  };

  savePolled() {
    this.togglePollingModalVisibility();
    this.savePollingData();
  }

  checkVideoAndImage(noti_data) {
    LinkPreview.getPreview(noti_data).then(data => {
      // console.debug(data);
      this.setState({url: data.url});
    });
  }

  openNotification(data) {
    if (data.key == 20 || data.key == 21) {
      if (!this.checkAlredyGivenResponse(data)) {
        this.togglePollingModalVisibility();
        this.setState({question: data.poll_data[0].poll_question});
        if (data.poll_data[0].question_type == 'multi_type') {
          this.setState({tagLine: '*You can choose mulitple response'});
        } else if (data.poll_data[0].question_type == 'single_type') {
          this.setState({tagLine: '*You can choose single response'});
        } else if (data.poll_data[0].question_type == 'opt_in') {
          this.setState({tagLine: '*You can choose single response'});
        }
        this.setState({
          poll_id: data.poll_data[0].poll_id,
          book_id: data.poll_data[0].booking_id,
        });

        let optionsArray = [];
        let opt = data.poll_data[0].options;
        for (let index = 0; index < opt.length; index++) {
          optionsArray.push({
            option: opt[index].option,
            ans: opt[index].ans,
            key: index,
            type: data.poll_data[0].question_type,
          });
        }
        this.setState({options: optionsArray});
      } else {
        alert('Thank you for leaving your response');
      }
    } else if (data.key == 22) {
      this.props.navigation.navigate('ReviewRating');
    } else if (data.key == 14) {
      if (data.title == 'Day wise Agenda') {
        this.props.navigation.navigate('DayPlan');
      } else if (data.title == 'Dos and Donts') {
        this.props.navigation.navigate('DoDonts');
      } else if (data.title == 'Weather Forecast') {
        this.props.navigation.navigate('Documents');
      } else if (data.title == 'Flight Tickets') {
        this.props.navigation.navigate('FlightTicket');
      } else if (data.title == 'Eat') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (data.title == 'Buy') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (data.title == 'See') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (data.title == 'About') {
        this.props.navigation.navigate('ExploreCityScreen_HD');
      } else if (data.title == 'Information') {
        //Open browser with URL button
        LinkPreview.getPreview(data.body).then(data => {
          // console.debug(data);
          this.props.navigation.navigate('OpenFile', {
            fileurl: data.url,
          });
        });
      } else if (data.title == 'Currency converter') {
        this.props.navigation.navigate('CurrencyConverter');
      } else if (data.title == 'Feedback') {
        this.props.navigation.navigate('ReviewRating');
      } else if (data.title == 'Share Experience') {
        this.props.navigation.navigate('ShareExperience');
      } else if (data.title == 'Important Contact') {
        this.props.navigation.navigate('ImportantContact');
      } else if (data.title == 'Other document') {
        this.props.navigation.navigate('Documents');
      } else if (data.title == 'Video') {
        this.checkVideoAndImage(data.body);
      }
    } else if (
      data.key == 0 ||
      data.key == 8 ||
      data.key == 9 ||
      data.key == 10 ||
      data.key == 11 ||
      data.key == 12
    ) {
      this.props.navigation.navigate('Documents');
    } else if (data.key == 5) {
      this.props.navigation.navigate('HotelInfo');
    } else if (data.key == 6) {
      this.props.navigation.navigate('DayPlan');
    }
  }

  async setOptionsData(item) {
    var value;
    if (item.ans == 'true') {
      value = 'false';
    } else {
      value = 'true';
    }
    let options = [...this.state.options];
    if (item.type == 'single_type') {
      var optionArray = [];
      optionArray = this.state.options;
      for (let index = 0; index < optionArray.length; index++) {
        options[index] = {...options[index], ans: 'false'};
      }
    }
    options[item.key] = {...options[item.key], ans: value};
    this.setState({options});
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
            }}>
            {data.item.option}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  checkAlredyGivenResponse = data => {
    let opt = data.poll_data[0].options;
    let given = false;
    for (let index = 0; index < opt.length; index++) {
      if (opt[index].ans == 'true') {
        given = true;
        break;
      }
    }
    return given;
  };

  getTitelNotification = data => {
    if (data.key == 20 || data.key == 21) {
      if (this.checkAlredyGivenResponse(data)) {
        return 'Thank you for leaving your response';
      } else {
        return data.body;
      }
    } else {
      return data.body;
    }
  };

  renderItemComponent = data => {
    return (
      <TouchableOpacity onPress={() => this.openNotification(data.item)}>
        <View style={styles.rect}>
          <View style={styles.rect2}>
            <View style={styles.rect3StackRow}>
              <View style={styles.rect3Stack}>
                <View style={styles.rect3}></View>
                <Text numberOfLines={1} style={styles.loremIpsum}>
                  {data.item.title}
                </Text>
              </View>
              <View style={styles.rect4}>
                {this.getIconAccordingToNotification(data.item.title)}
              </View>
            </View>
          </View>
          <View style={styles.rect7}>
            <Text style={styles.text2}>
              {this.getTitelNotification(data.item)}
            </Text>
          </View>
          <View style={styles.rect5}>
            <View style={styles.loremIpsum3Row}>
              <Text style={styles.loremIpsum3}>
                {convertDate(data.item.time)}
              </Text>
              <Text style={styles.text}>{convertDate(data.item.time)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          alert('Thank you for leaving your response');
          this.getNotificationData();
        }
      })
      .catch(error => {});
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
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
          <View style={styles.scrollArea}>
            {renderif(this.state.isModalVisiblePolling)(
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
                        <Text style={{color: 'black', fontSize: 18}}>
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
                          }}></Button>
                      </View>
                    </ImageBackground>
                  </View>
                </Modal>
              </View>,
            )}
            {renderif(this.state.url !== '')(
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
            <FlatList
              data={this.state.notificationData}
              renderItem={item => this.renderItemComponent(item)}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={this.handleRefresh}
              contentContainerStyle={{paddingBottom: 300}}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollArea: {
    width: width,
    height: 'auto',
    marginTop: '10%',
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 300,
  },
  rect: {
    width: '95%',
    height: 'auto',
    backgroundColor: '#fff',
    shadowRadius: 5,
    margin: 10,
    alignSelf: 'center',
  },
  rect2: {
    width: '100%',
    height: 38,
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
  },
  rect3: {
    top: 0,
    left: 0,
    width: '90%',
    height: '100%',
    position: 'absolute',
  },
  loremIpsum: {
    paddingTop: '2%',
    left: '2%',
    color: '#121212',
    height: 'auto',
    fontSize: 18,
    width: '100%',
  },
  rect3Stack: {
    width: '80%',
    height: 'auto',
  },
  rect4: {
    width: '15%',
    marginRight: '5%',
  },
  image: {
    width: 35,
    height: 35,
    marginLeft: '50%',
  },
  rect3StackRow: {
    height: 'auto',
    flexDirection: 'row',
    flex: 1,
  },

  rect7: {
    width: '100%',
    paddingBottom: '5%',
    overflow: 'visible',
  },

  text2: {
    color: 'rgba(155,155,155,1)',
    fontSize: 18,
    width: '95%',
    marginLeft: '2.5%',
    textAlign: 'left',
  },
  rect5: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
  },
  loremIpsum3: {
    color: 'rgba(155,155,155,1)',
    height: 'auto',
    width: '50%',
    textAlign: 'left',
    paddingLeft: 10,
  },
  text: {
    color: 'rgba(74,144,226,1)',
    height: 'auto',
    width: '50%',
    textAlign: 'right',
    paddingRight: 10,
  },
  loremIpsum3Row: {
    height: '100%',
    flexDirection: 'row',
    flex: 1,
  },
});
