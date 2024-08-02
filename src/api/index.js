import axios from 'axios'
import config from '../../config'

const api = axios.create({
  baseURL: config.API_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
