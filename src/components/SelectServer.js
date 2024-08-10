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

  useEffect(() => {
    const fetchTokenAndVideos = async () => {
      const storedToken = await AsyncStorage.getItem('userToken')
      const userId = await AsyncStorage.getItem('userId')
      setToken(storedToken)
      setUserId(userId)
      const data = await videoGet()
      if (data) {
        setVideos(data)
        console.log
      }
      setLoading(false) // Set loading to false once data is fetched
    }
    
    fetchTokenAndVideos()
  }, [])

  const videoNav = async (vId, eId) => {
    setSelectedVideoId(vId)
    setExerciseId(eId)
    setModalVisible(true)
    console.log(vId)
    console.log(eId)
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
              {userId}님의 운동 기록입니다
            </Text>
          </View>
          <View>
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
                  <Text>{video.video.saveDate}에 촬영한 영상</Text>
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
  headerText: {
    fontSize: 28, // 텍스트 크기를 키워서 더 강조되게 설정
    fontWeight: 'bold', // 폰트 두께를 굵게 설정
    color: '#2C3E50', // 메인 컬러로 텍스트 색상 설정
    marginBottom: 30, // 텍스트 아래 여백을 늘려서 요소 간 간격을 확장
    textAlign: 'left', // 텍스트를 좌측 정렬
  },
  loadingText: {
    fontSize: 20, // 로딩 텍스트 크기를 키워서 읽기 쉽게 설정
    color: '#888', // 색상을 약간 밝게 설정
    textAlign: 'center', // 중앙 정렬
    marginTop: 50, // 상단에 여백을 주어 텍스트 위치 조정
  },
  videoItem: {
    marginBottom: 20, // 요소 간 간격을 더 넓게 설정
    padding: 15, // 내부 패딩을 넉넉히 설정
    backgroundColor: '#ffffff', // 비디오 아이템 배경색을 흰색으로 설정
    borderRadius: 10, // 모서리를 둥글게 설정
    shadowColor: '#000', // 그림자 색상 설정
    shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋 설정
    shadowOpacity: 0.1, // 그림자 투명도 설정
    shadowRadius: 5, // 그림자 반경 설정
    elevation: 3, // Android에서 그림자 표현을 위한 속성
    width: width * 0.9, // 화면 너비의 90%로 설정
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // 모달의 배경색을 어둡게 설정해 집중도를 높임
    padding: 20, // 모달 안쪽에 여백을 설정
  },
  video: {
    width: width * 0.9,
    height: width * 0.6,
    borderRadius: 10, // 비디오의 모서리를 둥글게 설정
  },
  videoImage: {
    width: width * 0.3, 
    height: width * 0.3, 
    marginBottom: 15, // 이미지와 텍스트 간 간격을 더 넓게 설정
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 배치
    alignItems: 'center',
    justifyContent: 'space-evenly', // 버튼 사이의 공간을 균등하게 배치
    width: '80%', // 두 버튼이 들어갈 수 있는 적절한 너비 설정
    marginTop: 20, // 버튼과 비디오 사이의 여백
  },
  cancelButtonStyle: {
    backgroundColor: '#D3D3D3', // 밝은 회색 버튼 배경
    width: '45%', // 두 버튼이 나란히 배치될 수 있도록 너비 조정
  },
  selectButtonStyle: {
    backgroundColor: '#2C3E50', // 기존 선택하기 버튼 색상
    width: '45%', // 두 버튼이 나란히 배치될 수 있도록 너비 조정
  },
  cancelButtonTextStyle: {
    color: '#000', // 취소하기 버튼 텍스트 색상 (검은색)
  },
  selectButtonTextStyle: {
    color: '#fff', // 선택하기 버튼 텍스트 색상 (흰색)
  },
})



export default SelectOnServer
