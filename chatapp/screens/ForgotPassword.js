import { View, Text, KeyboardAvoidingView, TextInput, Pressable, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useNavigation} from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = () => {
const navigation = useNavigation()
  const [oldPassword,setOldPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");



  const handleSetPassword = async () => {
    const user = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
  
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.post("http://192.168.29.163:7000/user/changepassword", user, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        Alert.alert("Password changed");
        setOldPassword("");
        setNewPassword("");
        navigation.navigate("Home");
      } else {
        Alert.alert("Authentication token not found");
      }
    } catch (error) {
      Alert.alert("Something went wrong", error.toString());
    }
  };
  


   
   

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
       <View style={{flex:1,backgroundColor:"white",padding:10,alignItems:"center"}}> 
       <KeyboardAvoidingView>
        <View style={{marginTop:100}}>
          <Text style={{color:"#4A55A2",fontSize:17,fontWeight:"600",textAlign:"center"}}>Forgot Passoword</Text>
          <Text style={{fontSize:17,fontWeight:"600",marginTop:15,textAlign:"center"}}>Don't worry i'll add some new feature</Text>
        </View>

        <View style={{marginTop:50,marginRight:100}}>
        <View>
          <Text style={{fontSize:oldPassword ?18 :18,fontWeight:"600",color:"gray"}}>old password</Text>
          <TextInput
          value={oldPassword}
          onChangeText={(text)=>setOldPassword(text)}
          placeholderTextColor={"black"} placeholder='Enter your old password' />
        </View>
        </View>

        {/* password region */}
        <View style={{marginTop:50}}>
        <View>
          <Text style={{fontSize:newPassword ?18 :18,fontWeight:"600",color:"gray"}}>New Password</Text>
          <TextInput
          value={newPassword}
          onChangeText={(text)=>setNewPassword(text)}
          placeholderTextColor={"black"} placeholder='Enter your new password' />
        </View>
        </View>
       

        <View>
         <View>
          <Pressable 
          onPress={handleSetPassword}
          style={{
            width:200,
            backgroundColor:"#4A55A2",
            padding:15,
            marginTop:50,
            marginLeft:"auto",
            marginRight:"auto",
            borderRadius:6
          }}
          >
            <Text 
            style={{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}}>Set Passoword</Text>
          </Pressable>
          <Pressable 
          onPress={()=>navigation.navigate("Register")}
          
          style={{marginTop:15}}>
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>New feature coming soon</Text>
          </Pressable>
         </View>
        </View>
       </KeyboardAvoidingView>
  
       </View>
       </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen