import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import UserChat from '../components/UserChat'


const ChatScreen = () => {
  const {userId}=useContext(UserType)
  const [requestAccept,setRequestAccept]=useState([])

  useEffect(()=>{
     const getAcceptedFriends=async()=>{
       try {
        const response = await fetch(`http://192.168.29.163:7000/user/acceptedRequest/${userId}`,{
          method:"GET"
        })
         const data=await response.json();
         if(response.ok){
          setRequestAccept(data)
         }
       } catch (error) {
        console.error(error)
       }
     }
     getAcceptedFriends()
  },[])

 
  
  return (
    <ScrollView>
      <Pressable>
        {requestAccept.map((item,index)=>(
          <UserChat key={index} item={item}/>
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})