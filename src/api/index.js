import axios from 'axios'
import config from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: config.API_URL,
  timeout: 3000,
  headers: {
    // json형태의 type만 받아오게 되어있음. 
    'Content-Type': 'application/json',
  },
})

export default api
