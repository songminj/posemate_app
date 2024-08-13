import React, { useEffect, useState } from "react"
import ImagePicker from 'react-native-image-crop-picker'
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Alert 
} from 'react-native'
import LargeButton from './LargeButton'
import Video from "react-native-video"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { videoPost } from "../api/ApiServer"

const SelectOnDevice = ({navigation}) => {
  const [afterSelect, setAfterSelect] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)  // 초기 값 false로 설정
  const [selectedVideo, setSelectedVideo] = useState(null)
  

  useEffect(()=> {
    pickVideo()
  }, [])

  // 갤러리에 접근하여 비디오를 선택할 수 있도록 설정
  const pickVideo = () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      setSelectedVideo(video)
      setModalVisible(true)  // 비디오를 선택한 후 모달을 띄움
    }).catch(error => {
      console.log('Error picking video: ', error)
    })
  }

  const sendVideoToServer = async () => {
    if (selectedVideo) {
      try {
        console.log("Selected video:", String(selectedVideo));
        setAfterSelect(true);
    
        const formData = new FormData();
        formData.append('video', {
          uri: selectedVideo.path,
          type: selectedVideo.mime,
          name: 'video.mp4'
        });
        
        const response = await videoPost(formData);
        
        if (response && response.data !== undefined) {
          const videoIdString = String(response.data);
          await AsyncStorage.setItem('selectedVideoId', videoIdString);
          console.log('Video ID saved:', videoIdString);
        } else {
          console.error('Invalid response from server:', response);
          Alert.alert("오류", "서버로부터 유효한 응답을 받지 못했습니다.");
        }
      } catch (error) {
        console.error('Error in sendVideoToServer:', error);
        Alert.alert("앗!", "비디오 저장에 실패했습니다😥");
      }
    }
    setModalVisible(false);
  };
  

  return (
    <View style={styles.container}>
      {!afterSelect? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}  // 모달 상태를 관리
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
              setModalVisible(!modalVisible)
          }}>
            <View style={styles.centeredView}>
              {selectedVideo && (
                <Video
                  source={{ uri: selectedVideo.path }}
                  style={styles.video}
                  resizeMode="cover"
                  controls={false}
                />
              )}
              <View style={styles.modalView}>
                <Text style={styles.modalText}>이 비디오를 선택하겠습니까?</Text>
                <View style={styles.buttonContainer}>
                  <LargeButton
                    title='아니요'
                    toward='Select'
                    navigation={navigation}
                    buttonStyle={styles.cancelButtonStyle} 
                    buttonTextStyle={styles.cancelButtonTextStyle} 
                  />
                  <LargeButton
                    title="예"
                    toward={sendVideoToServer}
                    buttonStyle={styles.selectButtonStyle} 
                    buttonTextStyle={styles.selectButtonTextStyle} 
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <Text style={styles.title}>이 비디오로 분석을 시작하겠습니다</Text>
          <LargeButton
            title='분석하러 가기'
            toward='AnalysisResult'
            navigation={navigation}
            buttonStyle={styles.selectButtonStyle}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  pickButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  video: {
    width: 300,
    height: 300,
    backgroundColor: 'black',
  },
  cancelButtonStyle: {
    backgroundColor: '#F1F2F6',
    width: '50%', 
  },
  selectButtonStyle: {
    backgroundColor: '#004AAD', 
    width: '50%', 
  },
  cancelButtonTextStyle: {
    color: '#000',
  },
  selectButtonTextStyle: {
    color: '#fff',
  },
})

export default SelectOnDevice
