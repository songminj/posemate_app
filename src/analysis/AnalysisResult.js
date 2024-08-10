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

  const reportHandler = () => {
    setReport(!report);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("selectedVideoId");
        const tk = await AsyncStorage.getItem("userToken");
        const exId = await AsyncStorage.getItem("exerciseId");
        setSelectedVideoId(id);
        setToken(tk);
        setExerciseId(exId);
        const response = await aiPost(exerciseId, tk);
        setData(response?.score || []);
        setMsg(response?.message || []);
  
      } catch (err) {
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
    // labels: ["운동 결과"],
    data: [100 * 0.01]
  };
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`, 
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const segmentColors = ['#FF00FF', '#00FFFF', '#FFFF00'];
  const getColorForIndex = (index) => {
    return segmentColors[index % segmentColors.length];
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
                          <Text>아주 잘하고 있어요!</Text>
                        </>
                      ) : (
                        <>
                          <Text>조금만 더 노력해요!</Text>
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
              <Text style={styles.headerText}>님의 분석 결과</Text>
              <View style={styles.reviewContainer}>
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
              </View>
              <View style={styles.modalContent}>
                <ProgressChart
                  data={totalData}
                  width={width * 0.9}
                  height={220}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={chartConfig}
                  hideLegend={false}
                />
              </View>
              <LargeButton
                title='부위별 리포트 확인하기'
                toward={reportHandler}
                buttonStyle={styles.largeButton}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
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
  },
  largeButton: {
    width: '80%',
    marginVertical: 10,
  },
});


export default AnalysisResult;
