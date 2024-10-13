import React from 'react'
import {
  ColorValue,
  // eslint-disable-next-line no-restricted-imports
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from 'react-native'

import i18n from 'i18n-js'

import { useColor } from 'app/context'
import { isRTL, translate, TxKeyPath } from 'app/i18n'
import { Theme, typography } from 'app/theme'
import { scaledSize } from 'app/utils'

type Sizes = keyof typeof typography.fontSize
type Weights = keyof typeof typography.font.primary

const BASE_TEXT: TextStyle = {
  fontSize: scaledSize(typography.fontSize.sm),
}

export const textPresets = {
  default: BASE_TEXT,
  h1: {
    ...BASE_TEXT,
    fontFamily: typography.font.primary.bold,
    fontSize: scaledSize(typography.fontSize.xl4),
    letterSpacing: typography.fontSpacing.x.sm,
    lineHeight: typography.fontSpacing.y.sm,
  } as TextStyle,
  h2: {
    ...BASE_TEXT,
    fontFamily: typography.font.secondary?.medium || typography.font.primary.semiBold,
    fontSize: scaledSize(typography.fontSize.xl3),
    letterSpacing: typography.fontSpacing.x.md,
  } as TextStyle,
  h3: {
    ...BASE_TEXT,
    fontFamily: typography.font.primary.regular,
    fontSize: scaledSize(typography.fontSize.xl2),
  } as TextStyle,
  h4: {
    ...BASE_TEXT,
    fontFamily: typography.font.primary.regular,
    fontSize: scaledSize(typography.fontSize.xl),
  } as TextStyle,
  h5: {
    ...BASE_TEXT,
    fontFamily: typography.font.primary.medium,
    fontSize: scaledSize(typography.fontSize.md),
  } as TextStyle,
  h6: {
    ...BASE_TEXT,
    fontFamily: typography.font.secondary?.normal,
    fontSize: scaledSize(typography.fontSize.base),
  } as TextStyle,
  small: {
    ...BASE_TEXT,
    fontFamily: typography.font.primary.medium,
    fontSize: scaledSize(typography.fontSize.sm),
  } as TextStyle,
  title: {
    ...BASE_TEXT,
    fontFamily: typography.font.secondary?.medium || typography.font.primary.semiBold,
    fontSize: scaledSize(typography.fontSize.lg),
    letterSpacing: typography.fontSpacing.x.sm,
  } as TextStyle,
}

export type TextPresets = keyof typeof textPresets

export interface TextProps extends RNTextProps {
  tx?: TxKeyPath
  text?: string
  txOptions?: i18n.TranslateOptions
  style?: StyleProp<TextStyle>
  preset?: TextPresets
  color?: ColorValue | Theme
  weight?: Weights
  size?: Sizes
  children?: React.ReactNode
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  upperCase?: boolean
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 * @param {TextProps} props - The props for the `Text` component.
 * @returns {React.ReactNode} The rendered `Text` component.
 */
export function Text(props: TextProps): React.ReactNode {
  const {
    children,
    color,
    preset = 'default',
    size,
    style: styleOverride,
    text,
    textAlign,
    tx,
    txOptions,
    upperCase,
    weight,
    ...rest
  } = props

  const { colors } = useColor()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const styles: StyleProp<TextStyle> = [
    textPresets[preset],
    rtlStyle,
    weight && fontWeightStyles[weight],
    size && { fontSize: typography.fontSize[size] },
    upperCase && { textTransform: 'uppercase' },
    textAlign && { textAlign },
    // eslint-disable-next-line react-native/no-inline-styles
    { color: color || colors.text },
    styleOverride,
  ]

  return (
    <RNText {...rest} style={styles}>
      {content}
    </RNText>
  )
}

const fontWeightStyles = Object.entries(typography.font.primary).reduce(
  (acc, [weight, fontFamily]) => {
    return { ...acc, [weight]: { fontFamily } }
  },
  {},
) as Record<Weights, TextStyle>

const rtlStyle: TextStyle = isRTL ? { writingDirection: 'rtl' } : {}
