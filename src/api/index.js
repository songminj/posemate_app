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


const aiApi = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
});

// Request interceptor
// aiApi.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     console.log('Current token:', token); // Debug log
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Ensure 'Bearer' prefix
//     } else {
//       console.log('No token found in AsyncStorage'); // Debug log
//     }
//     console.log('Request config:', config); // Debug log
//     return config;
//   },
//   (error) => {
//     console.log('Request interceptor error:', error); // Debug log
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// aiApi.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response.status, response.data); // Debug log
//     return response;
//   },
//   (error) => {
//     console.log('Response error:', error.response?.status, error.response?.data); // Debug log
//     if (error.response && error.response.status === 403) {
//       console.log('Authentication error. Token might be invalid or expired.');
//       // Implement your logic here (e.g., redirect to login, refresh token)
//       // For example:
//       // refreshToken();
//     }
//     return Promise.reject(error);
//   }
// );



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



export { api, userApi, videoApi, aiApi, videoPostApi };

// import axios from 'axios';
// import config from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Create a single axios instance with interceptor
// const api = axios.create({
//   baseURL: config.API_URL,
//   timeout: 10000,
// });

// let isRefreshing = false;
// let refreshSubscribers = [];

// const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);

// const onRefreshed = (token) => {
//   refreshSubscribers.map(cb => cb(token));
//   refreshSubscribers = [];
// };

// const refreshToken = async () => {
//   try {
//     const refreshToken = await AsyncStorage.getItem('refreshToken');
//     const response = await axios.post(`${config.API_URL}/refresh-token`, { refreshToken });
//     const { token } = response.data;
//     await AsyncStorage.setItem('userToken', token);
//     return token;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     throw error;
//   }
// };

// // Request interceptor to attach token
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle 403 errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 403 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(resolve => {
//           subscribeTokenRefresh(token => {
//             originalRequest.headers['Authorization'] = 'Bearer ' + token;
//             resolve(axios(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newToken = await refreshToken();
//         api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
//         onRefreshed(newToken);
//         originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
//         // Redirect to login or handle authentication failure
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Function to create a request with custom headers
// const createRequest = async (additionalHeaders = {}) => {
//   const token = await AsyncStorage.getItem('userToken');
//   const defaultHeaders = {
//     'Authorization': token ? `Bearer ${token}` : '',
//     'Content-Type': 'application/json',
//   };

//   return api({
//     headers: {
//       ...defaultHeaders,
//       ...additionalHeaders,
//     },
//   });
// };

// // Example usage
// const mainApi = async () => {
//   return createRequest({
//     'Content-Type': 'application/json',
//   });
// };

// const videoPostApi = async () => {
//   return createRequest({
//     'Content-Type': 'multipart/form-data',
//   });
// };

// const videoApi = async () => {
//   return createRequest({
//     'Content-Type': 'multipart/form-data',
//   });
// };

// const userApi = async () => {
//   return createRequest({
//     'Content-Type': 'multipart/form-data',
//   });
// };

// export { mainApi, userApi, videoApi, videoPostApi };
