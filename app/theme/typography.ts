import { Platform } from 'react-native'

import {
  Roboto_900Black as robotoBold,
  Roboto_300Light as robotoLight,
  Roboto_500Medium as robotoMedium,
  Roboto_400Regular as robotoRegular,
  Roboto_700Bold as robotoSemiBold,
} from '@expo-google-fonts/roboto'

export const customFontsToLoad = {
  robotoBold,
  robotoLight,
  robotoMedium,
  robotoRegular,
  robotoSemiBold,
}

const fonts = {
  courier: {
    // iOS only font.
    normal: 'Courier',
  },
  helveticaNeue: {
    light: 'HelveticaNeue-Light',

    medium: 'HelveticaNeue-Medium',

    normal: 'Helvetica Neue',
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
  },
  monospace: {
    // Android only font.
    normal: 'monospace',
  },
  roboto: {
    bold: 'robotoBold',
    // Cross-platform Google font.
    light: 'robotoLight',
    medium: 'robotoMedium',
    regular: 'robotoRegular',
    semiBold: 'robotoSemiBold',
  },
  sansSerif: {
    light: 'sans-serif-light',

    medium: 'sans-serif-medium',

    normal: 'sans-serif',
    // Android only font.
    thin: 'sans-serif-thin',
  },
}

const fontSize = {
  base: 9,
  lg: 13,
  md: 12,
  sm: 6,
  xl: 15,
  xl2: 18,
  xl3: 21,
  xl4: 24,
} as const

const fontSpacing = {
  x: {
    lg: 2,
    md: -0.5,
    sm: -1,
  },
  y: {
    sm: 35,
  },
} as const

const font = {
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ android: fonts.monospace, ios: fonts.courier }),

  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,

  /**
   * The primary font. Used in most places.
   */
  primary: fonts.roboto,

  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({
    android: fonts.sansSerif,
    ios: fonts.helveticaNeue,
    web: fonts.sansSerif,
  }),
} as const

export const typography = {
  font,
  fontSize,
  fontSpacing,
} as const

export type Font = keyof typeof fonts
export type FontSize = keyof typeof fontSize
export type FontSpacing = keyof typeof fontSpacing
export type Typography = keyof typeof typography
