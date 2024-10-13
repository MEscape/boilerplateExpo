import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { ContentLanguage, i18n } from 'app/i18n'
import { StorageKeys } from 'app/utils'
import * as storage from 'app/utils/storage'

export type LocalizationAppContextType = {
  /**
   * This variable is of type ContentLanguage and is used to store the language of content.
   * language = "English";
   */
  language: ContentLanguage
  /**
   * For setLanguage change content lang
   * @example i18n.locale = ContentLanguage.France
   * @return void change app content language.
   */
  setLanguageInApp: (lang: ContentLanguage) => void
}

export const LocalizationAppContext = createContext<LocalizationAppContextType | undefined>(
  undefined,
)

export const useLanguage = () => {
  const context = useContext(LocalizationAppContext)
  if (!context) throw Error('useLanguage must be used inside LocalizationAppContext')
  return context
}

export const LocalizationProvider = ({ children }: React.PropsWithChildren) => {
  const [language, setLanguage] = useState<ContentLanguage>(ContentLanguage.English)

  /**
   * For setLanguage change content lang
   * i18n.locale = ContentLanguage.France
   * @return void change app content language.
   */
  const setLanguageInApp = useCallback(async (lang: ContentLanguage) => {
    await storage.save(StorageKeys.APP_LANGUAGE, lang)
    i18n.locale = lang
    setLanguage(lang)
  }, [])

  const value: LocalizationAppContextType = useMemo(() => {
    return {
      language,
      setLanguageInApp,
    }
  }, [language, setLanguageInApp])

  useEffect(() => {
    ;(async () => {
      const appLanguage = (await storage.load(StorageKeys.APP_LANGUAGE)) as ContentLanguage
      if (appLanguage) {
        await setLanguageInApp(appLanguage)
      }
    })()
  }, [setLanguageInApp])

  return <LocalizationAppContext.Provider value={value}>{children}</LocalizationAppContext.Provider>
}
