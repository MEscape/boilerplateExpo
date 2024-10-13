import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import { observer } from 'mobx-react-lite'

import Config from 'app/config'
import { useStores } from 'app/models'
import * as Screens from 'app/screens'

import { MainNavigator } from './MainNavigator'
import { type AppStackParamList, ScreenTypes } from './navigation.type'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

const Stack = createNativeStackNavigator<AppStackParamList>()

const screenOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  headerShown: false,
}

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={isAuthenticated ? ScreenTypes.WELCOME : ScreenTypes.LOGIN}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name={ScreenTypes.WELCOME} component={Screens.WelcomeScreen} />
          <Stack.Screen name={ScreenTypes.MAIN} component={MainNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name={ScreenTypes.LOGIN} component={Screens.LoginScreen} />
        </>
      )}

      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} {...props}>
      <AppStack />
    </NavigationContainer>
  )
})
