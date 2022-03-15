import React from "react";
import {
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import { AntDesign } from "@expo/vector-icons";

export default class ViewOwnImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  render() {
    let data = this.props.navigation.state.params.data;
    return (
      <ImageBackground
        source={require("../assets/Photoopen.png")}
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            padding: 10,
            paddingTop: 30,
          }}
        >
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require("./../assets/avater1.png")}
                  style={{ height: 35, width: 35 }}
                />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <Text style={styles._name}>{data.userName}</Text>
                <Text note>{data.tag}</Text>
              </Body>
              <Right>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ProfileScreen")
                  }
                >
                  <AntDesign name="close" size={20} color="white" />
                </TouchableOpacity>
              </Right>
            </ListItem>
          </List>
        </View>

        <View style={styles._image_section}>
          <Image source={{ uri: data.url }} style={styles._overly_img} />
        </View>
        <TouchableOpacity
          style={styles.submitContainer}
          onPress={() =>
            this.props.navigation.navigate("UpdateItem", {
              data: data,
            })
          }
        >
          <Text style={styles._upload_text}>UPLOAD ITEM</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: "center",
    resizeMode: "cover",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",

    marginTop: 32,
  },

  _image_section: {
    flex: 2,
    justifyContent: "flex-start",
  },
  _overly_img: {
    width: "100%",
    resizeMode: "stretch",
    height: 270,
  },
  _name: {
    fontWeight: "bold",
    color: "white",
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
    alignSelf: "center",
    borderWidth: 2,
    backgroundColor: "black",
    width: 120,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  _upload_text: {
    padding: 3,
    color: "white",
    fontWeight: "bold",
  },
});
