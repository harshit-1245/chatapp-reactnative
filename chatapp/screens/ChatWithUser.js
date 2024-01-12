import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector"
import {useNavigation,useRoute} from "@react-navigation/native"
import { Feather } from '@expo/vector-icons';
import axios from "axios"
import { UserType } from '../UserContext';
import * as ImagePicker from "expo-image-picker"

const ChatWithUser = () => {
  const {userId}=useContext(UserType)
  const navigation=useNavigation()
  const route = useRoute();
  const {recepientId} = route.params
  const [showEmoji,setShowEmoji]=useState(false)
  const [message,setMessage]=useState("")
  const [messageType,setMessageType]=useState("text")
  const [apiImage,setApiImage]=useState()
  const [username,setUsername]=useState()
  const [recepientData,setRecepientData]=useState([])
  const [selectedImage,setSelectedImage]=useState("")
  const [chatMessage,setChatMessage]=useState({})

  const handleShowEmoji=()=>{
    setShowEmoji(!showEmoji)
  }

  //getting user image
  useEffect(()=>{
     const getRecepientId=async()=>{
      try {
        const response=await axios.get(`http://192.168.29.163:7000/user/${recepientId}`)
          
        //extracting username

        const nameArray=response.data;
        const username=nameArray.map(item=>item.username)
         setUsername(username)
         //----------------------------------------------------------------------------------------------------

        const dataArray = response.data;
        // Extracting image URLs into a new array
        const imageUrls = dataArray.map(item => item.image);
        
        // Logging the array of image URLs
        setApiImage(imageUrls)

       

       
        setRecepientData(response.data)
      } catch (error) {
        console.log(error)
      }
     }
     getRecepientId()
  },[])
 
 
  //designing header part
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather onPress={()=>navigation.goBack()} name="arrow-left" size={24} color="black" />
            <View style={{flexDirection:"row",alignItems:"center"}}>
              {apiImage && apiImage.length > 0 && (
                <>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      resizeMode: "cover",
                    }}
                    source={{ uri: apiImage[0] }}
                  />
                  <Text style={{marginLeft:5,fontWeight:"bold"}}>{username[0]}</Text>
                </>
              )}
            </View>
          </View>
        );
      },
    });
  }, [recepientData]);
  
 
  //get chat of two user   
  const getChat=async()=>{
    try {
      const response=await axios.get(`http://192.168.29.163:7000/message/${userId}/${recepientId}`)
     
      setChatMessage(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    
    getChat()
  },[])
 
  
  const formatCurrentTime = () => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date().toLocaleString("en-US", options);
};

// Example usage:
const currentTimeFormatted = formatCurrentTime();

//----------------------------------handling button send
const handleSend = async () => {
  try {
    const requestData = {
      senderId: userId,
      recepientId: recepientId,
      messageType: messageType,
    };

    if (messageType === "text") {
      requestData.messageText = message;
    } else if (messageType === "image") {
      requestData[messageType] = selectedImage;
    }

    const response = await axios.post(
      "http://192.168.29.163:7000/message/send",
      requestData
    );

    if (response.status === 200) {
      setMessage("");
      setSelectedImage("");
      setMessageType("text"); // Reset messageType after sending
      getChat();
    }
  } catch (error) {
    console.error("Error details:", error.response.data);
    console.error("Status code:", error.response.status);
  }
};


const saveImage = async (image, messageType) => {
  try {
    setSelectedImage(image);
    setMessageType(messageType); // Set the messageType based on the selected mode
    getChat(); // Assuming you want to refresh the chat after sending an image
  } catch (error) {
    console.error(error);
  }
};

// Function for uploading image
const uploadImage = async (mode) => {
  try {
    let result = {};
    if (mode === "gallery") {
      // Handling gallery mode
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        // Call saveImage with the selected image and set the messageType to 'image'
        await saveImage(result.assets[0].uri, "image");
      }
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        // Call saveImage with the selected image and set the messageType to 'image'
        await saveImage(result.assets[0].uri, "image");
      }
    }
  } catch (error) {
    console.error(error);
  }
};






  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {/* All the messages come here */}
        {Object.keys(chatMessage).map((key, index) => {
  const item = chatMessage[key];

  if (item.messageType === "text") {
    return (
      <Pressable
        key={index}
        style={[
          // If user is sending
          item?.senderId?._id === userId
            ? {
                alignSelf: "flex-end",
                backgroundColor: "#DCF8C6",
                padding: 8,
                maxWidth: "60%",
                borderRadius: 7,
                margin: 10,
              }
            : {
                alignSelf: "flex-start",
                backgroundColor: "white",
                padding: 8,
                margin: 10,
                borderRadius: 7,
                maxWidth: "60%",
              },
        ]}
      >
        <Text style={{ fontSize: 20, textAlign: "left" }}>
          {item?.messageText}
        </Text>
        <Text
          style={{
            textAlign: "right",
            fontSize: 9,
            color: "gray",
            marginTop: 5,
          }}
        >
          {formatCurrentTime(currentTimeFormatted)}
        </Text>
      </Pressable>
    );
  }

  if (item.messageType === "image") {
    const baseUrl = item.imageUrl;

    return (
      <View
        key={index}
        style={{
          alignSelf:
            item?.senderId?._id === userId ? "flex-end" : "flex-start",
          maxWidth: "60%",
          margin: 10,
        }}
      >
        <Image
          style={{
            width: 200, // Adjust the width as needed
            height: 200, // Adjust the height as needed
            borderRadius: 7,
          }}
          source={{ uri: baseUrl }}
        />
        <Text
          style={{
            textAlign: "right",
            fontSize: 9,
            color: "gray",
            marginTop: 5,
          }}
        >
          {formatCurrentTime(currentTimeFormatted)}
        </Text>
      </View>
    );
  }

  return null; // or render something else for other message types
})}

        
      </ScrollView>

      <View style={{flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    marginBottom:showEmoji ? 0 : 25}}>
        <Entypo onPress={handleShowEmoji} name="emoji-happy" size={24} color="black" style={styles.icon} />
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder='Type text here' value={message} onChangeText={(text)=>setMessage(text)} />
          <Entypo onPress={()=>uploadImage("gallery")} name="camera" size={24} color="gray" style={styles.icon} />
          <FontAwesome name="microphone" size={24} color="gray" style={styles.icon} />
        </View>
        <Pressable onPress={()=>handleSend("text")} style={styles.sendButton}>
          <FontAwesome name="send" size={24} color="white" style={{ alignSelf: 'center' }} />
        </Pressable>
      </View>
      
       {showEmoji && (
        <EmojiSelector 
        onEmojiSelected={(emoji)=>{
            setMessage((prevMessage)=>prevMessage+emoji);
        }}
        style={{height:250}}/>
       )}

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: "black",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatWithUser;
