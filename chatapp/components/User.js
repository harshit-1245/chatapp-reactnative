import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import axios from "axios"

const User = ({ item }) => {
  const navigation = useNavigation();
  const {userId,setUserId}=useContext(UserType)
  const [request,setRequest]=useState(false);

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

  return (
    <Pressable style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={{ uri: item.image }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item?.username}</Text>
          <Text style={styles.email}>{item?.email}</Text>
        </View>
      </View>
      <Pressable onPress={()=>sendingRequest(userId,item._id)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Friend</Text>
      </Pressable>

      {/* <Text onPress={()=>navigation.navigate("Register")}>Logout</Text> */}
    </Pressable>
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
