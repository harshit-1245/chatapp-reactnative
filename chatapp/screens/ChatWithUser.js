import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector"
import { MaterialIcons } from '@expo/vector-icons';
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
  const [recepientData,setRecepientData]=useState([])
  const [selectedImage,setSelectedImage]=useState("")
  const [chatMessage,setChatMessage]=useState({})
  const [selectedMessages,setSelectedMessages]=useState([])
  const scrollViewRef=useRef(null)


//logic for last message automatically visible
 const scrollToBottom=()=>{
  if(scrollViewRef.current){
    scrollViewRef.current.scrollToEnd({animated:false})
  }
 }


useEffect(()=>{
   scrollToBottom()
},[])

const handleContentSizeChange=()=>{
  scrollToBottom();
}





  const handleShowEmoji=()=>{
    setShowEmoji(!showEmoji)
  }

  //getting user image
  useEffect(()=>{
     const getRecepientId=async()=>{
      try {
        const response=await axios.get(`http://192.168.29.163:7000/user/getRecipient/${recepientId}`)
          
      
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
            <Feather onPress={() => navigation.goBack()} name="arrow-left" size={24} color="black" />
  
            {selectedMessages.length > 0 ? (
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>{selectedMessages.length}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      resizeMode: "cover",
                    }}
                    source={{ uri: recepientData?.image }}
                  />
                  <Text style={{ marginLeft: 5, fontWeight: "bold" }}>{recepientData?.username}</Text>
                </>
              </View>
            )}
          </View>
        );
      },
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="arrow-redo" size={24} color="black" />
            <Ionicons name="arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons onPress={()=>handleDelete(selectedMessages)} name="delete" size={24} color="black" />
          </View>
        ) : null,
    });
  }, [recepientData,selectedMessages]);
  //deleteting chat when we selcet
  const handleDelete=async(messageId)=>{
    try {
      const response = await fetch("http://192.168.29.163:7000/message/deletemessage",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({message: messageId}),//sending into body
      });
      if(response.ok){
        setSelectedMessages((prevSelectedMessage)=>prevSelectedMessage.filter((id)=>!messageId.includes(id)))
      };
      getChat()
    } catch (error) {
      console.error(error)
    }
  }
  
 
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

//logic for deleting long press
const handleSelectedMessage=(message)=>{
  //if its true then it moves furhter
  const isSelected = selectedMessages.includes(message._id);
//if already selected
  if(isSelected){
    setSelectedMessages((prevMessage)=>prevMessage.filter((id)=> id !== message._id))
  }else{
    setSelectedMessages((prevMessage)=>[...prevMessage,message._id,]);
  }
}

console.log(selectedMessages)




  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      {/* using ref for not scrolling mannually */}
      <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}> 
        {/* All the messages come here */}
        {Object.keys(chatMessage).map((key, index) => {
  const item = chatMessage[key];

  if (item.messageType === "text") {
    const isSelected=selectedMessages.includes(item._id)
    return (
      <Pressable
      onLongPress={()=>handleSelectedMessage(item)}
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
                alignItems:isSelected ?"flex-start":"",
              },
              isSelected && {width:"100%",backgroundColor:"#F0FFFF"}
        ]}
      >
        {/* actal text */}
        <Text style={{ fontSize: 20, textAlign: isSelected ? "right":"left" }}>
          {item?.messageText}
        </Text>
        {/* time it has some issue i will handle it */}
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
// problem with image UI isSelected
  if (item.messageType === "image") {
    const isSelected = selectedMessages.includes(item._id);
    const baseUrl = item.imageUrl;
  
    return (
      <Pressable
  onLongPress={() => handleSelectedMessage(item)}
  key={index}
  style={{
    alignSelf: item?.senderId?._id === userId ? "flex-end" : "flex-start",
    maxWidth: "60%",
    margin: 10,
    backgroundColor: isSelected ? "gray" : "",
  }}
>
  <Image
    style={{
      width: 200, // Adjust the width as needed
      height: 200, // Adjust the height as needed
      borderRadius: 7,
      borderWidth: isSelected ? 1 : 1, // Add a border when the image is selected
      borderColor: "blue", // Adjust the border color as needed
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
</Pressable>

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
