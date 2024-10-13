import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigatorScreenParams, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'

export enum ScreenTypes {
  FORCE_UPDATE_SCREEN = 'forceUpdateScreen',
  NETWORK_CHECK = 'networkCheck',
  WELCOME = 'welcome',
  SETTING = 'setting',
  LOGIN = 'login',
  SIGNUP = 'signup',
  HOME = 'home',
  MAIN = 'main',
  LIBRARY = 'library',
}

// MAIN NAVIGATOR
export type MainTabParamList = {
  [ScreenTypes.HOME]: undefined
  [ScreenTypes.LIBRARY]: LibraryParams
  [ScreenTypes.SETTING]: undefined
  [ScreenTypes.NETWORK_CHECK]: undefined
}

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export type LibraryParams = {
  item: null
}

// APP NAVIGATOR
export type AppStackParamList = {
  [ScreenTypes.FORCE_UPDATE_SCREEN]: undefined
  [ScreenTypes.WELCOME]: undefined
  [ScreenTypes.LOGIN]: undefined
  [ScreenTypes.SIGNUP]: undefined
  [ScreenTypes.MAIN]: NavigatorScreenParams<MainTabParamList>
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList | MainTabParamList>

export type RouteProps<T extends keyof AppStackParamList | keyof MainTabParamList> = RouteProp<
  AppStackParamList & MainTabParamList,
  T
>
