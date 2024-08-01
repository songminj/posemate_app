// largebutton.js

import React from 'react';
import { 
  Pressable, 
  Dimensions,
  Text,
  StyleSheet
} from 'react-native';

const { width } = Dimensions.get('window');

const LargeButton = (props) => {
  const handlePress = () => {
    if (typeof props.toward === 'function') {
      props.toward()
    } else {
      props.navigation.navigate(props.toward);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonStyle,
        pressed && styles.buttonPressed
      ]}
      onPress={handlePress}
    >
      <Text style={styles.buttonTextStyle}>
        {props.title}
      </Text>
    </Pressable>
  )
}



const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#007AFF',
    width: width * 0.9,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
    transform: [{ scale: 0.98 }],
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LargeButton;