import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
} from 'react-native';
import {getNewRequestToken, getRoe} from '../services/ConstantURLS';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {STORAGE_KEY_BACKGROUND_IMAGE} from '../services/ConstantStorageKey';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import renderif from '../utility/renderif';
import {Modal} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Linking} from 'react-native';

export default class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyCountryNames: [],
      currencyCountryNamesFilter: [],
      secondCountry: 'USD',
      secondCountryName: 'US Dollar',
      currentRate: 0.0,
      convertValue: 0.0,
      enterAmount: '0.0',
      background_image: '',
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    await this.getTokenFromService();
  }

  async getTokenFromService() {
    fetch(getNewRequestToken, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        uniqueId: '2402:3a80:65f:fff:558a:142:b1ad:ac27',
        user: 'mobicule',
      }),
    })
      .then(response => response.json())
      .then(responseText => {
        console.log('responseText: ', ' / ' + JSON.stringify(responseText));
        if (responseText.errorCode == 0) {
          this.getAllCurrencyNames(
            responseText.requestId,
            responseText.tokenId,
          );
        }
      })
      .catch(error => {});
  }

  toggleModalVisibility = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  async getAllCurrencyNames(requestid, tokenId) {
    fetch(getRoe, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        requestId: requestid,
        sessionId: tokenId,
      }),
    })
      .then(response => response.json())
      .then(responseText => {
        console.log('responseText: ', ' / ' + JSON.stringify(responseText));
        var currencyNames = [];

        for (let index = 0; index < responseText.length; index++) {
          currencyNames.push({
            currencyCode: responseText[index].currencyCode,
            currencyName: responseText[index].currencyName,
            roe: responseText[index].roe,
          });
        }
        // console.log('currencyArray: ', ' / ' + JSON.stringify(currencyArray));
        this.setState({
          currencyCountryNames: currencyNames,
          currentRate: responseText[0].roe,
        });
      })
      .catch(error => {});
  }
  setResult = () => {
    var amount = this.state.enterAmount;
    amount = parseInt(amount, 10);
    if (amount !== 0.0 && amount > 0.0) {
      var result = amount / this.state.currentRate;
      this.setState({
        convertValue: Math.round((result + Number.EPSILON) * 100) / 100,
      });
    } else {
      alert('Please input correct value');
    }
  };
  setData = item => {
    this.setState({
      secondCountry: item.currencyCode,
      secondCountryName: item.currencyName,
      isModalVisible: false,
      currentRate: item.roe,
      convertValue: 0.0,
    });
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

  openWebURL() {
    Linking.openURL(
      'https://www.thomascook.in/foreign-exchange/buy-forex-online',
    );
  }

  renderItemComponent = data => (
    <TouchableOpacity
      style={{width: '100%'}}
      onPress={() => this.setData(data.item)}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Text
          numberOfLines={1}
          style={{
            padding: 5,
            fontWeight: 'bold',
            fontSize: 16,
            alignSelf: 'center',
          }}>
          {data.item.currencyName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20, backgroundColor: '#e4e5e5'}}>
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
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
            Currency Converter
          </Text>
        </View>
        <View>
          <ImageBackground
            source={
              this.state.background_image
                ? {uri: this.state.background_image}
                : require('../assets/images/bg_home1.png')
            }
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}
            imageStyle={styles.image1_imageStyle}>
            <View
              style={{
                backgroundColor: 'rgba(230,230,230,0.6)',
                width: '90%',
                marginTop: 30,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingBottom: 70,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.from}>Amount</Text>
              <View style={styles.group3}>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="Enter amount"
                  style={styles.enterAmount}
                  onChangeText={enterAmount => this.setState({enterAmount})}
                  value={this.state.enterAmount}
                />
              </View>
              <Text style={styles.from}>From</Text>
              <View style={styles.group}>
                <TouchableOpacity onPress={() => {}}>
                  <View style={styles.rect3}>
                    <Text style={styles.indianRupeeInr}>
                      Indian Rupees (INR)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.from}>To</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isModalVisible: true});
                }}>
                <View
                  style={{
                    width: 295,
                    height: 50,
                    justifyContent: 'center',
                    marginTop: 15,
                    borderWidth: 1,
                    borderColor: '#000000',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                  }}>
                  <Text style={styles.indianRupeeInr}>
                    {this.state.secondCountryName} {this.state.secondCountry}
                  </Text>
                  <EntypoIcon name="chevron-small-down" style={styles.icon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.group2}
                onPress={() => this.setResult()}>
                <View style={styles.rect5}>
                  <Text style={styles.convert}>CONVERT</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.rect6}>
                <Text style={styles.indianRupeeInr3}>
                  {this.state.secondCountry} {this.state.convertValue}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.group2}
                onPress={() => this.openWebURL()}>
                <View style={styles.rect5}>
                  <Text style={styles.convert}>BUY FOREX</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
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
              onDismiss={() => this.toggleModalVisibility()}
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
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      alignSelf: 'flex-start',
                      marginStart: 10,
                      marginTop: 5,
                      padding: 5,
                    }}
                    onPress={() => this.toggleModalVisibility()}>
                    <Image
                      source={require('../assets/images/back_arrow.png')}
                      resizeMode="contain"
                      style={{
                        width: 40,
                        height: 40,
                        alignSelf: 'flex-start',
                      }}
                    />
                  </TouchableOpacity>
                  <FlatList
                    data={this.state.currencyCountryNames}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.ItemSeparator}
                    contentContainerStyle={{padding: 20}}
                  />
                </ImageBackground>
              </View>
            </Modal>
          </View>,
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  group8: {
    width: 375,
    height: 812,
  },
  group7: {
    width: 375,
    height: 812,
  },

  image1_imageStyle: {},
  group6: {
    width: 331,
    height: 517,
    marginTop: 91,
    marginLeft: 22,
  },
  rect: {
    width: 331,
    height: 507,
    backgroundColor: 'rgba(230,230,230,0.6)',
    marginTop: 10,
  },
  group3: {
    width: 295,
    height: 40,
    marginTop: 10,
  },
  enterAmount: {
    color: '#121212',
    height: 40,
    width: 295,
    padding: 5,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  from: {
    color: '#121212',
    fontSize: 16,
    marginTop: 24,
    marginLeft: 40,
    alignSelf: 'flex-start',
  },
  group: {
    width: 295,
    height: 50,
    justifyContent: 'center',
    marginTop: 15,
  },
  rect3: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  image2: {
    width: 60,
    height: 35,
    alignSelf: 'center',
  },
  indianRupeeInr: {
    color: '#121212',
    fontSize: 16,
    marginLeft: 5,
    alignSelf: 'center',
  },
  icon: {
    color: 'rgba(128,128,128,1)',
    fontSize: 30,
    height: 30,
    width: 30,
    alignSelf: 'center',
    margin: 5,
  },
  image2Row: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  group2: {
    width: 140,
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
  },
  rect5: {
    width: 140,
    height: 40,
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convert: {
    color: 'rgba(255,255,255,1)',
    fontSize: 20,
    alignSelf: 'center',
  },
  group4: {
    width: 295,
    height: 45,
    marginTop: 29,
    marginLeft: 18,
  },
  rect6: {
    width: '80%',
    height: 50,
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  indianRupeeInr3: {
    color: '#121212',
    fontSize: 23,
    alignSelf: 'center',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
