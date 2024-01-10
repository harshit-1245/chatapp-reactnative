import React, { useContext, useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';

const FriendRequests = ({ item, friendRequest, setFriendRequest }) => {
  const navigation = useNavigation();
  const { userId } = useContext(UserType);

  const acceptRequest = async (friendRequestId) => {
    try {
      console.log('Accept button clicked!');
      const response = await fetch('http://192.168.29.163:7000/user/friendRequest/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: friendRequestId,
          recepient: userId,
        }),
      });
   
      if (response.status === 200) {
        Alert.alert("Successfully accepted")
        setFriendRequest(friendRequest.filter((request) => request.id !== friendRequestId));
        navigation.navigate('Chat'); // Navigate to the "Chat" screen after accepting the request
      }
      
    } catch (error) {
      console.error(error);
    }
  };
 

  return (
    <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
      <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />

      <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, flex: 1 }}>{item?.username} sent you a friend Request!</Text>

      <Pressable onPress={() => acceptRequest(item._id)} style={{ backgroundColor: '#0066b2', padding: 10, borderRadius: 6 }}>
        <Text style={{ textAlign: 'center', color: 'white' }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({});
