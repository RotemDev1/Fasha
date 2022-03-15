import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import firebase from "firebase";

import { Container, Form } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default class Login extends React.Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.uid === "5ROQUBNCvXeR98rq6Jloy6xtHLm1") {
          this.props.navigation.navigate("AdminLogin");
        } else {
          this.props.navigation.navigate("Discover");
        }
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log(e);
    }
  };
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  loginUser = (email, password) => {
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\. \-]+\.[a-zA-z0-9]{2,4}$/;
    if (!email.match(regex)) {
      alert("Please correct email address");
      return false;
    }

    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function (user) {
          // console.log(user);
        })
        .catch((err) => {
          alert(err);
        });
    } catch (error) {
      alert(error.toString());
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles._header}>
          <TouchableOpacity
            style={styles.titleBar}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Ionicons name="return-up-back" size={24} color="black" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            <View style={{ marginVertical: 20 }}>
              <Image source={require("../assets/Login.png")}></Image>
            </View>

            <Form>
              <TextInput
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })}
                style={styles._input}
              />

              <TextInput
                secureTextEntry={true}
                placeholder="Password"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                style={styles._input}
              />

              <TouchableOpacity
                style={styles.submitContainer}
                onPress={() =>
                  this.loginUser(this.state.email, this.state.password)
                }
              >
                {/* <Text></Text> */}
                <Image source={require("../assets/LoginB.png")}></Image>
              </TouchableOpacity>
            </Form>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    justifyContent: "center",
    padding: 10,
  },
  submitContainer: {
    borderRadius: 11,
    paddingVertical: 1,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(97,61,10,97)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
    marginHorizontal: 20,
  },
  _header: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  _input: {
    borderWidth: 1.5,
    padding: 12,
    margin: 10,
    borderColor: "#000000",
    borderRadius: 5,
  },
});
