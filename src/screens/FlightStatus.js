import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';
import {getFlightstatsbyID} from '../services/ConstantURLS';
import {
  convertDateInFlight,
  convertDateInFlightDate,
  convertTimeInFlight,
} from '../utility/Common';
import {STORAGE_KEY_BACKGROUND_IMAGE} from '../services/ConstantStorageKey';
var global_style = require('./components/style');
const {width, height} = Dimensions.get('window');

export default class FlightStatus extends Component {
  constructor() {
    super();
    this.state = {
      flightno: '',
      date: '',
      airport: '',
      arrcity: '',
      flightStatusResponse: '',
      departureDate: '',
      arrivalDate: '',
      res_dep_cityName: '',
      res_dep_countryCode: '',
      res_dep_air_name: '',
      res_dep_ter: '',
      res_dep_gate: '',
      res_dep_timeZoneRegionName: '',
      res_air_cityName: '',
      res_air_countryCode: '',
      res_air_air_name: '',
      res_air_ter: '',
      res_air_gate: '',
      res_air_timeZoneRegionName: '',
      baggage: '',
      estimatedGateDeparture: '',
      scheduledGateDeparture: '',
      actualGateDeparture: '',
      estimatedGateArrival: '',
      background_image: '',
    };

    // const flight_status = this.props.route.params.flight_status;
    // console.log("flight_status123: ", " / " + JSON.stringify(flight_status));
  }

  getDifferenceDate(type) {
    let value1, value2, differenceTime;
    if (type == 1) {
      value1 = this.state.actualGateDeparture;
      value2 = this.state.scheduledGateDeparture;
    } else if (type == 2) {
      value1 = this.state.estimatedGateArrival;
      value2 = this.state.arrivalDate;
    }

    let status = 'ON-Time';
    var date1 = new Date(value1);
    var date2 = new Date(value2);
    if (date1.getTime() === date2.getTime()) {
      status = 'ON-Time';
    } else if (date1.getTime() > date2.getTime()) {
      status = 'Delayed';
    } else if (date1.getTime() < date2.getTime()) {
      status = 'ON-Time';
    }

    // var diff = Math.floor(date2.getTime() - date1.getTime());
    // console.log("differenceTime: ", " / " + diff);
    // var day = 1000 * 60 * 60 * 24;

    // var days = Math.floor(diff / day);
    // var months = Math.floor(days / 31);
    // var years = Math.floor(months / 12);
    // differenceTime = days + " Days" + months + " months" + years + " years";
    // console.log("differenceTime: ", " / " + differenceTime);
    return status;
  }

  async componentDidMount() {
    console.log('componentDidMount', 'componentDidMount');
    // let date = "2021-03-15T03:18:00.000Z";
    // convertDateInFlight(date);
    // this.getDifferenceDate();
    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });
    // this.getFlightStatus();
  }

  async getFlightStatus(flight_status) {
    //const flightData = convertDateInFlightDate(flight_status.flt_date);
    console.log(
      'FlightStatus: ',
      ' / ' +
        getFlightstatsbyID +
        '?arrcity=' +
        flight_status.flt_arrcity +
        '&airport=' +
        flight_status.flt_dep +
        '&flightno=' +
        flight_status.flt_no +
        '&nonce=' +
        '173648APz6zQ2jaa^CKIB9rSStjPWgo!NZnPYCKl59b2380d' +
        '&date=' +
        flight_status.flt_date,
    );
    fetch(
      getFlightstatsbyID +
        '?arrcity=' +
        flight_status.flt_arrcity +
        '&airport=' +
        flight_status.flt_dep +
        '&flightno=' +
        flight_status.flt_no +
        '&nonce=' +
        '173648APz6zQ2jaa^CKIB9rSStjPWgo!NZnPYCKl59b2380d' +
        '&date=' +
        flight_status.flt_date, // <-- Post parameters,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json', // <-- Specifying the Content-Type
        }),
      },
    )
      .then(response => response.json())
      .then(responseText => {
        console.log('FlightStatus: ', ' / ' + JSON.stringify(responseText));
        if (responseText.status == '200') {
          this.setState({flightStatusResponse: responseText});
          this.setState({
            departureDate: responseText.scheduledGateDeparture.dateLocal,
            arrivalDate: responseText.scheduledGateArrival.dateLocal,
            res_dep_cityName: responseText.AirportDeparture.city,
            res_dep_air_name: responseText.AirportDeparture.name,
            res_dep_countryCode: responseText.AirportDeparture.countryCode,
            res_dep_timeZoneRegionName:
              responseText.AirportDeparture.timeZoneRegionName,
            res_air_cityName: responseText.AirportArrival.city,
            res_air_air_name: responseText.AirportArrival.name,
            rest_air_countryCode: responseText.AirportArrival.countryCode,
            res_air_timeZoneRegionName:
              responseText.AirportArrival.timeZoneRegionName,
            scheduledGateDeparture:
              responseText.scheduledGateDeparture.dateLocal,
          });

          if (
            responseText.airportResources.hasOwnProperty('departureTerminal')
          ) {
            this.setState({
              res_dep_ter: responseText.airportResources.departureTerminal,
            });
          } else {
            this.setState({
              res_dep_ter: 'N/A',
            });
          }
          if (responseText.airportResources.hasOwnProperty('arrivalTerminal')) {
            this.setState({
              res_air_ter: responseText.airportResources.arrivalTerminal,
            });
          } else {
            this.setState({
              res_air_ter: 'N/A',
            });
          }
          if (responseText.airportResources.hasOwnProperty('departureGate')) {
            this.setState({
              res_dep_gate: responseText.airportResources.departureGate,
            });
          } else {
            this.setState({
              res_dep_gate: 'N/A',
            });
          }
          if (responseText.airportResources.hasOwnProperty('arrivalGate')) {
            this.setState({
              res_air_gate: responseText.airportResources.arrivalGate,
            });
          } else {
            this.setState({
              res_air_gate: 'N/A',
            });
          }
          if (responseText.airportResources.hasOwnProperty('baggage')) {
            this.setState({
              baggage: responseText.airportResources.baggage,
            });
          } else {
            this.setState({
              baggage: 'N/A',
            });
          }

          if (responseText.actualGateDeparture.hasOwnProperty('dateLocal')) {
            this.setState({
              actualGateDeparture: responseText.actualGateDeparture.dateLocal,
            });
          }
          if (responseText.estimatedGateDeparture.hasOwnProperty('dateLocal')) {
            this.setState({
              estimatedGateDeparture:
                responseText.estimatedGateDeparture.dateLocal,
            });
          }
          if (responseText.estimatedGateArrival.hasOwnProperty('dateLocal')) {
            this.setState({
              estimatedGateArrival: responseText.estimatedGateArrival.dateLocal,
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.flightStatusResponse == '') {
      const flight_status = this.props.route.params.flight_status;
      this.getFlightStatus(flight_status);
    }
    return (
      <View style={{flex: 1, backgroundColor: '#e4e5e5'}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#fff"
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
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}>
              <View style={styles.image2Stack}>
                <ImageBackground
                  source={require('../assets/images/bg_flight.png')}
                  resizeMode="stretch"
                  style={styles.image2}
                  imageStyle={styles.image2_imageStyle}>
                  <View style={styles.rectStack}>
                    <View style={styles.rect}>
                      <Text style={styles.ai111}>
                        (
                        {this.state.flightStatusResponse.carrierFsCode +
                          '-' +
                          this.state.flightStatusResponse.flightNumber}
                        )
                      </Text>
                    </View>
                    <Text style={styles.airIndia}>
                      {this.state.flightStatusResponse.airline_name}
                    </Text>
                  </View>
                  <View style={styles.rect2}>
                    <View style={styles.rect3Row}>
                      <View style={styles.rect3}>
                        <Text style={styles.from}>From</Text>
                      </View>
                      <View style={styles.rect4}>
                        <Text style={styles.to}>To</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.rect5Stack}>
                    <View style={styles.loc}>
                      <Text style={styles.loc_name}>
                        {this.state.flightStatusResponse.departureAirportFsCode}
                      </Text>
                    </View>
                    <View style={styles.loc_image}>
                      <Image
                        source={require('../assets/images/flighticon.png')}
                        resizeMode="contain"
                        style={styles.image4}></Image>
                    </View>
                    <View style={styles.loc}>
                      <Text style={styles.loc_name2}>
                        {this.state.flightStatusResponse.arrivalAirportFsCode}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
                <Image
                  source={require('../assets/images/strip_flight_green.png')}
                  resizeMode="contain"
                  style={styles.image3}></Image>
                <Text style={styles.statusOnTime}>Status- On Time</Text>
              </View>
              <ImageBackground
                source={require('../assets/images/bg_flight_first.png')}
                resizeMode="contain"
                style={styles.image5}
                imageStyle={styles.image5_imageStyle}>
                <View style={styles.loremIpsumStack}>
                  <Text style={styles.loremIpsum}>
                    {convertDateInFlight(this.state.departureDate)}
                  </Text>
                  <Text style={styles.departure}>Departure</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require('../assets/images/bg_flight_green_top.png')}
                resizeMode="contain"
                style={styles.image6}
                imageStyle={styles.image5_imageStyle}>
                <View style={styles.dep_details}>
                  <Text style={styles.dep_details1}>
                    {this.state.flightStatusResponse.departureAirportFsCode +
                      '-' +
                      this.state.res_dep_cityName +
                      ',' +
                      this.state.rest_air_countryCode}
                  </Text>
                  <Text numberOfLines={1} style={styles.dep_details1}>
                    {this.state.res_dep_air_name}
                  </Text>
                </View>
                <View style={styles.dep_details2}>
                  <View style={styles.dep_details2_1}>
                    <Text style={styles.dep_details2_1_text}>
                      {this.getDifferenceDate(1)}
                    </Text>
                    <Text style={styles.dep_details2_1_text2}>Terminal</Text>
                  </View>
                  <View style={styles.dep_details2_2}>
                    <Text style={styles.dep_details2_2_text}>
                      {convertTimeInFlight(this.state.departureDate)}
                    </Text>
                    <Text style={styles.dep_details2_2_text2}>
                      {this.state.res_dep_ter}
                    </Text>
                  </View>
                  <View style={styles.dep_details2_3}>
                    <Text style={styles.dep_details2_3_text}>IST</Text>
                    <Text style={styles.dep_details2_3_text2}>Baggage N/A</Text>
                  </View>
                </View>
              </ImageBackground>

              <ImageBackground
                source={require('../assets/images/bg_flight_third.png')}
                resizeMode="contain"
                style={styles.image10}
                imageStyle={styles.image5_imageStyle}>
                <View style={styles.loremIpsumStack}>
                  <Text style={styles.loremIpsum}>
                    {convertDateInFlight(this.state.arrivalDate)}
                  </Text>
                  <Text style={styles.departure}>Arrival</Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require('../assets/images/bg_flight_fourth.png')}
                resizeMode="contain"
                style={styles.image6}
                imageStyle={styles.image5_imageStyle}>
                <View style={styles.dep_details}>
                  <Text style={styles.dep_details1}>
                    {this.state.flightStatusResponse.arrivalAirportFsCode +
                      '-' +
                      this.state.res_air_cityName +
                      ',' +
                      this.state.rest_air_countryCode}
                  </Text>
                  <Text numberOfLines={1} style={styles.dep_details1}>
                    {this.state.res_air_air_name}
                  </Text>
                </View>
                <View style={styles.dep_details2}>
                  <View style={styles.dep_details2_1}>
                    <Text style={styles.dep_details2_1_text}>
                      {this.getDifferenceDate(2)}
                    </Text>
                    <Text style={styles.dep_details2_1_text2}>Terminal</Text>
                  </View>
                  <View style={styles.dep_details2_2}>
                    <Text style={styles.dep_details2_2_text}>
                      {convertTimeInFlight(this.state.arrivalDate)}
                    </Text>
                    <Text style={styles.dep_details2_2_text2}>
                      {this.state.res_air_ter}
                    </Text>
                  </View>
                  <View style={styles.dep_details2_3}>
                    <Text style={styles.dep_details2_3_text}>IST</Text>
                    <Text style={styles.dep_details2_3_text2}>Baggage N/A</Text>
                  </View>
                </View>
              </ImageBackground>
            </ScrollView>
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
    paddingBottom: 200,
  },
  image2: {
    top: 0,
    position: 'absolute',
    width: width - 10,
    height: 160,
  },
  image2_imageStyle: {},
  rect: {
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  ai111: {
    color: 'rgba(255,255,255,1)',
    height: 'auto',
    width: '100%',
    fontSize: 16,
    textAlign: 'left',
    marginTop: '20%',
    paddingLeft: '10%',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  airIndia: {
    paddingTop: '5%',
    left: 0,
    position: 'absolute',
    color: 'rgba(255,255,255,1)',
    height: 'auto',
    width: '100%',
    textAlign: 'left',
    fontSize: 22,
    paddingLeft: '10%',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  rectStack: {
    width: '50%',
    height: '50%',
  },
  rect5: {
    top: 0,
    left: 1,
    width: '100%',
    height: 'auto',
    position: 'absolute',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'blue',
  },
  rect5Stack: {
    width: '100%',
    height: '35%',
    marginTop: '5%',

    flexDirection: 'row',
  },
  image3: {
    width: '50%',
    position: 'absolute',
    top: '0%',
    right: '0%',
  },
  statusOnTime: {
    width: '45%',
    position: 'absolute',
    top: '15%',
    right: '0%',
    color: 'rgba(255,255,255,1)',
    fontSize: 18,
    paddingLeft: '5%',
  },
  rect2: {
    top: '50%',
    left: 1,
    width: 400,
    height: 20,
    position: 'absolute',
    flexDirection: 'row',
  },
  rect3: {
    width: '50%',
  },
  from: {
    color: 'rgba(255,255,255,1)',
    width: '100%',
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: '10%',
  },
  rect4: {
    width: '50%',
  },
  to: {
    color: 'rgba(255,255,255,1)',
    width: '100%',
    fontSize: 20,
    textAlign: 'right',
    paddingRight: '40%',
  },
  rect3Row: {
    flexDirection: 'row',
    flex: 1,
  },
  image2Stack: {
    width: width - 10,
    height: 120,
    marginTop: '10%',
    marginLeft: 5,
  },
  loc: {
    width: '25%',
  },
  loc_image: {
    width: '50%',
  },
  loc_name: {
    color: '#fff',
    fontSize: 34,
    textAlign: 'center',
  },
  loc_name2: {
    color: '#fff',
    fontSize: 34,
  },
  image4: {
    borderWidth: 1,
    width: '100%',
    marginTop: 5,
  },
  image5: {
    width: width - 10,
    height: 31,
    marginTop: '15%',
    left: 5,
  },
  image10: {
    width: width - 10,
    height: 31,
    marginTop: '2%',
    left: 5,
  },
  image5_imageStyle: {},
  loremIpsum: {
    color: 'rgba(255,255,255,1)',
    width: '65%',
    height: 22,
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    textAlign: 'right',
    fontSize: 18,
  },
  departure: {
    color: 'rgba(255,255,255,1)',
    width: '40%',
    height: 22,
    position: 'absolute',
    bottom: '0%',
    left: '3%',
    textAlign: 'left',
    fontSize: 18,

    paddingLeft: '5%',
  },
  loremIpsumStack: {
    width: 331,
    height: 21,
    marginTop: 4,
    marginLeft: 20,
  },
  image6: {
    width: width,
    height: 155,
  },
  dep_details: {
    width: '90%',
    paddingTop: 10,
    marginLeft: '10%',
    position: 'absolute',
  },
  dep_details1: {
    fontSize: 20,
    color: '#fff',
  },
  dep_details2: {
    width: '90%',
    top: '40%',
    height: 'auto',
    marginLeft: '5%',
    position: 'absolute',
  },
  dep_details2_1: {
    height: 20,
    flexDirection: 'row',
  },
  dep_details2_1_text: {
    width: '50%',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    paddingRight: '5%',
  },
  dep_details2_1_text2: {
    paddingRight: '5%',
    width: '50%',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  dep_details2_2: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    marginLeft: '2%',
  },
  dep_details2_2_text: {
    width: '50%',
    textAlign: 'center',
    fontSize: 25,
    color: '#fff',
  },
  dep_details2_2_text2: {
    width: '50%',
    textAlign: 'center',
    fontSize: 25,
    color: '#fff',
  },
  dep_details2_2_text_1: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'blue',
  },
  dep_details2_3: {
    width: '90%',
    height: 'auto',
    marginLeft: '5%',
    flexDirection: 'row',
  },
  dep_details2_3_text: {
    width: '30%',
    color: 'white',
    textAlign: 'right',
    fontSize: 20,
    paddingRight: '5%',
  },
  dep_details2_3_text2: {
    width: '70%',
    color: 'white',
    textAlign: 'right',
    fontSize: 20,
    paddingRight: '5%',
  },
});
