import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Platform} from 'react-native';
import renderif from '../utility/renderif';
import WebView from 'react-native-webview';

const {width, height} = Dimensions.get('window');

export default class PlaceDetails extends Component {
  openGoogleMap = (lat, long, placeName) => {
    const url = Platform.select({
      ios: 'maps:' + lat + ',' + long + '?q=' + placeName,
      android: 'geo:' + lat + ',' + long + '?q=' + placeName,
    });
    Linking.openURL(url);
  };

  render() {
    const place_details = this.props.route.params.place_details;
    console.log('Details: ', ' / ' + JSON.stringify(place_details));
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <View style={styles.imageStack}>
          <ImageBackground
            source={{uri: place_details.img_url}}
            resizeMode="cover"
            style={styles.image}
            imageStyle={styles.image_imageStyle}
          />
          <View style={styles.scrollArea}>
            <ScrollView
              vertical={true}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              showsVerticalScrollIndicator={false}>
              <View style={styles.rect}>
                <View style={styles.image2ColumnRow}>
                  <View style={styles.image2Column}>
                    <Image
                      source={{uri: place_details.img_url}}
                      resizeMode="cover"
                      style={styles.image2}
                    />
                  </View>
                  <View style={styles.manuTempleColumn}>
                    <Text style={styles.manuTemple}>
                      {place_details.place_name}
                    </Text>
                    <Text
                      numberOfLines={3}
                      style={{
                        color: '#000000',
                        width: '80%',
                        fontSize: 14,
                      }}>
                      {place_details.address}
                    </Text>
                  </View>
                </View>
                <View style={styles.container_3}>
                  {renderif(
                    place_details.place_name != '' ||
                      place_details.place_name != null,
                  )(
                    <TouchableOpacity
                      style={styles.loc_section}
                      onPress={() =>
                        this.openGoogleMap(
                          place_details.latitude,
                          place_details.longitude,
                          place_details.place_name,
                        )
                      }>
                      <EntypoIcon name="location-pin" style={styles.icon_1} />
                      <Text style={styles.icon_text}>Location</Text>
                    </TouchableOpacity>,
                  )}

                  {renderif(
                    place_details.contact_no != '' ||
                      place_details.contact_no != null,
                  )(
                    <TouchableOpacity
                      style={styles.call_section}
                      onPress={() => {
                        Linking.openURL(
                          'tel:${' + place_details.contact_no + '}',
                        );
                      }}>
                      <IoniconsIcon name="ios-call" style={styles.icon_1} />
                      <Text style={styles.icon_text}>Call</Text>
                    </TouchableOpacity>,
                  )}

                  <View style={styles.time_section}>
                    <Text style={styles.time_text}>{place_details.timing}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rect2}>
                <Text style={styles.details}>Remark</Text>
                <Text
                  style={{
                    color: '#121212',
                    height: 'auto',
                    width: '100%',
                    fontSize: 15,
                    paddingLeft: '5%',
                    textAlign: 'left',
                  }}>
                  {place_details.remark}
                </Text>
              </View>
              <View style={styles.rect2}>
                <Text style={styles.details}>Description</Text>
                <WebView
                  useWebKit={true}
                  style={{height: 250}}
                  originWhitelist={['*']}
                  automaticallyAdjustContentInsets={false}
                  source={{
                    html:
                      '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
                      place_details.description +
                      '</body></html>',
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
  },
  image: {
    width: width,
    height: 300,
    position: 'absolute',
  },
  container2: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: 'blue',
  },
  image_imageStyle: {},
  iconback: {
    color: '#E6E6E6',
    fontSize: 40,

    width: '80%',
    marginTop: '10%',
    marginLeft: '5%',
  },
  scrollArea: {
    top: '35%',
    left: '5%',
    width: '90%',
    height: 'auto',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'column',
  },
  scrollArea_contentContainerStyle: {
    width: '100%',
    paddingBottom: 300,
  },
  rect: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    overflow: 'visible',
    paddingBottom: 10,
  },
  rect_1: {
    width: width,
    height: 50,
  },
  image2: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  image2Column: {
    width: '30%',
    height: 130,
    marginBottom: 5,
    alignItems: 'center',
  },
  manuTemple: {
    color: '#121212',
    width: '80%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  manuTempleColumn: {
    width: '70%',
    marginLeft: 0,
  },
  image2ColumnRow: {
    height: 50,
    flexDirection: 'row',
    marginTop: '2%',
    marginLeft: '2%',
    marginRight: 6,
  },
  icon2: {
    color: '#4A90E2',
    fontSize: 40,
    width: '20%',
    marginTop: '15%',
    textAlign: 'center',
    borderWidth: 1,
  },
  location: {
    color: 'rgba(113,113,113,1)',

    width: '20%',
    fontSize: 14,
    marginTop: '0%',
    textAlign: 'center',
    borderWidth: 1,
  },
  rect2: {
    width: '100%',

    backgroundColor: '#ffffff',
    borderRadius: 5,
    overflow: 'visible',
    marginTop: '5%',
    paddingBottom: '5%',
  },
  imageStack: {
    width: width,
    height: height,
    borderWidth: 1,
  },
  container_3: {
    width: 'auto',
    height: 'auto',
    marginTop: '10%',
    paddingBottom: 5,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  loc_section: {
    width: '18%',
    height: 'auto',
  },
  call_section: {
    width: '15%',
    height: 'auto',
    marginEnd: 10,
  },
  time_section: {
    width: 150,
    padding: 5,
    marginStart: 5,
    marginEnd: 45,
    marginTop: 20,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 100,
  },
  time_text: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 5,
  },
  icon_1: {
    color: '#000000',
    fontSize: 30,
    textAlign: 'center',
  },
  icon_text: {
    color: '#121212',
    height: 15,
    width: '100%',
    textAlign: 'center',
  },
  details: {
    color: '#121212',
    height: 45,
    width: '100%',
    fontSize: 22,
    paddingLeft: '5%',
    paddingTop: '5%',
    textAlign: 'left',
    fontWeight: '700',
  },
  text: {
    color: '#121212',
    fontSize: 15,
    width: '100%',
    paddingLeft: '5%',
    textAlign: 'left',
    paddingRight: '5%',
  },
  rect3: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'visible',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    paddingLeft: 10,
    paddingEnd: 10,
  },
  rect3_1: {
    width: '17%',
    height: '100%',
    marginLeft: '5%',
    fontSize: 20,
    alignSelf: 'center',
  },
  rect3_2: {
    width: '8%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  rect3_3: {
    width: '75%',
    height: '100%',
    fontSize: 20,
    alignSelf: 'center',
  },
});
