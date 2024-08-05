import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import Video from 'react-native-video'
import { launchImageLibrary } from 'react-native-image-picker'
import RNFS from 'react-native-fs'
import axios from 'axios'
import { FFmpegKit } from 'ffmpeg-kit-react-native'

const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(10)
  const videoPlayer = useRef(null)

  const handleLaunchLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        assetRepresentationMode: 'current',
      })

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri || ''
        setVideoUri(uri)
        videoPlayer.current.seek(0)
      }
    } catch (error) {
      console.error('Error launching image library:', error)
    }
  }

  const trimVideo = async () => {
    setIsLoading(true)
    const outputUri = `${RNFS.CachesDirectoryPath}/trimmedVideo_${Date.now()}.mp4`

    const command = `-i ${videoUri} -ss ${startTime} -t ${endTime - startTime} -c copy ${outputUri}`

    try {
      await FFmpegKit.execute(command)
      setIsLoading(false)
      await uploadVideo(outputUri)
    } catch (error) {
      console.error('Error trimming video:', error)
      setIsLoading(false)
    }
  }

  const uploadVideo = async (uri) => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', {
      uri,
      type: 'video/mp4',
      name: `trimmedVideo_${Date.now()}.mp4`,
    })

    try {
      const response = await axios.post('http://3.35.213.242:8080/api-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 올바른 Content-Type 설정
        },
      })
      console.log('Upload successful:', response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error uploading video:', error.message) // 에러 메시지 로깅
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#000000" />}
      {videoUri ? (
        <>
          <Video
            source={{ uri: videoUri }}
            ref={videoPlayer}
            style={styles.video}
            onLoad={(data) => setDuration(data.duration)}
            resizeMode="contain"
          />
          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Trim Range:</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={[startTime, endTime]}
              onValueChange={value => {
                setStartTime(Array.isArray(value) ? value[0] : value)
                setEndTime(Array.isArray(value) ? value[1] : value)
              }}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#1E90FF"
            />
            <Text style={styles.timeLabel}>Start: {startTime.toFixed(2)}s</Text>
            <Text style={styles.timeLabel}>End: {endTime.toFixed(2)}s</Text>
          </View>
          <TouchableOpacity onPress={trimVideo} style={styles.trimButton}>
            <Text style={styles.buttonText}>Trim Video</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleLaunchLibrary} style={styles.launchButton}>
          <Text style={styles.buttonText}>Launch Library</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // 배경색 흰색
  },
  video: {
    width: '90%',
    height: 200,
    marginVertical: 20,
  },
  sliderContainer: {
    width: '90%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  launchButton: {
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 10,
  },
  trimButton: {
    padding: 15,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    color: '#333333',
  },
})

export default App
