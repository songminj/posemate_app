import React, {useEffect} from 'react';
import {
  ActivityIndicator, 
  StyleSheet, 
  View, 
  Text 
} from 'react-native';

const Loading = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('AnalysisResult');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return(
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.loadingIndicator} />
      <Text style={styles.loadingText}>데이터를 불러오는 중입니다.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    position: 'absolute',
    bottom: 50, // 중앙 하단부에 텍스트를 위치시키기 위해 설정합니다.
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Loading