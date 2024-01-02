import { View, Text } from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import React from 'react'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import HomeScreen from '../screens/HomeScreen'
import ForgotPassword from '../screens/ForgotPassword'

const StackNavigator = () => {
    const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="forgot" component={ForgotPassword} options={{headerShown:false}}/>
      
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default StackNavigator