import React, {useEffect, useState} from "react"
import {
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal
} 
from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Loading from "../components/Loading"
import LargeButton from '../components/LargeButton'
import CommentBox from "../components/CommentBox"
import Video from "react-native-video"
import api from "../api/ApiServer"

const AnalysisResult = ({navigation}) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(true)
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const reportHandler = () => {
    {!report ? setReport(true) : setReport(false)}
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.aiGet() // API 호출
        setData({ aiScore: 50 }) // 받은데이터
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    getData()
  }, [])

  if (loading) {
    return <Loading />
  }
  const score = rand(0, 101)
  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          {!report?(
            <>
              <Modal>
                <View>
                  <Text>짜잔</Text>
                  <LargeButton
                    title="리포트 닫기"
                    toward={reportHandler}
                  />
                </View>
              </Modal>
            </>
          ) : (
            <>
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
                <LargeButton
                  title='리포트 확인하기'
                  toward={reportHandler}
                />
              </View>
            </>
            )
          }
        </ScrollView>
      </SafeAreaView>
      
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
