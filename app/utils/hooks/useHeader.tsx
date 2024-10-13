import React, { useLayoutEffect } from 'react'

import { useNavigation } from '@react-navigation/native'

import { Header, HeaderProps, LibraryTypes } from '../../components'

/**
 * A hook that can be used to easily set the Header of a react-navigation screen from within the screen's component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/utility/useHeader/}
 * @param {HeaderProps} headerProps - The props for the `Header` component.
 * @param {any[]} deps - The dependencies to watch for changes to update the header.
 */
export function useHeader(
  headerProps: HeaderProps<LibraryTypes, LibraryTypes>,
  deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      header: () => <Header {...headerProps} />,
      headerShown: true,
    })
  }, [...deps, navigation])
}
