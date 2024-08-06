import React, { useEffect, useState } from "react"
import ImagePicker from 'react-native-image-crop-picker'
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Alert 
} from 'react-native'
import axios from 'axios'
import LargeButton from './LargeButton'
import Video from "react-native-video"

const SelectOnDevice = ({navigation}) => {
  const [afterSelect, setAfterSelect] = useState(false)
  const [modalVisible, setModalVisible] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(()=> {
    pickVideo()
  }, [])

  const pickVideo = () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      setSelectedVideo(video)
      setModalVisible(true)
    }).catch(error => {
      console.log('Error picking video: ', error)
    })
  }

  const sendVideoToServer = async () => {
    if (selectedVideo) {
      setAfterSelect(true)
      const formData = new FormData()
      formData.append('video', {
        uri: selectedVideo.path,
        type: selectedVideo.mime,
        name: 'video.mp4',
      })

      try {
        const response = await axios.post('http://i11a202.p.ssafy.io:8080/api-video/video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Video uploaded successfully:', response.data)
      } catch (error) {
        console.error('Error uploading video:', error)
        Alert.alert("앗!", "비디오 저장에 실패했습니다😥")
      }
    }
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {!afterSelect? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
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
                    title='예'
                    toward={sendVideoToServer}
                  />
                  <LargeButton
                    title='아니요'
                    toward='Select'
                    navigation={navigation}
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
            toward='VideoTrim'
            navigation={navigation}
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
    marginTop: 22,
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
})

export default SelectOnDevice
