import React from "react";

import {
  createAppContainer,
  createSwitchNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import { StyleSheet } from "react-native";
import { View } from "react-native";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import RegisterStepTwo from "./screens/RegisterStepTwo";
import Discover from "./screens/Discover";
import ProfileScreen from "./screens/ProfileScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ViewImage from "./screens/ViewImage";
import AdminLogin from "./admin_screen/AdminLogin";
import AddItem from "./screens/AddItem";
import firebase from "firebase";
import config from "./config";
import Search from "./screens/Search";
import Chats from "./screens/Chats";
import IndividualChat from "./screens/IndividualChat";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ViewProfile from "./screens/ViewProfile";
import { LogBox } from "react-native";
import SavedItems from "./screens/SavedItem";
import updateItem from "./screens/updateItem";
import ViewOwnImage from "./screens/ViewOwnImage";
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const MainTabs = createBottomTabNavigator(
  {
    Discover: {
      screen: Discover,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="home" size={20} color="black" />
        ),
      },
    },

    Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="search1" size={20} color="black" />
        ),
      },
    },

    AddNew: {
      screen: AddItem,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ color, size }) => (
          <View
            style={{
              backgroundColor: "#BFB497",
              width: 70,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              padding: 8,
            }}
          >
            <AntDesign name="plus" size={20} color="white" />
          </View>
        ),
      },
    },

    Chats: {
      screen: Chats,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-outline" size={20} color="black" />
        ),
      },
    },

    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="user" size={20} color="black" />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: "yellow",
      inactiveTintColor: "#B1B1B1",
      showLabel: false,
    },
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  Home: Home,
  Login: Login,
  Discover: MainTabs,
  RegisterStepTwo: RegisterStepTwo,
  AdminLogin: AdminLogin,
  Register: Register,
  ViewImage: ViewImage,
  IndividualChat: IndividualChat,
  UpdateItem: updateItem,
  ViewProfile: ViewProfile,
  SavedItems: SavedItems,
  ViewOwnImage: ViewOwnImage,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(183, 161, 107, 0)",
  },
});
