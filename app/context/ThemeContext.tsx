import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'

import { colors, palette, Palette, Theme } from 'app/theme'
import { StorageKeys } from 'app/utils'
import * as storage from 'app/utils/storage'

export interface AppThemeContextType {
  /**
   * The appTheme variable is used to define the color scheme used for the application. It takes a ColorSchemeName as its value.
   */
  appTheme: Theme
  /**
   * This function is used to set the theme of the application. It takes a single argument, _theme, which should be of type ColorSchemeName.
   * @example setAppTheme('dark');
   * @param theme ColorSchemeName
   * @returns void
   */
  setAppTheme: () => void
  /**
   * Get app palette colors.
   */
  colors: Palette
}

export const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined)

export const useColor = () => {
  const context = useContext(AppThemeContext)
  if (!context) throw Error('useColor must be used inside AppThemeContext')
  return context
}

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const colorScheme = useColorScheme()

  const [appTheme, setTheme] = useState<Theme>(colorScheme)

  /**
   * For setAppTheme change app theming.
   * setTheme(ColorSchemeName)
   * @return void change app Theme.
   */
  const setAppTheme = useCallback(async () => {
    const newTheme = appTheme === 'light' ? 'dark' : 'light'
    await storage.save(StorageKeys.APP_THEME, newTheme)
    setTheme(newTheme)
  }, [appTheme])

  const value: AppThemeContextType = useMemo(() => {
    return {
      appTheme,
      colors: { ...colors[appTheme || 'light'], ...palette },
      setAppTheme,
    }
  }, [appTheme, setAppTheme])

  useEffect(() => {
    ;(async () => {
      const theme = (await storage.load(StorageKeys.APP_THEME)) as Theme

      if (theme) {
        setTheme(theme)
      } else {
        setTheme(colorScheme)
      }
    })()
  }, [colorScheme, setAppTheme])

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
}
