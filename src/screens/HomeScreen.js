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
import { jwtDecode } from "jwt-decode"

const width = Dimensions.get('window')


// User정보 및 로그인 여부를 확인시켜주는 상단바 
const HiUser = ({ navigation, userId, isLoggedIn, handleLogout }) => {
  const [memberName, setMemberName] = useState(null)

  useEffect(() => {
    const getToken = async () => {
      try {
        const tk = await AsyncStorage.getItem("userToken"); // 비동기적으로 토큰 가져오기
        if (tk) {
          const bodyTk = String(tk).split(" ");
          const decodedToken = jwtDecode(bodyTk[1]);
          setMemberName(decodedToken["memberName"]);
          if (memberName){
            await AsyncStorage.setItem("memberName", memberName)
          }
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    getToken();
  }, []);

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
      <Text style={styles.hiUserText}>
        {isLoggedIn ? `${memberName}님\n오늘도 달려볼까요!` : '오늘도 운동하세요'}
      </Text>
    </TouchableOpacity>
  )
}

const HomeImage = () => {
  return (
    <View style={styles.imageContainer}>
      <Image
        resizeMode="cover"
        source={require('../../assets/run_unscreen.gif')}
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
  const [token, setToken] = useState(null)

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
        await setIsLoggedIn(true)
        await setUserId(id)
        setToken(String(token))
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
      navigation.navigate('Home')
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
          <View style={styles.buttonContainer}>
            <CurrentDate/>
            <LargeButton
              title='      영상 분석하기   🎯      '
              toward='Select'
              navigation={navigation}
              buttonStyle={styles.buttonStyle}
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
    backgroundColor: '#F1F2F6',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between', 
  },
  headContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  hiUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
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
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    marginVertical: 24,
    gap: 16,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 24,
    color: '#212529',
    fontWeight: '300',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '80%',  
  },
  buttonStyle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#004AAD',
    borderRadius: 10,
  },
  logoContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#E9ECEF',  
  },
  mainLogo: {
    width: 150, 
    height: 30,
    resizeMode: 'contain',
  },
});

export default HomeScreen
