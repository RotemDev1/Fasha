import React , {Component} from "react";
import {View, Text,StyleSheet, ActivityIndicator} from "react-native";

import  firebase from "firebase"


class LoadingScreen extends Component{

    componentDidMount(){
        this.checkIfLoggedIn();
    }

    
    checkIfLoggedIn = () =>{
        
        firebase.auth().onAuthStateChanged(user=>
        {
            if(user){
                this.props.navigation.navigate('Discover');
            }
            else{
                this.props.navigation.navigate('Home');
            }
        });
    };

    render() {
    return(
      <View style={styles.container}>
        {/* <Text>Welcome to fasha , the app will loading soon </Text> */}
        <ActivityIndicator size="large"/>

      </View>
    );
  }
}



export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent: "center",
        
    },
    submitContainer: {
     
        borderRadius:11,
        paddingVertical:1,
        marginTop:8,
        alignItems:"center",
        justifyContent:"center",
        shadowColor:"rgba(97,61,10,97)",
        shadowOffset:{width:0,height:2},
        shadowOpacity:1,
        shadowRadius:3,
    
    
      }
});