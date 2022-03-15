import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import { Container, Form } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default class RegisterStep2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };
  }

  signUpUser = (email, password) => {
    if (this.state.name === "") {
      alert("Please enter your name");
      return;
    } else {
      let data = this.props.navigation.state.params;
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((res) => {
          console.log(res.user.uid);
          firebase.firestore().collection("users").doc(res.user.uid).set({
            email: data.email,
            name: this.state.name,
          });
        });
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
                placeholder="Enter you name"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(name) => this.setState({ name })}
                style={styles._input}
              />

              <TouchableOpacity
                style={styles.submitContainer}
                onPress={() =>
                  this.signUpUser(this.state.email, this.state.password)
                }
              >
                <Image source={require("../assets/register2.png")} />
              </TouchableOpacity>
              <Text style={styles._terms}>
                By signing up, you agree to Photo’s Terms of Service and Privacy
                Policy.
              </Text>
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
    marginTop: 60,
  },
  _terms: {
    paddingVertical: 30,
  },
});
