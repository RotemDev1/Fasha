import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CardItem } from "native-base";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
const ChatBox = (props) => {
  let [cuser, setCuser] = useState("");
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCuser(user.uid);
    });
  }, []);
  let isCurrentUser = props.data.sendBy === cuser ? false : true;
  console.log(props);
  return (
    <View
      style={{
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        padding: 6,
      }}
    >
      <View
        style={[
          styles.chatContainer,
          isCurrentUser && {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
          },
        ]}
      >
        {isCurrentUser ? (
          <>
            <View
              style={{
                backgroundColor: "#f1f3f4",
                borderRadius: 5,
                marginRight: 5,
                justifyContent: "center",
                minWidth: 100,
                padding: 10,
                maxWidth: 200,
              }}
            >
              <Text style={[styles.chatTxt]}>{props.msg}</Text>
            </View>
            <CardItem cardBody>
              <TouchableOpacity style={styles._image_view}>
                <Image
                  source={{ uri: props.img }}
                  resizeMode="cover"
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    borderWidth: 1,
                    maxWidth: 200,
                  }}
                />
              </TouchableOpacity>
            </CardItem>
          </>
        ) : (
          <>
            <CardItem cardBody>
              <TouchableOpacity style={styles._image_view}>
                <Image
                  source={{ uri: props.img }}
                  resizeMode="cover"
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            </CardItem>
            <View
              style={{
                backgroundColor: "#f1f3f4",
                borderRadius: 5,
                marginLeft: 5,
                justifyContent: "center",
                minWidth: 100,
                padding: 10,
                maxWidth: 200,
              }}
            >
              <Text style={[styles.chatTxt]}>{props.msg}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
export default ChatBox;
let styles = StyleSheet.create({
  chatTxt: {
    color: "black",
    fontSize: 12,
    fontWeight: "500",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flexDirection: "row",
  },
  _image_view: {
    borderRadius: 50,
    backgroundColor: "white",
    padding: 5,
    borderWidth: 0.5,
    borderColor: "#9e9e9e4a",
  },
});
