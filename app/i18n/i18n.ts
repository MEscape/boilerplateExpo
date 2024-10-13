import { I18nManager } from 'react-native'

import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'

import de from './locale/de'
import en, { Translations } from './locale/en'

// Migration guide from i18n 3.x -> 4.x:
// https://github.com/fnando/i18n-js/blob/main/MIGRATING_FROM_V3_TO_V4.md
// https://github.com/fnando/i18n/discussions/24

// to use regional locales use { "en-US": enUS } etc
const fallbackLocale = 'en-US'
const translations = { de, en, 'en-US': en }

export const i18n = new I18n(translations, {
  defaultLocale: fallbackLocale,
  enableFallback: true,
  locale: fallbackLocale,
})

const systemLocale = Localization.getLocales()[0]
const systemLocaleTag = systemLocale?.languageTag ?? fallbackLocale

if (Object.prototype.hasOwnProperty.call(i18n.translations, systemLocaleTag)) {
  // if specific locales like en-FI or en-US is available, set it
  i18n.locale = systemLocaleTag
} else {
  // otherwise try to fallback to the general locale (dropping the -XX suffix)
  const generalLocale = systemLocaleTag.split('-')[0]
  if (Object.prototype.hasOwnProperty.call(i18n.translations, generalLocale)) {
    i18n.locale = generalLocale
  } else {
    i18n.locale = fallbackLocale
  }
}

// handle RTL languages
export const isRTL = systemLocale?.textDirection === 'rtl'
I18nManager.allowRTL(isRTL)
I18nManager.forceRTL(isRTL)

export enum ContentLanguage {
  English = 'en',
  German = 'de',
}

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text
