import React, { useState, useEffect } from "react"
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import LargeButton from '../components/LargeButton'

const width = Dimensions.get('window')

// User정보 및 로그인 여부를 확인시켜주는 상단바 
const HiUser = ({ navigation, userId, isLoggedIn, handleLogout }) => {
  return (
    <TouchableOpacity 
      style={styles.hiUserContainer}
      onPress={() => {
        navigation.navigate(isLoggedIn ? 'Home' : 'Login')
        isLoggedIn && handleLogout() // 로그인 상태일 때만 handleLogout 호출
      }}
    >
      <View style={styles.avatarContainer}>
        <Icon name="person" size={24} color="#007AFF" />
      </View>
      <Text style={styles.hiUserText}>{isLoggedIn ? `${userId}님\n달릴 준비가 완료되었습니다!` : '오늘도 운동하세요'}</Text>
    </TouchableOpacity>
  )
}

const HomeImage = () => {
  return (
    <View style={styles.imageContainer}>
      <Image
        resizeMode="cover"
        source={require('../../assets/runrun.gif')}
      />
    </View>
  )
}

const CurrentDate = () => {
  const [today, setToday] = useState('')
  useEffect(() => {
    const now = new Date()
    const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`
    setToday(formattedDate)
  }, [])

  return (
    <Text style={styles.dateText}>{today}</Text>
  )
}

const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')

  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus()
    }, [])
  )

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const id = await AsyncStorage.getItem('userId')
      if (token) {
        setIsLoggedIn(true)
        setUserId(id)
        console.log(token)
      } else {
        setIsLoggedIn(false)
        setUserId('')
      }
    } catch (error) {
      console.error('Error checking login status:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear()
      setIsLoggedIn(false)
      setUserId('')
      navigation.navigate('Login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar/>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headContainer}>
          <View
            style={styles.logoContainer}
          >
            <Image
              style={styles.mainLogo}
              source={require('../../assets/posemate1.png')}
              resizeMode="center"
            />
          </View>
          <HiUser 
            userId={userId}
            navigation={navigation}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout} // handleLogout 함수 전달
          />
        </View>
        <View style={styles.container}>
          <HomeImage />
          <View style={styles.dateContainer}>
            <CurrentDate/>
          </View>
          <View style={styles.buttonContainer}>
            <LargeButton
              title='영상 분석하기'
              toward='Select'
              navigation={navigation}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  hiUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:16,
    paddingVertical: 16,
  },
  hiUserText: {
    fontSize: 20,
    color: '#212529',
    fontWeight: '600',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  container: {
    flex: 1,
    alignItems:'center',
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    gap: 16,
    borderRadius: 12,
    // overflow: 'hidden',
    marginBottom: 24,

  },
  dateText: {
    fontSize: 24,
    color: '#212529',
    fontWeight: '300',
  },
  dateContainer: {
    position: 'absolute',
    bottom: 100,                // Distance from the bottom of the screen
    alignItems: 'center',      // Center button horizontally within the container
    // width: width, 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,                // Distance from the bottom of the screen
    alignItems: 'center',      // Center button horizontally within the container
    width: width,              // Optional: set width of the container to match screen width
  },
  logoContainer: {
    paddingVertical:16,
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#E9ECEF',  
  },
  mainLogo: {
    width: 150, 
    height: 30,  
    paddingBottom: 20,
    resizeMode: 'contain',
  },
})

export default HomeScreen
