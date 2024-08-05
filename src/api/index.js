import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: config.API_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const userApi = axios.create({
  baseURL: config.API_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export { api, userApi };
