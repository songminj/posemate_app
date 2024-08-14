import React, { useState, useEffect } from "react"
import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import LargeButton from './LargeButton'
import { videoGet } from '../api/ApiServer'
import Video from "react-native-video"
import Loading from "./Loading"

const width = Dimensions.get('window').width

const SelectOnServer = ({ navigation }) => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true) // Loading state
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const [exerciseId, setExerciseId] = useState(null)
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)
  const [memberName, setMemberName] = useState('')



  useEffect(() => {
    const fetchTokenAndVideos = async () => {
      const storedToken = await AsyncStorage.getItem('userToken')
      const userId = await AsyncStorage.getItem('userId')
      const name = await AsyncStorage.getItem("memberName")

      setToken(storedToken)
      setUserId(userId)
      setMemberName(name)
      const data = await videoGet()
      if (data) {
        setVideos(data)
      }
      setLoading(false) // Set loading to false once data is fetched
    }
    
    fetchTokenAndVideos()
  }, [])

  const videoNav = async (vId, eId) => {
    setSelectedVideoId(vId)
    setExerciseId(eId)
    setModalVisible(true)
  }
  const closeModal = async () => {
    setModalVisible(false)
  }

  const videoTrimNav = async (selectedVideoId, exerciseId, navigation) => {
    try {
      await AsyncStorage.setItem('selectedVideoId', String(selectedVideoId)) 
      await AsyncStorage.setItem('exerciseId', String(exerciseId)) 
      setModalVisible(false)
      navigation.navigate('AnalysisResult')
    } catch (error) {
      console.error("Error storing selectedVideoId: ", error)
    }
  }
  
  if (loading) {
    return <Loading navigation={navigation} />
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
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
          />
          <View style={styles.buttonContainer}>
            <LargeButton
              title="취소하기"
              toward={closeModal}
              buttonStyle={styles.cancelButtonStyle} 
              buttonTextStyle={styles.cancelButtonTextStyle} 
            />
            <LargeButton
              title="선택하기"
              toward={() => videoTrimNav(selectedVideoId, exerciseId, navigation)}
              buttonStyle={styles.selectButtonStyle} 
              buttonTextStyle={styles.selectButtonTextStyle} 
            />
          </View>
        </View>
      </Modal>
      
      <SafeAreaView>
        <ScrollView>
          <View>
            <Text 
              style={styles.headerText}
            >
              {memberName}님의 운동 기록입니다
            </Text>
          </View>
          <View
            style={styles.videoContainer}
          >
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.videoItem}
                  onPress={() => videoNav(video.video.videoId, video.exerciseId)}
                >
                  <Image
                    style={styles.videoImage}
                    source={require('../../assets/video.png')}
                    resizeMode="cover"
                  />
                  <Text
                    style={styles.videoText}
                  >
                    {video.video.saveDate}에 촬영한 영상
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.loadingText}>촬영한 video가 없어요</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'left',
  },
  loadingText: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  videoItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    paddingVertical: 25,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: width * 0.85,
    alignItems: 'center',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  video: {
    width: width * 0.9,
    height: width * 0.6,
    borderRadius: 10,
  },
  videoText: {
    fontSize: 18,
    color: '#202020',
  },
  videoImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  cancelButtonStyle: {
    backgroundColor: '#F1F2F6',
    width: '45%',
  },
  selectButtonStyle: {
    backgroundColor: '#004AAD',
    width: '45%',
  },
  cancelButtonTextStyle: {
    color: '#000',
  },
  selectButtonTextStyle: {
    color: '#fff',
  },
});


export default SelectOnServer
