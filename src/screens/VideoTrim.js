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
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const videoPlayer = useRef(null);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [trimmedVideoUri, setTrimmedVideoUri] = useState('');
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
      // Step 1: Download the video
      await RNFS.downloadFile({
        fromUrl: `http://i11a202.p.ssafy.io:8080/api-video/${selectedVideoId}`,
        toFile: downloadPath,
        headers: {
          Authorization: token,
        },
      }).promise;
  
      console.log('Video downloaded successfully');
  
      // Step 2: Trim the downloaded video
      const command = `-i ${downloadPath} -ss ${startTime} -t ${endTime - startTime} -c copy ${outputUri}`;
  
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();
  
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Video trimmed successfully');

        // Step 3: Move trimmed video to the final download directory
        const downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        const finalPath = `${downloadDir}/${trimmedFileName}`;

        await RNFS.moveFile(outputUri, finalPath);
        console.log('Trimmed video moved to download directory:', finalPath);
        setTrimmedVideoUri(finalPath);

        Alert.alert('Success', `Video trimmed and saved to: ${finalPath}`);
      } else {
        const logs = await session.getLogs();
        console.error('Error during FFmpeg execution:', logs);
        Alert.alert('Error', 'Failed to trim video. Please try again.');
      }
    } catch (error) {
      console.error('Error in trimVideo:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      // Clean up: delete the downloaded file
      await RNFS.unlink(downloadPath).catch(err => console.warn('Error deleting downloaded file:', err));
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const onSliderValueChange = (value) => {
    videoPlayer.current.seek(value);
    setCurrentTime(value);
  };

  const onVideoProgress = (data) => {
    setCurrentTime(data.currentTime);
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
            uri: `http://i11a202.p.ssafy.io:8080/api-video/${selectedVideoId}`,
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
          onProgress={onVideoProgress}
        />
      </TouchableOpacity>
      <View style={styles.trimContainer}>
        <Text style={styles.label}>Select Trim Range</Text>
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
          <Text style={styles.timeLabel}>Start: {formatTime(startTime)}</Text>
          <Text style={styles.timeLabel}>End: {formatTime(endTime)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={trimVideo} style={styles.button}>
        <Text style={styles.buttonText}>Trim Video</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
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
});

export default VideoTrim;

