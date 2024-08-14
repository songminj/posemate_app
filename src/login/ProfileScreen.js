import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = () => {
  _storeToken = async () => {
    try {
      const value = await AsyncStorage.getItems('userToken')
      console.log(value)
    } catch (error) {
      console.log(error)
    }
  }
  const user = {}
  return(
    <View>
      <Text>여기는 프로필 페이지</Text>
      <Text>내 이미지 사진</Text>
      <Text>안녕하세여</Text>
      <Text>최근 운동 기록</Text>
    </View>
  )
}


export default ProfileScreen;