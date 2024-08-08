import React from 'react'
import { 
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from 'react-native'
import {
  aiGet, 
  aiPost, 
  healthGet, 
  healthPost, 
  joinPost, 
  loginPost, 
  videoGet, 
  videoPost, 
  videoJsonPost, 
  videoVideoPost
} from '../api/ApiServer'
import LargeButton from '../components/LargeButton'


const ApiTest = ({navigation}) => {
  const exerciseId = 52
  const msg = '메세지요'
  return (
    <SafeAreaView>
      <ScrollView>
        <LargeButton
          title = "aiGet"
          toward={aiGet}
        />
        <LargeButton
          title = "aiPost"
          toward={() => aiPost(exerciseId)}
        />
        <LargeButton
          title = "healthGet"
          toward={healthGet}
        />
        <LargeButton
          title = "healthPost"
          toward={() => healthPost(msg)}
        />
        <LargeButton
          title = "joinPost"
          toward={() => joinPost(navigation)}
        />
        <LargeButton
          title = "loginPost"
          toward={() => loginPost('test', '1234', navigation)}
        />
        <LargeButton
          title = "videoGet"
          toward={videoGet}
        />
        <LargeButton
          title = "videoPost"
          toward={videoPost}
        />
        <LargeButton
          title = "videoJsonPost"
          toward={videoJsonPost}
        />
        <LargeButton
          title = "videoVideoPost"
          toward={videoVideoPost}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
export default ApiTest