import { api, userApi } from './Index'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 공통된 AbortController와 타임아웃 설정 로직을 함수로 분리
const createAbortController = (timeout) => {
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), timeout)
  return abortController
}

const aiGet = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.get('/api-ai', { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('api-ai 점수 get 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const aiPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-ai', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('api-ai 점수 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const healthGet = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.get('/api-health', { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('서버 잘 작동')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const healthPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-health', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('api-health 점수 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const joinGet = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.get('/api-member/join', { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('id중복확인 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const joinPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-member/join', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('id중복확인 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const loginPost = async (userId, password, navigation) => {
  try {
    const response = await userApi.post('/api-member/login', {
      userId,
      password,
    })
    if (response.status === 200) {
      const token = response.headers.authorization
      await AsyncStorage.setItem('userData', token)
      navigation.navigate('Home')
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  } catch (error) {
    console.error('Error during login:', error)
    alert('로그인 중 오류가 발생했습니다.')
  }
}

const videoGet = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.get('/api-video', { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 데이터 get 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const videoPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-video', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 데이터 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const videoJsonPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-video/json', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 JSON 데이터 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const videoVideoPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const response = await api.post('/api-video/video', {}, { signal: abortController.signal })
    console.log(response.data)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 파일 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

export { 
  aiGet, 
  aiPost, 
  healthGet, 
  healthPost, 
  joinGet, 
  joinPost, 
  loginPost, 
  videoGet, 
  videoPost, 
  videoJsonPost, 
  videoVideoPost 
}
