import React, { ErrorInfo } from 'react'
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native'

import { Button, Icon, Screen, Text } from 'app/components'
import { useColor } from 'app/context'
import { sizing } from 'app/theme'

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {React.ReactNode} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps): React.ReactNode {
  const { colors } = useColor()

  const errorContent: TextStyle = {
    color: colors.error,
  }

  const errorBacktrace: TextStyle = {
    color: colors.textDim,
    marginTop: sizing.spacing.md,
  }

  const heading: TextStyle = {
    color: colors.error,
    marginBottom: sizing.spacing.md,
  }

  const errorSection: ViewStyle = {
    backgroundColor: colors.separator,
    borderRadius: 6,
    flex: 2,
    marginVertical: sizing.spacing.md,
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={contentContainer}>
      <View style={topSection}>
        <Icon icon="LADYBUG" size={64} />
        <Text style={heading} preset="h1" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      <ScrollView style={errorSection} contentContainerStyle={errorSectionContentContainer}>
        <Text style={errorContent} weight="bold" text={`${props.error}`.trim()} />
        <Text
          selectable
          style={errorBacktrace}
          text={`${props.errorInfo?.componentStack ?? ''}`.trim()}
        />
      </ScrollView>

      <Button preset="primary" onPress={props.onReset} tx="errorScreen.reset" />
    </Screen>
  )
}

const contentContainer: ViewStyle = {
  alignItems: 'center',
  flex: 1,
  paddingHorizontal: sizing.spacing.lg,
  paddingTop: sizing.spacing.xl,
}

const topSection: ViewStyle = {
  alignItems: 'center',
  flex: 1,
}

const errorSectionContentContainer: ViewStyle = {
  padding: sizing.spacing.md,
}
