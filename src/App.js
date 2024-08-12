import React, { useEffect, useState } from 'react'
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AnalysisResult from './analysis/AnalysisResult'
import AnalysisSelectScreen from './analysis/AnalysisSelectScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './login/LoginScreen'
import SignInScreen from './login/SignInScreen'
import SlicingScreen from './screens/SlicingScreen'
import VideoTrim from './screens/VideoTrim'
import DeviceComponent from './components/SelectDevice'
import ServerComponent from './components/SelectServer'
import ApiTest from './screens/ApiTest'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const LogoutScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const performLogout = async () => {
        try {
          await AsyncStorage.clear()
          await setIsLoggedIn(false)
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        } catch (error) {
          console.log('Error logging out:', error)
        }
      }
      performLogout()
    }, [navigation])
  )

  return null // 로그아웃 처리 후, 화면에 아무것도 렌더링하지 않음
}

const MainTabNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
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
  )

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
        initialRouteName='MainTabs'
        screenOptions={{
          contentStyle: {
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        <Stack.Screen
          name='MainTabs'
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='AnalysisResult'
          // options={{ headerShown: false }}
          component={AnalysisResult}
        />
        <Stack.Screen
          name='Select'
          component={AnalysisSelectScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Login'
          // options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name='SignIn'
          // options={{ headerShown: false }}
          component={SignInScreen}
        />
        <Stack.Screen
          name='Slicing'
          // options={{ headerShown: false }}
          component={SlicingScreen}
        />
        <Stack.Screen
          name='Device'
          // options={{ headerShown: false }}
          component={DeviceComponent}
        />
        <Stack.Screen
          name='Server'
          // options={{ headerShown: false }}
          component={ServerComponent}
        />
        <Stack.Screen
          name='VideoTrim'
          // options={{ headerShown: false }}
          component={VideoTrim}
        />
        <Stack.Screen
          name='ApiTest'
          component={ApiTest}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
