import React from 'react'

import { Screen, Text } from 'app/components'
import type { MainTabScreenProps, ScreenTypes } from 'app/navigators'
import { useRenderCount } from 'app/utils'

import useSetting from './useSetting'

const Setting: React.FC<MainTabScreenProps<ScreenTypes.SETTING>> = function Setting(_props) {
  const { styles } = useSetting()
  useRenderCount('SettingScreen')

  return (
    <Screen style={styles.container} preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Text>SettingScreen</Text>
    </Screen>
  )
}

const MemorizedSetting = React.memo(Setting)
MemorizedSetting.displayName = 'SettingScreen'
export { MemorizedSetting as SettingScreen }
