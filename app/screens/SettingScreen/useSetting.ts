import { useAppContext } from 'app/context'

import { settingStyles } from './Setting.style'

const useSetting = () => {
  const { colors } = useAppContext()

  return {
    styles: settingStyles(colors),
  }
}

export default useSetting
