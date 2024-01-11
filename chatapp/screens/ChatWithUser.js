import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector"
import {useNavigation,useRoute} from "@react-navigation/native"
import { Feather } from '@expo/vector-icons';
import axios from "axios"
import { UserType } from '../UserContext';

const ChatWithUser = () => {
  const {userId}=useContext(UserType)
  const navigation=useNavigation()
  const route = useRoute();
  const {recepientId} = route.params
  const [showEmoji,setShowEmoji]=useState(false)
  const [message,setMessage]=useState("")
  const [apiImage,setApiImage]=useState()
  const [username,setUsername]=useState()
  const [recepientData,setRecepientData]=useState([])
  const [selectedImage,setSelectedImage]=useState("")
  const [messages,setMessages]=useState("")

  const handleShowEmoji=()=>{
    setShowEmoji(!showEmoji)
  }

  const handleSend = async (messageType, imageUrl) => {
    try {
      const requestData = {
        senderId: userId,
        recepientId: recepientId,
        messageType: messageType,
      };
  
      if (messageType === "text") {
        requestData.messageText = message;
      } else if (messageType === "image") {
        requestData.imageUrl = imageUrl;
      }
  
      const response = await axios.post("http://192.168.29.163:7000/message/send", requestData);
  
      if (response.status === 200) {
        setMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  
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

  useEffect(()=>{
    const getChat=async()=>{
      const response=await axios.get(`http://192.168.29.163:7000/message/${userId}/${recepientId}`)
      console.log(response.data)
      setMessages(response.data);
    }
    getChat()
  },[])
  
  console.log(messages)

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {/* All the messages come here */}
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
          <Entypo name="camera" size={24} color="gray" style={styles.icon} />
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
