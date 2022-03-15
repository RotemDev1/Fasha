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
import { Container, Form } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default class updateItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      uid: null,
      price: "",
      brand: "",
      color: "",
      category: "",
      desc: "",
      url: "",
      productId: "",
      currentUser: {},
    };
  }

  componentDidMount() {
    this.checkIfLoggedIn();
    let propsData = this.props.navigation.state.params.data;
    this.setState({
      email: propsData.userEmail,
      name: propsData.userName,
      uid: propsData.uid,
      price: propsData.price,
      brand: propsData.brand,
      color: propsData.color,
      category: propsData.category,
      desc: propsData.desc,
      url: propsData.url,
      productId: propsData.productId,
    });
  }

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

  updateProduct = () => {
    let propsData = this.props.navigation.state.params.data;
    let { price, brand, color, category, desc, productId, name } = this.state;
    firebase
      .firestore()
      .collection("Discover")
      .doc(productId)
      .update({ price, brand, color, category, desc, productId })
      .then((res) => {
        let savedUser = propsData.saved;
        if (savedUser !== undefined) {
          for (var i = 0; i < savedUser.length; i++) {
            firebase
              .firestore()
              .collection("users")
              .doc(savedUser[i])
              .update({
                notification: firebase.firestore.FieldValue.arrayUnion({
                  text: name + " just updated item you saved",
                  updatedBy: name,
                  updatedAt: new Date(),
                }),
              });
            this.props.navigation.navigate("ProfileScreen");
          }
        } else {
          this.props.navigation.navigate("ProfileScreen");
        }
      })
      .catch((err) => {
        console.log("================>", err);
      });
  };

  deleteProduct = () => {
    let { productId } = this.state;
    firebase
      .firestore()
      .collection("Discover")
      .doc(productId)
      .delete()
      .then((res) => {
        this.props.navigation.navigate("ProfileScreen");
      })
      .catch((err) => {
        console.log("=====something went wrong=======>", err);
      });
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log(e);
    }
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
    let { price, brand, color, category, desc, url, uid } = this.state;

    return (
      <Container style={styles.container}>
        <View style={styles._header}>
          <TouchableOpacity
            style={styles.titleBar}
            onPress={() => this.props.navigation.navigate("ProfileScreen")}
          >
            <Ionicons name="return-up-back" size={24} color="black" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            <View style={{ marginVertical: 20 }}>
              <Image source={require("../assets/updateItem.png")}></Image>
            </View>

            <Form>
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
                value={desc}
                autoCapitalize="none"
                onChangeText={(desc) => this.setState({ desc })}
                style={styles._input}
              />
              <View style={[styles._row, { marginHorizontal: 20 }]}>
                <TouchableOpacity
                  style={[styles.submitContainer]}
                  onPress={() => this.deleteProduct()}
                >
                  <Text style={styles._upload_text}>DELETE ITEM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitContainer}
                  onPress={() => this.updateProduct()}
                >
                  <Text style={styles._upload_text}>UPDATE ITEM</Text>
                </TouchableOpacity>
              </View>
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
    width: 130,
    alignSelf: "center",
    height: 40,
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
