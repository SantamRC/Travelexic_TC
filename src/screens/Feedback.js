import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  YellowBox,
} from "react-native";
import renderIf from "../utility/renderif";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_KEY_MAIN_ITINERARY,
  STORAGE_KEY_ORDERID_key,
  STORAGE_KEY_userid_key,
  STORAGE_KEY_userProfiling_key,
  STORAGE_KEY_BACKGROUND_IMAGE,
} from "../services/ConstantStorageKey";
import { getreviewandratingURL } from "../services/ConstantURLS";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { currentDate } from "../utility/Common";
var global_style = require("./components/style");
const { width, height } = Dimensions.get("window");

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      traveller_id: "",
      booking_id: "",
      nonce: "",
      reviewTitle: "",
      reviewkey: "",
      reviewDesc: "",
      rating: "",
      reviewID: "",
      hotelData: [],
      driver_id: "",
      userName: "",
      driver_review_descrip: "",
      trip_review_descrip: "",
      app_review_descrip: "",
      hotel_review_descrip: "",
      isDriverRating: true,
      isTripRating: true,
      isAppRating: true,
      isDriverGood: true,
      isDriverBad: true,
      isDriverAvrg: true,
      isTripGood: true,
      isTripBad: true,
      isTripAvrg: true,
      isAppGood: true,
      isAppBad: true,
      isAppAvrg: true,
      background_image: "",
    };
  }

  async componentDidMount() {
    YellowBox.ignoreWarnings(["VirtualizedLists should never be nested"]);

    const back_image = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);
    this.setState({
      background_image: back_image,
    });

    const userProfileData = await AsyncStorage.getItem(
      STORAGE_KEY_userProfiling_key
    );
    const userData =
      userProfileData != null ? JSON.parse(userProfileData) : null;

    if (userData != null) {
      this.setState({ userName: userData.full_name });
    }

    this.setState({ date: currentDate() });

    const user_id_key = await AsyncStorage.getItem(STORAGE_KEY_userid_key);
    this.setState({ traveller_id: user_id_key });
    const order_id_key = await AsyncStorage.getItem(STORAGE_KEY_ORDERID_key);
    this.setState({ booking_id: order_id_key });
    const visitDateJSON = await AsyncStorage.getItem(
      STORAGE_KEY_MAIN_ITINERARY
    );

    const visitData = visitDateJSON != null ? JSON.parse(visitDateJSON) : null;

    const visitParseData = visitData.data[0].resREGFinal;

    this.setState({ driver_id: visitData.data[0].SelectedCar.DriverID });

    let hotelArray = [];

    if (visitParseData.length > 0) {
      for (let index = 0; index < visitParseData.length; index++) {
        hotelArray.push({
          id: index,
          hotel_id: visitDateJSON[index].hotelID,
          hotel_name: visitParseData[index].hotel_name,
          hote_image: visitParseData[index].hotel_image,
          isHotelGood: 1,
          isHotelAvrg: 1,
          isHotelBad: 1,
        });
      }

      this.setState({ hotelData: hotelArray });
    }
  }

  async sendRatingToServer() {
    let forData = new FormData();
    forData.append("date", this.state.date);
    forData.append("traveller_id", this.state.traveller_id);
    forData.append("booking_id", this.state.booking_id);
    forData.append("nonce", this.state.nonce);
    forData.append("reviewTitle", this.state.reviewTitle);
    forData.append("reviewkey", this.state.reviewkey);
    forData.append("reviewDesc", this.state.reviewDesc);
    forData.append("rating", this.state.rating);
    forData.append("reviewID", this.state.reviewID);

    fetch(getreviewandratingURL, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "multipart/form-data", // <-- Specifying the Content-Type
      }),
      body: formDate, // <-- Post parameters
    })
      .then((response) => response.json())
      .then((responseText) => {
        if (responseText.status == "success") {
          alert(
            "Thank you for sharing your feedback with us. The same will be forwarded to your travel agent"
          );
        } else {
          alert("Thanks you already give us ratings");
        }
      })
      .catch((error) => {});
  }

  renderItemComponent = (data) => {
    return (
      <View style={styles.rect4}>
        <View style={styles.image2Row}>
          <Image
            source={{ uri: data.item.hote_image }}
            resizeMode="cover"
            style={styles.image2}
          />
          <View style={styles.rect5}>
            <Text style={styles.goldenAppleCottage}>
              {data.item.hotel_name}
            </Text>
            <Text style={styles.loremIpsum2}>Please rate your hotel.</Text>
          </View>
        </View>

        <View style={styles.rect6}>
          <TouchableOpacity
            style={styles.rect6_box}
            onPress={() => this.HotelRating(0, data.item.id)}
          >
            <Image
              source={
                data.item.isHotelGood
                  ? require("../assets/images/smile_white_four.png")
                  : require("../assets/images/smile_blue_four.png")
              }
              resizeMode="contain"
              style={styles.image2_smiley}
            ></Image>
            <Text style={styles.rating}>Good</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rect6_box}
            onPress={() => this.HotelRating(1, data.item.id)}
          >
            <Image
              source={
                data.item.isHotelAvrg
                  ? require("../assets/images/smile_white_three.png")
                  : require("../assets/images/smile_blue_three.png")
              }
              resizeMode="contain"
              style={styles.image2_smiley}
            ></Image>
            <Text style={styles.rating}>Average</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rect6_box}
            onPress={() => this.HotelRating(2, data.item.id)}
          >
            <Image
              source={
                data.item.isHotelBad
                  ? require("../assets/images/smile_white_one.png")
                  : require("../assets/images/smile_blue_one.png")
              }
              resizeMode="contain"
              style={styles.image2_smiley}
            ></Image>
            <Text style={styles.rating}>Bad</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  HotelRating(type, id) {
    console.log("id: ", " / " + JSON.stringify(id));
    if (this.state.hotelData.length > 0) {
      var singleHotelArray = this.state.hotelData;
      for (let index = 0; index < singleHotelArray.length; index++) {
        if (singleHotelArray[index].id == id) {
          if (type == 0) {
            singleHotelArray[index].isDriverGood = type;
            singleHotelArray[index].isDriverAvrg = 1;
            singleHotelArray[index].isDriverBad = 1;
            this.setState({
              reviewTitle: "Hotel Rating",
              reviewkey: "hotel",
              reviewDesc: "",
              rating: "5",
              reviewID: this.state.driver_id,
            });
            this.sendRatingToServer();
          } else if (type == 1) {
            singleHotelArray[index].isDriverGood = 1;
            singleHotelArray[index].isDriverAvrg = type;
            singleHotelArray[index].isDriverBad = 1;
            this.setState({
              reviewTitle: "Hotel Rating",
              reviewkey: "hotel",
              reviewDesc: this.state.hotel_review_descrip,
              rating: "3",
              reviewID: this.state.driver_id,
            });
          } else if (type == 2) {
            singleHotelArray[index].isDriverGood = 1;
            singleHotelArray[index].isDriverAvrg = 1;
            singleHotelArray[index].isDriverBad = type;
            this.setState({
              reviewTitle: "Hotel Rating",
              reviewkey: "hotel",
              reviewDesc: this.state.hotel_review_descrip,
              rating: "1",
              reviewID: this.state.driver_id,
            });
          }
          break;
        }
      }
      this.setState({ hotelData: singleHotelArray });
    }
  }

  setRatingIcon(type) {
    if (type == 0) {
      this.setState({
        isDriverGood: !this.state.isDriverGood,
        isDriverAvrg: true,
        isDriverBad: true,
      });
      this.setState({
        reviewTitle: "Tour Manager Rating",
        reviewkey: "tourmanager",
        reviewDesc: "",
        rating: "5",
        reviewID: this.state.driver_id,
      });
      this.sendRatingToServer();
    } else if (type == 1) {
      this.setState({
        isDriverGood: true,
        isDriverAvrg: !this.state.isDriverAvrg,
        isDriverBad: true,
      });
      this.setState({
        reviewTitle: "Tour Manager Rating",
        reviewkey: "tourmanager",
        reviewDesc: this.state.driver_review_descrip,
        rating: "3",
        reviewID: this.state.driver_id,
      });
      this.sendRatingToServer();
    } else if (type == 2) {
      this.setState({
        isDriverGood: true,
        isDriverAvrg: true,
        isDriverBad: !this.state.isDriverBad,
      });
      this.setState({
        reviewTitle: "Tour Manager Rating",
        reviewkey: "tourmanager",
        reviewDesc: this.state.driver_review_descrip,
        rating: "1",
        reviewID: this.state.driver_id,
      });
    } else if (type == 3) {
      this.setState({
        isTripGood: !this.state.isTripGood,
        isTripAvrg: true,
        isTripBad: true,
      });
      this.setState({
        reviewTitle: "Trip Rating",
        reviewkey: "trip",
        reviewDesc: "",
        rating: "5",
        reviewID: this.state.booking_id,
      });
    } else if (type == 4) {
      this.setState({
        isTripGood: true,
        isTripAvrg: !this.state.isTripAvrg,
        isTripBad: true,
      });
      this.setState({
        reviewTitle: "Trip Rating",
        reviewkey: "trip",
        reviewDesc: this.state.trip_review_descrip,
        rating: "3",
        reviewID: this.state.booking_id,
      });
    } else if (type == 5) {
      this.setState({
        isTripGood: true,
        isTripAvrg: true,
        isTripBad: !this.state.isTripBad,
      });
      this.setState({
        reviewTitle: "Trip Rating",
        reviewkey: "trip",
        reviewDesc: this.state.trip_review_descrip,
        rating: "1",
        reviewID: this.state.booking_id,
      });
    } else if (type == 6) {
      this.setState({
        isAppGood: !this.state.isAppGood,
        isAppAvrg: true,
        isAppBad: true,
      });
      this.setState({
        reviewTitle: "App Rating",
        reviewkey: "app",
        reviewDesc: "",
        rating: "5",
        reviewID: this.state.booking_id,
      });
      this.sendRatingToServer();
    } else if (type == 7) {
      this.setState({
        isAppGood: true,
        isAppAvrg: !this.state.isAppAvrg,
        isAppBad: true,
      });
      this.setState({
        reviewTitle: "App Rating",
        reviewkey: "app",
        reviewDesc: this.state.app_review_descrip,
        rating: "3",
        reviewID: this.state.booking_id,
      });
    } else if (type == 8) {
      this.setState({
        isAppGood: true,
        isAppAvrg: true,
        isAppBad: !this.state.isAppBad,
      });
      this.setState({
        reviewTitle: "App Rating",
        reviewkey: "app",
        reviewDesc: this.state.app_review_descrip,
        rating: "1",
        reviewID: this.state.booking_id,
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20, backgroundColor: "#e4e5e5" }}>
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
              ? { uri: this.state.background_image }
              : require("../assets/images/bg_home1.png")
          }
          resizeMode="cover"
          style={global_style.bg_image}
        >
          <View style={styles.rect}>
            <View style={styles.rect2}>
              <View style={styles.rect3Stack}>
                <View style={styles.rect3}></View>
                <Image
                  source={require("../assets/images/review_user_icon.png")}
                  resizeMode="contain"
                  style={styles.image}
                ></Image>
              </View>
              <Text style={styles.cust_name}>{this.state.userName}</Text>
            </View>
            <Text style={styles.loremIpsum}>
              Your feedback is important to us.
            </Text>
          </View>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              showsVerticalScrollIndicator={false}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  data={this.state.hotelData}
                  renderItem={(item) => this.renderItemComponent(item)}
                  keyExtractor={(item, index) => index.toString()}
                  onRefresh={this.handleRefresh}
                />
              </SafeAreaView>
              {renderIf(this.state.isDriverRating)(
                <View style={styles.rect4}>
                  <View style={styles.image2Row}>
                    <Image
                      source={require("../assets/images/driver_placeholder.png")}
                      resizeMode="cover"
                      style={styles.image2}
                    ></Image>
                    <View style={styles.rect5}>
                      <Text style={styles.goldenAppleCottage}>
                        Driver/Handler Rating
                      </Text>
                      <Text style={styles.loremIpsum2}>
                        Please rate your driver through the tour.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rect6}>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(0)}
                    >
                      <Image
                        source={
                          this.state.isDriverGood
                            ? require("../assets/images/smile_white_four.png")
                            : require("../assets/images/smile_blue_four.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(1)}
                    >
                      <Image
                        source={
                          this.state.isDriverAvrg
                            ? require("../assets/images/smile_white_three.png")
                            : require("../assets/images/smile_blue_three.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Average</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(2)}
                    >
                      <Image
                        source={
                          this.state.isDriverBad
                            ? require("../assets/images/smile_white_one.png")
                            : require("../assets/images/smile_blue_one.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Bad</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {renderIf(this.state.isTripRating)(
                <View style={styles.rect4}>
                  <View style={styles.image2Row}>
                    <Image
                      source={require("../assets/images/trip_rating_icon.png")}
                      resizeMode="cover"
                      style={styles.image2}
                    ></Image>
                    <View style={styles.rect5}>
                      <Text style={styles.goldenAppleCottage}>Tour Rating</Text>
                      <Text style={styles.loremIpsum2}>
                        Please rate your overall experience with the tour.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rect6}>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(3)}
                    >
                      <Image
                        source={
                          this.state.isTripGood
                            ? require("../assets/images/smile_white_four.png")
                            : require("../assets/images/smile_blue_four.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(4)}
                    >
                      <Image
                        source={
                          this.state.isTripAvrg
                            ? require("../assets/images/smile_white_three.png")
                            : require("../assets/images/smile_blue_three.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Average</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(5)}
                    >
                      <Image
                        source={
                          this.state.isTripBad
                            ? require("../assets/images/smile_white_one.png")
                            : require("../assets/images/smile_blue_one.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Bad</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {renderIf(this.state.isAppRating)(
                <View style={styles.rect4}>
                  <View style={styles.image2Row}>
                    <Image
                      source={require("../assets/images/ic_launcher.png")}
                      resizeMode="cover"
                      style={styles.image2}
                    ></Image>
                    <View style={styles.rect5}>
                      <Text style={styles.goldenAppleCottage}>App Rating</Text>
                      <Text style={styles.loremIpsum2}>
                        Please rate your experience with the app.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rect6}>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(6)}
                    >
                      <Image
                        source={
                          this.state.isAppGood
                            ? require("../assets/images/smile_white_four.png")
                            : require("../assets/images/smile_blue_four.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(7)}
                    >
                      <Image
                        source={
                          this.state.isAppAvrg
                            ? require("../assets/images/smile_white_three.png")
                            : require("../assets/images/smile_blue_three.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Average</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rect6_box}
                      onPress={() => this.setRatingIcon(8)}
                    >
                      <Image
                        source={
                          this.state.isAppBad
                            ? require("../assets/images/smile_white_one.png")
                            : require("../assets/images/smile_blue_one.png")
                        }
                        resizeMode="contain"
                        style={styles.image2_smiley}
                      ></Image>
                      <Text style={styles.rating}>Bad</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rect: {
    width: "95%",
    height: 225,
    marginLeft: "2.5%",
    top: "10%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  rect2: {
    width: "70%",
    height: "90%",
    backgroundColor: "rgba(74,74,74,1)",
    marginLeft: "15%",
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 200,
    borderBottomLeftRadius: 200,
  },
  rect3: {
    top: 1,
    width: "80%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(74,74,74,1)",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    left: "10%",
  },
  image: {
    top: 5,
    width: "70%",
    height: "90%",
    position: "absolute",
    left: "14%",
  },
  rect3Stack: {
    width: "60%",
    height: 110,
    marginTop: "5%",
    marginLeft: "20%",
  },
  cust_name: {
    color: "rgba(244,242,242,1)",
    height: "auto",
    width: "80%",
    fontSize: 22,
    textAlign: "center",
    marginTop: 5,
    marginLeft: "10%",
  },
  loremIpsum: {
    color: "rgba(74,74,74,1)",
    height: "auto",
    backgroundColor: "#E6E6E6",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    bottom: 0,
  },
  scrollArea: {
    width: width,
    height: "auto",
    top: "10%",
  },
  scrollArea_contentContainerStyle: {
    paddingBottom: 450,
  },
  rect4: {
    width: "95%",
    height: 130,
    marginLeft: "2.5%",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10,
  },
  image2_smiley: {
    width: 40,
    height: 40,
    marginLeft: "28%",
  },
  image2: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 20,
  },
  rect5: {
    width: "80%",
    height: "auto",
    marginLeft: 5,
  },
  goldenAppleCottage: {
    height: "auto",
    width: "100%",
    fontSize: 18,
    marginTop: 0,
  },
  loremIpsum2: {
    height: "auto",
    width: "100%",
    fontSize: 12,
    marginTop: 0,
  },
  image2Row: {
    height: "auto",
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  rect6: {
    top: 0,
    left: 0,
    width: "70%",
    height: "auto",
    marginLeft: "20%",
    flexDirection: "row",
  },
  rect6_box: {
    width: "33%",
    height: 60,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    textAlign: "center",
  },
  rating: {
    color: "rgba(128,128,128,1)",
    textAlign: "center",
  },
});
