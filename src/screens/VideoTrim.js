import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { isValidFile, showEditor } from 'react-native-video-trim';
import { launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', (event) => {
      switch (event.name) {
        case 'onShow':
          console.log('onShowListener', event);
          break;
        case 'onHide':
          console.log('onHide', event);
          break;
        case 'onStartTrimming':
          console.log('onStartTrimming', event);
          break;
        case 'onFinishTrimming':
          console.log('onFinishTrimming', event);
          break;
        case 'onCancelTrimming':
          console.log('onCancelTrimming', event);
          break;
        case 'onError':
          console.log('onError', event);
          break;
        default:
          console.log('Unknown event', event);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLaunchLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        assetRepresentationMode: 'current',
      });

      if (result.assets && result.assets.length > 0) {
        const videoUri = result.assets[0].uri || '';
        const isValid = await isValidFile(videoUri);
        console.log(isValid);

        showEditor(videoUri, { maxDuration: 20 });
      }
    } catch (error) {
      console.error('Error launching image library:', error);
    }
  };

  const handleCheckVideoValid = async () => {
    try {
      const isValid = await isValidFile('invalid file path');
      console.log(isValid);
    } catch (error) {
      console.error('Error checking video validity:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLaunchLibrary} style={styles.launchButton}>
        <Text>Launch Library</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCheckVideoValid} style={styles.checkButton}>
        <Text>Check Video Valid</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchButton: {
    padding: 10,
    backgroundColor: 'red',
  },
  checkButton: {
    padding: 10,
    backgroundColor: 'blue',
    marginTop: 20,
  },
});

export default App;
