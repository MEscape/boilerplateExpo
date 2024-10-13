import React from 'react'

import { observer } from 'mobx-react-lite'

import { Screen, Text } from 'app/components'
import type { AppStackScreenProps, ScreenTypes } from 'app/navigators'
import { useRenderCount } from 'app/utils'

import useLogin from './useLogin'

const Login: React.FC<AppStackScreenProps<ScreenTypes.LOGIN>> = observer(function Login(_props) {
  const { styles } = useLogin()
  useRenderCount('LoginScreen')

  return (
    <Screen style={styles.container} preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Text>LoginScreen</Text>
    </Screen>
  )
})

const MemorizedLogin = React.memo(Login)
MemorizedLogin.displayName = 'LoginScreen'
export { MemorizedLogin as LoginScreen }
