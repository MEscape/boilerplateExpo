import { useAppContext } from 'app/context'

import { loginStyles } from './Login.style'

const useLogin = () => {
  const { colors } = useAppContext()

  return {
    styles: loginStyles(colors),
  }
}

export default useLogin
