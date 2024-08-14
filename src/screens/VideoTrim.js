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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoId = await AsyncStorage.getItem('selectedVideoId');
        const tk = await AsyncStorage.getItem('userToken');
        setSelectedVideoId(videoId);
        setToken(tk);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const trimVideo = async () => {
    setIsLoading(true);
    const videoFileName = `downloadedVideo_${Date.now()}.mp4`;
    const downloadPath = `${RNFS.CachesDirectoryPath}/${videoFileName}`;
    const trimmedFileName = `trimmedVideo_${Date.now()}.mp4`;
    const outputUri = `${RNFS.CachesDirectoryPath}/${trimmedFileName}`;
  
    try {
      await RNFS.downloadFile({
        fromUrl: `https://i11a202.p.ssafy.io/api-video/${selectedVideoId}`,
        toFile: downloadPath,
        headers: {
          Authorization: token,
        },
      }).promise;
  
  
      // const command = `-i ${downloadPath} -ss ${startTime} -t ${endTime - startTime} -c copy ${outputUri}`;
      const command = `\-i "${downloadPath}" -ss ${startTime} -t ${endTime - startTime} -c copy "${outputUri}"`
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();
      console.log('return code : ', returnCode)
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
      // Clean up: delete the downloaded file
      await RNFS.unlink(downloadPath).catch(err => console.warn('Error deleting downloaded file:', err));
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
      <TouchableOpacity onPress={togglePlayPause} style={styles.videoContainer}>
        <Video
          source={{
            uri: `https://i11a202.p.ssafy.io/api-video/${selectedVideoId}`,
            headers: {
              Authorization: token,
            },
            type: 'mp4',
          }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2F6',
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
    width: 300,
    alignItems: 'center',
    marginVertical: 10,
  },
  trimContainer: {
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
  button: {
    padding: 15,
    backgroundColor: '#004AAD',
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
  goBackContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  goBackText: {
    fontSize: 18,
    color: '#004AAD',
  },
});

export default VideoTrim;

