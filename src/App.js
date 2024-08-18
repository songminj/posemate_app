import React, { useEffect, useState } from 'react'
import { 
  NavigationContainer, 
  useFocusEffect, 
  useIsFocused
} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AnalysisResult from './analysis/AnalysisResult'
import AnalysisSelectScreen from './analysis/AnalysisSelectScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './login/LoginScreen'
import SignInScreen from './login/SignInScreen'
import VideoTrim from './screens/VideoTrim'
import DeviceComponent from './components/SelectDevice'
import ServerComponent from './components/SelectServer'
import MakeTf from './screens/MakeTf'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const isFocused = useIsFocused()
  const LogoutScreen = ({ navigation }) => {
    useFocusEffect(
      React.useCallback(() => {
        const performLogout = async () => {
          try {
            await AsyncStorage.clear()
            await setIsLoggedIn(false)
            navigation.navigate('Home')
          } catch (error) {
            console.log('Error logging out:', error)
          }
        }
        performLogout()
      }, [isFocused])
    )
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        await setIsLoggedIn(token)
      } catch (error) {
        console.log('Error checking login status:', error)
      }
    }
    checkLoginStatus()
  }, [isFocused]) // isLoggedIn 상태가 변경될 때마다 실행

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0C1B2E',
          borderTopColor: '#1A2A42',
          height: 60, // Increase tab bar height for better visibility
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#7CBBF3',
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
          unmountOnBlur: true,
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
            backgroundColor: '#F1F2F6',
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
          options={{ headerShown: false }}
          component={AnalysisResult}
        />
        <Stack.Screen
          name='Select'
          component={AnalysisSelectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Login'
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name='SignIn'
          options={{ headerShown: false }}
          component={SignInScreen}
        />
        <Stack.Screen
          name='Device'
          options={{ headerShown: false }}
          component={DeviceComponent}
        />
        <Stack.Screen
          name='Server'
          options={{ headerShown: false }}
          component={ServerComponent}
        />
        <Stack.Screen
          name='VideoTrim'
          options={{ headerShown: false }}
          component={VideoTrim}
        />
        {/* 삭제할거 */}
        <Stack.Screen
          name='MakeTf'
          options={{ headerShown: false }}
          component={MakeTf}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
