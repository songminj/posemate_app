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
