import { View, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native'; // Import useRoute

const StaredScreen = () => {
  const route = useRoute(); // Use useRoute to get the route object
  const { username} = route.params;

  return (
    <View>
      <Text>{username}</Text>
      
    </View>
  );
};

export default StaredScreen;
