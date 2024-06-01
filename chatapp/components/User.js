import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import axios from "axios"

const User = ({ item }) => {
  const navigation = useNavigation();
  const {userId,setUserId}=useContext(UserType)
  const [request,setRequest]=useState(false);
  const [friendRequests,setFriendRequests]=useState([]);
  const [userFriends,setUserFriends]=useState([])


  const sendingRequest = async (currentUserId, selectedUserId) => {
    try {
      const data = { currentUserId, selectedUserId }; // Create an object with the required properties
  
      const response = await fetch('http://192.168.29.163:7000/user/friendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Stringify the object containing the IDs
      });
  
      if (response.ok) {
        setRequest(true);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
//  friend if sent 
useEffect(() => {
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://192.168.74.201:7000/user/friendRequest/sent/${userId}`);
      
      

      if (response.status === 200) {
        const friendRequestsArray = response.data;
    

        // Update state with the received data
        setFriendRequests(friendRequestsArray);
      } else {
        console.log("Error status:", response.status);
        console.log("Error data:", response.data);
      }
    } catch (error) {
      console.error("Error during fetchFriendRequests:", error);
    }
  };

  fetchFriendRequests();
}, [userId]);





  
 //getting friend request
 useEffect(() => {
  const fetchFriendList = async () => {
    try {
      const response = await axios.get(`http://192.168.74.201:7000/user/friends/${userId}`);
      setUserFriends(response.data)
      
    } catch (error) {
      console.error(error)
    }
  };

  fetchFriendList();
}, []);





  return (
    <>
    <Pressable
    style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
  >
    <View>
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }}
        source={{ uri: item.image }}
      />
    </View>

    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
      <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
    </View>     
    {userFriends.includes(item._id) ? (
      <Pressable
        style={{
          backgroundColor: "#82CD47",
          padding: 10,
          width: 105,
          borderRadius: 6,
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
      </Pressable>
    ) : request || friendRequests.some((friend) => friend._id === item._id) ? (
      <Pressable
        style={{
          backgroundColor: "gray",
          padding: 10,
          width: 105,
          borderRadius: 6,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Request Sent
        </Text>
      </Pressable>
    ) : (
      <Pressable
        onPress={() => sendingRequest(userId, item._id)}
        style={{
          backgroundColor: "#567189",
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Add Friend
        </Text>
      </Pressable>
    )}
  </Pressable>
   
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    marginTop:4,
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#567189',
    borderRadius: 6,
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default User;
