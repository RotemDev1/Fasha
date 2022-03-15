import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase";
import ChatBox from "./../components/chatbox";

import { Ionicons } from "@expo/vector-icons";
import { senderMsg, recieverMsg } from "../network";
const ChatScreen = (props) => {
  const [messages, setMessages] = useState([]);
  const [msgValue, setMsgValue] = useState("");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    let propsData = props.navigation.state.params.data;
    let other_User_UId = propsData.uid;
    let currentUserId = props.navigation.state.params.cuser;

    firebase
      .database()
      .ref("messeges")
      .child(currentUserId)
      .child(other_User_UId)
      .on("value", (dataSnapshot) => {
        let msgs = [];
        dataSnapshot.forEach((child) => {
          msgs.push({
            sendBy: child.val().messege.sender,
            recievedBy: child.val().messege.reciever,
            msg: child.val().messege.msg,
            img: child.val().messege.img,
          });
          setMessages(msgs.reverse());
        });
      });
    firebase.auth().onAuthStateChanged(async (user) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          }
        });
    });
  }, []);

  let propsData = props.navigation.state.params.data;
  let other_User_UId = propsData.uid;
  let otherUserName = propsData.userName;
  let currentUserId = props.navigation.state.params.cuser;

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // SEND MESSAGE
  const handleSend = () => {
    setMsgValue("");
    if (msgValue) {
      if (messages.length === 0) {
        firebase
          .firestore()
          .collection("users")
          .doc(other_User_UId)
          .update({
            notification: firebase.firestore.FieldValue.arrayUnion({
              text: userData.name + " just sent you a message",
              setnbydBy: userData.name,
              sentAt: new Date(),
              avatar: userData.avatar,
            }),
          });
        senderMsg(msgValue, currentUserId, other_User_UId, "").then(() => {});
        recieverMsg(msgValue, currentUserId, other_User_UId, "").then(() => {});
      } else {
        senderMsg(msgValue, currentUserId, other_User_UId, "").then(() => {});
        recieverMsg(msgValue, currentUserId, other_User_UId, "").then(() => {});
      }
    }
    return (
      <Send {...props}>
        <TouchableOpacity onPress={() => handleSend()}>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="#2e64e5"
          />
        </TouchableOpacity>
      </Send>
    );
  };

  const handleOnChange = (text) => {
    setMsgValue(text);
  };
  //   * On image tap
  const imgTap = (chatImg) => {
    navigation.navigate("ShowFullImg", { name, img: chatImg });
  };

  console.log("--------------ShowFullImg--------->", messages);
  return (
    <View style={styles.container}>
      <View style={styles._header}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Chats")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles._chat_heading}>{otherUserName}</Text>
        <Text />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
        >
          <Fragment>
            <FlatList
              inverted
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <ChatBox
                  msg={item.msg}
                  data={item}
                  img={item.img}
                  onImgTap={() => imgTap(item.img)}
                />
              )}
            />

            <View style={styles.sendMessageContainer}>
              <TextInput
                placeholder="Type Here"
                multiline
                style={styles.input}
                value={msgValue}
                onChangeText={(text) => handleOnChange(text)}
              />

              <View style={styles.sendBtnContainer}>
                <TouchableOpacity
                  onPress={() => handleSend()}
                  style={{ marginRight: 8 }}
                >
                  <FontAwesome name="send" color="grey" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginTop: 0,
  },
  _header: {
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e2ecf1",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  _chat_heading: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    paddingLeft: 16,
    padding: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#9e9e9e87",
    borderRadius: 5,
  },
  sendMessageContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: 4,
    padding: 5,
    borderRadius: 5,
  },
  sendBtnContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
