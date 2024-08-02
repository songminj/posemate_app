import api from './index' 

export const serviceApi = async () => {
  const aiGet = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.get('/api-ai', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('api-ai 점수 get 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const aiPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.post('/api-ai', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('api-ai 점수 post 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const healthGet = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.get('/api-health', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('서버 잘 작동')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const healthPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.post('/api-health', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('api-health 점수 post 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const joinGet = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.get('/api-member/join', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const joinPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.post('/api-member/join', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const videoGet = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.get('/api-video', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const videoPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.post('/api-video', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const videoJsonPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.joinPost('/api-video/json', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  const videoVideoPost = async () => {
    const abortController = new AbortController() 
    try {
      const response = await api.post('/api-video/video', { signal: abortController.signal.timeout(3000) })
      console.log(response.data)
    } catch (error) {
      if (abortController.signal.aborted) {
        // abortController.abort()
        console.log('id중복확인 실패')
      } else {
        console.log('API 호출 중 오류', error)
      }
    }
  }

  // 순서대로 모든 API 호출
  await aiGet()
  await aiPost()
  await healthGet()
  await healthPost()
  await joinGet()
  await joinPost()
  await videoGet()
  await videoPost()
  await videoJsonPost()
  await videoVideoPost()
}
