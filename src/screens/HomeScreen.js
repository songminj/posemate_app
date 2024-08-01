import React, { useState, useEffect } from "react";
// import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';

import LargeButton from '../components/LargeButton';

const { width } = Dimensions.get('window');

const HiUser = ({ navigation, userId, isLoggedIn }) => {
  return (
    <TouchableOpacity 
      style={styles.hiUserContainer}
      onPress={() => navigation.navigate(isLoggedIn ? 'Profile' : 'Login')}
    >
      <View style={styles.avatarContainer}>
        {/* <Icon name="person" size={24} color="#007AFF" /> */}
      </View>
      <Text style={styles.hiUserText}>{isLoggedIn ? `안녕하세요, ${userId}님` : '로그인'}</Text>
    </TouchableOpacity>
  );
};

const HomeImage = () => {
  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.homeImage}
        source={require('../../assets/run1.jpg')}
        resizeMode="cover"
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const id = await AsyncStorage.getItem('userId')
      if (token) {
        setIsLoggedIn(true)
        setUserId(id)
        console.log(token)
        console.log('로그인중')
      } else {
        setIsLoggedIn(false)
        console.log('로그인 안되어있음')
      }
    } catch (error) {
      console.error('Error checking login status:', error)
    }
  }

  const handleLogin = () => {
    navigation.navigate('Login')
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      await AsyncStorage.removeItem('userId')
      setIsLoggedIn(false)
      setUserId('')
      navigation.navigate('Login')
      console.log('로그아웃 완료')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headContainer}>
          <HiUser 
            userId={userId}
            navigation={navigation}
            isLoggedIn={isLoggedIn}
          />
        </View>
        <View style={styles.container}>
          <HomeImage />
          <View style={styles.buttonContainer}>
            <LargeButton
              title='영상 분석하기'
              toward='Select'
              navigation={navigation}
            />
            <LargeButton
              title={isLoggedIn ? '로그아웃' : '로그인'}
              toward={isLoggedIn ? handleLogout : handleLogin}
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  hiUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  hiUserText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    gap: 16,
  }
});

export default HomeScreen;