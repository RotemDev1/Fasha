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
class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      disable: true,
      followers: [],
      followed: false,
      saved: [],
      maySaved: [],
      userData: {}
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
    await firebase.auth().onAuthStateChanged(async (user) => {
      this.setState({ userUid: user.uid });

      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let savedArray = doc.data().saved;
            this.getProduct(user.uid);
            this.setState({ saved: savedArray, userData: doc.data(), cuser: user.uid });
          }
        });
    });
  };
















  getProduct = (v) => {
    var arr = [];
    firebase
      .firestore()
      .collection("Discover")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          let data = doc.data().saved;

          if (data !== undefined) {
            for (var i = 0; i < data.length; i++) {
              if (data[i] === v) {
                let r = doc.data()
                r.productId = doc.id
                console.log("-----productId-------.", r)

                arr.push(r);
                this.setState({ maySaved: arr });
              }
            }
          }
        });
      });
  };

  Follow = () => {
    let { userUid, other_User_UId, followers } = this.state;
    followers.push(userUid);
    firebase
      .firestore()
      .collection("users")
      .doc(other_User_UId)
      .update({ follow: followers })
      .then(() => this.setState({ followed: true }));
  };



  removedFromSaved = async (v, index) => {
    let productId = v.productId;
    let savedArr = v.saved;
    let cUser = this.state.userData;
    let mySaved = this.state.userData.saved;
    // console.log("-----cUser-------.", cUser)

    for (var i = 0; i < savedArr.length; i++) {
      if (savedArr[i] === this.state.cuser) {
        savedArr.splice(i, 1);
        v.saved = savedArr;
        await firebase
          .firestore()
          .collection("Discover")
          .doc(productId)
          .update({ saved: savedArr });
        cUser.saved = savedArr;
        this.setState({ cUser });
      }
    }

    for (var i = 0; i < mySaved.length; i++) {
      if (mySaved[i] === productId) {
        mySaved.splice(i, 1);
        await firebase
          .firestore()
          .collection("users")
          .doc(this.state.cuser)
          .update({ saved: mySaved });
        cUser.saved = savedArr;
        this.setState({ cUser });
      }
    }
    this.getProduct(this.state.cuser);

  };





  render() {
    let { disable, followed, followers, newArr, saved, maySaved } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBar}>
          <Ionicons
            name="ios-arrow-back"
            size={25}
            color="#52575D"
            onPress={() => this.props.navigation.navigate("Discover")}
          ></Ionicons>
        </View>

        <View style={styles.profileImage}>
          <Image
            source={require("../assets/savedItems.png")}
            style={styles.image}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles._row}>
            {maySaved.length !== 0 ? (
              maySaved.map((val, i) => {
                return (
                  <TouchableOpacity style={styles._browse_img} key={i}
                    onPress={() =>
                      this.props.navigation.navigate("ViewProfile", {
                        data: val,
                      })
                    }
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 50,
                          overflow: "hidden",
                          margin: 5,
                        }}
                      >
                        <Image
                          source={{ uri: val.avatar }}
                          style={{ flex: 1, borderRadius: 40 }}
                          resizeMode="stretch"
                        />
                      </View>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 12,
                          flex: 1,
                          color: "grey",
                          fontWeight: "bold",
                        }}
                      >
                        Item uploaded by
                        <Text style={{ color: "black" }}> {val.userName} </Text>
                      </Text>
                    </View>
                    <View style={{ height: 100 }}>
                      <Image
                        source={{ uri: val.url }}
                        style={{ flex: 1 }}
                        resizeMode="stretch"
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10,
                      }}
                    >
                      <TouchableOpacity onPress={() => this.removedFromSaved(val)}>
                        <MaterialIcons
                          name="favorite"
                          size={25}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Text style={styles._price}>{val.price}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>There is no any product yet</Text>
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
    alignSelf: "center",
    height: 25,
    width: 150,
    alignSelf: "flex-start",
    margin: 20,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 44,
    marginHorizontal: 26,
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
    marginTop: 16,
    width: "100%",
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
    // height: 160,
    width: "45%",
    marginTop: 10,
    elevation: 3,
    borderRadius: 3,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-between",
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
