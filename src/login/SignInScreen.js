// signin.js

import React, { useState } from 'react'
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text,
  StatusBar,
  ScrollView
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Input from '../components/Input'

const SignInScreen = ({ navigation }) => {
  // 이름은 문자만 최소 두자 
  const [username, setUsername] = useState('')
  const nameRe = /\D{2,}$/g
  // 아이디는 문자, 숫자 최소 4자~12자
  const [userId, setUserId] = useState('')
  const idRe = /([-_.]?[0-9a-zA-Z]){4,12}$/g
  // 비밀번호는 모든 문자열 가능 최소 4자
  const [password, setPassword] = useState('')
  const passwordRe = /(\.){4,}$/g
  // 전화번호는 ###-####-#### 
  const [phone, setPhone] = useState('')
  const phoneRe = /^(?:\d{3}|\(\d{3}\))([-])\d{4}\1\d{4}$/g

  const requestPost = async () => {
    const data = {
      username: username,
      password: password,
      userId: userId,
      phone: phone,
    }

    try {
      const response = await axios.post('http://i11a202.p.ssafy.io:8080/api-member/join', data)
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
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>회원가입</Text>
        <Input
          title="이름"
          placeholder="이름을 입력하세요"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Input
          title="전화번호"
          placeholder="전화번호를 입력하세요"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        <Input
          title="아이디"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChangeText={text => setUserId(text)}
        />
        <Input
          title="비밀번호"
          placeholder="비밀번호를 입력하세요"
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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1B2E',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  signUpButton: {
    marginTop: 24,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default SignInScreen