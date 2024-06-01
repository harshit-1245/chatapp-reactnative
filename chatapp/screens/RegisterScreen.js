import { View, Text, KeyboardAvoidingView, TextInput, Pressable, ScrollView, Alert, Button, Image } from 'react-native'
import React, { useState } from 'react'
import axios from "axios"
import { SafeAreaView } from 'react-native-safe-area-context'
import {useNavigation} from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { EvilIcons } from '@expo/vector-icons';







const RegisterScreen = () => {
  const navigation=useNavigation()
const [username,setUserName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [image,setImage]=useState("")



const handleRegister = () => {
  const user = {
    username: username,
    email: email,
    password: password,
    image: image
  };

  axios.post("http://192.168.74.201:7000/user/register", user)
    .then((response) => {
      Alert.alert("Registration Successfully");

      
      
      
      setUserName("");
      setEmail("");
      setPassword("");
      setImage("");
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      Alert.alert("Registration Failed");
    });
};
//function for accepting image
const uploadImage = async (mode) => {
  try {
    let result={};
    if (mode === "gallery") {
      // Handle gallery mode
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[1,1],
        quality:1,
      })
      if(!result.cancelled){
        await saveImage(result.assets[0].uri);
      }

    } else {
      // Handle camera mode
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        // Save image function
        await saveImage(result.assets[0].uri);
      }
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    // Handle error
  }
};




const saveImage=async(image)=>{
  try {
    setImage(image)
  } catch (error) {
    throw new Error("Something went wrong")
  }
}



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
       <View style={{flex:1,backgroundColor:"white",padding:10,alignItems:"center"}}> 
       <KeyboardAvoidingView>
        <View style={{marginTop:40}}>
          <Text style={{color:"#4A55A2",fontSize:17,fontWeight:"600",textAlign:"center"}}>Register</Text>
          <Text style={{fontSize:17,fontWeight:"600",marginTop:15,textAlign:"center"}}>Register to your Account</Text>
        </View>
      {/* name section */}
      <View style={{marginTop:50,marginRight:100}}>
        <View>
          <Text style={{fontSize:email ?18 :18,fontWeight:"600",color:"gray"}}>username</Text>
          <TextInput
          value={username}
          onChangeText={(text)=>setUserName(text)}
          placeholderTextColor={"black"} placeholder='Enter your name' />
        </View>
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
        <View style={{marginTop:50}}>
  <View>
    <Text style={{fontSize: email ? 18 : 18, fontWeight: "600", color: "gray"}}>Image</Text>
    <View>
      {image && (
        <Image
          resizeMode="cover"
          resizeMethod="scale"
        
          source={{ uri: image }}
        />
      )}
      <Button title='Select Image' onPress={()=>uploadImage()} />
      <EvilIcons onPress={()=>uploadImage("gallery")} name="image" size={24} color="black" />
    </View>
  </View>
</View>

        <View>
         <View>
          <Pressable 
          onPress={handleRegister}
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
            <Text style={{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}}>Register</Text>
          </Pressable>
          <Pressable 
          onPress={()=>navigation.navigate("Home")}
          
          style={{marginTop:15}}>
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>Already register? Sign In</Text>
          </Pressable>
         </View>
        </View>
       </KeyboardAvoidingView>
  
       </View>
       </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen


