import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native'
import Input from '../components/Input'
import { loginPost } from '../api/ApiServer'

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


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/posemate2.png')}
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
            style={[styles.loginButton, { backgroundColor: isButtonEnabled ? '#004AAD' : '#BDC3C7' }]} 
            onPress={() => loginPost(userId, password, navigation)}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.signinText}>회원가입하고 더 멋진 운동을 즐겨요!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.06, 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05, 
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    marginTop: height * 0.02, 
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.06,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  signinText: {
    color: '#2C3E50',
    fontSize: width * 0.04, 
    marginTop: height * 0.02, 
    textDecorationLine: 'underline',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3, 
  },
  input: {
    marginBottom: height * 0.02, 
    width: '100%',
  }
});

export default LoginScreen
