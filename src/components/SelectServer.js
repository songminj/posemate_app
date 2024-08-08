import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LargeButton from './LargeButton';
import { videoGet } from '../api/ApiServer';
import Video from "react-native-video";

const width = Dimensions.get('window').width;

const SelectOnServer = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [checkVideo, setCheckVideo] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [token, setToken] = useState(null)


  useEffect(() => {
    const fetchTokenAndVideos = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);

      const data = await videoGet(storedToken);
      if (data) {
        setVideos(data);
      }
    };
    
    fetchTokenAndVideos();
  }, []);

  const videoNav = async (id) => {
    setSelectedVideoId(id);
    setModalVisible(true);
  };

  const videoTrimNav = (selectedVideoId, navigation) => {
    setModalVisible(false)
    AsyncStorage.setItem('selectedVideoId', selectedVideoId)
    navigation.navigate('VideoTrim')
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
          <Text>얍얍얍얍얍</Text>
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
              controlsStyles={{
                hideSeekBar: true,
                seekIncrementMS: 10000,
              }}
            />
          <LargeButton
            title='선택하기'
            toward={() => videoTrimNav(selectedVideoId, navigation)}
          />
        </View>
      </Modal>
      
      <View>
        {videos.length > 0 ? (
          checkVideo ? (
            videos.map((video, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.videoItem}
                onPress={() => videoNav(video.video.videoId)}
              >
                {/* <Image></Image> */}
                <Text>{video.video.saveDate}에 촬영한 영상</Text>
                {/* 필요한 속성들을 추가로 렌더링 */}
              </TouchableOpacity>
            ))
          ) : (
            <Text>얍얍얍얍얍</Text>
          )
        ) : (
          <Text style={styles.loadingText}>비디오가 없어요...</Text>
        )}
      </View>
      
      <LargeButton
        title='분석하러 가기'
        toward='Slicing'
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  videoItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: width * 0.9,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  video: {
    width: width * 0.9,
    height: width * 0.6,
  },
});

export default SelectOnServer;
