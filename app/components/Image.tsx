import React, { useEffect, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Images } from 'assets/images'
import {
  Image as ExpoImage,
  ImageProps as ExpoImageProp,
  ImageSource,
  ImageStyle,
} from 'expo-image' // Import from expo-image
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useColor } from 'app/context'

export type ExpoImageProps = Omit<ExpoImageProp, 'source'>

export interface ImageProps extends Omit<ExpoImageProps, 'source'> {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ImageStyle>
  uploading?: boolean
  width?: number
  height?: number
  children?: React.ReactNode
  showIndicator?: boolean
  indicatorColor?: string[]
  source?: string | ImageSource | number | Images
}

export const ImageComponent = (props: ImageProps) => {
  const {
    children,
    containerStyle,
    contentFit,
    contentPosition,
    indicatorColor,
    showIndicator = true,
    source,
    style,
    uploading,
    width,
    ...rest
  } = props
  const { colors } = useColor()

  const [loading, setLoading] = useState(false)
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const pulsate = useSharedValue(0)

  const shouldShowIndicator =
    showIndicator &&
    typeof source === 'string' &&
    (source.startsWith('http') || source.startsWith('https'))

  // Start the pulsating animation when loading starts
  useEffect(() => {
    if (loading && shouldShowIndicator) {
      pulsate.value = withRepeat(
        withTiming(1, { duration: 1000 }), // Timing for color transition
        -1, // Infinite loop
        true, // Reverse on each iteration
      )
    } else {
      pulsate.value = 0 // Reset pulsating when loading is false
    }
  }, [loading, shouldShowIndicator])

  useEffect(() => {
    if (typeof uploading !== 'undefined' && uploading !== loading) {
      setLoading(uploading)
    }
  }, [loading, uploading])

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    if (layout && layout.height === height && layout.width === width) {
      return
    }
    setLayout(e.nativeEvent.layout)
  }

  // Animated style for background color pulsation
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      pulsate.value,
      [0, 1], // Animation range (from 0 to 1)
      indicatorColor || [colors.background, colors.backgroundSecondary],
    )

    return {
      backgroundColor,
    }
  })

  let pulsatingContainer = null
  if (loading && shouldShowIndicator) {
    pulsatingContainer = (
      <Animated.View
        style={[styles.pulsatingContainer, animatedStyle]} // Apply animated styles
      />
    )
  }

  let imageSource: number | ImageSource | undefined = {
    uri: source as string,
  }

  if (typeof source !== 'string') {
    // Local image
    imageSource = source
  }

  let imageStyle: StyleProp<ImageStyle> = style || {}
  if ('flex' in imageStyle && imageStyle.flex === 1 && layout) {
    const { flex: _, ...restStyle } = imageStyle

    // Merge the remaining styles with the `layout`
    imageStyle = { ...restStyle, ...layout }
  }

  return (
    <View style={[styles.container, containerStyle]} onLayout={onLayout}>
      <ExpoImage
        style={imageStyle}
        source={imageSource ?? Images.PLACEHOLDER_IMAGE}
        onLoadStart={() => {
          !loading && setLoading(true)
        }}
        onError={() => {
          loading && setLoading(false)
        }}
        onLoadEnd={() => {
          loading && setLoading(false)
        }}
        placeholder={Images.PLACEHOLDER_IMAGE}
        contentFit={contentFit || 'contain'}
        contentPosition={contentPosition || 'center'}
        {...rest}>
        {children}
      </ExpoImage>
      {pulsatingContainer}
    </View>
  )
}

const MemorizedImage = React.memo(ImageComponent)
MemorizedImage.displayName = 'Image'
export { MemorizedImage as Image }

const styles = StyleSheet.create({
  container: {},
  pulsatingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
