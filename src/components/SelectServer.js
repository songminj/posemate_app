import React, { useState, useEffect } from "react";
import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LargeButton from './LargeButton';
import { videoGet } from '../api/ApiServer';
import Video from "react-native-video";
import Loading from "./Loading";

const width = Dimensions.get('window').width;

const SelectOnServer = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndVideos = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);

      const data = await videoGet(storedToken);
      if (data) {
        setVideos(data);
      }
      setLoading(false); // Set loading to false once data is fetched
    };
    
    fetchTokenAndVideos();
  }, []);

  const videoNav = async (id) => {
    setSelectedVideoId(id);
    setModalVisible(true);
  };

  const videoTrimNav = async (selectedVideoId, navigation) => {
    try {
      await AsyncStorage.setItem('selectedVideoId', String(selectedVideoId)); 
      setModalVisible(false);
      navigation.navigate('AnalysisResult');
    } catch (error) {
      console.error("Error storing selectedVideoId: ", error);
    }
  };
  
  if (loading) {
    return <Loading navigation={navigation} />;
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
            />
          <LargeButton
            title='선택하기'
            toward={() => videoTrimNav(selectedVideoId, navigation)}
          />
        </View>
      </Modal>
      
      <SafeAreaView>
        <ScrollView>
          <View>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.videoItem}
                  onPress={() => videoNav(video.video.videoId)}
                >
                  <Image
                    style={styles.videoImage}
                    source={require('../../assets/video.png')}
                    resizeMode="cover"
                  />
                  <Text>{video.video.saveDate}에 촬영한 영상</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.loadingText}>촬영한 video가 없어요</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      
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
  videoImage: {
    width: width * 0.3, 
    height: width * 0.3, 
    marginBottom: 10, 
    alignItems:'center'
  },
});

export default SelectOnServer;
