import React, { ComponentType, Fragment, ReactElement } from 'react'
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { useColor } from 'app/context'
import { Palette, shadows, sizing } from 'app/theme'

import { Text, TextProps } from './Text'

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: any
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: 'top' | 'center' | 'space-between' | 'force-footer-bottom'
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement
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
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement
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
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps['text']
  /**
   * Footer text which is looked up via i18n.
   */
  footerTx?: TextProps['tx']
  /**
   * Optional footer options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  footerTxOptions?: TextProps['txOptions']
  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement
}

const BASE_CONTAINER: ViewStyle = {
  borderRadius: sizing.spacing.md,
  borderWidth: 1,
  elevation: shadows.android.large,
  flexDirection: 'row',
  minHeight: 96,
  padding: sizing.spacing.xs,
  ...shadows.ios.large,
}

export const containerPresets = ({ background, border }: Palette) => ({
  default: {
    ...BASE_CONTAINER,
    backgroundColor: background,
    borderColor: border,
  } as ViewStyle,
  reversed: {
    ...BASE_CONTAINER,
    backgroundColor: border,
    borderColor: background,
  } as ViewStyle,
})

export type ContainerPresets = keyof ReturnType<typeof containerPresets>

const headingPresets: Record<ContainerPresets, (palette: Palette) => TextStyle> = {
  default: () => ({}),
  reversed: ({ text }) => ({ color: text }),
}

const contentPresets: Record<ContainerPresets, (palette: Palette) => TextStyle> = {
  default: () => ({}),
  reversed: ({ text }) => ({ color: text }),
}

const footerPresets: Record<ContainerPresets, (palette: Palette) => TextStyle> = {
  default: () => ({}),
  reversed: ({ text }) => ({ color: text }),
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Card/}
 * @param {CardProps} props - The props for the `Card` component.
 * @returns {React.ReactNode} The rendered `Card` component.
 */
export function Card(props: CardProps): React.ReactNode {
  const {
    content,
    ContentComponent,
    contentStyle: contentStyleOverride,
    ContentTextProps,
    contentTx,
    contentTxOptions,
    footer,
    FooterComponent,
    footerStyle: footerStyleOverride,
    FooterTextProps,
    footerTx,
    footerTxOptions,
    heading,
    HeadingComponent,
    headingStyle: headingStyleOverride,
    HeadingTextProps,
    headingTx,
    headingTxOptions,
    LeftComponent,
    RightComponent,
    style: containerStyleOverride,
    verticalAlignment = 'top',
    ...WrapperProps
  } = props

  const { colors } = useColor()

  const preset: ContainerPresets = props.preset ?? 'default'
  const isPressable = !!WrapperProps.onPress
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx)
  const isContentPresent = !!(ContentComponent || content || contentTx)
  const isFooterPresent = !!(FooterComponent || footer || footerTx)

  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >
  const HeaderContentWrapper = verticalAlignment === 'force-footer-bottom' ? View : Fragment

  const containerStyle = [containerPresets(colors)[preset], containerStyleOverride]

  const headingStyle = [
    headingPresets[preset](colors),
    (isFooterPresent || isContentPresent) && { marginBottom: sizing.spacing.xxxs },
    headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const contentStyle = [
    contentPresets[preset](colors),
    isHeadingPresent && { marginTop: sizing.spacing.xxxs },
    isFooterPresent && { marginBottom: sizing.spacing.xxxs },
    contentStyleOverride,
    ContentTextProps?.style,
  ]
  const footerStyle = [
    footerPresets[preset](colors),
    (isHeadingPresent || isContentPresent) && { marginTop: sizing.spacing.xxxs },
    footerStyleOverride,
    FooterTextProps?.style,
  ]
  const alignmentWrapperStyle = [
    alignmentWrapper,
    { justifyContent: alignmentWrapperFlexOptions[verticalAlignment] },
    LeftComponent && { marginStart: sizing.spacing.md },
    RightComponent && { marginEnd: sizing.spacing.md },
  ]

  return (
    <Wrapper
      style={containerStyle}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? 'button' : undefined}
      {...WrapperProps}>
      {LeftComponent}

      <View style={alignmentWrapperStyle}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text
                weight="bold"
                text={heading}
                tx={headingTx}
                txOptions={headingTxOptions}
                {...HeadingTextProps}
                style={headingStyle}
              />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text
                weight="regular"
                text={content}
                tx={contentTx}
                txOptions={contentTxOptions}
                {...ContentTextProps}
                style={contentStyle}
              />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              weight="regular"
              size="sm"
              text={footer}
              tx={footerTx}
              txOptions={footerTxOptions}
              {...FooterTextProps}
              style={footerStyle}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  )
}

const alignmentWrapper: ViewStyle = {
  alignSelf: 'stretch',
  flex: 1,
}

const alignmentWrapperFlexOptions = {
  'center': 'center',
  'force-footer-bottom': 'space-between',
  'space-between': 'space-between',
  'top': 'flex-start',
} as const
