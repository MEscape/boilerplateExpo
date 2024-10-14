import {
  NativeSyntheticEvent,
  StyleProp,
  TargetedEvent,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IconProps, LibraryTypes } from 'app/components'

import { TextProps } from '../Text'

export interface FieldProps<L extends LibraryTypes, R extends LibraryTypes>
  extends TextFieldProps<L, R> {
  name: string
}

export interface TextFieldIconProps<T extends LibraryTypes> {
  icon?: IconProps<T>['icon']
  iconColor?: string
  iconLibrary?: T
  size?: number
  onPress?: () => void
}

export type Variant = 'filled' | 'outlined' | 'standard'

export interface TextFieldProps<L extends LibraryTypes, R extends LibraryTypes>
  extends Omit<TextInputProps, 'ref'> {
  /**
   * The style modifier for disabled input states.
   */
  disabled?: boolean
  secureTextEntry?: boolean
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps['text']
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps['tx']
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps['txOptions']
  /**
   * Pass any additional props directly to the label Text component.
   */
  labelTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps['text']
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps['tx']
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps['txOptions']
  /**
   * The variant of the TextInput style.
   * @default "filled"
   */
  variant?: Variant
  /**
   * The element placed before the text input.
   */
  leftIcon?: IconProps<L>['icon']
  /**
   * IconLibrary for the icon.
   */
  leftIconLibrary?: L
  /**
   * An optional tint color for the left icon
   */
  leftIconColor?: string
  leftIconSize?: number
  /**
   * The element placed after the text input.
   */
  rightIcon?: IconProps<R>['icon']
  /**
   * IconLibrary for the icon.
   */
  rightIconLibrary?: R
  /**
   * An optional tint color for the right icon
   */
  rightIconColor?: string
  rightIconSize?: number
  /**
   * The helper text to display.
   */
  error?: string
  /**
   * Callback function to call when user moves pointer over the input.
   */
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  /**
   * Callback function to call when user moves pointer away from the input.
   */
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  /**
   * The style of the container view.
   */
  style?: StyleProp<ViewStyle>
  /**
   * The style of the text input container view.
   */
  inputContainerStyle?: StyleProp<ViewStyle>
  /**
   * The style of the text input.
   */
  inputStyle?: TextInputProps['style']
  /**
   * The style of the text input's leading element container.
   */
  leftIconContainerStyle?: StyleProp<ViewStyle>
  /**
   * The style of the text input's trailing element container.
   */
  rightIconContainerStyle?: StyleProp<ViewStyle>
  /**
   * Background color of the input container style.
   * @default "white"
   */
  backgroundColor?: string
  /**
   * On focus background color of the input container style.
   * @default "#e9e9e9"
   */
  onFocusBackgroundColor?: string
  /**
   * Border color of the outline input container style.
   * @default "black"
   */
  borderColor?: string
  /**
   * On focus Border color of the outline input container style.
   * @default "#0c5fed"
   */
  onFocusBorderColor?: string
  /**
   * On hover background color of the filled input container style.
   * @default "#e9e9e9"
   */
  onHoverBackgroundColor?: string
  /**
   * Label text color of the input.
   * @default "black"
   */
  labelColor?: string
  /**
   * On focus Label text color change.
   * @default "#0c5fed"
   */
  onFocusLabelColor?: string
  /**
   * On error or any helper text below text Input container style.
   */
  errorContainerStyle?: StyleProp<ViewStyle>
  /**
   * On error or any helper text below text Input Text-Style.
   */
  errorStyle?: StyleProp<TextStyle>
  /**
   * In outlined variant the gap border color.
   * @default white
   */
  outlineGapColor?: string
}
