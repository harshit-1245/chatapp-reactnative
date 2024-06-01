import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from "@react-navigation/native"
import { MaterialIcons } from '@expo/vector-icons';

const StaredScreen = () => {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const [starMessage, setStarMessage] = useState([]);
  const [username, setUsername] = useState('');
  const route = useRoute();
  const { recepientData } = route.params;

  useEffect(() => {
    const getStar = async () => {
      try {
        const response = await fetch(`http://192.168.74.201:7000/star/${userId}`, {
          method: 'GET',
        });
        const data = await response.json();

        setStarMessage(data.starMessage);
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching starred messages:', error);
      }
    };
    getStar();
  }, [userId]);

  //deleting with backend

  // --------- designing header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Star",
      headerRight: () => (
        selectedMessages.length > 0 ? (
          <Pressable onPress={() => handleDelete(selectedMessages)}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <MaterialIcons name="delete" size={24} color="black" />
            </View>
          </Pressable>
        ) : null
      ),
    });
  }, [navigation, selectedMessages]);

  const renderMessageItem = ({ item }) => (

    <Pressable
      style={[styles.pressableContainer, selectedMessages.includes(item._id) && { backgroundColor: 'lightblue' }]}
      onPress={() => navigation.navigate("ChatMessage", { messageId: item._id })}
      onLongPress={() => handleLongPress(item._id)}
    >
      <View style={styles.messageContainer}>
        <Image style={styles.avatar} source={{ uri: recepientData?.image }} />
        <View style={styles.messageContent}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderUsername}>YOU</Text>
            <AntDesign name="arrowright" size={24} color="black" />
            <Text style={styles.recipientUsername}>{recepientData?.username}</Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageText}>{item.messageText[0]}</Text>
        </View>
        <Text>{recepientData?.createdAt}</Text>
      </View>
    </Pressable>
  );

  const handleLongPress = (messageId) => {
    // Toggle the selection of the message

    setSelectedMessages((prevSelected) => {
      if (prevSelected.includes(messageId)) {
        // If message is already selected, remove it
        return prevSelected.filter((id) => id !== messageId);
      } else {
        // If message is not selected, add it
        return [...prevSelected, messageId];
      }
    });
  };

  const handleDelete = async () => {
    // Implement logic to delete selected messages
    Alert.alert(
      "Delete Messages",
      "Are you sure you want to delete selected messages?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Perform the actual deletion logic here
            console.log("Deleting messages:", selectedMessages);

            // Delete selected messages on the backend
            await deleteStarMessage();

            // Refresh the list of starred messages
            await getStar();

            // Clear the selected messages
            setSelectedMessages([]);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteStarMessage = async () => {
    try {
      const response = await fetch(`http://192.168.29.163:7000/star/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds: selectedMessages,
        }),
      });

      if (response.ok) {
        console.log("Star messages deleted successfully");
      } else {
        console.error("Failed to delete star messages");
      }
    } catch (error) {
      console.error("Error while deleting star messages:", error);
    }
  };

  const getStar = async () => {
    try {
      const response = await fetch(`http://192.168.29.163:7000/star/${userId}`, {
        method: 'GET',
      });
      const data = await response.json();

      setStarMessage(data.starMessage);
      setUsername(data.username);
    } catch (error) {
      console.error('Error fetching starred messages:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={starMessage}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  pressableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderUsername: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  recipientUsername: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default StaredScreen;
