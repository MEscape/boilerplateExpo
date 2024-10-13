/* eslint-disable import/first */
if (__DEV__) {
  // Load Reactotron in development only.
  require('./devtools/ReactotronConfig.ts')
}
import './utils/gestureHandler'
import './i18n'
import './utils/ignoreWarnings'
import React from 'react'

import { useFonts } from 'expo-font'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'

import { LocalizationProvider, ThemeProvider } from 'app/context'
import { ErrorBoundary } from 'app/screens'

import Config from './config'
import { useInitialRootStore } from './models'
import { AppNavigator, linking, useNavigationPersistence } from './navigators'
import { customFontsToLoad } from './theme'

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {React.ReactNode} The rendered `App` component.
 */
function App(props: AppProps): React.ReactNode {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    isRestored: isNavigationStateRestored,
    onNavigationStateChange,
  } = useNavigationPersistence()

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    setTimeout(hideSplashScreen, 500)
  })

  if (!rehydrated || !isNavigationStateRestored || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <ThemeProvider>
          <LocalizationProvider>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </LocalizationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
