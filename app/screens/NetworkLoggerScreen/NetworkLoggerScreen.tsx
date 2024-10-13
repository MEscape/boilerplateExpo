import React from 'react'

import NetworkLogger from 'react-native-network-logger'

import { Screen } from 'app/components'
import type { MainTabScreenProps, ScreenTypes } from 'app/navigators'

const NetworkLoggerDebug: React.FC<MainTabScreenProps<ScreenTypes.NETWORK_CHECK>> =
  function NetworkLoggerDebug() {
    return (
      <Screen preset="auto" safeAreaEdges={['top', 'bottom']}>
        <NetworkLogger theme="light" />
      </Screen>
    )
  }

const MemorizedNetworkLogger = React.memo(NetworkLoggerDebug)
MemorizedNetworkLogger.displayName = 'NetworkLoggerScreen'
export { MemorizedNetworkLogger as NetworkLoggerScreen }
