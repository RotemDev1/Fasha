import React from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import firebase from "firebase";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      newArr: [],
    };
  }

  componentDidMount = async () => {
    await firebase
      .firestore()
      .collection("Discover")
      .get()
      .then((res) => {
        let arr = [];
        res.forEach((doc) => {
          arr.push(doc.data());
          this.setState({ newArr: arr });
        });
      });
  };

  render() {
    let { newArr } = this.state;
    const filterCardItem = newArr.filter((search) => {
      return (
        (search.brand &&
          search.brand
            .toLowerCase()
            .includes(this.state.search.toLowerCase())) ||
        (search.userEmail &&
          search.userEmail
            .toLowerCase()
            .includes(this.state.search.toLowerCase()))
      );
    });
    return (
      <View style={styles.container}>
        <Image
          source={require("./../assets/Search.png")}
          style={{ marginBottom: 20 }}
        />
        <TextInput
          secureTextEntry={false}
          placeholder="Search all photos"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(search) => this.setState({ search })}
          style={styles._input}
        />
        {filterCardItem.length !== 0 ? (
          <>
            <Text style={[styles.text, { fontSize: 12, fontWeight: "bold" }]}>
              ALL RESULTS
            </Text>
            <ScrollView>
              <View style={styles._row}>
                {filterCardItem.map((val, i) => {
                  return (
                    <TouchableOpacity style={styles._browse_img} key={i}
                      onPress={() =>
                        this.props.navigation.navigate("ViewProfile", {
                          data: val,
                        })
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

              >
                <Text style={{ fontWeight: "bold" }}>SEE MORE</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingTop: 80,
    padding: 10,
  },
  _input: {
    borderWidth: 1.5,
    padding: 12,
    margin: 10,
    borderColor: "#000000",
    borderRadius: 5,
    marginHorizontal: 0,
  },
  text: {
    color: "#52575D",
  },
  _browse_img: {
    height: 100,
    width: "30%",
    marginTop: 10,
    borderRadius: 5,
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
