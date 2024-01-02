import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import {useNavigation} from "@react-navigation/native"
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {UserType} from "../UserContext"


const HomeScreen = () => {
 const navigation=useNavigation()
 const {userId,setUserId}=useContext(UserType)
 
 useLayoutEffect(()=>{
  navigation.setOptions({
    headerTitle:"",
    headerLeft:()=>(
      <Text style={{fontSize:16,fontWeight:"bold"}}>Chat App</Text>
    ),
    headerRight:()=>(
     <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
<AntDesign name="message1" size={24} color="black" />
<Ionicons name="people-outline" size={24} color="black" />
     </View>
    )
  })
 },[])
  

  return (
    <View>
      <Text>HomeScreen</Text>
    
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})