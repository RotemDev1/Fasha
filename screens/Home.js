import React from "react";
import {
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  signUpUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("please enter atleast 6 characters");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.toString());
    }
  };

  loginUser = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function (user) {
          // console.log(user);
        });
    } catch (error) {
      console.log(error.toString());
    }
  };

  render() {
    return (
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.container}
      >
        <View style={styles._logo_section}>
          <Image source={require("../assets/Group.png")}></Image>
        </View>

        <View style={styles._footer_section}>
          <List>
            <ListItem avatar>
              <Left>

              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <Text style={styles._name}></Text>
                <Text note></Text>
              </Body>
            </ListItem>
          </List>
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.submitContainer}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Image source={require("../assets/Button.png")}></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitContainer}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              <Image source={require("../assets/Button2.png")}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: "center",
    padding: 0,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",

    marginTop: 32,
  },
  submitContainer: {
    flexDirection: "row",
    borderRadius: 1,
    paddingVertical: 1,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(97,61,10,97)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    margin: 5,
  },
  _footer_section: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  _logo_section: {
    flex: 1,
    justifyContent: "flex-end",
  },
  _name: {
    fontWeight: "bold",
  },
});
