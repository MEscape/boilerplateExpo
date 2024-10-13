import React, { ComponentType, FC, useMemo } from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  SwitchProps,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { ImageStyle } from 'expo-image'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

import { Icon, IconProps, IconTypes, LibraryTypes } from 'app/components'
import { useColor } from 'app/context'
import { isRTL } from 'app/i18n'
import { sizing } from 'app/theme'
import { isWeb } from 'app/utils'

import { Text, TextProps } from './Text'

type Variants = 'checkbox' | 'switch' | 'radio'

interface BaseToggleProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * The variant of the toggle.
   * Options: "checkbox", "switch", "radio"
   * Default: "checkbox"
   */
  variant?: unknown
  /**
   * A style modifier for different input states.
   */
  status?: 'error' | 'disabled'
  /**
   * If false, input is not editable. The default value is true.
   */
  editable?: TextInputProps['editable']
  /**
   * The value of the field. If true the component will be turned on.
   */
  value?: boolean
  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: SwitchProps['onValueChange']
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * Optional input wrapper style override.
   * This gives the inputs their size, shape, "off" background-color, and outer border.
   */
  inputOuterStyle?: ViewStyle
  /**
   * Optional input style override.
   * This gives the inputs their inner characteristics and "on" background-color.
   */
  inputInnerStyle?: ViewStyle
  /**
   * The position of the label relative to the action component.
   * Default: right
   */
  labelPosition?: 'left' | 'right'
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
   * Style overrides for label text.
   */
  labelStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps['text']
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps['tx']
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps['txOptions']
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
}

interface CheckboxToggleProps<T extends LibraryTypes> extends BaseToggleProps {
  variant?: 'checkbox'
  /**
   * Optional style prop that affects the Image component.
   */
  inputDetailStyle?: ImageStyle
  /**
   * Checkbox-only prop that changes the icon used for the "on" state.
   */
  checkboxIcon?: IconProps<T>['icon']
  /**
   * Checkbox-only prop that changes the library for the icon
   */
  checkboxIconLibrary?: T
  checkboxIconSize?: number
}

interface RadioToggleProps extends BaseToggleProps {
  variant?: 'radio'
  /**
   * Optional style prop that affects the dot View.
   */
  inputDetailStyle?: ViewStyle
}

interface SwitchToggleProps<T extends LibraryTypes> extends BaseToggleProps {
  variant?: 'switch'
  /**
   * Switch-only prop that adds a text/icon label for on/off states.
   */
  switchAccessibilityMode?: 'text' | 'icon'
  /**
   * Optional style prop that affects the knob View.
   * Note: `width` and `height` rules should be points (numbers), not percentages.
   */
  inputDetailStyle?: Omit<ViewStyle, 'width' | 'height'> & { width?: number; height?: number }
  /**
   * Optional icon type to display when the switch is in the "on" position.
   */
  switchIconView?: IconTypes
  /**
   * Optional icon type to display when the switch is in the "off" position.
   */
  switchIconHidden?: IconProps<T>['icon']
  /**
   * The library to use for the switch icons.
   * Currently set to `undefined`, indicating that no specific library is required.
   */
  switchIconLibrary?: T
  switchIconSize?: number
}

export type ToggleProps<T extends LibraryTypes> =
  | CheckboxToggleProps<T>
  | RadioToggleProps
  | SwitchToggleProps<T>

interface ToggleInputProps<T extends LibraryTypes> {
  on: boolean
  status: BaseToggleProps['status']
  disabled: boolean
  outerStyle: ViewStyle
  innerStyle: ViewStyle
  detailStyle: Omit<ViewStyle & ImageStyle, 'overflow'>
  switchAccessibilityMode?: SwitchToggleProps<T>['switchAccessibilityMode']
  checkboxIcon?: CheckboxToggleProps<T>['checkboxIcon']
  checkboxIconLibrary?: CheckboxToggleProps<T>['checkboxIconLibrary']
  switchIconView?: SwitchToggleProps<T>['switchIconView']
  switchIconHidden?: SwitchToggleProps<T>['switchIconHidden']
  switchIconLibrary?: SwitchToggleProps<T>['switchIconLibrary']
  switchIconSize?: SwitchToggleProps<T>['switchIconSize']
  checkboxIconSize?: CheckboxToggleProps<T>['checkboxIconSize']
}

/**
 * Renders a boolean input.
 * This is a controlled component that requires an onValueChange callback that updates the value prop in order for the component to reflect user actions. If the value prop is not updated, the component will continue to render the supplied value prop instead of the expected result of any user actions.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Toggle/}
 * @param {ToggleProps} props - The props for the `Toggle` component.
 * @returns {React.ReactNode} The rendered `Toggle` component.
 */
export function Toggle(props: ToggleProps<LibraryTypes>): React.ReactNode {
  const {
    containerStyle: containerStyleOverride,
    editable = true,
    helper,
    HelperTextProps,
    helperTx,
    helperTxOptions,
    inputWrapperStyle: inputWrapperStyleOverride,
    labelPosition = 'right',
    onPress,
    onValueChange,
    status,

    value,
    variant = 'checkbox',
    ...WrapperProps
  } = props

  const { colors } = useColor()

  const {
    switchAccessibilityMode,
    switchIconHidden,
    switchIconLibrary,
    switchIconSize,
    switchIconView,
  } = props as SwitchToggleProps<LibraryTypes>
  const { checkboxIcon, checkboxIconLibrary, checkboxIconSize } =
    props as CheckboxToggleProps<LibraryTypes>

  const disabled = !editable || status === 'disabled' || props.disabled

  const Wrapper = useMemo(
    () => (disabled ? View : TouchableOpacity) as ComponentType<TouchableOpacityProps | ViewProps>,
    [disabled],
  )
  const ToggleInput = useMemo(() => ToggleInputs[variant] || (() => null), [variant])

  const containerStyles = [containerStyleOverride]
  const inputWrapperStyles = [inputWrapper, inputWrapperStyleOverride]
  const helperStyles = [
    helperStyle,
    status === 'error' && { color: colors.error },
    HelperTextProps?.style,
  ]

  /**
   * @param {GestureResponderEvent} e - The event object.
   */
  function handlePress(e: GestureResponderEvent) {
    if (disabled) return
    onValueChange?.(!value)
    onPress?.(e)
  }

  return (
    <Wrapper
      activeOpacity={1}
      accessibilityRole={variant}
      accessibilityState={{ checked: value, disabled }}
      {...WrapperProps}
      style={containerStyles}
      onPress={handlePress}>
      <View style={inputWrapperStyles}>
        {labelPosition === 'left' && <FieldLabel {...props} labelPosition={labelPosition} />}

        <ToggleInput
          on={!!value}
          disabled={!!disabled}
          status={status}
          outerStyle={props.inputOuterStyle ?? {}}
          innerStyle={props.inputInnerStyle ?? {}}
          detailStyle={props.inputDetailStyle ?? {}}
          switchAccessibilityMode={switchAccessibilityMode}
          checkboxIcon={checkboxIcon}
          checkboxIconLibrary={checkboxIconLibrary}
          switchIconView={switchIconView}
          switchIconHidden={switchIconHidden}
          switchIconLibrary={switchIconLibrary}
          switchIconSize={switchIconSize}
          checkboxIconSize={checkboxIconSize}
        />

        {labelPosition === 'right' && <FieldLabel {...props} labelPosition={labelPosition} />}
      </View>

      {!!(helper || helperTx) && (
        <Text
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={helperStyles}
        />
      )}
    </Wrapper>
  )
}

const ToggleInputs: Record<Variants, FC<ToggleInputProps<LibraryTypes>>> = {
  checkbox: Checkbox,
  radio: Radio,
  switch: Switch,
}

/**
 * @param {ToggleInputProps} props - The props for the `Checkbox` component.
 * @returns {React.ReactNode} The rendered `Checkbox` component.
 */
function Checkbox(props: ToggleInputProps<LibraryTypes>): React.ReactNode {
  const {
    checkboxIcon,
    checkboxIconLibrary,
    checkboxIconSize,
    detailStyle: detailStyleOverride,
    disabled,
    innerStyle: innerStyleOverride,
    on,
    outerStyle: outerStyleOverride,
    status,
  } = props

  const { colors } = useColor()

  const offBackgroundColor = [
    disabled && colors.backgroundSecondary,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.backgroundSecondary,
    status === 'error' && colors.error,
    !on && colors.accent,
    colors.border,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const iconTintColor = [
    disabled && colors.background,
    status === 'error' && colors.error,
    colors.text,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        inputOuterVariants.checkbox,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        outerStyleOverride,
      ]}>
      <Animated.View
        style={[
          checkboxInner,
          { backgroundColor: onBackgroundColor },
          innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}>
        <Icon
          color={iconTintColor}
          size={checkboxIconSize}
          icon={checkboxIcon || 'CHECK'}
          library={checkboxIconLibrary}
          style={detailStyleOverride}
        />
      </Animated.View>
    </View>
  )
}

/**
 * @param {ToggleInputProps} props - The props for the `Radio` component.
 * @returns {React.ReactNode} The rendered `Radio` component.
 */
function Radio(props: ToggleInputProps<LibraryTypes>): React.ReactNode {
  const {
    detailStyle: detailStyleOverride,
    disabled,
    innerStyle: innerStyleOverride,
    on,
    outerStyle: outerStyleOverride,
    status,
  } = props

  const { colors } = useColor()

  const dotBackgroundColor = [
    disabled && colors.background,
    status === 'error' && colors.error,
    colors.accent,
  ].filter(Boolean)[0]

  const offBackgroundColor = [
    disabled && colors.backgroundSecondary,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.backgroundSecondary,
    status === 'error' && colors.error,
    !on && colors.accent,
    colors.border,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        inputOuterVariants.radio,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        outerStyleOverride,
      ]}>
      <Animated.View
        style={[
          radioInner,
          { backgroundColor: onBackgroundColor },
          innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}>
        <View style={[radioDetail, { backgroundColor: dotBackgroundColor }, detailStyleOverride]} />
      </Animated.View>
    </View>
  )
}

/**
 * @param {ToggleInputProps} props - The props for the `Switch` component.
 * @returns {React.ReactNode} The rendered `Switch` component.
 */
function Switch(props: ToggleInputProps<LibraryTypes>): React.ReactNode {
  const {
    detailStyle: detailStyleOverride,
    disabled,
    innerStyle: innerStyleOverride,
    on,
    outerStyle: outerStyleOverride,
    status,
  } = props

  const knobSizeFallback = 2

  const knobWidth = [detailStyleOverride?.width, switchDetail?.width, knobSizeFallback].find(
    v => typeof v === 'number',
  )

  const knobHeight = [detailStyleOverride?.height, switchDetail?.height, knobSizeFallback].find(
    v => typeof v === 'number',
  )

  const { colors } = useColor()

  const offBackgroundColor = [
    disabled && colors.backgroundSecondary,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === 'error' && colors.errorBackground,
    colors.backgroundSecondary,
  ].filter(Boolean)[0]

  const knobBackgroundColor = (function () {
    if (on) {
      return [
        detailStyleOverride?.backgroundColor,
        status === 'error' && colors.error,
        disabled && colors.background,
        colors.accent,
      ].filter(Boolean)[0]
    } else {
      return [
        innerStyleOverride?.backgroundColor,
        disabled && colors.background,
        status === 'error' && colors.error,
        colors.accent,
      ].filter(Boolean)[0]
    }
  })()

  const animatedSwitchKnob = useAnimatedStyle(() => {
    const offsetLeft = (innerStyleOverride?.paddingStart ||
      innerStyleOverride?.paddingLeft ||
      switchInner?.paddingStart ||
      switchInner?.paddingLeft ||
      0) as number

    const offsetRight = (innerStyleOverride?.paddingEnd ||
      innerStyleOverride?.paddingRight ||
      switchInner?.paddingEnd ||
      switchInner?.paddingRight ||
      0) as number

    // For RTL support:
    // - web flip input range to [1,0]
    // - outputRange doesn't want rtlAdjustment
    const rtlAdjustment = isRTL ? -1 : 1
    const inputRange = isWeb ? (isRTL ? [1, 0] : [0, 1]) : [0, 1]
    const outputRange = isWeb
      ? [offsetLeft, +(knobWidth || 0) + offsetRight]
      : [rtlAdjustment * offsetLeft, rtlAdjustment * (+(knobWidth || 0) + offsetRight)]

    const translateX = interpolate(on ? 1 : 0, inputRange, outputRange, Extrapolation.CLAMP)

    return { transform: [{ translateX: withTiming(translateX) }] }
  }, [on, knobWidth])

  return (
    <View
      style={[
        inputOuterVariants.switch,
        { backgroundColor: offBackgroundColor },
        outerStyleOverride,
      ]}>
      <Animated.View
        style={[
          switchInner,
          { backgroundColor: onBackgroundColor },
          innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}
      />

      <SwitchAccessibilityLabel {...props} role="on" />
      <SwitchAccessibilityLabel {...props} role="off" />

      <Animated.View
        style={[
          switchDetail,
          detailStyleOverride,
          animatedSwitchKnob,
          { height: knobHeight, width: knobWidth },
          { backgroundColor: knobBackgroundColor },
        ]}
      />
    </View>
  )
}

/**
 * @param {ToggleInputProps & { role: "on" | "off" }} props - The props for the `SwitchAccessibilityLabel` component.
 * @returns {React.ReactNode} The rendered `SwitchAccessibilityLabel` component.
 */
function SwitchAccessibilityLabel(
  props: ToggleInputProps<LibraryTypes> & { role: 'on' | 'off' },
): React.ReactNode {
  const {
    detailStyle,
    disabled,
    innerStyle,
    on,
    role,
    status,
    switchAccessibilityMode,
    switchIconHidden,
    switchIconLibrary,
    switchIconSize,
    switchIconView,
  } = props

  const { colors } = useColor()

  if (!switchAccessibilityMode) return null

  const shouldLabelBeVisible = (on && role === 'on') || (!on && role === 'off')

  const switchAccessibilityStyles: StyleProp<ViewStyle> = [
    switchAccessibilityStyle,
    role === 'off' && { end: '5%' },
    role === 'on' && { left: '5%' },
  ]

  const color = [
    disabled && colors.background,
    status === 'error' && colors.error,
    !on && (innerStyle?.backgroundColor || colors.background),
    detailStyle?.backgroundColor || colors.accent,
  ].filter(Boolean)[0] as string

  return (
    <View style={switchAccessibilityStyles}>
      {switchAccessibilityMode === 'text' && shouldLabelBeVisible && (
        <View
          style={[
            role === 'on' && switchAccessibilityLine,
            role === 'on' && { backgroundColor: color },
            role === 'off' && switchAccessibilityCircle,
            role === 'off' && { borderColor: color },
          ]}
        />
      )}

      {switchAccessibilityMode === 'icon' && shouldLabelBeVisible && (
        <Icon
          icon={role === 'off' ? switchIconHidden || 'HIDDEN' : switchIconView || 'VIEW'}
          color={color}
          size={switchIconSize}
          style={switchAccessibilityIcon}
          library={switchIconLibrary}
        />
      )}
    </View>
  )
}

/**
 * @param {BaseToggleProps} props - The props for the `FieldLabel` component.
 * @returns {React.ReactNode} The rendered `FieldLabel` component.
 */
function FieldLabel(props: BaseToggleProps): React.ReactNode {
  const {
    label,
    labelPosition,
    labelStyle: labelStyleOverride,
    LabelTextProps,
    labelTx,
    labelTxOptions,
    status,
  } = props

  const { colors } = useColor()

  if (!label && !labelTx && !LabelTextProps?.children) return null

  const labelStyles = [
    labelStyle,
    status === 'error' && { color: colors.error },
    labelPosition === 'right' && labelRight,
    labelPosition === 'left' && labelLeft,
    labelStyleOverride,
    LabelTextProps?.style,
  ]

  return (
    <Text
      text={label}
      tx={labelTx}
      txOptions={labelTxOptions}
      {...LabelTextProps}
      style={labelStyles}
    />
  )
}

const inputWrapper: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
}

const inputOuterBase: ViewStyle = {
  alignItems: 'center',
  borderWidth: 2,
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  height: 24,
  justifyContent: 'space-between',
  overflow: 'hidden',
  width: 24,
}

const inputOuterVariants: Record<Variants, StyleProp<ViewStyle>> = {
  checkbox: [inputOuterBase, { borderRadius: 4 }],
  radio: [inputOuterBase, { borderRadius: 12 }],
  switch: [inputOuterBase, { borderRadius: 16, borderWidth: 0, height: 32, width: 56 }],
}

const checkboxInner: ViewStyle = {
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
  width: '100%',
}

const radioInner: ViewStyle = {
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
  width: '100%',
}

const radioDetail: ViewStyle = {
  borderRadius: 6,
  height: 12,
  width: 12,
}

const switchInner: ViewStyle = {
  alignItems: 'center',
  borderColor: 'transparent',
  height: '100%',
  overflow: 'hidden',
  paddingEnd: 4,
  paddingStart: 4,
  position: 'absolute',
  width: '100%',
}

const switchDetail: SwitchToggleProps<LibraryTypes>['inputDetailStyle'] = {
  borderRadius: 12,
  height: 24,
  position: 'absolute',
  width: 24,
}

const helperStyle: TextStyle = {
  marginTop: sizing.spacing.xs,
}

const labelStyle: TextStyle = {
  flex: 1,
}

const labelRight: TextStyle = {
  marginStart: sizing.spacing.md,
}

const labelLeft: TextStyle = {
  marginEnd: sizing.spacing.md,
}

const switchAccessibilityStyle: TextStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  width: '40%',
}

const switchAccessibilityIcon: ImageStyle = {
  height: 14,
  width: 14,
}

const switchAccessibilityLine: ViewStyle = {
  height: 12,
  width: 2,
}

const switchAccessibilityCircle: ViewStyle = {
  borderRadius: 6,
  borderWidth: 2,
  height: 12,
  width: 12,
}
