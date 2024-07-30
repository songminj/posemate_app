import React, { useState } from 'react'
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text 
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Input from '../components/Input'

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [phone, setPhone] = useState('')

  const requestPost = async () => {
    const data = {
      username: username,
      password: password,
      userId: userId,
      phone: phone,
    }

    try {
      const response = await axios.post('http://3.35.213.242:8080/api-member/join', data)
      console.log(response.data)

      if (response.data.token) {
        await AsyncStorage.setItem('userData', response.data.token)
        navigation.navigate('Home')
      } else {
        console.error('Token is missing in the response')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="이름"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <Input
        placeholder="전화번호"
        value={phone}
        onChangeText={text => setPhone(text)}
      />
      <Input
        placeholder="아이디"
        value={userId}
        onChangeText={text => setUserId(text)}
      />
      <Input
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity 
        style={styles.signUpButton} 
        onPress={requestPost}
      >
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  signUpButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
})

export default SignInScreen