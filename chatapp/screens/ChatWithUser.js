import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector"

const ChatWithUser = () => {
  const [showEmoji,setShowEmoji]=useState(false)
  const [message,setMessage]=useState("")
console.log(message)
  const handleShowEmoji=()=>{
    setShowEmoji(!showEmoji)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {/* All the messages come here */}
      </ScrollView>

      <View style={{flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    marginBottom:showEmoji ? 0 : 25}}>
        <Entypo onPress={handleShowEmoji} name="emoji-happy" size={24} color="black" style={styles.icon} />
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder='Type text here' value={message} onChangeText={(text)=>setMessage(text)} />
          <Entypo name="camera" size={24} color="gray" style={styles.icon} />
          <FontAwesome name="microphone" size={24} color="gray" style={styles.icon} />
        </View>
        <Pressable style={styles.sendButton}>
          <FontAwesome name="send" size={24} color="white" style={{ alignSelf: 'center' }} />
        </Pressable>
      </View>
      
       {showEmoji && (
        <EmojiSelector 
        onEmojiSelected={(emoji)=>{
            setMessage((prevMessage)=>prevMessage+emoji);
        }}
        style={{height:250}}/>
       )}

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: "black",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatWithUser;
