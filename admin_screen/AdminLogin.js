import React , {Component} from "react";
import { SafeAreaView , ScrollView, ColorPropType, PickerIOSComponent, StyleSheet,Image,ImageSize, Text, TouchableOpacity, View } from 'react-native';
import { Container, Content , Header , Form, Input, Item ,Button , Label} from 'native-base'
import firebase from 'firebase'
import {Ionicons,MaterialIcons} from "@expo/vector-icons";


export default class AdminLogin extends React.Component{

  signOutUser = async () => {
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}
  
  print =  () => { 
       let uid = firebase.auth().currentUser.uid }

  render(){
    let uid =firebase.auth().currentUser.uid 

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statBox} onPress={() => this.signOutUser()}>
              <Image source={require("../assets/logout.png")}></Image>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={[styles.text,{ fontWeight:"200",fontSize:36}]}>{uid}</Text>
          </View>

          <View style={{marginTop:60,alignItems:"center",justifyContent:"center"}}>
              <Image source={require("../assets/Discover.jpg")}></Image>
          </View>

          <View style={styles.infoContainer}>
            
            <Text style={[styles.text,{ color:"#AEB5BC",fontSize:14}]}>Whats new today</Text>
          </View>
         
          <View style={{marginTop:32}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../assets/media1.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../assets/media2.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../assets/media3.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
            </ScrollView>
          </View>
          
         

          <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.statBox} onPress={()=> this.props.navigation.navigate('ProfileScreen')}>
              <Image source={require("../assets/person.jpg")}></Image>
            </TouchableOpacity>
          
          
          
            <TouchableOpacity style={styles.statBox} onPress={()=> this.props.navigation.navigate('Discover')}>
              <Image source={require("../assets/h.jpg")}></Image>
            </TouchableOpacity>
          </View> 

         

        </ScrollView>
      </SafeAreaView>
     );
    }
  }


// render(){
//     return(

//       <View style={styles.container}>
        
//         <Image source={require("../assets/Discover.jpg")}></Image>
             

      
//       <TouchableOpacity style={styles.submitContainer} onPress={() => this.signOutUser()}>
//            <Image source={require("../assets/logout.png")}></Image>
//       </TouchableOpacity>
      
//       </View>

//     );
//   }
// }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        
    },
    infoContainer:{
      alignSelf:"center",
      alignItems:"center",
      marginTop:16,
    },
    statsContainer:{
      flexDirection:"row",
      alignSelf:"center",
      marginTop:10,
      left:110,
      width:20,
      height:10,
    },
    text:{
      fontFamily:"HelveticaNeue",
      color:"#52575D"
    },
    subText:{
      fontSize:12,
      color:"#AEB5BC",
      textTransform:"uppercase",
      fontWeight:"100"
    },
    image:{
      flex:1,
      width:undefined,
      height:undefined

    },
    titleBar:{
      flexDirection:"row",
      justifyContent:"space-between",
      marginTop:24,
      marginHorizontal:16
    },
    profileImage:{
      width:200,
      height:200,
      borderRadius:100,
      overflow:"hidden",
    },
    dm:{
      backgroundColor:"#41444B",
      position:"absolute",
      top:20,
      width:40,
      height:40,
      borderRadius:20,
      alignItems:"center",
      justifyContent:"center",
    },
    active:{
      backgroundColor:"#34FFB9",
      position:"absolute",
      bottom:28,
      left:10,
      padding:4,
      height:20,
      width:20,
      borderRadius:10,

    },
    add:{
      backgroundColor:"#41444B",
      position:"absolute",
      bottom:0,
      right:0,
      width:60,
      height:60,
      borderRadius:30,
      alignItems:"center",
      justifyContent:"center",
    },
    infoContainer:{
      alignSelf:"center",
      alignItems:"center",
      marginTop:16,
      flexDirection:"row",

    },

    stateBox:{
      alignItems:"center",
      flex:1
    },
    mediaImageContainer:{
      width:180,
      height:200,
      borderRadius:12,
      overflow:"hidden",
      marginHorizontal:10

    },
    mediaCount:{
      backgroundColor:"#41444B",
      position:"absolute",
      top:"50%",
      marginTop:-50,
      marginLeft:38,
      width:100,
      height:100,
      alignItems:"center",
      justifyContent:"center",
      borderRadius:12,
      shadowColor:"rgba(0,0,0,0.38)",
      shadowOffset:{width:0,height:10},
      shadowRadius:20,
      shadowOpacity:1
    },
    recent:{
      marginLeft:78,
      marginTop:32,
      marginBottom:6,
      fontSize:10
    },
    recentItem:{
      flexDirection:"row",
      alignItems:"flex-start",
      marginBottom:16,
    },
    recentItemIndicator:{
      backgroundColor:"#CABFAB",
      padding:4,
      height:12,
      width:12,
      borderRadius:6,
      marginTop:3,
      marginRight:20
    },
    
});


    // submitContainer: {
     
    //   borderRadius:11,
    //   paddingVertical:1,
    //   marginTop:8,
    //   alignItems:"center",
    //   justifyContent:"center",
    //   shadowColor:"rgba(97,61,10,97)",
    //   shadowOffset:{width:0,height:2},
    //   shadowOpacity:1,
    //   shadowRadius:3,
    // },