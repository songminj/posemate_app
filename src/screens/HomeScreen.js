import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Pressable
} from 'react-native';

import LargeButton from '../components/LargeButton';

const width = Dimensions.get('window').width;

const HiUser = ({ navigation, userId, isLoggedIn }) => {
  return (
    <Pressable 
      style={styles.hiUserContainer}
      onPress={() => navigation.navigate(isLoggedIn ? 'Profile' : 'Login')}
    >
      <Icon 
        name="user" 
        size={20}
        style={styles.hiUserIcon}
      />
      <Text style={styles.hiUserText}>{isLoggedIn ? `${userId}님` : 'USER님'}</Text>
    </Pressable>
  );
};

const HomeImage = () => {
  return (
    <View>
      <Image
        style={styles.tiny}
        source={require('../../assets/run1.jpg')}
        resizeMode="contain"
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userId');
      if (token) {
        setIsLoggedIn(true);
        setUserId(id);
        console.log(token);
        console.log('로그인중');
      } else {
        setIsLoggedIn(false);
        console.log('로그인 안되어있음');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      setIsLoggedIn(false);
      setUserId('');
      navigation.navigate('Login');
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headContainer}>
          <HiUser 
            userId={userId}
            navigation={navigation} // Pass navigation prop
          />
        </View>
        <View style={styles.container}>
          <LargeButton
            title={isLoggedIn ? '로그아웃하기' : '로그인하기'}
            toward={isLoggedIn ? handleLogout : handleLogin}
          />
          <HomeImage />
          <LargeButton
            title='영상 분석하기'
            toward='Select'
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headContainer: {
    padding: 10,
    alignItems: 'flex-start',
    width: width * 0.9, // Ensure it aligns correctly within the container width
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
    alignItems: 'center', 
  },
  hiUserContainer: {
    marginBottom: 20,
    // padding: 10,
    borderRadius: 5,
    flexDirection: 'row'
  },
  hiUserText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left', 
    width: '100%', 
  },
  hiUserIcon: {
    marginRight:8,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tiny: {
    width: width * 0.9,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
  },
})

export default HomeScreen;
