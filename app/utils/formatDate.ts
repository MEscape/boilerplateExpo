// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
import type { Locale } from 'date-fns'
import format from 'date-fns/format'
import ar from 'date-fns/locale/ar-SA'
import en from 'date-fns/locale/en-US'
import ko from 'date-fns/locale/ko'
import parseISO from 'date-fns/parseISO'

import { i18n } from 'app/i18n'

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = i18n.locale.split('-')[0]
  return locale === 'ar' ? ar : locale === 'ko' ? ko : en
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? 'MMM dd, yyyy', dateOptions)
}
