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
import {aiPost} from "../api/ApiServer"

const AnalysisResult = ({navigation}) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(true)
  const [token, setToken] = useState(null)
  const [selectedVideoId, setSelectedVideoId] = useState(null)


  const reportHandler = () => {
    AsyncStorage.clear()
    {!report ? setReport(true) : setReport(false)}
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("selectedVideoId")
        const tk = await AsyncStorage.getItem("userToken")
        console.log(id)
        console.log(tk)
        setSelectedVideoId(id)
        setToken(tk)
        const exerciseId = 52
        const response = await aiPost(exerciseId) // API 호출
        setData(response) 
        console.log(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loading />
  }
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
                <Text>사용자님의 자세는 점 입니다!</Text>
                <View style={styles.reviewContainer}>
                <Video
                  source={{
                    uri: `http://i11a202.p.ssafy.io:8080/api-video/${selectedVideoId}`,
                    headers: {
                      Authorization: token,
                    },
                    type: 'mp4'
                  }}
                  style={styles.video}
                  controls={true}
                  controlsStyles={{
                    hideSeekBar: true,
                    seekIncrementMS: 10000,
                  }}
                />
                  <CommentBox
                    bodyName='상체'
                    score={data.score.arms}
                    comment='Test'
                  />
                  <CommentBox
                    bodyName='하체'
                    score={data.score.legs}
                    comment='Test'
                  />
                  <CommentBox
                    bodyName='팔'
                    score={data.score.upperBody}
                    comment='Test'
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
