import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_BACKGROUND_IMAGE,
  STORAGE_KEY_ACTIVE_DATA_KEY,
} from '../services/ConstantStorageKey';
import renderif from '../utility/renderif';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

export default class DayPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: 'All',
      datalist: [],
      visitDate: [],
      visitPlace: [],
      background_image: '',
    };
  }

  async componentDidMount() {
    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    let index_id = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_DATA_KEY);
    if (index_id == null) {
      index_id = 0;
    }
    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;
    const visitParseData = visitData.data[index_id].resREGFinal;

    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    if (visitParseData.length > 0) {
      let visitDateArray = [];
      visitDateArray.push({date: 'All'});
      let visitPlaceArray = [];
      for (let index = 0; index < visitParseData.length; index++) {
        Object.keys(visitParseData[index].daysActivity).forEach(days => {
          {
            Object.keys(visitParseData[index].daysActivity[days]).forEach(
              visit => {
                if (visit == 'Date') {
                  visitDateArray.push({
                    date: visitParseData[index].daysActivity[days].Date,
                  });
                } else {
                  visitPlaceArray.push({
                    place_name:
                      visitParseData[index].daysActivity[days][visit]
                        .place_name,
                    date: visitParseData[index].daysActivity[days].Date,
                    description:
                      visitParseData[index].daysActivity[days][visit]
                        .description,
                    timing:
                      visitParseData[index].daysActivity[days][visit].timing,
                    address:
                      visitParseData[index].daysActivity[days][visit].address,
                    img_url:
                      visitParseData[index].daysActivity[days][visit].img_url,
                    contact_no:
                      visitParseData[index].daysActivity[days][visit]
                        .contact_no,
                    ticket_prices:
                      visitParseData[index].daysActivity[days][visit]
                        .ticket_prices,
                    remark:
                      visitParseData[index].daysActivity[days][visit].remark,
                  });
                }
              },
            );
          }
        });
      }

      this.setState({visitDate: visitDateArray, visitPlace: visitPlaceArray});
      this.setState({datalist: visitPlaceArray});
      this.removeDuplicate();
    } else {
      Alert.alert('Sorry! no visit data found...');
    }
  }

  removeDuplicate() {
    //Remove duplicate from Arraylist
    const newArrayList = [];
    this.state.visitDate.forEach(obj => {
      if (!newArrayList.some(o => o.date === obj.date)) {
        newArrayList.push({...obj});
      }
    });

    this.setState({visitDate: newArrayList});
  }

  setDatalist = filterData => {
    this.setState({datalist: filterData});
  };

  setStatusFilter = status => {
    if (status !== 'All') {
      this.setDatalist([
        ...this.state.visitPlace.filter(e => e.date === status),
      ]);
    } else {
      this.setDatalist(this.state.visitPlace);
    }
    this.setState({date: status});
  };

  renderItemComponent = data => {
    return (
      <TouchableOpacity
        style={{backgroundColor: '#FFFFFF', margin: 5, borderRadius: 5}}
        onPress={() =>
          this.props.navigation.navigate('PlaceDetails', {
            place_details: data.item,
          })
        }>
        <View style={styles.itemContainer}>
          <Image
            source={require('../assets/images/location_dark_icon.png')}
            resizeMode="contain"
            style={styles.pin_image}
          />
          <View style={styles.location_details}>
            <Text numberOfLines={2} style={styles.title1}>
              {data.item.place_name}
            </Text>
            <Text style={styles.title2}>{data.item.date}</Text>
          </View>
          <View style={styles.image_container}>
            {renderif(data.item.img_url != '')(
              <Image
                source={{uri: data.item.img_url}}
                resizeMode="cover"
                style={styles.loc_image}></Image>,
            )}
          </View>
        </View>
      </TouchableOpacity>
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
            <View style={styles.header}>
              <View style={styles.header_container}>
                <TouchableOpacity style={styles.header_button}>
                  <Text style={styles.header_button_text}>Day Plan</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.header_container}>
                <TouchableOpacity
                  style={styles.header_button_active}
                  onPress={() => this.props.navigation.navigate('KnowMore')}>
                  <Text style={styles.header_button_text_active}>
                    Know More
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.scroll_container}>
              <Image
                source={require('../assets/images/leftarrow.png')}
                resizeMode="contain"
                style={styles.image3}
              />
              <View style={styles.listTab}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {this.state.visitDate.map((e, key) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.btnTab,
                        this.state.date === e.date && styles.btnTabActive,
                      ]}
                      onPress={() => this.setStatusFilter(e.date)}>
                      <Text
                        style={[
                          styles.textTab,
                          this.state.date === e.date && styles.textTabActive,
                        ]}>
                        {e.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Image
                source={require('../assets/images/rightarrow.png')}
                resizeMode="contain"
                style={styles.image3}
              />
            </View>

            <View style={styles.scrollArea2}>
              <FlatList
                data={this.state.datalist}
                renderItem={item => this.renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{paddingBottom: 400}}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image_imageStyle: {},
  header: {
    padding: 0,
    width: width,
    top: 10,
    height: '8%',
    flexDirection: 'row',
    zIndex: 100,
  },
  header_container: {
    width: '50%',
    height: 50,
    top: 10,
    alignItems: 'center',
  },
  header_button: {
    width: '90%',
    height: 45,
    padding: 2,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  header_button_active: {
    width: '90%',
    height: 45,
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 100,
    color: '#fff',
  },
  header_button_text: {
    textAlign: 'center',
    top: '20%',
    color: 'black',
    fontSize: 18,
  },
  header_button_text_active: {
    textAlign: 'center',
    top: '20%',
    color: '#fff',
    fontSize: 18,
  },
  scroll_container: {
    width: width,
    height: '8%',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    top: '5%',
    flexDirection: 'row',
  },
  scrollArea2: {
    width: width,
    height: '100%',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'column',
    marginTop: 30,
  },
  textTab: {
    fontSize: 16,
    color: '#000000',
    justifyContent: 'center',
    padding: 5,
  },
  textTabActive: {
    color: '#FFFFFF',
    fontSize: 16,
    justifyContent: 'center',
    padding: 5,
  },
  btnTab: {
    width: 100,
    height: 60,
    flexDirection: 'row',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    paddingTop: 2,
    borderTopWidth: 5,
    borderTopColor: '#9B9B9B',
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  btnTabActive: {
    backgroundColor: '#9B9B9B',
    borderTopColor: '#fff',
    width: 100,
    height: 60,
    flexDirection: 'row',
    borderRadius: 3,
    paddingTop: 2,
    borderTopWidth: 5,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  image3: {
    width: '5%',
    top: 10,
    marginLeft: '1%',
  },
  shadow: {
    width: width,
    height: 1,
    top: '4%',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  listTab: {
    height: 60,
    justifyContent: 'center',
    top: 5,
    width: '80%',
    marginLeft: 10,
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    width: width,
    height: 100,
    marginBottom: 10,
    flex: 1,
    elevation: 2,
  },
  pin_image: {
    height: 30,
    width: 30,
    marginLeft: '5%',
  },
  location_details: {
    width: '50%',
    marginLeft: '5%',
  },
  title1: {
    fontSize: 22,
  },
  title2: {
    fontSize: 18,
    color: 'grey',
    padding: 10,
  },
  image_container: {
    width: '20%',
    marginLeft: '5%',
  },
  loc_image: {
    marginLeft: '5%',
    width: 70,
    height: 70,
    borderRadius: 100,
  },
});
