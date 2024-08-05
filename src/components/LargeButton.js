import React from 'react'
import { 
  Pressable, 
  Dimensions,
  Text,
  StyleSheet
} from 'react-native'

const { width } = Dimensions.get('window')

const LargeButton = ({
  toward = 'Home',
  title = '버튼',
  navigation
}) => {
  const handlePress = () => {
    if (typeof toward === 'function') {
      toward()
    } else {
      navigation.navigate(toward)
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonStyle,
        pressed && styles.buttonPressed
      ]}
      onPress={handlePress}
    >
      <Text style={styles.buttonTextStyle}>
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 10,
    backgroundColor: '#2C3E50',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
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
})

export default LargeButton