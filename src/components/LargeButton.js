import React from 'react'
import { 
  Pressable, 
  Dimensions,
  Text,
  StyleSheet
} from 'react-native'


const LargeButton = ({
  toward = 'Home',
  title = '버튼',
  navigation,
  buttonStyle = {}, // 추가: 외부에서 전달받는 버튼 스타일
  buttonTextStyle = {} // 추가: 외부에서 전달받는 텍스트 스타일
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
        buttonStyle, // 추가: 전달된 버튼 스타일 적용
        pressed && styles.buttonPressed
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    margin: 10,
    backgroundColor: '#004AAD',
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
    fontSize: 16,
    fontWeight: '600',
  },
})

export default LargeButton
