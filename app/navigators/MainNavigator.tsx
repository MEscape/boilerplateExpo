import React from 'react'
import { Animated, ViewStyle } from 'react-native'

import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon, IconProps, LibraryTypes, textPresets } from 'app/components'
import { useColor } from 'app/context'
import { translate } from 'app/i18n'
import * as Screens from 'app/screens'
import { sizing } from 'app/theme'
import { scaledSize } from 'app/utils'

import { MainTabParamList, ScreenTypes } from './navigation.type'

const Tab = createBottomTabNavigator<MainTabParamList>()

const scaleValues = {
  Add: new Animated.Value(1),
  Home: new Animated.Value(1),
  Network: new Animated.Value(1),
  Search: new Animated.Value(1),
}

const animateTabPress = (scaleValue: Animated.Value) => {
  Animated.sequence([
    Animated.timing(scaleValue, {
      duration: 50,
      toValue: 0.8,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      duration: 50,
      toValue: 1,
      useNativeDriver: true,
    }),
  ]).start()
}

interface AnimatedIconProps {
  name: string
  scale: Animated.Value
  focused: boolean
  accent: string
  text: string
}

const AnimatedIcon = <T extends LibraryTypes>({
  accent,
  focused,
  name,
  scale,
  text,
}: AnimatedIconProps) => (
  <Animated.View style={{ transform: [{ scale }] }}>
    <Icon
      icon={(focused ? name : `${name}-outline`) as IconProps<T>['icon']}
      library="Ionicons"
      size={scaledSize(sizing.iconSize.normal)}
      color={focused ? accent : text}
    />
  </Animated.View>
)

const tabBarStyle: ViewStyle = {
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  elevation: 0,
  position: 'absolute',
}

export function MainNavigator() {
  const { colors } = useColor()
  const { bottom } = useSafeAreaInsets()

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: colors.accent,
    tabBarHideOnKeyboard: true,
    tabBarInactiveTintColor: colors.text,
    tabBarLabelStyle: textPresets.h5,
    tabBarStyle: [tabBarStyle, { height: bottom + 70 }],
  }

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={ScreenTypes.HOME}
        component={Screens.HomeScreen}
        options={{
          tabBarIcon: props => (
            <AnimatedIcon {...colors} {...props} name="home" scale={scaleValues.Home} />
          ),
          tabBarLabel: translate('tabs.start') as string,
        }}
        listeners={{ tabPress: () => animateTabPress(scaleValues.Home) }}
      />
      <Tab.Screen
        name={ScreenTypes.LIBRARY}
        component={Screens.LibraryScreen}
        options={{
          tabBarIcon: props => (
            <AnimatedIcon {...colors} {...props} name="library" scale={scaleValues.Search} />
          ),
          tabBarLabel: translate('tabs.library') as string,
        }}
        listeners={{ tabPress: () => animateTabPress(scaleValues.Search) }}
      />
      <Tab.Screen
        name={ScreenTypes.SETTING}
        component={Screens.SettingScreen}
        options={{
          tabBarIcon: props => (
            <AnimatedIcon {...colors} {...props} name="settings" scale={scaleValues.Add} />
          ),
          tabBarLabel: translate('tabs.settings') as string,
        }}
        listeners={{ tabPress: () => animateTabPress(scaleValues.Add) }}
      />
      {__DEV__ && (
        <Tab.Screen
          name={ScreenTypes.NETWORK_CHECK}
          component={Screens.NetworkLoggerScreen}
          options={{
            tabBarIcon: props => (
              <AnimatedIcon {...colors} {...props} name="key" scale={scaleValues.Network} />
            ),
            tabBarLabel: translate('tabs.network') as string,
          }}
          listeners={{ tabPress: () => animateTabPress(scaleValues.Network) }}
        />
      )}
    </Tab.Navigator>
  )
}
