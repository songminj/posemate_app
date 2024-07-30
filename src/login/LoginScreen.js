import React, { useState } from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Image
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Input from '../components/Input'

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://3.35.213.242:8080/api-member/', {
        userId,
        password
      })

      if (response.status === 200) {
        const { token } = response.data
        await AsyncStorage.setItem('userData', token)
        navigation.navigate('Main')
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
      />
      <Text style={styles.title}>로그인</Text>
      <Input 
        placeholder='아이디를 입력하세요'
        onChangeText={text => setUserId(text)}
        value={userId}
      />
      <Input 
        placeholder='비밀번호를 입력하세요'
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.loginButtonText}>회원가입</Text>
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
    padding: 24
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
})

export default LoginScreen
