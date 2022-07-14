import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import renderif from '../utility/renderif';
import {
  STORAGE_KEY_auth_key,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_username_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_BOOKING_key,
} from '../services/ConstantStorageKey';
import {
  fetch_feedback_questions,
  getreviewandratingURL,
} from '../services/ConstantURLS';
import {currentDatePassport} from '../utility/Common';
import {is} from '@babel/types';
var global_style = require('./components/style');

var question_id, reviewTitle, reviewkey, reviewDesc;

export default class ReviewRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      background_image: '',
      feedbackArray: [],
      userName: '',
      order_id: '',
      auth_key: '',
      traveller_id: '',
      booking_id: '',
      rating: 0,
      reviewID: '',
      rating_one: false,
      rating_two: false,
      rating_three: false,
      rating_four: false,
      rating_five: false,
    };
  }

  async componentDidMount() {
    const traveller_id = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    const auth_key = await AsyncStorage.getItem(STORAGE_KEY_auth_key);
    const order_id = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    const booking_id = await AsyncStorage.getItem(STORAGE_KEY_BOOKING_key);
    const userName = await AsyncStorage.getItem(STORAGE_KEY_username_key);

    this.setState({
      background_image: back_image,
      auth_key,
      order_id,
      traveller_id,
      booking_id,
      userName,
    });
    this.GetAllData();
  }

  async GetAllData() {
    let formDate = new FormData();
    formDate.append('auth', this.state.auth_key);
    formDate.append('booking_id', this.state.order_id);

    // console.log(
    //   'formDate: ',
    //   ' / ' + JSON.stringify(formDate) + ' -- ' + fetch_feedback_questions,
    // );

    let questionArray = [];
    fetch(fetch_feedback_questions, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        // console.log('feedbackResponse: ', ' / ' + JSON.stringify(responseText));
        if (responseText.status == 'success') {
          var isEnter = true;
          for (let index = 0; index < responseText.question.length; index++) {
            if (responseText.question[index].ans.trim() == '') {
              if (isEnter) {
                questionArray.push({
                  id: responseText.question[index].id,
                  question: responseText.question[index].question,
                  review_type: responseText.question[index].review_type,
                  ans: responseText.question[index].ans,
                  options: responseText.question[index].options,
                  isDone: false,
                });
                isEnter = false;
              }
            }
          }
          if (questionArray.length == 0) {
            questionArray.push({
              id: questionArray.length,
              question: '',
              review_type: 'complete',
              options: [],
              isDone: false,
            });
          }

          this.setState({feedbackArray: questionArray});
        } else {
          alert('Sorry! no data found...');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  checkValidationRating() {
    if (
      this.state.rating_one ||
      this.state.rating_two ||
      this.state.rating_three ||
      this.state.rating_four ||
      this.state.rating_five
    ) {
      this.submitInput();
    } else {
      alert('Please select at least one rating...');
    }
  }

  checkValidationText() {
    if (reviewDesc !== '') {
      this.submitInput();
    } else {
      alert('Please input the text...');
    }
  }
  checkValidationRadio() {
    if (reviewDesc !== '') {
      this.submitInput();
    } else {
      alert('Please select option...');
    }
  }
  async submitInput() {
    let formDate = new FormData();
    formDate.append('traveller_id', this.state.traveller_id);
    formDate.append('rating', this.state.rating);
    formDate.append('reviewID', this.state.booking_id);
    formDate.append('reviewkey', reviewkey);
    formDate.append('date', currentDatePassport());
    formDate.append('booking_id', this.state.order_id);
    formDate.append('reviewTitle', reviewTitle);
    formDate.append('reviewDesc', reviewDesc);
    formDate.append('nonce', this.state.auth_key);
    formDate.append('question_id', question_id);

    // console.log('formDate: ', ' / ' + JSON.stringify(formDate));

    fetch(getreviewandratingURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        // console.log('NotificationRes: ', ' / ' + JSON.stringify(responseText));
        if (responseText.status == 'success') {
          alert('Thank You!');
        }
        //reset all feedback data
        this.setState({
          rating: 0,
          reviewID: '',
          rating_one: false,
          rating_two: false,
          rating_three: false,
          rating_four: false,
          rating_five: false,
        });
        question_id = '';
        reviewDesc = '';
        reviewTitle = '';
        reviewkey = '';

        this.GetAllData();
      })
      .catch(error => {
        console.error(error);
      });
  }

  toggleModalVisibility = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  ratingFeedback(value, type) {
    question_id = value.id;
    reviewTitle = value.question;
    reviewkey = value.review_type;

    if (type == 0) {
      this.setState({
        rating_one: !this.state.rating_one,
        rating_two: false,
        rating_three: false,
        rating_four: false,
        rating_five: false,
        rating: 1,
      });
    } else if (type == 1) {
      this.setState({
        rating_one: false,
        rating_two: !this.state.rating_two,
        rating_three: false,
        rating_four: false,
        rating_five: false,
        rating: 2,
      });
    } else if (type == 2) {
      this.setState({
        rating_one: false,
        rating_two: false,
        rating_three: !this.state.rating_three,
        rating_four: false,
        rating_five: false,
        rating: 3,
      });
    } else if (type == 3) {
      this.setState({
        rating_one: false,
        rating_two: false,
        rating_three: false,
        rating_four: !this.state.rating_four,
        rating_five: false,
        rating: 4,
      });
    } else if (type == 4) {
      this.setState({
        rating_one: false,
        rating_two: false,
        rating_three: false,
        rating_four: false,
        rating_five: !this.state.rating_five,
        rating: 5,
      });
    }
  }

  renderItemPolling(data, value) {
    return (
      <TouchableOpacity
        onPress={() => {
          reviewDesc = data.item.key;
          question_id = value.id;
          reviewTitle = value.question;
          reviewkey = value.review_type;
          this.checkValidationRadio();
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
          }}>
          <Image
            source={
              true == 'true'
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
          <Text style={{alignSelf: 'center', marginStart: 5, fontSize: 20}}>
            {data.item.key}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderFeedbackData(data) {
    return (
      <View style={styles.itemWrapper}>
        {renderif(data.item.review_type == 'radio')(
          <View>
            <Image
              source={require('../assets/images/feedback_rateing_img.png')}
              resizeMode="contain"
              style={{width: '100%', height: 200}}
            />
            <Text
              style={{
                marginEnd: 10,
                marginLeft: 10,
                marginTop: 20,
                textAlign: 'center',
                fontSize: 23,
                padding: 5,
              }}>
              {data.item.question}
            </Text>
            <FlatList
              style={{alignSelf: 'center'}}
              data={data.item.options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => this.renderItemPolling(item, data.item)}
            />
          </View>,
        )}
        {renderif(data.item.review_type == 'text')(
          <View>
            <Image
              source={require('../assets/images/feedback_rateing_img.png')}
              resizeMode="contain"
              style={{width: '100%', height: 180}}
            />
            <Text
              style={{
                marginEnd: 10,
                marginLeft: 10,
                marginTop: 20,
                textAlign: 'center',
                fontSize: 23,
                padding: 5,
              }}>
              {data.item.question}
            </Text>
            <TextInput
              placeholder="enter comment"
              keyboardType="default"
              placeholderTextColor="#000000"
              style={{
                color: '#000000',
                height: 50,
                width: '90%',
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                backgroundColor: '#D3D3D3',
                margin: 5,
                alignSelf: 'center',
              }}
              onChangeText={value => {
                reviewDesc = value;
              }}
            />
            <View
              style={{
                width: 100,
                height: 40,
                borderRadius: 7,
                margin: 30,
                alignSelf: 'center',
              }}>
              <Button
                title="Submit"
                onPress={() => {
                  question_id = data.item.id;
                  reviewTitle = data.item.question;
                  reviewkey = data.item.review_type;
                  this.checkValidationText();
                }}
              />
            </View>
          </View>,
        )}
        {renderif(data.item.review_type == 'rating')(
          <View>
            <Image
              source={require('../assets/images/feedback_rateing_img.png')}
              resizeMode="contain"
              style={{width: '100%', height: 180}}
            />
            <Text
              style={{
                marginEnd: 10,
                marginLeft: 10,
                marginTop: 20,
                textAlign: 'center',
                fontSize: 23,
                padding: 5,
              }}>
              {data.item.question}
            </Text>
            <View
              style={{
                width: '50%',
                height: 'auto',
                alignSelf: 'center',
                flexDirection: 'row',
                alignContent: 'center',
                padding: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: 60,
                  marginStart: 10,
                  marginEnd: 10,
                }}
                onPress={() => this.ratingFeedback(data.item, 0)}>
                <Image
                  source={
                    this.state.rating_one
                      ? require('../assets/images/emoji_angry_non.png')
                      : require('../assets/images/emoji_angry_black.png')
                  }
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: 60,
                  marginStart: 10,
                  marginEnd: 10,
                }}
                onPress={() => this.ratingFeedback(data.item, 1)}>
                <Image
                  source={
                    this.state.rating_two
                      ? require('../assets/images/emoji_expressionless_non.png')
                      : require('../assets/images/emoji_expressionless_black.png')
                  }
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: 60,
                  marginStart: 10,
                  marginEnd: 10,
                }}
                onPress={() => this.ratingFeedback(data.item, 2)}>
                <Image
                  source={
                    this.state.rating_three
                      ? require('../assets/images/emoji_dizzy_non.png')
                      : require('../assets/images/emoji_dizzy_black.png')
                  }
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: 60,
                  marginStart: 10,
                  marginEnd: 10,
                }}
                onPress={() => this.ratingFeedback(data.item, 3)}>
                <Image
                  source={
                    this.state.rating_four
                      ? require('../assets/images/emoji_smile_non.png')
                      : require('../assets/images/emoji_smile_black.png')
                  }
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: 60,
                  marginStart: 10,
                  marginEnd: 10,
                }}
                onPress={() => this.ratingFeedback(data.item, 4)}>
                <Image
                  source={
                    this.state.rating_five
                      ? require('../assets/images/emoji_laughing_non.png')
                      : require('../assets/images/emoji_laughing_black.png')
                  }
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="What do you like most?"
              placeholderTextColor="#000000"
              clearTextOnFocus={true}
              style={{
                color: '#000000',
                height: 50,
                width: '90%',
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                backgroundColor: '#D3D3D3',
                alignSelf: 'center',
              }}
              onChangeText={value => {
                reviewDesc = value;
              }}
            />
            <View
              style={{
                width: 100,
                height: 40,
                borderRadius: 7,
                margin: 10,
                alignSelf: 'center',
              }}>
              <Button
                style={{width: 'auto', height: 'auto'}}
                title="Submit"
                onPress={() => {
                  this.checkValidationRating();
                }}
              />
            </View>
          </View>,
        )}
        {renderif(data.item.review_type == 'complete')(
          <View>
            <Image
              source={require('../assets/images/feedback_thanks_img.png')}
              resizeMode="contain"
              style={{alignSelf: 'center'}}
            />
            <Text
              style={{
                marginEnd: 30,
                marginLeft: 30,
                marginTop: 20,
                textAlign: 'center',
                fontSize: 23,
                padding: 5,
              }}>
              Hi, {this.state.userName}
              {'\n'}Thanks for taking the time{'\n'}to post this! We really
              {'\n'}appreciate it.
            </Text>
          </View>,
        )}
      </View>
    );
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
            <FlatList
              style={{
                alignSelf: 'center',
                marginBottom: 100,
                marginTop: 80,
                marginRight: 15,
                marginLeft: 15,
                width: '100%',
              }}
              data={this.state.feedbackArray}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => this.renderFeedbackData(item)}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: '#FFFFFF',
    margin: 50,
    width: '90%',
    height: 460,
    alignSelf: 'center',
    borderRadius: 10,
  },
});
