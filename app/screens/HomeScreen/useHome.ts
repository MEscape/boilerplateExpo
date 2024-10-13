import { useAppContext } from 'app/context'

import { homeStyles } from './Home.style'

const useHome = () => {
  const { colors } = useAppContext()

  return {
    styles: homeStyles(colors),
  }
}

export default useHome
