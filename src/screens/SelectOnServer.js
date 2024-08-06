import React, { useEffect } from "react"
import axios from 'axios'
import { 
  View, 
  Text, 
  StyleSheet,
  Dimensions
} from 'react-native'

import LargeButton from '../components/LargeButton'

const width = Dimensions.get('window').width

const SelectOnServer = ({ navigation }) => {
  const requestGet = async () => {
    try {
      const response = await axios.get('http://i11a202.p.ssafy.io:8080/api-video')
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    requestGet()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>로봇카로 촬영한 영상 찾아보기</Text>
      <LargeButton
        title='분석하러 가기'
        toward='Slicing'
        navigation={navigation}
      />
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
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default SelectOnServer
