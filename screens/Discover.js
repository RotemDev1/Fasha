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
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default class Discover extends React.Component {
  constructor() {
    super();
    this.state = {
      newArr: [],
      userUid: "",
      userData: {},
      followedArr: [],
    };
  }

  componentDidMount = () => {
    this.getDAta();
  };

  getDAta = async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.setState({ userUid: user.uid });

        await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((res) => {
            let value = res.data();
            value.uid = user.uid;
            this.setState({ userData: value, cuser: user.uid });
          });
      }
    });

    await firebase
      .firestore()
      .collection("Discover")
      .get()
      .then((res) => {
        let arr = [];
        let followedArr = [];
        let whoifollowed = this.state.userData.followed;
        res.forEach((doc) => {
          let data = doc.data();
          data.productId = doc.id;
          arr.push(data);
          this.setState({ newArr: arr });
          if (whoifollowed) {
            for (var i = 0; i < whoifollowed.length; i++) {
              if (data.uid === whoifollowed[i]) {
                followedArr.push(data);
                this.setState({ followedArr: followedArr });
              }
            }
          }
          // followedArr.push(uid);
        });
      });
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("Home");
    } catch (e) {
      console.log(e);
    }
  };

  saveItem = async (v, index) => {
    let userId = this.state.userData.uid;
    let productId = v.productId;
    let savedArr = v.saved;
    let cUser = this.state.userData;
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
        await this.getDAta();
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
    let cUser = this.state.userData;
    let mySaved = this.state.userData.saved;
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
    await this.getDAta();
  };

  render() {
    let { newArr, userData, followedArr } = this.state;
    // console.log("--------followedArr------>", followed/Arr);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => this.signOutUser()}
          >
            <Image source={require("../assets/logout.png")}></Image>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 20, justifyContent: "center" }}>
            <Image source={require("../assets/Discover.jpg")}></Image>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontSize: 12, fontWeight: "bold" }]}>
              WHATS'S NEW TODAY
            </Text>
          </View>

          <View style={{ marginTop: 32 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {followedArr.map((val, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() =>
                      this.props.navigation.navigate("ViewImage", { data: val,back:"Discover" })
                    }
                  >
                    <View style={styles.mediaImageContainer}>
                      <Image
                        source={{ uri: val.url }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <List>
                      <ListItem
                        avatar
                        onPress={() =>
                          this.props.navigation.navigate("ViewProfile", {
                            data: val,
                          })
                        }
                      >
                        <Left>
                          <Thumbnail
                            source={
                              val.avatar === undefined
                                ? {
                                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqeVVMZblgaGTt_6EeDJPDdSLdyIHJAHzaUA&usqp=CAU",
                                  }
                                : { uri: val.avatar }
                            }
                            style={{ height: 35, width: 35 }}
                          />
                        </Left>
                        <Body style={{ borderBottomWidth: 0 }}>
                          <Text style={styles._name}>{val.userName}</Text>
                          <Text note>@{val.userName}</Text>
                        </Body>
                        <Right>
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
                            <TouchableOpacity
                              onPress={() => this.saveItem(val, i)}
                            >
                              <MaterialIcons
                                name="favorite-border"
                                size={24}
                                color="black"
                              />
                            </TouchableOpacity>
                          )}
                          <Text style={styles._price}>{val.price}</Text>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <Text style={[styles.text, { fontSize: 12, fontWeight: "bold" }]}>
            BROWSE ALL
          </Text>

          <View style={styles._row}>
            {newArr.map((val, i) => {
              return (
                <TouchableOpacity
                  style={styles._browse_img}
                  key={i}
                  onPress={() =>
                    this.props.navigation.navigate("ViewProfile", { data: val })
                  }
                >
                  <Image
                    source={{ uri: val.url }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  infoContainer: {},
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
    left: 110,
    width: 20,
    height: 80,
    alignItems: "center",
  },
  text: {
    color: "#52575D",
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "100",
  },
  image: {
    flex: 1,
    height: 150,
    width: 400,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
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
    alignItems: "center",
    flexDirection: "row",
  },

  stateBox: {
    alignItems: "center",
    flex: 1,
  },
  mediaImageContainer: {
    width: 310,
    height: 250,
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
  _name: {
    fontWeight: "bold",
  },
  _price: {
    color: "grey",
    fontWeight: "bold",
  },
  _browse_img: {
    height: 150,
    width: "45%",
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  _row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 15,
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
    width: "100%",
    alignSelf: "center",
    borderWidth: 2,
    height: 50,
    marginTop: 30,
  },
});
