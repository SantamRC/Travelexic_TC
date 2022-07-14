import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
var global_style = require('./components/style');
import DropDownPicker from 'react-native-custom-dropdown';
import {
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';
import {getExhibitor, nonceDriver} from '../services/ConstantURLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

export default class TourSpeaker extends Component {
  constructor() {
    super();
    this.state = {
      order_id: '',
      exibitorData: [],
      exibitorDataFilters: [],
      categories: [],
      background_image: '',
    };
  }
  async componentDidMount() {
    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({order_id: order_id_key});
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    this.getExhibitorService();
  }

  async getExhibitorService() {
    let formData = new FormData();
    formData.append('booking_id', this.state.order_id);
    formData.append('nonce', nonceDriver);

    let exhibitorArray = [];
    let categoriesArray = [];

    fetch(getExhibitor, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/form-data', // <-- Specifying the Content-Type
      }),
      body: formData, // <-- Post parameters
    })
      .then(response => response.json())
      .then(responseText => {
        if (responseText.status == 'success') {
          for (
            let index = 0;
            index < responseText.data.exhibitors.length;
            index++
          ) {
            exhibitorArray.push({
              id: responseText.data.exhibitors[index].id,
              name: responseText.data.exhibitors[index].name,
              description: responseText.data.exhibitors[index].description,
              contact: responseText.data.exhibitors[index].contact,
              address: responseText.data.exhibitors[index].address,
              website: responseText.data.exhibitors[index].website,
              logo: responseText.data.exhibitors[index].logo,
              category: responseText.data.exhibitors[index].category,
              interest_status:
                responseText.data.exhibitors[index].interest_status,
            });

            categoriesArray.push({
              label: responseText.data.exhibitors[index].category,
              value: responseText.data.exhibitors[index].category,
            });
          }
          this.setState({
            exibitorData: exhibitorArray,
            categories: categoriesArray,
            exibitorDataFilters: exhibitorArray,
          });
          this.removeDuplicate();
        } else {
          alert('Sorry! no exhibor data found...');
        }
      })
      .catch(error => {});
  }

  setDatalist = filterData => {
    this.setState({exibitorDataFilters: filterData});
  };

  setStatusFilter = categoryName => {
    this.setState({
      category: categoryName,
    });
    this.setDatalist([
      ...this.state.exibitorData.filter(e => e.category === categoryName),
    ]);
  };

  removeDuplicate() {
    //Remove duplicate from Arraylist
    const newArrayList = [];
    this.state.categories.forEach(obj => {
      if (!newArrayList.some(o => o.label === obj.label)) {
        newArrayList.push({...obj});
      }
    });

    this.setState({categories: newArrayList});
  }

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
  renderItemComponent = data => {
    return (
      <View style={styles.rect2}>
        <Image
          source={{uri: data.item.logo}}
          resizeMode="contain"
          style={styles.image}></Image>

        <Text style={styles.visharth}>{data.item.name}</Text>
        <Text style={styles.corporate}>{data.item.category}</Text>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TourSpeakerDetail', {
              exhibitor_details: data.item,
              exhibitorArray: this.state.exibitorData,
            })
          }>
          <View>
            <Text style={styles.showInterest}>Show</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
          <DropDownPicker
            items={this.state.categories}
            placeholder="Filter"
            arrowSize={15}
            showArrow={false}
            containerStyle={{
              height: 50,
              marginTop: 50,
              width: width - 50,
              marginLeft: 25,
              marginBottom: 20,
            }}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => this.setStatusFilter(item.value)}
          />

          <View style={styles.scrollArea}>
            <FlatList
              data={this.state.exibitorDataFilters}
              renderItem={item => this.renderItemComponent(item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.ItemSeparator}
              onRefresh={this.handleRefresh}
              numColumns={2}
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
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 250,
  },
  rect2: {
    width: '45%',
    height: 'auto',
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 30,
    shadowOpacity: 1,
    shadowRadius: 10,
    borderRadius: 10,
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  image: {
    width: '80%',
    height: '40%',
    marginTop: 10,
    marginLeft: '10%',
    borderWidth: 1,
  },
  visharth: {
    color: '#121212',
    height: 'auto',
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
  },
  corporate: {
    color: 'rgba(155,155,155,1)',
    fontSize: 14,
    height: 'auto',
    width: '100%',
    textAlign: 'center',
  },

  showInterest: {
    color: '#121212',
    height: 40,
    width: '85%',
    textAlign: 'center',
    fontSize: 22,
    marginLeft: '7.5%',
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: 'rgb(255,193,7)',
    marginTop: 10,
  },

  rect2Row: {
    height: 220,
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
  },
});
