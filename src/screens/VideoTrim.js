import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { FFmpegKit, FFmpegKitConfig } from 'ffmpeg-kit-react-native';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const videoPlayer = useRef(null);

  const handleLaunchLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        assetRepresentationMode: 'current',
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri || '';
        setVideoUri(uri);
        videoPlayer.current.seek(0);
      }
    } catch (error) {
      console.error('Error launching image library:', error);
    }
  };

  const trimVideo = async () => {
    setIsLoading(true);
    const outputUri = `${RNFS.CachesDirectoryPath}/trimmedVideo.mp4`;

    const command = `-i ${videoUri} -ss ${startTime} -t ${endTime - startTime} -c copy ${outputUri}`;

    try {
      await FFmpegKit.execute(command);
      setIsLoading(false);
      await uploadVideo(outputUri);
    } catch (error) {
      console.error('Error trimming video:', error);
      setIsLoading(false);
    }
  };

  const uploadVideo = async (uri) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'video/mp4',
      name: 'trimmedVideo.mp4',
    });

    try {
      const response = await axios.post('YOUR_SERVER_URL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {videoUri ? (
        <>
          <Video
            source={{ uri: videoUri }}
            ref={videoPlayer}
            style={styles.video}
            onLoad={(data) => setDuration(data.duration)}
            resizeMode="contain"
          />
          <Text>Start Time: {startTime.toFixed(2)}s</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={startTime}
            onValueChange={setStartTime}
          />
          <Text>End Time: {endTime.toFixed(2)}s</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={endTime}
            onValueChange={setEndTime}
          />
          <TouchableOpacity onPress={trimVideo} style={styles.trimButton}>
            <Text>Trim Video</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleLaunchLibrary} style={styles.launchButton}>
          <Text>Launch Library</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  launchButton: {
    padding: 10,
    backgroundColor: 'red',
  },
  trimButton: {
    padding: 10,
    backgroundColor: 'blue',
    marginTop: 20,
  },
});

export default App;
