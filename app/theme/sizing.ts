/* eslint-disable sort-keys-fix/sort-keys-fix */

/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

const iconSize = {
  big: 70,
  normal: 22,
  small: 8,
} as const

const radius = {
  base: 2,
  lg: 8,
  md: 4,
} as const

export const sizing = {
  spacing,
  radius,
  iconSize,
}

export type Radius = keyof typeof radius
export type Spacing = keyof typeof spacing
export type IconSize = keyof typeof iconSize
export type Sizing = keyof typeof sizing
