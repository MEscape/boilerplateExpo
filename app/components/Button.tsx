import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { Icon, IconProps, LibraryTypes } from 'app/components'
import { useColor } from 'app/context'
import { translate } from 'app/i18n'
import { Palette, sizing } from 'app/theme'
import { moderateScale } from 'app/utils'

import { Text, TextProps } from './Text'

const AnimatedButtonComponent = Animated.createAnimatedComponent(TouchableOpacity)

interface ExtraButtonProps<L extends LibraryTypes, R extends LibraryTypes> {
  buttonContainerStyle?: StyleProp<ViewStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  titleChildren?: React.ReactNode
  tx?: TextProps['tx']
  title?: TextProps['text']
  txOptions?: TextProps['txOptions']
  preset?: ButtonPresets
  titleTextProps?: TextProps
  leftIcon?: IconProps<L>['icon']
  leftIconColor?: string
  leftIconLibrary?: L
  rightIcon?: IconProps<R>['icon']
  rightIconColor?: string
  rightIconLibrary?: R
  rightNoColorChange?: boolean
  leftNoColorChange?: boolean
  rightIconSize?: number
  leftIconSize?: number
  disabled?: boolean
  disabledStyle?: StyleProp<ViewStyle>
  disabledTextStyle?: StyleProp<TextStyle>
}

interface ButtonIconProps<T extends LibraryTypes> {
  icon?: IconProps<T>['icon']
  iconColor?: string
  size?: number
  iconLibrary?: T
  noColorChange?: boolean
}

export type AnimatedButtonProps = Omit<
  TouchableOpacityProps,
  'onPressIn' | 'onPressOut' | 'style'
> & {
  containerStyle?: StyleProp<ViewStyle>
}

export type ButtonProps<L extends LibraryTypes, R extends LibraryTypes> = AnimatedButtonProps &
  ExtraButtonProps<L, R>

const BASE_BUTTON: ViewStyle = {
  alignItems: 'center',
  borderRadius: moderateScale(60),
  height: '100%',
  width: '100%',
}

export const buttonPresets = ({ accent, backgroundSecondary }: Palette) => ({
  primary: {
    ...BASE_BUTTON,
    backgroundColor: accent,
  } as ViewStyle,
  secondary: {
    ...BASE_BUTTON,
    backgroundColor: 'transparent',
    borderColor: accent,
    borderWidth: 1,
  } as ViewStyle,
  tertiary: {
    ...BASE_BUTTON,
    backgroundColor: backgroundSecondary,
  } as ViewStyle,
})

export type ButtonPresets = keyof ReturnType<typeof buttonPresets>

export const AnimatedTouchableOpacityComponent = (props: AnimatedButtonProps) => {
  const { containerStyle } = props
  const scaleValue = useSharedValue(1)

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    }
  })

  return (
    <AnimatedButtonComponent
      style={[containerStyle, animatedButtonStyle]}
      onPressIn={() => (scaleValue.value = withSpring(0.9))}
      onPressOut={() => (scaleValue.value = withSpring(1))}
      activeOpacity={0.8}
      {...props}>
      {props.children}
    </AnimatedButtonComponent>
  )
}

const MemorizedAnimatedTouchableOpacity = React.memo(AnimatedTouchableOpacityComponent)
MemorizedAnimatedTouchableOpacity.displayName = 'AnimatedTouchableOpacity'
export { MemorizedAnimatedTouchableOpacity as AnimatedTouchableOpacity }

export const ButtonComponent = (props: ButtonProps<LibraryTypes, LibraryTypes>) => {
  const {
    buttonContainerStyle,
    disabled,
    disabledStyle,
    disabledTextStyle,
    leftIcon,
    leftIconColor,
    leftIconLibrary,
    leftIconSize,
    leftNoColorChange,
    preset = 'primary',
    rightIcon,
    rightIconColor,
    rightIconLibrary,
    rightIconSize,
    rightNoColorChange,
    title,
    titleChildren,
    titleContainerStyle,
    titleStyle,
    titleTextProps,
    tx,
    txOptions,
  } = props

  const i18nTitle = tx && translate(tx, txOptions)
  const titleContent = i18nTitle || title || titleChildren

  const { colors } = useColor()

  const styles = buttonStyles(colors)

  const containerStyles = [
    buttonPresets(colors)[preset],
    disabled && (disabledStyle || styles.disabledStyle),
    buttonContainerStyle,
  ]

  const titleStyles = [disabled && (disabledTextStyle || styles.disabledTitleStyle), titleStyle]

  return (
    <MemorizedAnimatedTouchableOpacity containerStyle={containerStyles} {...props}>
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <ButtonIcon
          icon={leftIcon}
          iconLibrary={leftIconLibrary}
          iconColor={leftIconColor}
          size={leftIconSize}
          noColorChange={leftNoColorChange}
        />
        <Text preset="h4" color={colors.text} style={titleStyles} {...titleTextProps}>
          {titleContent}
        </Text>
        <ButtonIcon
          icon={rightIcon}
          iconLibrary={rightIconLibrary}
          iconColor={rightIconColor}
          size={rightIconSize}
          noColorChange={rightNoColorChange}
        />
      </View>
    </MemorizedAnimatedTouchableOpacity>
  )
}

function ButtonIcon(props: ButtonIconProps<LibraryTypes>): React.ReactNode {
  const { icon, iconColor, iconLibrary, noColorChange, size } = props

  if (icon) {
    return (
      <Icon
        style={{ paddingHorizontal: sizing.spacing.md }}
        icon={icon}
        library={iconLibrary}
        color={iconColor}
        size={size || 24}
        noColorChange={noColorChange}
      />
    )
  }

  return null
}

const MemorizedButton = React.memo(ButtonComponent)
MemorizedButton.displayName = 'Button'
export { MemorizedButton as Button }

/* eslint-disable react-native/no-unused-styles */
const buttonStyles = ({ backgroundSecondary, textDim }: Palette) =>
  StyleSheet.create({
    disabledStyle: {
      backgroundColor: backgroundSecondary,
      pointerEvents: 'none',
      transform: 'none',
      userSelect: 'none',
    },
    disabledTitleStyle: {
      color: textDim,
    },
    titleContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  })
