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
import * as ImagePicker from "expo-image-picker";

import { Container, Form } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

export default class AddItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      uid: null,
      price: "",
      brand: "",
      color: "",
      category: "",
      desc: "",
      url: "",
      currentUser: {},
    };
  }

  componentDidMount() {
    this.getUserData();
    this.checkIfLoggedIn();
    this.getPermissionAsync();
  }

  getUserData = async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            this.setState({ currentUser: data });
          }
        });
    });
  };

  // GET PERMITION FOR CAMERA ROLL
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  checkIfLoggedIn = async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.setState({ uid: user.uid });
        await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let data = doc.data();
              this.setState({ currentUser: data });
            }
          });
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
          console.log(user);
        });
    } catch (error) {
      alert(error.toString());
    }
  };

  imageFunc = async (uri) => {
    this.setState({ disabled: true });
    let { name, rollNum } = this.state;
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ref = firebase.storage().ref().child(`${this.state.uid}`);
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();
    let down = await snapshot.ref.getDownloadURL();
    this.setState({ url: down, disabled: false });
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.imageFunc(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
    //  writeUserData() {
  };

  uploadItem = () => {
    let { price, brand, color, category, desc, url, uid, currentUser } =
      this.state;
    firebase
      .firestore()
      .collection("Discover")
      .doc()
      .set({
        price,
        brand,
        color,
        category,
        desc,
        url,
        uid,
        userName: currentUser.name,
        userEmail: currentUser.email,
        avatar: this.state.currentUser.avatar,
      })
      .then((res) => {
        this.setState({
          price: "",
          brand: "",
          color: "",
          category: "",
          desc: "",
          url: "",
        });
        this.props.navigation.navigate("Discover");
      });
  };
  render() {
    let { price, brand, color, category, desc, url, uid, currentUser } =
      this.state;
    console.log("----------------------->", currentUser);
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
              <Image source={require("../assets/uploadheading.png")}></Image>
            </View>

            <Form>
              <View style={styles._row}>
                <View style={[styles._input, { flex: 1 }]}>
                  <Text>upload from gallery</Text>
                </View>
                <TouchableOpacity onPress={() => this._pickImage()}>
                  <Image source={require("./../assets/new.png")} />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Price"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(price) => this.setState({ price })}
                style={styles._input}
                value={price}
              />

              <TextInput
                placeholder="Brand"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(brand) => this.setState({ brand })}
                style={styles._input}
                value={brand}
              />
              <TextInput
                placeholder="Color"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(color) => this.setState({ color })}
                style={styles._input}
                value={color}
              />

              <TextInput
                placeholder="Category"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(category) => this.setState({ category })}
                style={styles._input}
                value={category}
              />

              <TextInput
                placeholder="Description"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(desc) => this.setState({ desc })}
                style={styles._input}
              />

              {price === "" ||
              brand === "" ||
              color === "" ||
              category === "" ||
              desc === "" ||
              url === "" ? (
                <TouchableOpacity
                  style={[styles.submitContainer, { backgroundColor: "grey" }]}
                >
                  <Text style={styles._upload_text}>UPLOAD ITEM</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.submitContainer}
                  onPress={() => this.uploadItem()}
                >
                  <Text style={styles._upload_text}>UPLOAD ITEM</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: "black",
    width: 150,
    alignSelf: "center",
    height: 50,
  },
  _upload_text: {
    color: "white",
    fontWeight: "bold",
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
  _row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
