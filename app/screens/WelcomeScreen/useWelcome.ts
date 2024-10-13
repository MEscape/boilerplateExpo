import { useAppContext } from 'app/context'

import { welcomeStyles } from './Welcome.style'

const useWelcome = () => {
  const {
    authenticationStore: { logout },
    colors,
  } = useAppContext()

  return {
    logout,
    styles: welcomeStyles(colors),
  }
}

export default useWelcome
