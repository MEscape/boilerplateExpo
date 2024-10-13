import * as Linking from 'expo-linking'

import { ScreenTypes } from 'app/navigators/navigation.type'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
  screens: {
    [ScreenTypes.MAIN]: {
      screens: {
        [ScreenTypes.HOME]: ScreenTypes.HOME,
        [ScreenTypes.LIBRARY]: ScreenTypes.LIBRARY,
        [ScreenTypes.SETTING]: ScreenTypes.SETTING,
        [ScreenTypes.NETWORK_CHECK]: ScreenTypes.NETWORK_CHECK,
      },
    },
    [ScreenTypes.LOGIN]: {
      path: '',
    },
    [ScreenTypes.WELCOME]: ScreenTypes.WELCOME,
  },
}

export const linking = {
  config,
  prefixes: [prefix],
}
