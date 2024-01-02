import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useState } from 'react'

export const UserType = createContext()
const UserContext = ({children}) => {
 const [userId,setUserId]=useState("")

  return (
    <UserType.Provider value={{userId,setUserId}} >
     {children}
    </UserType.Provider>
  )
}

export default UserContext;

const styles = StyleSheet.create({})