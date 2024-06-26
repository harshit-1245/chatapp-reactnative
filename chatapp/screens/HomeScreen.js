import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {useNavigation} from "@react-navigation/native"
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {UserType} from "../UserContext"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import base64 from "base-64"
import User from '../components/User';
import { Entypo } from '@expo/vector-icons';



const HomeScreen = () => {
 const navigation=useNavigation()
 const {userId,setUserId}=useContext(UserType)
 const [users,SetUsers]=useState([])
 const [dropdown,setDropDown]=useState(false)

 const decodeJWTToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
      const decodedToken = {
        header: JSON.parse(base64.decode(headerEncoded)),
        payload: JSON.parse(base64.decode(payloadEncoded)),
        signature: signatureEncoded, // This remains base64 encoded
      };

      // Access the decoded token's payload.userId
      const userId = decodedToken.payload.userId;
     setUserId(userId)
    } else {
      console.error('Token not found in AsyncStorage');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    // Handle error as needed
  }
};



 useEffect(()=>{
  const fetchUser=async()=>{
   try {
    const response=await fetch(`http://192.168.74.201:7000/user/${userId}`)
    const data=await response.json()
    
    SetUsers(data)
   } catch (error) {
    console.log(error)
   }
  }
  fetchUser()
  decodeJWTToken();
 },[])

 

 useLayoutEffect(()=>{
  navigation.setOptions({
    headerTitle:"",
    headerLeft:()=>(
      <Text style={{fontSize:16,fontWeight:"bold"}}>Chat App</Text>
    ),
    headerRight:()=>(
     <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
<AntDesign onPress={()=>navigation.navigate("Chat")} name="message1" size={24} color="black" />
<Ionicons onPress={()=>navigation.navigate("Friends")} name="people-outline" size={24} color="black" />
<Entypo name="dots-three-vertical" size={24} color="black" />
     </View>
    )
  })
 },[])

 const usersArray = Object.values(users);

  return (
    <>
 <View>
  <View style={{padding:10}}>
    {/* {Object.keys(users).map((key,index) => (
      <User key={index} item={users[key]} />
    ))} */}

{usersArray.map((item, index) => (
<User key={index} item={item}/>
))}
 

  </View>
</View>

  
  </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})