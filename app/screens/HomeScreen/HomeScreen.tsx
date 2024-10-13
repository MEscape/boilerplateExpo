import React from 'react'

import { observer } from 'mobx-react-lite'

import { Screen, Text } from 'app/components'
import type { MainTabScreenProps, ScreenTypes } from 'app/navigators'
import { useRenderCount } from 'app/utils'

import useHome from './useHome'

const Home: React.FC<MainTabScreenProps<ScreenTypes.HOME>> = observer(function Home(_props) {
  const { styles } = useHome()
  useRenderCount('HomeScreen')

  return (
    <Screen style={styles.container} preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Text>HomeScreen</Text>
    </Screen>
  )
})

const MemorizedHome = React.memo(Home)
MemorizedHome.displayName = 'HomeScreen'
export { MemorizedHome as HomeScreen }
