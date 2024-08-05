import React, { useState, useEffect } from 'react'
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
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [userIdError, setUserIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const nameRe = /\D{2,}$/g
  const idRe = /([-_.]?[0-9a-zA-Z]){4,12}$/g
  const passwordRe = /(.{4,})$/g
  const phoneRe = /^(?:\d{3}|\(\d{3}\))([-])\d{4}\1\d{4}$/g

  const validateInput = (value, regex, setError, inputThis) => {
    if (!regex.test(value)) {
      setError(`${inputThis} 양식이 올바르지 않습니다.`)
      return false
    } else {
      setError('')
      return true
    }
  }

  useEffect(() => {
    validateInput(username, nameRe, setUsernameError, '이름')
  }, [username])

  useEffect(() => {
    validateInput(userId, idRe, setUserIdError, '아이디')
  }, [userId])

  useEffect(() => {
    validateInput(password, passwordRe, setPasswordError, '비밀번호')
  }, [password])

  useEffect(() => {
    validateInput(phone, phoneRe, setPhoneError, '전화번호')
  }, [phone])

  const validateInputs = () => {
    return (
      validateInput(username, nameRe, setUsernameError) &&
      validateInput(userId, idRe, setUserIdError) &&
      validateInput(password, passwordRe, setPasswordError) &&
      validateInput(phone, phoneRe, setPhoneError)
    )
  }

  const requestPost = async () => {
    if (!validateInputs()) {
      return
    }

    const data = {
      username: username,
      password: password,
      userId: userId,
      phone: phone,
    }

    try {
      const response = await axios.post('http://3.35.213.242:8080/api-member/join', data)
      console.log(response.data)

      if (response.headers.authorization) {
        await AsyncStorage.setItem('userData', response.headers.authorization)
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
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>회원가입</Text>
        <Input
          title="이름"
          placeholder="이름을 입력하세요"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

        <Input
          title="전화번호"
          placeholder="전화번호를 입력하세요"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Input
          title="아이디"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChangeText={text => setUserId(text)}
        />
        {userIdError ? <Text style={styles.errorText}>{userIdError}</Text> : null}

        <Input
          title="비밀번호"
          placeholder="비밀번호를 입력하세요"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
    backgroundColor: '#FFFFFF',  // 배경색을 흰색으로 변경
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
    color: '#000000',  // 제목 색상을 검정색으로 변경
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',  // 에러 메시지를 왼쪽 정렬
  },
})

export default SignInScreen