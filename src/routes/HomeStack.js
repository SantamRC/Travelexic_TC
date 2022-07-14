import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HotelDetails from "../screens/HotelDetails";
import HotelInfo from "../screens/HotelInfo";
import DoDonts from "../screens/DoDonts";
import LoginScreen from "../screens/LoginScreen";
import UserEditProfile from "../screens/UserEditProfile";
import SplashScreen from "../screens/SplashScreen";
import Documents from "../screens/Documents";
import DocumentView from "../screens/DocumentView";
import PassportCopy from "../screens/PassportCopy";
import FlightDetails from "../screens/FlightDetails";
import FlightStatus from "../screens/FlightStatus";
import FlightTicket from "../screens/FlightTicket";
import ImportantContact from "../screens/ImportantContact";
import DayPlan from "../screens/DayPlan";
import KnowMore from "../screens/KnowMore";
import PlaceDetails from "../screens/PlaceDetails";
import GooglePlacesInput from "../screens/GooglePlacesInput";
import Weather from "../screens/Weather";
import BottomTabStack from "../screens/BottomTabStcak";
import ExploreCityScreen_HD from "../screens/ExploreCityScreen_HD";
import Notification from "../screens/Notification";
import TourSpeakerDetail from "../screens/TourSpeakerDetail";
import TourSpeaker from "../screens/TourSpeaker";
import UserProfile from "../screens/UserProfile";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import ShowQRCode from "../screens/ShowQRCode";
import Feedback from "../screens/Feedback";
import MyTrips from "../screens/MyTrips";
//import ShareExperience from '../screens/ShareExperience';
import ReviewRating from "../screens/ReviewRating";
import OpenFile from "../screens/OpenFile";
import PhotoIdUploadScreen from "../screens/PhotoIdUploadScreen";
import CustomerPanel from "../screens/CustomerPanel";
import CurrencyConverter from "../screens/CurrencyConverter";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <NavigationContainer initialRouteName="SplashScreen">
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "User Profile",
          }}
        />
        <Stack.Screen
          name="UserEditProfile"
          component={UserEditProfile}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Edit Profile",
          }}
        />
        <Stack.Screen
          name="DoDonts"
          component={DoDonts}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "DoDonts",
          }}
        />
        <Stack.Screen
          name="Weather"
          component={Weather}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyTrips"
          component={MyTrips}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "My Trips",
          }}
        />
        <Stack.Screen
          name="HotelDetails"
          component={HotelDetails}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Hotels Details",
          }}
        />
        <Stack.Screen
          name="HotelInfo"
          component={HotelInfo}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Hotels List",
          }}
        />
        <Stack.Screen
          name="DocumentView"
          component={DocumentView}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Documents",
          }}
        />
        <Stack.Screen
          name="PhotoIdUploadScreen"
          component={PhotoIdUploadScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Photo Id Upload",
          }}
        />
        <Stack.Screen
          name="ImportantContact"
          component={ImportantContact}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Important Contact",
          }}
        />
        <Stack.Screen
          name="TourSpeaker"
          component={TourSpeaker}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Tour Speaker",
          }}
        />
        <Stack.Screen
          name="TourSpeakerDetail"
          component={TourSpeakerDetail}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Tour Speaker Details",
          }}
        />
        <Stack.Screen
          name="PassportCopy"
          component={PassportCopy}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Passport Details Upload",
          }}
        />
        <Stack.Screen
          name="FlightDetails"
          component={FlightDetails}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Flight Tickets",
          }}
        />
        <Stack.Screen
          name="FlightStatus"
          component={FlightStatus}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Flight Status",
          }}
        />
        <Stack.Screen
          name="FlightTicket"
          component={FlightTicket}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Flight Details Upload",
          }}
        />
        <Stack.Screen
          name="DayPlan"
          component={DayPlan}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Day Plan",
          }}
        />
        <Stack.Screen
          name="KnowMore"
          component={KnowMore}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Know More",
          }}
        />
        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetails}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Place Details",
          }}
        />
        <Stack.Screen
          name="GooglePlacesInput"
          component={GooglePlacesInput}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Search Loaction Name",
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Notification",
          }}
        />
        <Stack.Screen
          name="ExploreCityScreen_HD"
          component={ExploreCityScreen_HD}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Explore City",
          }}
        />
        <Stack.Screen
          name="Documents"
          component={Documents}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Documents",
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Privacy & Policy",
          }}
        />
        <Stack.Screen
          name="ShowQRCode"
          component={ShowQRCode}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Scan QR-Code",
          }}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Feedback",
          }}
        />
        {/* <Stack.Screen
          name="ShareExperience"
          component={ShareExperience}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Share Experience',
          }}
        /> */}
        <Stack.Screen
          name="ReviewRating"
          component={ReviewRating}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Review & Rating",
          }}
        />
        <Stack.Screen
          name="OpenFile"
          component={OpenFile}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Open File View",
          }}
        />
        <Stack.Screen
          name="Customer Panel"
          component={CustomerPanel}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            title: "Open File View",
          }}
        />
        <Stack.Screen
          name="CurrencyConverter"
          component={CurrencyConverter}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
