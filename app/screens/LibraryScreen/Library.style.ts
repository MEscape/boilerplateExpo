import { StyleSheet } from 'react-native'

import { Palette } from 'app/theme'

export const libraryStyles = ({ background }: Palette) =>
  StyleSheet.create({
    container: {
      backgroundColor: background,
    },
  })
