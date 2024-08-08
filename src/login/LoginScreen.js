import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Input from '../components/Input'

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const userIdRegex = /([-_.]?[0-9a-zA-Z]){4,12}$/
  const passwordRegex =/(.{4,})$/

  useEffect(() => {
    // 로그인 버튼 활성화 상태 업데이트
    const isUserIdValid = userIdRegex.test(userId)
    const isPasswordValid = passwordRegex.test(password)
    setIsButtonEnabled(isUserIdValid && isPasswordValid)
  }, [userId, password])

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://i11a202.p.ssafy.io:8080/api-member/login', {
        userId,
        password
      }, 
      { 
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      if (response.status === 200) {
        const token = response.headers.authorization
        await AsyncStorage.setItem('userToken', token)
        navigation.navigate('Home')
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.formContainer}>
          <Input 
            title="아이디"
            placeholder='아이디를 입력하세요'
            onChangeText={text => setUserId(text)}
            value={userId}
            style={styles.input}
          />
          <Input 
            title="비밀번호"
            placeholder='비밀번호를 입력하세요'
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            value={password}
            style={styles.input}
          />
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: isButtonEnabled ? '#2C3E50' : '#BDC3C7' }]} 
            onPress={handleLogin}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.loginButton, styles.signUpButton]} 
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#34495E',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    tintColor: '#2C3E50',
  },
  input: {
    marginBottom: 16,
    width: '100%',
  }
})

export default LoginScreen
