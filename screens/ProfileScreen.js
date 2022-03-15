import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      disable: true,
      followers: [],
      followed: false,
      newArr: [],
      currentUser: {},
      url: "",
    };
  }
  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    // this._unsubscribe = navigation.addListener("didFocus", async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      var arr = [];
      await firebase
        .firestore()
        .collection("Discover")
        .get()
        .then((res) => {
          res.forEach((doc) => {
            if (doc.data().uid === user.uid) {
              let data = doc.data();
              data.productId = doc.id;
              arr.push(data);
            }
            this.setState({ newArr: arr, uid: user.uid });
          });
        });

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
    // });
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
    firebase.firestore().collection("users").doc(this.state.uid).update({
      avatar: down,
    });
    let data = this.state.currentUser;
    data.avatar = down;
    this.setState({ url: down, disabled: false, currentUser: data });
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

  render() {
    let { disable, followed, newArr, currentUser } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBar}>
          <Ionicons
            name="ios-arrow-back"
            size={24}
            color="#52575D"
            onPress={() => this.props.navigation.navigate("Discover")}
          ></Ionicons>
        </View>
        <TouchableOpacity
          style={{ alignSelf: "flex-end", margin: 10 }}
          onPress={() => this.props.navigation.navigate("SavedItems")}
        >
          <MaterialIcons name="favorite" size={35} color="black" />
        </TouchableOpacity>
        <View style={styles.profileImage}>
          <Image source={{ uri: currentUser.avatar }} style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
            {currentUser.name}{" "}
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              zIndex: 1,
              borderRadius: 50,
            }}
            onPress={() => this._pickImage()}
          >
            <Feather name="edit" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            {followed ? (
              <TouchableOpacity
                style={[styles.statFollowBox, { backgroundColor: "gray" }]}
                disabled={true}
                onPress={() => {}}
              >
                <Text style={styles.followText}>Followed</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.statFollowBox,
                  { backgroundColor: disable ? "gray" : "black" },
                ]}
                disabled={disable}
                onPress={() => {
                  this.Follow();
                }}
              >
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.statBox} disabled>
              <Image
                source={require("../assets/massage.jpg")}
                style={{ width: 150, height: 40 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "95%",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.submitContainer,
                { width: "100%", marginHorizontal: 0 },
              ]}
              onPress={() =>
                this.loginUser(this.state.email, this.state.password)
              }
            >
              <Text style={{ fontWeight: "bold" }}>SEE MORE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles._row}>
            {newArr.length !== 0 ? (
              newArr.map((val, i) => {
                return (
                  <TouchableOpacity
                    style={styles._browse_img}
                    key={i}
                    onPress={() =>
                      this.props.navigation.navigate("ViewOwnImage", {
                        data: val,
                      })
                    }
                  >
                    <Image
                      source={{ uri: val.url }}
                      style={{ flex: 1 }}
                      resizeMode="cover"
                    />
                    <Text style={styles._price}>{val.price}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>There is no any product yet!</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.submitContainer}
            onPress={() =>
              this.loginUser(this.state.email, this.state.password)
            }
          >
            <Text style={{ fontWeight: "bold" }}>SEE MORE</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withNavigation(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    color: "#52575D",
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
    elevation: 10,
    zIndex: 1,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  profileImage: {
    // overflow: "hidden",
    // flex: 1,
    zIndex: 1,
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    // marginTop: 16,
    // width: "100%",
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    justifyContent: "center",
  },

  infoContainer2: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
  },

  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  stateBox: {
    alignItems: "center",
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 38,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  recentItemIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
  statBox: {
    width: "45%",
  },
  statFollowBox: {
    width: "45%",
  },
  followText: {
    color: "white",
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    fontWeight: "bold",
  },
  _seemore: {},
  _browse_img: {
    height: 190,
    width: "45%",
    marginTop: 10,
    elevation: 1,
    borderRadius: 4,
    backgroundColor: "white",
  },
  _row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 15,
    flex: 1,
  },
  _price: {
    textAlign: "right",
    padding: 5,
    fontWeight: "bold",
  },
  submitContainer: {
    borderRadius: 5,
    paddingVertical: 1,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(97,61,10,97)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    marginHorizontal: 10,
    width: "95%",
    alignSelf: "center",
    borderWidth: 2,
    height: 50,
  },
});
