import React, { ComponentType } from 'react'
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import * as VectorIcons from '@expo/vector-icons'
import { Icons } from 'assets/icons'
import { ImageStyle } from 'expo-image'

import { Image } from 'app/components'
import { useColor } from 'app/context'

// Define the types for Icons and Vector Icons
export type IconTypes = keyof typeof Icons
export type VectorIconLibraries = Extract<keyof typeof VectorIcons, 'AntDesign' | 'Ionicons'>
export type LibraryTypes = 'custom' | VectorIconLibraries

// Create a mapping type to extract the glyph map types based on library
type IconLibraryMap = {
  custom: IconTypes // Custom icons from the local Icons asset
} & {
  [K in VectorIconLibraries]: keyof (typeof VectorIcons)[K]['glyphMap']
}

// Interface for Icon Props
export interface IconProps<T extends LibraryTypes> extends TouchableOpacityProps {
  /**
   * The name of the icon.
   */
  icon: T extends keyof IconLibraryMap ? IconLibraryMap[T] : never // Use IconLibraryMap to determine the icon type
  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps['onPress']

  /**
   * Option to choose between the `Icons` enum or expo-vector-icons library
   */
  library?: T // The type of library being used
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @param {IconProps<T>} props - The props for the `Icon` component.
 * @returns {React.ReactNode} The rendered `Icon` component.
 */
function IconComponent(props: IconProps<LibraryTypes>): React.ReactNode {
  const {
    color,
    containerStyle: containerStyleOverride,
    icon,
    library = 'custom' as LibraryTypes, // Default to 'custom'
    size,
    style: imageStyleOverride,
    ...WrapperProps
  } = props

  const { colors } = useColor()

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  // If using expo-vector-icons, find the correct vector icon library
  if (library !== 'custom' && VectorIcons[library as keyof typeof VectorIcons]) {
    const VectorIcon = VectorIcons[library as keyof typeof VectorIcons]
    return (
      <Wrapper
        accessibilityRole={isPressable ? 'imagebutton' : undefined}
        {...WrapperProps}
        style={containerStyleOverride}>
        <VectorIcon
          name={icon}
          size={size || 20}
          color={color || colors.text}
          style={imageStyleOverride}
        />
      </Wrapper>
    )
  }

  // Fallback to custom Icons
  const imageStyle: StyleProp<ImageStyle> = [
    size ? { height: size || 24, width: size || 24 } : {},
    imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={containerStyleOverride}>
      <Image
        tintColor={color || colors.text}
        style={imageStyle}
        contentFit="contain"
        source={Icons[icon as IconTypes]}
      />
    </Wrapper>
  )
}

const MemorizedIcon = React.memo(IconComponent)
MemorizedIcon.displayName = 'Icon'

export { MemorizedIcon as Icon }
