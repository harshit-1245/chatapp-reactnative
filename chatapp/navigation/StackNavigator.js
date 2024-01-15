import { View, Text } from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import React from 'react'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import HomeScreen from '../screens/HomeScreen'
import ForgotPassword from '../screens/ForgotPassword'
import FriendsScreen from '../screens/FriendsScreen'
import ChatScreen from '../screens/ChatScreen'
import ChatWithUser from '../screens/ChatWithUser'
import StaredScreen from '../components/StaredScreen'

const StackNavigator = () => {
    const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="forgot" component={ForgotPassword} options={{headerShown:false}}/>
      <Stack.Screen name="Friends" component={FriendsScreen}/>
      <Stack.Screen name="Chat" component={ChatScreen}/>
      <Stack.Screen name="ChatMessage" component={ChatWithUser}/>
      <Stack.Screen name="Star" component={StaredScreen}/>
      
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default StackNavigator