import { useAppContext } from 'app/context'

import { libraryStyles } from './Library.style'

const useLibrary = () => {
  const { colors } = useAppContext()

  return {
    styles: libraryStyles(colors),
  }
}

export default useLibrary
