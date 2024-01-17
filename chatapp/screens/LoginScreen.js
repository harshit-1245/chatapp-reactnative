import { View, Text, KeyboardAvoidingView, TextInput, Pressable, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useNavigation} from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"


const LoginScreen = () => {
const navigation=useNavigation();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

//you dont need to login again and again 
  useEffect(()=>{
    const checkLoginStatus=async()=>{
      const loginToken=await AsyncStorage.getItem("authToken")
      if(loginToken){
        navigation.replace("Main")
      }
    }
    checkLoginStatus()
    },[])



   
    const handleLogin=()=>{
      const user={
        email:email,
        password: password
      }
           
    axios.post("http://192.168.29.163:7000/user/login",user)
    .then((response) => {
      Alert.alert("Login Successful");
     

      const token = response.data.data?.accessToken;
      
     AsyncStorage.setItem("authToken",token)

      setEmail("");
      setPassword("");
    
    
      
    })
    .catch((error) => {
      console.error("Login failed:", error);
      Alert.alert("Login Failed");
    });
    }






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
       <View style={{flex:1,backgroundColor:"white",padding:10,alignItems:"center"}}> 
       <KeyboardAvoidingView>
        <View style={{marginTop:100}}>
          <Text style={{color:"#4A55A2",fontSize:17,fontWeight:"600",textAlign:"center"}}>Sign In</Text>
          <Text style={{fontSize:17,fontWeight:"600",marginTop:15,textAlign:"center"}}>Sign in to your Account</Text>
        </View>

        <View style={{marginTop:50,marginRight:100}}>
        <View>
          <Text style={{fontSize:email ?18 :18,fontWeight:"600",color:"gray"}}>Email</Text>
          <TextInput
          value={email}
          onChangeText={(text)=>setEmail(text)}
          placeholderTextColor={"black"} placeholder='Enter your email' />
        </View>
        </View>

        {/* password region */}
        <View style={{marginTop:50}}>
        <View>
          <Text style={{fontSize:email ?18 :18,fontWeight:"600",color:"gray"}}>Password</Text>
          <TextInput
          value={password}
          onChangeText={(text)=>setPassword(text)}
          placeholderTextColor={"black"} placeholder='Enter your password' />
        </View>
        </View>
        <View style={{
            marginTop: 12,
            marginLeft:150,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
        
           <Text 
           onPress={()=>navigation.navigate("forgot")}
           style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password?
          </Text>
        </View>

        <View>
         <View>
          <Pressable 
          onPress={handleLogin}
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
            <Text style={{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}}>Login</Text>
          </Pressable>
          <Pressable 
          onPress={()=>navigation.navigate("Register")}
          
          style={{marginTop:15}}>
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>Don't have an Account? Signup</Text>
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