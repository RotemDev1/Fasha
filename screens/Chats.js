import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { List, ListItem, Left, Body, Thumbnail } from "native-base";
import firebase from "firebase";
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      active: 0,
      notification: [],
      cuser: {},
      usersId: [],
      conatactedUser: [],
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;

    firebase.auth().onAuthStateChanged((user) => {
      var arr = [];
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            this.setState({ notification: data.notification, cuser: user.uid });
            this.getContactedUser(user.uid);
          }
        });
    });
  };

  getContactedUser = (id) => {
    var arr = [];
    firebase
      .database()
      .ref("messeges")
      .on("child_added", (res) => {
        let data = res.val();
        arr.push(res.key);
        this.setState({ usersId: arr });
      });
    this.getById("users", arr);
  };

  getById = (path, ids) => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((res) => {
        let conatactedUser = [];
        res.forEach((doc) => {
          for (var i = 0; i < ids.length; i++) {
            if (doc.id === ids[i] && doc.id !== this.state.cuser) {
              let value = doc.data();
              let data = {
                userName: value.name,
                uid: doc.id,
                userImg: value.avatar,
                messageText: "sent you a message",
              };
              conatactedUser.push(data);
              this.setState({ conatactedUser });
            }
          }
        });
      });
  };

  render() {
    let { active, notification, conatactedUser } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles._header}>
          <TouchableOpacity
            style={[styles._tabs, { borderBottomWidth: active === 0 ? 2 : 0 }]}
            onPress={() => this.setState({ active: 0 })}
          >
            <Text style={styles._chat_heading}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ active: 1 })}
            style={[styles._tabs, { borderBottomWidth: active === 1 ? 2 : 0 }]}
          >
            <Text style={styles._chat_heading}>notifications</Text>
          </TouchableOpacity>
        </View>
        {active === 0 ? (
          <>
            {conatactedUser.length !== 0 ? (
              conatactedUser.map((val, i) => {
                return (
                  <List
                    key={i}
                    style={{ borderBottomWidth: 1, borderColor: "#e2ecf1" }}
                  >
                    <ListItem
                      avatar
                      onPress={() =>
                        this.props.navigation.navigate("IndividualChat", {
                          data: val,
                          cuser: this.state.cuser,
                        })
                      }
                    >
                      <Left>
                        {val.userImg ? (
                          <Thumbnail source={{ uri: val.userImg }} />
                        ) : (
                          <Thumbnail source={require("../assets/chat1.png")} />
                        )}
                        {/* <Thumbnail source={val.userImg} /> */}
                      </Left>
                      <Body
                        style={{ borderBottomWidth: 0, paddingVertical: 20 }}
                        onPress={() => alert("SDf")}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                          {val.userName}
                        </Text>
                        <Text note>{val.messageText}</Text>
                      </Body>
                    </ListItem>
                  </List>
                );
              })
            ) : (
              <Text>There is no any message yet!</Text>
            )}
          </>
        ) : notification && notification.length !== 0 ? (
          notification.reverse().map((val, i) => {
            return (
              <List
                key={i}
                style={{ borderBottomWidth: 1, borderColor: "#e2ecf1" }}
              >
                <ListItem avatar>
                  <Left>
                    {val.avatar ? (
                      <Thumbnail source={{ uri: val.avatar }} />
                    ) : (
                      <Thumbnail source={require("../assets/chat1.png")} />
                    )}
                  </Left>
                  <Body style={{ borderBottomWidth: 0, paddingVertical: 20 }}>
                    <Text note>{val.text}</Text>
                  </Body>
                </ListItem>
              </List>
            );
          })
        ) : (
          <Text>There is no any notification yet!</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  _header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e2ecf1",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  _chat_heading: {
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "capitalize",
    textAlign: "center",
  },
  _tabs: {
    borderColor: "grey",
    width: "40%",
  },
});
