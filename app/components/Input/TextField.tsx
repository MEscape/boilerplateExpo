import React, { useCallback } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Icon, LibraryTypes } from 'app/components'
import { useColor } from 'app/context'
import { isRTL, translate } from 'app/i18n'
import { Palette, sizing } from 'app/theme'
import { isWeb } from 'app/utils'

import { Text } from '../Text'
import { TextFieldIconProps, TextFieldProps } from './TextField.type'

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput)

const TextFieldComponent = <L extends LibraryTypes, R extends LibraryTypes>(
  props: TextFieldProps<L, R>,
  ref?: React.Ref<RNTextInput | null>,
) => {
  const {
    backgroundColor,
    borderColor,
    disabled,
    error,
    errorContainerStyle,
    errorStyle,
    inputContainerStyle,
    inputStyle,
    label,
    labelColor,
    labelTextProps,
    labelTx,
    labelTxOptions,
    leftIcon,
    leftIconColor,
    leftIconContainerStyle,
    leftIconLibrary,
    leftIconSize,
    onBlur,
    onFocus,
    onFocusBackgroundColor,
    onFocusBorderColor,
    onFocusLabelColor,
    onHoverBackgroundColor,
    onMouseEnter,
    onMouseLeave,
    outlineGapColor,
    placeholder,
    placeholderTx,
    placeholderTxOptions,
    rightIcon,
    rightIconColor,
    rightIconContainerStyle,
    rightIconLibrary,
    rightIconSize,
    style,
    variant = 'filled',
    ...rest
  } = props

  const { colors } = useColor()
  const styles = inputStyles(colors)

  const i18nLabel = labelTx && translate(labelTx, labelTxOptions)
  const labelContent = i18nLabel || label

  const i18nPlaceholder = placeholderTx && translate(placeholderTx, placeholderTxOptions)
  const placeholderContent = i18nPlaceholder || placeholder

  const hovered = useSharedValue(false)
  const focused = useSharedValue(false)

  const handleMouseEnter = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onMouseEnter?.(event)
      hovered.value = true
    },
    [hovered, onMouseEnter],
  )

  const handleMouseLeave = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onMouseLeave?.(event)
      hovered.value = false
    },
    [hovered, onMouseLeave],
  )

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(event)
      focused.value = true
    },
    [focused, onFocus],
  )

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(event)
      focused.value = false
    },
    [focused, onBlur],
  )

  const focusAnimation = useSharedValue(0)

  useDerivedValue(() => {
    focusAnimation.value = withTiming(focused.value ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    })
  }, [focused.value, focusAnimation.value])

  const active = useDerivedValue(
    () => focused.value || (rest.value?.length || 0) > 0,
    [focused.value, rest.value],
  )

  const activeAnimation = useSharedValue(0)

  useDerivedValue(() => {
    activeAnimation.value = withTiming(active.value ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    })
  }, [active.value, activeAnimation.value])

  const animatedInputContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        variant === 'filled'
          ? focused.value
            ? onFocusBackgroundColor || colors.background
            : hovered.value
            ? onHoverBackgroundColor || colors.background
            : backgroundColor || colors.backgroundSecondary
          : variant === 'outlined'
          ? backgroundColor || colors.background
          : backgroundColor || colors.background,
      borderBottomEndRadius: variant !== 'standard' ? 4 : 0,
      borderBottomStartRadius: variant !== 'standard' ? 4 : 0,
      borderTopEndRadius: 4,
      borderTopStartRadius: 4,
    }
  }, [focused.value, hovered.value, variant, colors])

  const animatedInput = useAnimatedStyle(() => {
    return {
      fontSize: 16,
      minHeight: variant === 'standard' ? 48 : 56,
      paddingEnd: rightIcon ? 12 : variant === 'standard' ? 0 : 16,
      paddingStart: leftIcon ? 12 : variant === 'standard' ? 0 : 16,
      paddingTop: variant === 'filled' && labelContent ? 18 : 0,
    }
  }, [variant, leftIcon, rightIcon])

  const animatedLeading = useAnimatedStyle(() => {
    return {
      marginStart: variant === 'standard' ? 0 : 12,
      marginVertical: variant === 'standard' ? 12 : 16,
    }
  }, [variant])

  const animatedTrailing = useAnimatedStyle(() => {
    return {
      marginEnd: variant === 'standard' ? 0 : 12,
      marginVertical: variant === 'standard' ? 12 : 16,
    }
  }, [variant])

  const animatedOutline = useAnimatedStyle(() => {
    return {
      borderBottomEndRadius: 4,
      borderBottomStartRadius: 4,
      borderColor: focused.value
        ? onFocusBorderColor || colors.accent
        : hovered.value
        ? onFocusBorderColor || colors.accent
        : borderColor || colors.text,
      borderTopEndRadius: 4,
      borderTopStartRadius: 4,
      borderWidth: focused.value ? 2 : 1,
    }
  }, [focused.value, hovered.value, colors])

  const animatedOutlineLabelGap = useAnimatedStyle(() => {
    return {
      height: focused.value ? 2 : 1,
    }
  }, [focused.value])

  const animatedLabelContainer = useAnimatedStyle(() => {
    return {
      height: variant === 'standard' ? 48 : 56,
      start: variant === 'standard' ? (leftIcon ? 36 : 0) : leftIcon ? 48 : 16,
    }
  }, [variant, leftIcon])

  const animatedLabel = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        focusAnimation.value,
        [0, 1],
        [labelColor || colors.text, onFocusLabelColor || colors.accent],
      ),
      fontSize: interpolate(activeAnimation.value, [0, 1], [16, 12]),
      transform: [
        {
          translateY: interpolate(
            activeAnimation.value,
            [0, 1],
            [0, variant === 'filled' ? -14 : variant === 'outlined' ? -28 : -24],
          ),
        },
      ],
    }
  }, [focusAnimation, activeAnimation, colors])

  const animatedPlaceholder = useAnimatedProps<TextInputProps>(() => {
    return {
      placeholder: labelContent ? (focused.value ? placeholderContent : '') : placeholderContent,
    }
  }, [label, focused, placeholderContent])

  const animatedUnderline = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        focusAnimation.value,
        [0, 1],
        [borderColor || colors.text, onFocusBorderColor || colors.accent],
      ),
      transform: [{ scaleX: focusAnimation.value }],
    }
  }, [focusAnimation.value, colors])

  const animatedOutlineLabel = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        activeAnimation.value,
        [0, 1],
        [backgroundColor || colors.background, outlineGapColor || colors.background],
      ),
      transform: [{ scaleX: activeAnimation.value }],
    }
  }, [activeAnimation.value, colors])

  const animatedInputStyles: StyleProp<ViewStyle> = [
    styles.input,
    animatedInput,
    inputStyle,
    { color: colors.text },
    disabled && { color: colors.textDim },
    isRTL && { textAlign: 'right' as TextStyle['textAlign'] },
    rest.multiline && { height: 'auto' },
    rest.multiline && isWeb && { marginTop: 8 },
  ]

  const animatedInputContainerStyles: StyleProp<ViewStyle> = [
    rest.multiline && { minHeight: 112 },
    styles.inputContainer,
    animatedInputContainerStyle,
    inputContainerStyle,
  ]

  return (
    <View style={style}>
      <Animated.View style={animatedInputContainerStyles}>
        {leftIcon && (
          <Animated.View style={[styles.leading, animatedLeading, leftIconContainerStyle]}>
            <TextFieldIcon
              icon={leftIcon}
              iconLibrary={leftIconLibrary}
              iconColor={leftIconColor}
              size={leftIconSize}
            />
          </Animated.View>
        )}

        <AnimatedTextInput
          ref={ref}
          style={animatedInputStyles}
          animatedProps={animatedPlaceholder}
          placeholderTextColor={labelColor || colors.text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...({
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            ...rest,
          } as any)}
        />

        {rightIcon && (
          <Animated.View style={[styles.trailing, animatedTrailing, rightIconContainerStyle]}>
            <TextFieldIcon
              icon={rightIcon}
              iconLibrary={rightIconLibrary}
              iconColor={rightIconColor}
              size={rightIconSize}
            />
          </Animated.View>
        )}

        {(variant === 'filled' || variant === 'standard') && (
          <>
            <View
              style={[styles.underline, { backgroundColor: borderColor || colors.text }]}
              pointerEvents="none"
            />
            <Animated.View
              style={[styles.underlineFocused, animatedUnderline]}
              pointerEvents="none"
            />
          </>
        )}

        {variant === 'outlined' && (
          <Animated.View
            style={[StyleSheet.absoluteFill, animatedOutline, styles.outline]}
            pointerEvents="none"
          />
        )}

        {labelContent ? (
          <Animated.View
            style={[styles.labelContainer, animatedLabelContainer]}
            pointerEvents="none">
            {variant === 'outlined' && (
              <Animated.View
                style={[styles.outlineLabelGap, animatedOutlineLabel, animatedOutlineLabelGap]}
              />
            )}
            <Animated.Text {...labelTextProps} style={animatedLabel}>
              {labelContent}
            </Animated.Text>
          </Animated.View>
        ) : null}
      </Animated.View>
      <View style={[styles.errorView, errorContainerStyle]}>
        {error ? <Text style={[styles.helperText, errorStyle]}>{error}</Text> : null}
      </View>
    </View>
  )
}

function TextFieldIcon<T extends LibraryTypes>(props: TextFieldIconProps<T>) {
  const { icon, iconColor, iconLibrary, size } = props

  if (icon) {
    return <Icon icon={icon} library={iconLibrary} color={iconColor} size={size} />
  }

  return null
}

const MemorizedTextField = React.memo(React.forwardRef(TextFieldComponent))
MemorizedTextField.displayName = 'TextField'
export { MemorizedTextField as TextField }

/* eslint-disable react-native/no-unused-styles */
const inputStyles = ({ background }: Palette) =>
  StyleSheet.create({
    errorView: {
      marginHorizontal: sizing.spacing.md,
      marginTop: sizing.spacing.xxs,
    },
    helperText: {
      fontSize: 14,
    },
    input: {
      alignSelf: 'flex-start',
      flex: 1,
      paddingHorizontal: 0,
      // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
      paddingVertical: 0,
      ...Platform.select({
        web: {
          outlineStyle: 'none',
        },
      }),
    },
    inputContainer: {
      flexDirection: 'row',
    },
    labelContainer: {
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
    },
    leading: {
      alignItems: 'center',
      height: sizing.spacing.lg,
      justifyContent: 'center',
      width: sizing.spacing.lg,
    },
    outline: {},
    outlineLabelGap: {
      backgroundColor: background,
      end: -sizing.spacing.xxs,
      position: 'absolute',
      start: -sizing.spacing.xxs,
      top: 0,
    },
    trailing: {
      alignItems: 'center',
      height: sizing.spacing.lg,
      justifyContent: 'center',
      width: sizing.spacing.lg,
    },
    underline: {
      bottom: 0,
      end: 0,
      height: 1,
      position: 'absolute',
      start: 0,
    },
    underlineFocused: {
      bottom: 0,
      end: 0,
      height: 2,
      position: 'absolute',
      start: 0,
    },
  })
