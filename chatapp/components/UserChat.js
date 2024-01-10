import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const UserChat = ({item}) => {
  const navigation=useNavigation();
  return (
   <Pressable 
     onPress={()=>navigation.navigate("ChatMessage",{
      recepientId:item._id,
     })}
   style={{flexDirection:"row",alignItems:"center",gap:10,borderWidth:0.7,borderColor:"#D0D0D0",borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,padding:10}}>
      <Image style={{width:50,height:50,borderRadius:25,resizeMode:"cover"}} source={{uri:item?.image}}/>

      <View>
        <Text style={{fontWeight:"bold"}}>{item?.username}</Text>
        <Text style={{marginTop:5,color:"gray",fontWeight:"500"}}>someone messaged you</Text>
      </View>

      <View style={{marginLeft:80}}>
        <Text style={{fontSize:11,fontWeight:"400",color:"#585858"}}>3:00 pm</Text>
      </View>
   </Pressable>
  )
}

export default UserChat