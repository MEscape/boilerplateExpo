import React from 'react'

import { observer } from 'mobx-react-lite'

import { Screen, Text } from 'app/components'
import type { AppStackScreenProps, ScreenTypes } from 'app/navigators'
import { useRenderCount } from 'app/utils'

import useWelcome from './useWelcome'

const Welcome: React.FC<AppStackScreenProps<ScreenTypes.WELCOME>> = observer(function Welcome(
  _props,
) {
  const { logout, styles } = useWelcome()
  useRenderCount('WelcomeScreen')

  return (
    <Screen style={styles.container} preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Text onPress={logout}>WelcomeScreen</Text>
    </Screen>
  )
})

const MemorizedWelcome = React.memo(Welcome)
MemorizedWelcome.displayName = 'WelcomeScreen'
export { MemorizedWelcome as WelcomeScreen }
