import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import firebase from "firebase";

import { Container, Form, Input, Item, Button, Label } from "native-base";

export default class h extends React.Component {
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
          console.log(user);
        });
    } catch (error) {
      console.log(error.toString());
    }
  };

  render() {
    return (
      <ScrollView>
        <Container style={styles.container}>
          <View>
            <View
              style={{
                marginTop: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../assets/Group.jpg")}></Image>
            </View>

            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(email) => this.setState({ email })}
                />
              </Item>

              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(password) => this.setState({ password })}
                />
              </Item>

              <TouchableOpacity style={styles.submitContainer}>
                <Button
                  style={styles.submitContainer}
                  rounded
                  full
                  success
                  onPress={() =>
                    this.loginUser(this.state.email, this.state.password)
                  }
                >
                  <Text
                    style={[
                      styles.text,
                      { color: "#fff", fontWeigth: "600", fontSize: 20 },
                    ]}
                  >
                    Login
                  </Text>
                </Button>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitContainer}>
                <Button
                  style={styles.submitContainer}
                  rounded
                  full
                  primary
                  onPress={() =>
                    this.signUpUser(this.state.email, this.state.password)
                  }
                >
                  <Text
                    style={[
                      styles.text,
                      { color: "#fff", fontWeigth: "600", fontSize: 20 },
                    ]}
                  >
                    Sign Up
                  </Text>
                </Button>
              </TouchableOpacity>
            </Form>
          </View>
        </Container>
      </ScrollView>
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
    backgroundColor: "#613d0a",
    fontSize: 8,
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
});
