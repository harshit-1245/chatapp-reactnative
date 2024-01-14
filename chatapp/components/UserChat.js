import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';

const UserChat = ({item}) => {
  const { userId, setUserId } = useContext(UserType);
  const [chatMessage, setChatMessage] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const getChat = async () => {  
    try {
      const response = await axios.get(`http://192.168.29.163:7000/message/${userId}/${item._id}`);
      setChatMessage(response.data);

      // Set the last message here
      const userMessages = response.data.filter((message) => message.messageType === "text" || message.messageType === "image");
      const lastUserMessage = userMessages[userMessages.length - 1];
      setLastMessage(lastUserMessage);
    } catch (error) {
      console.error(error)
    }
  }

  const refreshChat = () => {
    getChat();
  }

  useEffect(() => {
    getChat();

    // Refresh the chat every 60 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      refreshChat();
    }, 60000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [])

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  }

  const navigation = useNavigation();
  
  return (
    <Pressable 
      onPress={() => navigation.navigate("ChatMessage", { recepientId: item._id })}
      style={{ flexDirection:"row", alignItems:"center", gap:10, borderWidth:0.7, borderColor:"#D0D0D0", borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0, padding:10}}
    >
      <Image style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }} source={{ uri: item?.image }}/>
      <View>
        <Text style={{ fontWeight:"bold" }}>{item?.username}</Text>
        {lastMessage && (
          <Text style={{ marginTop:5, color:"gray", fontWeight:"500" }}>{lastMessage.messageText}</Text>
        )}
      </View>
      <View style={{ marginLeft:80 }}>
        <Text style={{ fontSize:11, fontWeight:"400", color:"#585858", marginLeft:80 }}>
          {lastMessage && formatTime(lastMessage?.updatedAt)}
        </Text>
      </View>
    </Pressable>
  )
}

export default UserChat;
