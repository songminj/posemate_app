import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const VideoTrim = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const videoPlayer = useRef(null);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [token, setToken] = useState(null);
  const [videoUri, setVideoUri] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoId = await AsyncStorage.getItem('selectedVideoId');
        const tk = await AsyncStorage.getItem('userToken');
        setSelectedVideoId(videoId);
        setToken(tk);
        
        // Download the video when the component mounts
        if (videoId && tk) {
          await downloadVideo(videoId, tk);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const downloadVideo = async (videoId, token) => {
    setIsLoading(true);
    const videoFileName = `downloadedVideo_${Date.now()}.mp4`;
    const downloadPath = `${RNFS.CachesDirectoryPath}/${videoFileName}`;

    try {
      const response = await RNFS.downloadFile({
        fromUrl: `https://i11a202.p.ssafy.io/api-video/${videoId}`,
        toFile: downloadPath,
        headers: {
          Authorization: token,
        },
      }).promise;

      if (response.statusCode === 200) {
        console.log('Video downloaded successfully');
        setVideoUri(downloadPath);
      } else {
        console.error('Failed to download video:', response);
        Alert.alert('오류', '비디오 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error downloading video:', error);
      Alert.alert('오류', '비디오 다운로드 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const trimVideo = async () => {
    if (!videoUri) {
      Alert.alert('오류', '먼저 비디오를 다운로드해주세요.');
      return;
    }

    setIsLoading(true);
    const trimmedFileName = `trimmedVideo_${Date.now()}.mp4`;
    const outputUri = `${RNFS.CachesDirectoryPath}/${trimmedFileName}`;

    try {
      const command = `-ss ${startTime} -i "${videoUri}" -t ${endTime - startTime} -c copy "${outputUri}"`;
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();
      
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Video trimmed successfully');

        const downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        const finalPath = `${downloadDir}/${trimmedFileName}`;

        await RNFS.moveFile(outputUri, finalPath);
        console.log('Trimmed video moved to download directory:', finalPath);

        Alert.alert('성공!', `갤러리에서 동영상을 확인하세요🎞`);
      } else {
        const logs = await session.getLogs();
        console.error('Error during FFmpeg execution:', logs);
        Alert.alert('앗!', '비디오 저장에 실패했어요.');
      }
    } catch (error) {
      console.error('Error in trimVideo:', error);
      Alert.alert('앗!', '문제가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#000000" />}
      {videoUri && (
        <TouchableOpacity onPress={togglePlayPause} style={styles.videoContainer}>
          <Video
            source={{ uri: videoUri }}
            ref={videoPlayer}
            style={styles.video}
            onLoad={(data) => {
              setDuration(data.duration);
              setEndTime(data.duration);
            }}
            resizeMode="contain"
            paused={paused}
            controls={true}
          />
        </TouchableOpacity>
      )}
      <View style={styles.trimContainer}>
        <Text style={styles.label}>구간 길이</Text>
        <Slider
          style={styles.slider}
          width={300}
          minimumValue={0}
          maximumValue={duration}
          value={[startTime, endTime]}
          onValueChange={(value) => {
            setStartTime(value[0]);
            setEndTime(value[1]);
          }}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1E90FF"
        />
        <View style={styles.trimLabels}>
          <Text style={styles.timeLabel}>시작: {formatTime(startTime)}</Text>
          <Text style={styles.timeLabel}>끝: {formatTime(endTime)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={trimVideo} style={styles.button}>
        <Text style={styles.buttonText}>비디오 저장하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.goBackContainer}
      >
        <Text>처음으로</Text>
      </TouchableOpacity>
    </View>
  );
};