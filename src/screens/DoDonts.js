import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';

var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from '../services/ConstantStorageKey';

class DoDont extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}>
          <Text style={styles.headerText}>{this.props.item.category_name}</Text>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {this.props.item.subcategory.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() => alert('Id: ' + item.id + ' val: ' + item.val)}>
              <Text style={styles.text}>
                <Image
                  source={require('../assets/images/arrow_do.png')}
                  resizeMode="contain"
                  style={styles.image3}></Image>{' '}
                {item.val}
              </Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

export default class DoDonts extends Component {
  //Main View defined under this Class
  constructor() {
    super();
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {listDataSource: [], background_image: ''};
  }

  async componentDidMount() {
    const visitDataJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY,
    );
    const visitData = visitDataJSON != null ? JSON.parse(visitDataJSON) : null;
    const visitParseData = visitData.data[0].resREGFinal;

    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    let CONTENT = [];

    if (visitParseData.length > 0) {
      for (let index = 0; index < visitParseData.length; index++) {
        let splitData = visitParseData[index].dos_and_donts.split('|');
        let subcategory = [];
        for (let index = 0; index < splitData.length; index++) {
          subcategory.push({
            id: index,
            val: splitData[index],
          });
        }
        CONTENT.push({
          isExpanded: false,
          category_name: visitParseData[index].location,
          subcategory: subcategory,
        });
      }

      this.setState({listDataSource: CONTENT});
    }
  }

  updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <ImageBackground
          source={
            this.state.background_image
              ? {uri: this.state.background_image}
              : require('../assets/images/bg_home1.png')
          }
          resizeMode="cover"
          style={global_style.bg_image}
          imageStyle={styles.image_imageStyle}>
          <View style={styles.container2}>
            <ScrollView>
              {this.state.listDataSource.map((item, key) => (
                <DoDont
                  key={item.category_name}
                  onClickFunction={this.updateLayout.bind(this, key)}
                  item={item}
                />
              ))}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F5FCFF',
  },
  container2: {
    width: width,
    height: height - 150,
    backgroundColor: '#E6E6E6',
    margin: 10,
    alignSelf: 'center',
  },
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#E6E6E6',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E6E6E6',
    width: '100%',

    borderWidth: 0.5,
    borderColor: 'gray',
  },
  text: {
    fontSize: 16,
    color: 'black',
    padding: 10,
    fontWeight: '400',
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#E6E6E6',
  },
  image3: {
    width: 12,
    height: 12,
  },
  image_imageStyle: {},
});
