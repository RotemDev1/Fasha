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
export default class ViewImage extends React.Component {
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
                  onPress={() => this.props.navigation.navigate("Discover")}
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
  submitContainer: {
    flexDirection: "row",
    borderRadius: 1,
    paddingVertical: 1,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(97,61,10,97)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    margin: 5,
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
});
