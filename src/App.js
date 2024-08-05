import React, {useEffect, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, TouchableOpacity, Text } from 'react-native'
import AnalysisResult from './analysis/AnalysisResult'
import AnalysisSelectScreen from './analysis/AnalysisSelectScreen'
import HomeScreen from './screens/HomeScreen'
import SelectOnDevice from './screens/SelectOnDevice'
import SelectOnServer from './screens/SelectOnServer'
import LoginScreen from './login/LoginScreen'
import SignInScreen from './login/SignInScreen'
import ProfileScreen from './login/ProfileScreen'
import SlicingScreen from './screens/SlicingScreen'
import VideoTrim from './screens/VideoTrim'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()


// 로그아웃 버튼 컴포넌트
const LogoutScreen = async ({ navigation }) => {
  try {
    await AsyncStorage.clear()
    navigation.reset({
      index:0,
      routes: [{name:'Home'}],
    }) // 로그아웃 후 Home 화면으로 이동
  } catch (error) {
    console.log('Error logging out:', error)
  }
}

const MainTabNavigator = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        setIsLoggedIn(!!token)
      } catch (error) {
        console.log('Error checking login status:', error)
      }
    }
    checkLoginStatus()
  }, [])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0C1B2E',
          borderTopColor: '#1A2A42',
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1A2A42',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name='home'
              color={color}
              size={size}
            />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name={isLoggedIn ? 'Logout' : 'Login'}
        component={isLoggedIn ? LogoutScreen : LoginScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Icon
              name={isLoggedIn ? 'sign-out' : 'sign-in'}
              color={color}
              size={size}
            />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Main'
        screenOptions={{
          contentStyle: {
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        <Stack.Screen 
          name='MainTabs' 
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name='AnalysisResult' 
          component={AnalysisResult}
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Select' 
          component={AnalysisSelectScreen}
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Device'
          component={SelectOnDevice} 
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Server' 
          component={SelectOnServer} 
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Login' 
          component={LoginScreen} 
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='SignIn' 
          component={SignInScreen} 
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Profile' 
          component={ProfileScreen} 
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='Slicing'
          component={SlicingScreen}
          options= {{headerShown: false,}}
        />
        <Stack.Screen 
          name='VideoTrim'
          component={VideoTrim}
          options= {{headerShown: false,}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App