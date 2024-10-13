import React, { ReactElement } from 'react'
import {
  ColorValue,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'

import { useColor } from 'app/context'
import { sizing } from 'app/theme'

import { Icon, IconProps, LibraryTypes } from './Icon'
import { Text, TextProps } from './Text'

export interface ListItemProps<L extends LibraryTypes, R extends LibraryTypes>
  extends TouchableOpacityProps {
  /**
   * How tall the list item should be.
   * Default: 56
   */
  height?: number
  /**
   * Whether to show the top separator.
   * Default: false
   */
  topSeparator?: boolean
  /**
   * Whether to show the bottom separator.
   * Default: false
   */
  bottomSeparator?: boolean
  /**
   * Text to display if not using `tx` or nested components.
   */
  text?: TextProps['text']
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps['tx']
  /**
   * Children components.
   */
  children?: TextProps['children']
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps['txOptions']
  /**
   * Optional text style override.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the Text component.
   */
  TextProps?: TextProps
  /**
   * Optional View container style override.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Optional TouchableOpacity style override.
   */
  style?: StyleProp<ViewStyle>
  /**
   * Icon that should appear on the left.
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
  /**
   * Icon that should appear on the right.
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
  /**
   * Optional separator color.
   */
  separatorColor?: ColorValue
  /**
   * Right action custom ReactElement.
   * Overrides `rightIcon`.
   */
  RightComponent?: ReactElement
  /**
   * Left action custom ReactElement.
   * Overrides `leftIcon`.
   */
  LeftComponent?: ReactElement
}

interface ListItemActionProps<T extends LibraryTypes> {
  icon?: IconProps<T>['icon']
  iconLibrary?: T
  iconColor?: string
  Component?: ReactElement
  size: number
  side: 'left' | 'right'
}

/**
 * A styled row component that can be used in FlatList, SectionList, or by itself.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/ListItem/}
 * @param {ListItemProps} props - The props for the `ListItem` component.
 * @returns {React.ReactNode} The rendered `ListItem` component.
 */
export function ListItem(props: ListItemProps<LibraryTypes, LibraryTypes>): React.ReactNode {
  const {
    bottomSeparator,
    children,
    containerStyle: containerStyleOverride,
    height = 56,
    LeftComponent,
    leftIcon,
    leftIconColor,
    leftIconLibrary,
    RightComponent,
    rightIcon,
    rightIconColor,
    rightIconLibrary,
    separatorColor,
    style,
    text,
    TextProps,
    textStyle: textStyleOverride,
    topSeparator,
    tx,
    txOptions,
    ...TouchableOpacityProps
  } = props

  const { colors } = useColor()

  const separatorTop: ViewStyle = {
    borderTopColor: separatorColor || colors.backgroundSecondary,
    borderTopWidth: 1,
  }

  const separatorBottom: ViewStyle = {
    borderBottomColor: separatorColor || colors.backgroundSecondary,
    borderBottomWidth: 1,
  }

  const textStyles = [textStyle, textStyleOverride, TextProps?.style]

  const containerStyles = [
    topSeparator && separatorTop,
    bottomSeparator && separatorBottom,
    containerStyleOverride,
  ]

  const touchableStyles = [touchableStyle, { minHeight: height }, style]

  return (
    <View style={containerStyles}>
      <TouchableOpacity {...TouchableOpacityProps} style={touchableStyles}>
        <ListItemAction
          side="left"
          size={height}
          icon={leftIcon}
          iconColor={leftIconColor}
          iconLibrary={leftIconLibrary}
          Component={LeftComponent}
        />

        <Text {...TextProps} tx={tx} text={text} txOptions={txOptions} style={textStyles}>
          {children}
        </Text>

        <ListItemAction
          side="right"
          size={height}
          icon={rightIcon}
          iconColor={rightIconColor}
          iconLibrary={rightIconLibrary}
          Component={RightComponent}
        />
      </TouchableOpacity>
    </View>
  )
}

/**
 * @param {ListItemActionProps} props - The props for the `ListItemAction` component.
 * @returns {React.ReactNode | null} The rendered `ListItemAction` component.
 */
function ListItemAction(props: ListItemActionProps<LibraryTypes>): React.ReactNode {
  const { Component, icon, iconColor, iconLibrary, side, size } = props

  const iconContainerStyles = [iconContainer]

  if (Component) return Component

  if (icon !== undefined) {
    return (
      <Icon
        icon={icon}
        size={size}
        color={iconColor}
        library={iconLibrary}
        containerStyle={[
          iconContainerStyles,
          side === 'left' && iconContainerLeft,
          side === 'right' && iconContainerRight,
        ]}
      />
    )
  }

  return null
}

const textStyle: TextStyle = {
  alignSelf: 'center',
  flexGrow: 1,
  flexShrink: 1,
  paddingVertical: sizing.spacing.xs,
}

const touchableStyle: ViewStyle = {
  alignItems: 'flex-start',
  flexDirection: 'row',
}

const iconContainer: ViewStyle = {
  alignItems: 'center',
  flexGrow: 0,
  justifyContent: 'center',
}
const iconContainerLeft: ViewStyle = {
  marginEnd: sizing.spacing.md,
}

const iconContainerRight: ViewStyle = {
  marginStart: sizing.spacing.md,
}
