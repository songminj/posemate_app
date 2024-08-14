import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text,
  StatusBar,
  ScrollView,
  Dimensions,
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

  const nameRe = /\D{2,10}$/
  const idRe = /([-_.]?[0-9a-zA-Z]){4,12}$/
  const passwordRe = /(.{4,})$/
  const phoneRe = /^(?:\d{3}|\(\d{3}\))([-])\d{4}\1\d{4}$/

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
      const response = await axios.post('http://i11a202.p.ssafy.io:8080/api-member/join', data)
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
        <View style={styles.nameContainer}>
          <Input
            title="이름"
            placeholder="최소 2자 이상 문자"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          {/* <LargeButton>

          </LargeButton> */}
        </View>

        <Input
          title="전화번호"
          placeholder="000-0000-0000"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Input
          title="아이디"
          placeholder="영어+숫자 조합 4~12자"
          value={userId}
          onChangeText={text => setUserId(text)}
        />
        {userIdError ? <Text style={styles.errorText}>{userIdError}</Text> : null}

        <Input
          title="비밀번호"
          placeholder="최소 4자 이상"
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',  
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.06,  
  },
  title: {
    fontSize: width * 0.07,  
    fontWeight: 'bold',
    color: '#000000',  
    marginBottom: height * 0.03, 
  },
  signUpButton: {
    marginTop: height * 0.03,  
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.06, 
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,  // 화면 너비의 4%를 글꼴 크기로 설정
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.03,  // 화면 너비의 3%를 글꼴 크기로 설정
    marginBottom: height * 0.012,  // 화면 높이의 1.2%를 margin-bottom으로 설정
    marginLeft: width * 0.025,  // 화면 너비의 2.5%를 margin-left로 설정
    alignSelf: 'flex-start',  
  },
})

export default SignInScreen