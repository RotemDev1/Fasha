import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Container, Form } from "native-base";
import { Ionicons } from "@expo/vector-icons";
export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  signUpUser = (email, password) => {
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\. \-]+\.[a-zA-z0-9]{2,4}$/;
    if (!email.match(regex)) {
      alert("Please correct email address");
      return false;
    }

    try {
      if (this.state.password.length < 6) {
        alert("please enter atleast 6 characters");
        return;
      }
      this.props.navigation.navigate("RegisterStepTwo", { email, password });
    } catch (error) {
      console.log(error.toString());
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
              <Image source={require("../assets/Register.png")}></Image>
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
                  this.signUpUser(this.state.email, this.state.password)
                }
              >
                <Image source={require("../assets/next.png")} />
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
    borderColor: "#000000",
    borderRadius: 5,
    marginHorizontal: 0,
    marginVertical: 10,
  },
});
