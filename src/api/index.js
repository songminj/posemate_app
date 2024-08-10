import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = async () =>{
  const token = await AsyncStorage.getItem('userToken')
  return axios.create({
    baseURL: config.API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : token,
    },
  }); 
} 

const aiApi = async () =>{
  const token = await AsyncStorage.getItem('userToken')
  return axios.create({
    baseURL: config.API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`,
    },
  }); 
} 

const videoPostApi = async () =>{
  const token = await AsyncStorage.getItem('userToken')
  return axios.create({
    baseURL: config.API_URL,
    timeout: 3000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization' :token,
    },
  }); 
} 

const videoApi = async () =>{
  const token = await AsyncStorage.getItem('userToken')
  return axios.create({
    baseURL: config.API_URL,
    timeout: 3000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization' :token,
    },
  }); 
} 

const userApi = async () => {
  return axios.create({
    baseURL: config.API_URL,
    timeout: 3000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
}

// const instance = axios.create({
//   baseURL: config.API_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 요청 인터셉터
// instance.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.log('Error retrieving token:', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // 응답 인터셉터
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const statusCode = error.response?.status;
//     if (statusCode === 403) {
//       console.log('403 Forbidden - Access is denied');
//       // 추가적으로 할 작업이 있다면 여기에 작성
//     } else if (statusCode === 401) {
//       console.log('401 Unauthorized - Redirecting to login');
//       // 리다이렉트 로직
//     }
//     return Promise.reject(error);
//   },
// );

// const aiApi = instance


export { api, userApi, videoApi, aiApi, videoPostApi };

