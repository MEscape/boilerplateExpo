import React from 'react'

import { observer } from 'mobx-react-lite'

import { Screen, Text } from 'app/components'
import type { MainTabScreenProps, ScreenTypes } from 'app/navigators'
import { useRenderCount } from 'app/utils'

import useLibrary from './useLibrary'

const Library: React.FC<MainTabScreenProps<ScreenTypes.LIBRARY>> = observer(function Library(
  _props,
) {
  const { styles } = useLibrary()
  useRenderCount('LibraryScreen')

  return (
    <Screen style={styles.container} preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Text>LibraryScreen</Text>
    </Screen>
  )
})

const MemorizedLibrary = React.memo(Library)
MemorizedLibrary.displayName = 'LibraryScreen'
export { MemorizedLibrary as LibraryScreen }
