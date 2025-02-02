import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import CarouselComponent from '../components/CarouselComponent'
import Icon from 'react-native-vector-icons/FontAwesome'



const { width } = Dimensions.get('window')
const SelectScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>POSE MATE를</Text>
        <Text style={styles.headerText}>이용해주셔서 감사합니다!</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.description}>
          여러분의 달리기 자세를 분석하여
        </Text>
        <Text style={styles.description}>
          자세교정이 필요한 부분을 알려드립니다.
        </Text>
      </View>
      <CarouselComponent/>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonTitle}>어디서 동영상을 가져올까요?</Text>
          <View style={styles.iconButtonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Device')} // 갤러리 버튼을 클릭하면 'Device' 화면으로 이동
            >
              <Icon
                name='folder'
                size={24}
                color='#004AAD'
              />
              <Text style={styles.iconButtonText}>갤러리</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Server')} // 로봇카 버튼을 클릭하면 'Server' 화면으로 이동
            >
              <Icon
                name='car'
                size={24}
                color='#004AAD'
              />
              <Text style={styles.iconButtonText}>로봇카</Text>
            </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202020'
  },
  container: {
    margin: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#202020'
  },
  buttonContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconButtonContainer: {
    flexDirection: 'row', // Align icons horizontally
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 30,
    marginHorizontal:30,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10, // Space between buttons
    padding: 15,
    paddingHorizontal:20,
    // width: width*0.45,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    gap: 15
  },
  iconButtonText: {
    fontSize: 20,
    marginLeft: 8,
    color: '#202020'
  },
})

export default SelectScreen
