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

import LargeButton from "../components/LargeButton";

const SlicingScreen = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
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
