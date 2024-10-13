import { ColorSchemeName } from 'react-native'

export const palette = {
  accent100: '#f3aeee',
  accent200: '#E879E1',
  accent300: '#f446e7',

  neutral100: '#FFFFFF',
  neutral200: '#cbcfcf',
  neutral300: '#191818',
  neutral400: '#0c0c0c',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',

  transparent: 'rgba(0, 0, 0, 0)',
}

export const colors = {
  dark: {
    accent: palette.accent200,
    accentSecondary: palette.accent100,

    background: palette.neutral400,
    backgroundSecondary: palette.neutral300,
    border: palette.neutral300,

    error: palette.accent300,
    errorBackground: palette.neutral400,

    separator: palette.neutral300,

    text: palette.neutral100,
    textDim: palette.neutral200,

    transparent: palette.transparent,
  },
  light: {
    accent: palette.accent200,
    accentSecondary: palette.accent100,

    background: palette.neutral100,
    backgroundSecondary: palette.neutral200,
    border: palette.neutral200,

    error: palette.accent300,
    errorBackground: palette.neutral100,

    separator: palette.neutral300,

    text: palette.neutral400,
    textDim: palette.neutral300,

    transparent: palette.transparent,
  },
}

export type Palette = (typeof colors)[keyof typeof colors] & typeof palette

export type Theme = ColorSchemeName | keyof typeof colors
