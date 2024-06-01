import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {useNavigation} from "@react-navigation/native"
import { UserType } from '../UserContext'
import axios from "axios"
import FriendRequests from '../components/FriendRequests'

const FriendsScreen = () => {
  const {userId}=useContext(UserType)
  const navigation=useNavigation();
  const [friendRequest,setFriendRequest]=useState([])
 

  useEffect(()=>{
       const getFriendsRequest=async()=>{
       try {
         const response = await axios.get(`http://192.168.74.201:7000/user/friendRequest/${userId}`)
         if(response.status ===200){
          const friendRequestData = await response.data.map((friendRequest)=>({
           _id:friendRequest._id,
           username:friendRequest.username,
           email:friendRequest.email,
           image:friendRequest.image
          }))
          setFriendRequest(friendRequestData)
         }
       } catch (error) {
        console.log(error)
       }
       }
       getFriendsRequest()
  },[])


  return (
   <>
  
  <View style={{padding:10,marginHorizontal:12}}>
    {friendRequest.length >0 && <Text>Your Friend Request!</Text>}

    {friendRequest.map((item,index)=>(
      <FriendRequests key={index} item={item} friendRequest={friendRequest} setFriendRequest={setFriendRequest}/>
    ))}
  </View>
   </>
  )
}

export default FriendsScreen

