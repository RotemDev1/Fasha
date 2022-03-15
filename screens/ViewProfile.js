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
      newArr: [],
      notification: [],
      currentUserData: {},
      cuser: "",
      follower: 0,
    };
  }
  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      // console.log(e);
    }
  };

  checkStatus = async () => {
    const { navigation } = this.props;
    let { data } = this.props.navigation.state.params;
    this.getSelectedUserData(data.uid);
    await firebase.auth().onAuthStateChanged((user) => {
      if (data.uid !== user.uid) {
        this.setState({
          disable: false,
          userUid: user.uid,
          other_User_UId: data.uid,
        });
      } else {
        this.setState({ disable: true });
      }
      this.getCurrentUserData(user.uid);
    });
    await firebase
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let followArray = doc.data().follow;
          if (followArray) {
            let flag = false;
            for (var i = 0; i < followArray.length; i++) {
              if (followArray[i] === this.state.userUid) {
                flag = true;
                this.setState({
                  followed: true,
                  followers: followArray,
                  name: doc.data().userName,
                });
              }
            }
            if (!flag) {
              this.setState({
                followers: followArray,
                followed: false,
                name: doc.data().userName,
              });
            }
          } else {
            this.setState({
              followers: [],
              followed: false,
              name: doc.data().name,
            });
          }
        }
      });
    var arr = [];
    await firebase
      .firestore()
      .collection("Discover")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          if (doc.data().uid === data.uid) {
            let value = doc.data();
            value.productId = doc.id;
            arr.push(value);
            this.setState({ newArr: arr });
          }
        });
      });
  };

  componentDidMount = async () => {
    let { data } = this.props.navigation.state.params;

    await this.checkStatus();
    await firebase
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get()
      .then((res) => {
        // res.forEach((doc) => {
        let value = res.data();
        console.log("++++++++++++++++++++++++", value.follow);

        if (value.follow !== undefined) {
          this.setState({ follower: value.follow.length });
        }
        // });
      });
  };

  getSelectedUserData = (v) => {
    firebase
      .firestore()
      .collection("users")
      .doc(v)
      .get()
      .then((res) => {
        res.forEach((doc) => {
          if (doc.data().uid === data.uid) {
            let value = doc.data();
            if (value.notification !== undefined) {
              this.setState({ notification: value.notification });
            }
          }
        });
      });
  };

  getCurrentUserData = async (v) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(v)
      .get()
      .then((res) => {
        let value = res.data();
        this.setState({ currentUserData: value, cuser: v });
      });
  };
  Follow = async () => {
    let { userUid, other_User_UId, followers, currentUserData } = this.state;
    let notificationArr = this.state.notification;
    let notification = {
      flollowedBy: currentUserData.name,
      flollowedbyEmail: currentUserData.email,
      text: currentUserData.name + " started following you",
    };
    notificationArr.push(notification);
    followers.push(userUid);

    await firebase
      .firestore()
      .collection("users")
      .doc(other_User_UId)
      .update({ follow: followers, notification: notificationArr })
      .then(() => this.setState({ followed: true }));

    // await firebase
    // .firestore()
    // .collection("users")
    // .doc(userUid)
    // .update({ follow: followers, notification: notificationArr })
    // .then(() => this.setState({ followed: true }));

    await firebase
      .firestore()
      .collection("users")
      .doc(userUid)
      .update({
        followed: firebase.firestore.FieldValue.arrayUnion(other_User_UId),
      });
  };
  saveItem = async (v, index) => {
    let userId = this.state.userUid;
    let productId = v.productId;
    let savedArr = v.saved;
    let cUser = this.state.currentUserData;
    if (savedArr === undefined) {
      await firebase
        .firestore()
        .collection("Discover")
        .doc(productId)
        .update({ saved: [userId] });
      let newArr = this.state.newArr;
      newArr[index].saved = [userId];
      if (cUser.saved === undefined) {
        await firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({ saved: [productId] });
      } else {
        let a = cUser.saved;
        a.push(productId);
        cUser.saved = a;
        await firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({ saved: cUser.saved });
      }
    } else {
      savedArr.push(userId);
      await firebase
        .firestore()
        .collection("Discover")
        .doc(productId)
        .update({ saved: savedArr });
      if (cUser.saved === undefined) {
        await firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({ saved: [productId] });
      } else {
        await this.checkStatus();
        let a = cUser.saved;
        a.push(productId);
        cUser.saved = a;
        await firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({ saved: cUser.saved });
      }
    }
  };

  removedFromSaved = async (v, index) => {
    let productId = v.productId;
    let savedArr = v.saved;
    let cUser = this.state.currentUserData;
    let mySaved = this.state.currentUserData.saved;
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
    await this.checkStatus();
  };

  render() {
    let { disable, followed, followers, newArr, other_User_UId, follower } =
      this.state;
    let userData = this.props.navigation.state.params.data;
    let { data } = this.props.navigation.state.params;
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
          <Image source={{ uri: userData.avatar }} style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
            {userData.userName}
          </Text>
          {/* {userData.followed && userData.followed.length !== 0 ? */}
          {/* <Text>Follower:{userData.followed.length}</Text>
          <Text>Follower:0<Text>  */}
          <Text style={{ fontWeight: "bold" }}>
            Follower:{this.state.follower}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            {followed ? (
              <TouchableOpacity
                style={[styles.statFollowBox, { backgroundColor: "gray" }]}
                disabled={true}
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

            {this.state.cuser === data.uid ? null : (
              <TouchableOpacity
                style={styles.statBox}
                // disabled={this.state.userUid === data.uid ? true : false}
                onPress={() =>
                  this.props.navigation.navigate("IndividualChat", {
                    data: this.props.navigation.state.params.data,
                    cuser: this.state.cuser,
                  })
                }
              >
                <Image
                  source={require("../assets/massage.jpg")}
                  style={{ width: 150, height: 40 }}
                />
              </TouchableOpacity>
            )}
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
                  <TouchableOpacity style={styles._browse_img} key={i}


                    onPress={() =>
                      this.props.navigation.navigate("ViewImage", { data: val, back: "ViewProfile" })
                    }
                  >
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
                      {val.saved && val.saved.length !== 0 ? (
                        val.saved.includes(this.state.userUid) ? (
                          <TouchableOpacity
                            onPress={() => this.removedFromSaved(val)}
                          >
                            <MaterialIcons
                              name="favorite"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.saveItem(val, i)}
                          >
                            <MaterialIcons
                              name="favorite-border"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )
                      ) : (
                        <TouchableOpacity onPress={() => this.saveItem(val, i)}>
                          <MaterialIcons
                            name="favorite-border"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  profileImage: {
    // overflow: "hidden",
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
    height: 160,
    width: "45%",
    marginTop: 10,
    // overflow: "hidden",
    elevation: 3,
    // borderWidth:1,
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
