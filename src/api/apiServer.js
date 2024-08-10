import {api, userApi, videoApi, aiApi, videoPostApi} from './Index'
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage'

// 공통된 AbortController와 타임아웃 설정 로직을 함수로 분리
const createAbortController = (timeout) => {
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), timeout)
  return abortController
}

const aiGet = async () => {
  const abortController = createAbortController(3000);
  try {
    const apiInstance = await api()
    const response = await apiInstance.get('/api-ai', { signal: abortController.signal });
    console.log(response.data);
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('api-ai 점수 get 실패');
    } else {
      console.log('API 호출 중 오류', error);
    }
  }
}


// const aiPost = async (exerciseId, token) => {
//   // AbortController를 사용하여 타임아웃 설정
//   const abortController = createAbortController(3000);  // 3초 후 자동 취소

//   try {
//     // axios 인스턴스 생성 시 타임아웃 옵션 추가
//     const apiInstance = axios.create({
//       baseURL: 'http://i11a202.p.ssafy.io:8080/',  // API 기본 URL
//       timeout: 3000,  // 3초 타임아웃 설정
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': token,
//       }
//     });

//     // POST 요청 수행
//     const response = await apiInstance.post(`/api-ai`, 
//       { exerciseId }, 
//       { signal: abortController.signal }  // AbortController의 signal 전달
//     );
//     await console.log('ai Post:', response.data);
//     return await response.data;

//   } catch (error) {
//     // 에러가 발생한 경우 에러 응답 객체에서 status를 확인
//     if (error.response) {
//       if (error.response.status === 403) {
//         console.log('권한 오류: 재시도 중...');
//         // 권한 오류 발생 시 다시 요청 시도
//         try {
//           const response = await apiInstance.post(`/api-ai`, 
//             { exerciseId }, 
//             { signal: abortController.signal }  // AbortController의 signal 전달
//           );
//           console.log('ai Post 재시도 성공:', response.data);
//           return response.data;
//         } catch (retryError) {
//           console.log('재시도 중 오류 발생:', retryError);
//           throw retryError; // 재시도 중 발생한 오류를 다시 던짐
//         }
//       } else {
//         console.log(`API 호출 중 오류 발생: ${error.response.status}`, error.response.data);
//       }
//     } else if (abortController.signal.aborted) {
//       console.log('요청이 중단되었습니다.');
//     } else if (error.code === 'ECONNABORTED') {
//       console.log('요청이 시간 초과되었습니다.');
//     } else {
//       console.log('API 호출 중 알 수 없는 오류 발생:', error);
//     }
//   }
// };



// const aiPost = async (exerciseId, token) => {
//   // AbortController를 사용하여 타임아웃 설정
//   const abortController = createAbortController(3000);  // 3초 후 자동 취소
//   // const token = await AsyncStorage.getItem('userToken');
//   try {
//     // axios 인스턴스 생성 시 타임아웃 옵션 추가
//     const apiInstance = axios.create({
//       baseURL: 'http://i11a202.p.ssafy.io:8080/',  // API 기본 URL
//       timeout: 3000,  // 5초 타임아웃 설정
//       headers: {
//         // 필요에 따라 추가 헤더를 설정합니다.
//         'Content-Type': 'application/json',
//         'Authorization' : token,
//       }
//     });

//     // POST 요청 수행
//     const response = await apiInstance.post(`/api-ai`, 
//       { exerciseId }, 
//       //{ signal: abortController.signal}  // AbortController의 signal 전달
//     );
//     console.log('ai Post:', response.data);
//     return response.data;
//   } catch (error) {
//     if (response.error == 403) {
//       const response = await apiInstance.post(`/api-ai`, 
//         { exerciseId }, 
//         //{ signal: abortController.signal}  // AbortController의 signal 전달
//       );
//       console.log('ai Post:', response.data);
//       return response.data;
//     } else if (abortController.signal.aborted) {
//       console.log('요청이 중단되었습니다.');
//     } else if (error.code === 'ECONNABORTED') {
//       console.log('요청이 시간 초과되었습니다.');
//     } else {
//       console.log('API 호출 중 오류 발생:', error);
//     }
//   }
// };

// // 토큰 갱신 함수 예시
// const refreshAuthToken = async () => {
//   try {
//     const refreshToken = await AsyncStorage.getItem('refreshToken');
//     const response = await axios.post(`${config.API_URL}/auth/refresh`, { refreshToken });

//     const newToken = response.data.accessToken;
//     await AsyncStorage.setItem('userToken', newToken);

//     return newToken;
//   } catch (error) {
//     console.error('토큰 갱신 실패:', error);
//     return null;
//   }
// };


// const aiPost = async (exerciseId) => {
//   const abortController = createAbortController(3000);
//   try {
//     const apiInstance = await aiApi();
//     const response = await apiInstance.post(`/api-ai`, { exerciseId }, { signal: abortController.signal });
//     console.log('ai Post :', response.data);
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 403) {
//       console.log('토큰 만료 - 갱신 시도 중...');
//       // 토큰 갱신 로직 추가
//       const refreshedToken = await refreshAuthToken();  // 토큰 갱신 함수 호출
//       if (refreshedToken) {
//         // 새로 받은 토큰으로 다시 요청 시도
//         const apiInstance = await aiApi(); // 갱신된 토큰으로 새 인스턴스 생성
//         const retryResponse = await apiInstance.post(`/api-ai`, { exerciseId }, { signal: abortController.signal });
//         console.log('ai Post 재시도 성공:', retryResponse.data);
//         return retryResponse.data;
//       }
//     } else if (abortController.signal.aborted) {
//       console.log('서버 잘 작동');
//     } else {
//       console.log('API 호출 중 오류', error);
//     }
//   }
// }


const aiPost = async (exerciseId) => {
  const abortController = createAbortController(3000);
  try {
    const apiInstance = await api()
    const response = await apiInstance.post(`/api-ai`, {exerciseId}, { signal: abortController.signal} )
    console.log('ai Post :', response.data)
    return response.data
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('서버 잘 작동');
    } else {
      console.log('API 호출 중 오류', error);
    }
  }
}

const healthGet = async () => {
  const abortController = createAbortController(3000);
  try {
    const apiInstance = await api()
    const response = await apiInstance.get('/api-health', { signal: abortController.signal });
    console.log(response.data);
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('서버 잘 작동');
    } else {
      console.log('API 호출 중 오류', error);
    }
  }
}

const healthPost = async (msg) => {
  const abortController = createAbortController(3000)
  try {
    const apiInstance = await api()
    const response = await apiInstance.post('/api-health', {msg}, { signal: abortController.signal })
    console.log(response.data.msg)
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('api-health 점수 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

// // 403에러 
// const joinPost = async (navigation) => {
//   const abortController = createAbortController(3000);
//   try {
//     const member = {
//       username: "김씃픗",
//       password: "1234",
//       userId: "sssssafy",
//       phone: "010-1234-2303",
//     };
//     const response = await joinApi.post('/api-member/join', member, { signal: abortController.signal });
//     console.log(response.data);
//     if (response.headers.authorization) {
//       await AsyncStorage.setItem('userToken', response.headers.authorization);
//       navigation.navigate('Home');
//     } else {
//       console.error('Token is missing in the response');
//     }
//   } catch (error) {
//     if (abortController.signal.aborted) {
//       console.log('id중복확인 실패');
//     } else {
//       console.log('API 호출 중 오류', error);
//     }
//   }
// };


const loginPost = async (userId, password, navigation) => {
  try {
    const userApiInstance = await userApi()
    const response = await userApiInstance.post('/api-member/login', {
      userId,
      password,
    })
    console.log(response.data)
    if (response.status === 200) {
      const token = response.headers.authorization
      await AsyncStorage.setItem('userToken', token)
      await AsyncStorage.setItem('userId', userId)
      navigation.navigate('Home')
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  } catch (error) {
    console.error('Error during login:', error)
    Alert.alert('앗!', '아이디 또는 비밀번호가 올바르지 않습니다.')
  }
}


const videoGet = async () => {
  const abortController = createAbortController(3000)
  try {
    const apiInstance = await api()
    const response = await apiInstance.get(`/api-file`, { signal: abortController.signal })
    // console.log(response.data)
    return response.data
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 데이터 get 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const videoTargetGet = async (videoId) => {
  const abortController = createAbortController(3000)
  try {
    const apiInstance = await api()
    const response = await apiInstance.get(`/api-video/${videoId}`, { signal: abortController.signal })
    // console.log(response.data)
    return response
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 데이터 get 실패')
    } else {
      console.log('API 호출 중 오류', error)
    }
  }
}

const videoPost = async (video) => {
  const abortController = createAbortController(3000)
  try {
    const apiInstance = await videoPostApi()
    const response = await apiInstance.post('/api-video', video, { signal: abortController.signal })
    console.log(response)
    return response
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log('비디오 데이터 post 실패')
    } else {
      console.log('API 호출 중 오류', error)
      alert("앗! 비디오 저장에 실패했습니다😥")
    }
  }
}

const videoJsonPost = async () => {
  const abortController = createAbortController(3000)
  try {
    const apiInstance = await videoApi()
    const response = await apiInstance.post('/api-video/json', {}, { signal: abortController.signal })
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
  // joinPost, 
  loginPost, 
  videoGet,
  videoTargetGet, 
  videoPost, 
  videoJsonPost, 
  videoVideoPost 
}
