import React from "react"
import {
  View, 
  Text, 
  StyleSheet,
} 
from 'react-native'

import LargeButton from '../components/LargeButton'
import CommentBox from "../components/CommentBox"
import Video from "react-native-video"
import api from "../api/apiServer"

const AnalysisResult = ({navigation}) => {
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const score = rand(0, 101)
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>분석 결과</Text>
      <Text>사용자님의 자세는 {score}점 입니다!</Text>
      <View style={styles.reviewContainer}>
        <Video
          source={require("../../assets/jwtest.mp4")}
          resizeMode="cover"
          controls={false}
          style={styles.video}
        />
        <CommentBox
          bodyName='상체'
          score='30'
          comment='Test'
        />
        <CommentBox
          bodyName='하체'
          score='50'
          comment='Test'
        />
        <CommentBox
          bodyName='팔'
          score='70'
          comment='Test'
        />
        <CommentBox
            bodyName='전신'
            score='90'
            comment='TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest'
        />
      </View>
      <LargeButton
        title='처음으로'
        toward='Home'
        navigation={navigation} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  reviewContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  }
})

export default AnalysisResult
