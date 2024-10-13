import React from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'

import { Images } from 'assets/images'
import { ImageStyle } from 'expo-image'

import { Image, ImageProps, LibraryTypes } from 'app/components'

import { translate } from '../i18n'
import { sizing } from '../theme'
import { Button, ButtonProps } from './Button'
import { Text, TextProps } from './Text'

interface EmptyStateProps<L extends LibraryTypes, R extends LibraryTypes> {
  /**
   * An optional prop that specifies the text/image set to use for the empty state.
   */
  preset?: keyof typeof EmptyStatePresets
  /**
   * Style override for the container.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An Image source to be displayed above the heading.
   */
  imageSource?: ImageProps['source']
  /**
   * Style overrides for image.
   */
  imageStyle?: StyleProp<ImageStyle>
  /**
   * Pass any additional props directly to the Image component.
   */
  ImageProps?: ImageProps
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps['text']
  /**
   * Heading text which is looked up via i18n.
   */
  headingTx?: TextProps['tx']
  /**
   * Optional heading options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  headingTxOptions?: TextProps['txOptions']
  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps['text']
  /**
   * Content text which is looked up via i18n.
   */
  contentTx?: TextProps['tx']
  /**
   * Optional content options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  contentTxOptions?: TextProps['txOptions']
  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps
  /**
   * The button text to display if not using `buttonTx`.
   */
  button?: TextProps['text']
  /**
   * Button text which is looked up via i18n.
   */
  buttonTx?: TextProps['tx']
  /**
   * Optional button options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  buttonTxOptions?: TextProps['txOptions']
  /**
   * Style overrides for button.
   */
  buttonStyle?: ButtonProps<L, R>['buttonContainerStyle']
  /**
   * Style overrides for button text.
   */
  buttonTextStyle?: ButtonProps<L, R>['titleStyle']
  /**
   * Called when the button is pressed.
   */
  buttonOnPress?: ButtonProps<L, R>['onPress']
  /**
   * Pass any additional props directly to the Button component.
   */
  ButtonProps?: ButtonProps<L, R>
}

interface EmptyStatePresetItem {
  imageSource: ImageProps['source']
  heading: TextProps['text']
  content: TextProps['text']
  button: TextProps['text']
}

const EmptyStatePresets = {
  generic: {
    button: translate('emptyStateComponent.button'),
    content: translate('emptyStateComponent.content'),
    heading: translate('emptyStateComponent.heading'),
    imageSource: Images.APP_IMAGE,
  } as EmptyStatePresetItem,
  // other presets of type EmptyStatePresetItem
} as const

/**
 * A component to use when there is no data to display. It can be utilized to direct the user what to do next.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/EmptyState/}
 * @param {EmptyStateProps} props - The props for the `EmptyState` component.
 * @returns {React.ReactNode} The rendered `EmptyState` component.
 */
export function EmptyState(props: EmptyStateProps<LibraryTypes, LibraryTypes>): React.ReactNode {
  const preset = EmptyStatePresets[props.preset ?? 'generic']

  const {
    button = preset.button,
    buttonOnPress,
    ButtonProps,
    buttonStyle: buttonStyleOverride,
    buttonTextStyle: buttonTextStyleOverride,
    buttonTx,
    buttonTxOptions,
    content = preset.content,
    contentStyle: contentStyleOverride,
    ContentTextProps,
    contentTx,
    contentTxOptions,
    heading = preset.heading,
    headingStyle: headingStyleOverride,
    HeadingTextProps,
    headingTx,
    headingTxOptions,
    ImageProps,
    imageSource = preset.imageSource,
    imageStyle: imageStyleOverride,
    style: containerStyleOverride,
  } = props

  const isImagePresent = !!imageSource
  const isHeadingPresent = !!(heading || headingTx)
  const isContentPresent = !!(content || contentTx)
  const isButtonPresent = !!(button || buttonTx)

  const containerStyles = [containerStyleOverride]
  const imageStyles = [
    (isHeadingPresent || isContentPresent || isButtonPresent) && {
      marginBottom: sizing.spacing.xxxs,
    },
    imageStyleOverride,
    ImageProps?.style,
  ]
  const headingStyles = [
    headingStyle,
    isImagePresent && { marginTop: sizing.spacing.xxxs },
    (isContentPresent || isButtonPresent) && { marginBottom: sizing.spacing.xxxs },
    headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const contentStyles = [
    contentStyle,
    (isImagePresent || isHeadingPresent) && { marginTop: sizing.spacing.xxxs },
    isButtonPresent && { marginBottom: sizing.spacing.xxxs },
    contentStyleOverride,
    ContentTextProps?.style,
  ]
  const buttonStyles = [
    (isImagePresent || isHeadingPresent || isContentPresent) && { marginTop: sizing.spacing.xl },
    buttonStyleOverride,
    ButtonProps?.buttonContainerStyle,
  ]

  return (
    <View style={containerStyles}>
      {isImagePresent && <Image source={imageSource} {...ImageProps} style={imageStyles} />}

      {isHeadingPresent && (
        <Text
          preset="h2"
          text={heading}
          tx={headingTx}
          txOptions={headingTxOptions}
          {...HeadingTextProps}
          style={headingStyles}
        />
      )}

      {isContentPresent && (
        <Text
          text={content}
          tx={contentTx}
          txOptions={contentTxOptions}
          {...ContentTextProps}
          style={contentStyles}
        />
      )}

      {isButtonPresent && (
        <Button
          onPress={buttonOnPress}
          title={button}
          tx={buttonTx}
          txOptions={buttonTxOptions}
          titleStyle={buttonTextStyleOverride}
          {...ButtonProps}
          buttonContainerStyle={buttonStyles}
        />
      )}
    </View>
  )
}

const headingStyle: TextStyle = { paddingHorizontal: sizing.spacing.lg, textAlign: 'center' }
const contentStyle: TextStyle = { paddingHorizontal: sizing.spacing.lg, textAlign: 'center' }
