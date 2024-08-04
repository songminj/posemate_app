import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  NativeEventEmitter,
  NativeModules,
  Button,
} from "react-native";
// import {
//   VESDK,
//   VideoEditorModal,
//   Configuration,
// } from "react-native-videoeditorsdk";

// import Video from "react-native-video";
import LargeButton from "../components/LargeButton";

// VESDK.unlockWithLicense(require("./vesdk_license"))
const SlicingScreen = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <Button
        title="버튼을 누르고 편집하기"
        onPress={() => {
          // VESDK.openEditor(require("../../assets/jwtest.mp4"))
        }}
      />
      {/* <Video
        source={require("../../assets/jwtest.mp4")} // require를 사용하여 정적 자산을 로드
        style={styles.video}
        paused={false} // 재생/중지 여부
        resizeMode={"cover"} // 프레임이 비디오 크기와 일치하지 않을 때 비디오 크기를 조정하는 방법을 결정합니다.
        onLoad={(e) => console.log(e)} // 미디어가 로드되고 재생할 준비가 되면 호출되는 콜백 함수입니다.
        repeat={true} // video가 끝나면 다시 재생할 지 여부
        onAnimatedValueUpdate={() => {}}
      /> */}
      <LargeButton
        title="결과확인하러 가기"
        toward="AnalysisResult"
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
});

export default SlicingScreen;
