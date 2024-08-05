import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native'
import {Slider} from '@miblanchard/react-native-slider'
import Video from 'react-native-video'
import { launchImageLibrary } from 'react-native-image-picker'
import RNFS from 'react-native-fs'
import axios from 'axios'
import { FFmpegKit } from 'ffmpeg-kit-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')

const VideoTrim = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const [trimmedVideoUri, setTrimmedVideoUri] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [paused, setPaused] = useState(true)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(10)
  const [showTrimmed, setShowTrimmed] = useState(false)
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
        setTrimmedVideoUri(null)
        setShowTrimmed(false)
        setCurrentTime(0)
        setPaused(true)
      }
    } catch (error) {
      console.error('Error launching image library:', error)
      Alert.alert('Error', 'Failed to launch image library')
    }
  }

  const trimVideo = async () => {
    setIsLoading(true)
    const outputUri = `${RNFS.CachesDirectoryPath}/trimmedVideo_${Date.now()}.mp4`

    const command = `-i ${videoUri} -ss ${startTime} -t ${endTime - startTime} -c copy ${outputUri}`

    try {
      await FFmpegKit.execute(command)
      setIsLoading(false)
      setTrimmedVideoUri(outputUri)
      setShowTrimmed(true)
      Alert.alert('Success', 'Video trimmed successfully. You can now preview the trimmed video.')
    } catch (error) {
      console.error('Error trimming video:', error)
      setIsLoading(false)
      Alert.alert('Error', 'Failed to trim video')
    }
  }

  const uploadVideo = async () => {
    if (!trimmedVideoUri) {
      Alert.alert('Error', 'Please trim the video first')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', {
      uri: trimmedVideoUri,
      type: 'video/mp4',
      name: `trimmedVideo_${Date.now()}.mp4`,
    })

    try {
      const response = await axios.post('http://3.35.213.242:8080/api-video', formData, {
        headers: {
          'Authorization': `${AsyncStorage.getItem('userToken')}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      })
      console.log('Upload successful:', response.data)
      setIsLoading(false)
      Alert.alert('Success', 'Video uploaded successfully')
    } catch (error) {
      console.error('Error uploading video:', error.response || error.message)
      setIsLoading(false)
      Alert.alert('Error', `Failed to upload video: ${error.message}`)
    }
  }

  const toggleVideoPreview = () => {
    setShowTrimmed(!showTrimmed)
    setCurrentTime(0)
    setPaused(true)
  }

  const togglePlayPause = () => {
    setPaused(!paused)
  }

  const onSliderValueChange = (value) => {
    videoPlayer.current.seek(value)
    setCurrentTime(value)
  }

  const onVideoProgress = (data) => {
    setCurrentTime(data.currentTime)
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#000000" />}
      {videoUri ? (
        <>
          <TouchableOpacity onPress={togglePlayPause} style={styles.videoContainer}>
            <Video
              source={{ uri: showTrimmed ? trimmedVideoUri : videoUri }}
              ref={videoPlayer}
              style={styles.video}
              onLoad={(data) => {
                setDuration(data.duration)
                setEndTime(data.duration)
              }}
              resizeMode="contain"
              paused={paused}
              onProgress={onVideoProgress}
            />
          </TouchableOpacity>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={onSliderValueChange}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#1E90FF"
            />
            <Text style={styles.timeLabel}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
          </View>
          <View style={styles.trimContainer}>
            <Text style={styles.label}>Trim Range:</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={[startTime, endTime]}
              onValueChange={value => {
                setStartTime(value[0])
                setEndTime(value[1])
              }}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#1E90FF"
            />
            <View style={styles.trimLabels}>
              <Text style={styles.timeLabel}>Start: {formatTime(startTime)}</Text>
              <Text style={styles.timeLabel}>End: {formatTime(endTime)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={trimVideo} style={styles.button}>
            <Text style={styles.buttonText}>Trim Video</Text>
          </TouchableOpacity>
          {trimmedVideoUri && (
            <>
              <TouchableOpacity onPress={toggleVideoPreview} style={styles.button}>
                <Text style={styles.buttonText}>
                  {showTrimmed ? "Show Original" : "Show Trimmed"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={uploadVideo} style={styles.button}>
                <Text style={styles.buttonText}>Upload Trimmed Video</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <TouchableOpacity onPress={handleLaunchLibrary} style={styles.button}>
          <Text style={styles.buttonText}>Launch Library</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  sliderContainer: {
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  trimContainer: {
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
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
  trimLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
})

export default VideoTrim
