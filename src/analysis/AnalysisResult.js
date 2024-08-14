import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../components/Loading";
import LargeButton from '../components/LargeButton';
import Video from "react-native-video";
import { aiPost } from "../api/ApiServer";
import Icon from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get('window');

const AnalysisResult = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState([]);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(true);
  const [token, setToken] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [exerciseId, setExerciseId] = useState(null);
  const [isGood, setIsGood] = useState(false)
  const [memberName, setMemberName] = useState('')

  const reportHandler = () => {
    setReport(!report);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoId = await AsyncStorage.getItem("selectedVideoId");
        const exId = await AsyncStorage.getItem("exerciseId");
        const token = await AsyncStorage.getItem("userToken");
        const name = await AsyncStorage.getItem("memberName")
        
        setSelectedVideoId(videoId);
        setExerciseId(exId);
        setToken(token);
        setMemberName(name)

        if (exId && token) {
          const response = await aiPost(exId);
          setData(response?.score || []);
          setMsg(response?.message || []);
          
        } else {
          console.log("No exerciseId or token found");
          setError(new Error("Missing exerciseId or token"));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resultData = {
    labels: ["팔", "다리", "상체"],
    data: [data.arms * 0.01, data.legs * 0.01, data.upperBody * 0.01]
  };

  const totalData = {
    data: [data.body* 0.01]
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 74, 173, ${opacity})`, 
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!report ? (
            <Modal visible={true} transparent={true}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <ProgressChart
                    data={resultData}
                    width={width * 0.9}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                  />
                  <View>
                    <View>
                      {!isGood? (
                        <>
                          <Text style={styles.modalText}>잘하고 있어요!</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.modalText}>조금만 더 노력해요!</Text>
                        </>
                      )}
                      
                    </View>
                    <Text style={styles.modalText}>{msg.armMsg}</Text>
                    <Text style={styles.modalText}>{msg.legMsg}</Text>
                    <Text style={styles.modalText}>{msg.upperMsg}</Text>
                  </View>
                  <LargeButton
                    title="리포트 닫기"
                    toward={reportHandler}
                    buttonStyle={styles.modalButton}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <>
              <Text style={styles.headerText}>{memberName}님의 분석 결과</Text>
              <View style={styles.reviewContainer}>
                <Video
                  source={{
                    uri: `https://i11a202.p.ssafy.io/api-video/${selectedVideoId}`,
                    headers: {
                      Authorization: token,
                    },
                    type: 'mp4'
                  }}
                  style={styles.video}
                  controls={true}
                />
              </View>
              <View style={styles.modalContent}>
                <ProgressChart
                  data={totalData}
                  width={width * 0.9}
                  height={200}
                  strokeWidth={24}
                  radius={68}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
                <Text
                  style={styles.resultText}
                >
                  운동 점수는 {data.body}점 입니다!
                </Text>
              </View>
              <View style={styles.iconButtonContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {reportHandler()}}
                >
                  <Icon
                    name='bar-chart'
                    size={24}
                    color='#004AAD'
                  />
                  <Text style={styles.iconButtonText}>리포트보기</Text>
                </TouchableOpacity>
                {exerciseId? (
                <>
                  <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('VideoTrim')} // 로봇카 버튼을 클릭하면 'Server' 화면으로 이동
                  >
                    <Icon
                      name='cloud-download'
                      size={24}
                      color='#004AAD'
                    />
                    <Text style={styles.iconButtonText}>다운로드</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                </>
              )}
                
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.goBackContainer}
              >
                <Text>처음으로</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F2F6',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  resultText:{
    color:"#202020",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#2C3E50',
  },
  modalButton: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop:20,
    marginBottom: 20,
  },
  reviewContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10,
    marginVertical:30, 
  },
  largeButton: {
    width: '80%',
    marginVertical: 10,
  },
  buttonContainer: {
    margin: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconButtonContainer: {
    flexDirection: 'row', // Align icons horizontally
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 30,
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15, // Space between buttons
    padding: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  iconButtonText: {
    fontSize: 20,
    marginLeft: 8,
  },
  goBackcontainer:{
    // flex:1,
    position:"absolute",
    bottom: 20
  }
});


export default AnalysisResult;
