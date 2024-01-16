import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import {useNavigation,useRoute} from "@react-navigation/native"

const StaredScreen = () => {
  const navigation=useNavigation()
  const { userId } = useContext(UserType);
  const [starMessage, setStarMessage] = useState([]);
  const [username, setUsername] = useState('');
  const route = useRoute();
  const { recepientData } = route.params;

  useEffect(() => {
    const getStar = async () => {
      const response = await fetch(`http://192.168.29.163:7000/star/${userId}`, {
        method: 'GET',
      });
      const data = await response.json();
      setStarMessage(data.starMessage);
      setUsername(data.username);
    };
    getStar();
  }, [userId]);

  const renderMessageItem = ({ item }) => (
    
    <Pressable
    style={styles.pressableContainer}
    onPress={() => navigation.navigate("ChatMessage", { messageId: item._id })}
  >
    <View style={styles.messageContainer}>
      <Image style={styles.avatar} source={{ uri: recepientData?.image }} />
      <View style={styles.messageContent}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderUsername}>YOU</Text>
          <AntDesign name="arrowright" size={24} color="black" />
          <Text style={styles.recipientUsername}>{recepientData?.username}</Text>
        </View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageText}>{item.messageText[0]}</Text>
      </View>
      <Text>{recepientData?.createdAt}</Text>
    </View>
  </Pressable>
);
  

  return (
    <View style={styles.container}>
      <FlatList
        data={starMessage}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  pressableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderUsername: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  recipientUsername: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default StaredScreen;
