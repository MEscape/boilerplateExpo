/**
 * This file does the setup for integration with Reactotron, which is a
 * free desktop app for inspecting and debugging your React Native app.
 * @see https://github.com/infinitered/reactotron
 */
import { NativeModules } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ArgType } from 'reactotron-core-client'
import { mst } from 'reactotron-mst'

import { goBack, navigate, resetRoot } from 'app/navigators/navigationUtilities'
import { isWeb } from 'app/utils'
import { clear } from 'app/utils/storage'

import { Reactotron } from './ReactotronClient'

const reactotron = Reactotron.configure({
  name: require('../../package.json').name,
  onConnect: () => {
    /** since this file gets hot reloaded, let's clear the past logs every time we connect */
    Reactotron.clear()
  },
}).use(
  mst({
    /* ignore some chatty `mobx-state-tree` actions */
    filter: event => /postProcessSnapshot|@APPLY_SNAPSHOT/.test(event.name) === false,
  }),
)

if (!isWeb) {
  reactotron.setAsyncStorageHandler?.(AsyncStorage)
  reactotron.useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
}

/**
 * Reactotron allows you to define custom commands that you can run
 * from Reactotron itself, and they will run in your app.
 *
 * Define them in the section below with `onCustomCommand`. Use your
 * creativity -- this is great for development to quickly and easily
 * get your app into the state you want.
 *
 * NOTE: If you edit this file while running the app, you will need to do a full refresh
 * or else your custom commands won't be registered correctly.
 */
reactotron.onCustomCommand({
  command: 'showDevMenu',
  description: 'Opens the React Native dev menu',
  handler: () => {
    Reactotron.log('Showing React Native dev menu')
    NativeModules.DevMenu.show()
  },
  title: 'Show Dev Menu',
})

reactotron.onCustomCommand({
  command: 'resetStore',
  description: 'Resets the MST store',
  handler: () => {
    Reactotron.log('resetting store')
    clear()
  },
  title: 'Reset Root Store',
})

reactotron.onCustomCommand({
  command: 'resetNavigation',
  description: 'Resets the navigation state',
  handler: () => {
    Reactotron.log('resetting navigation state')
    resetRoot({ index: 0, routes: [] })
  },
  title: 'Reset Navigation State',
})

reactotron.onCustomCommand<[{ name: 'route'; type: ArgType.String }]>({
  args: [{ name: 'route', type: ArgType.String }],
  command: 'navigateTo',
  description: 'Navigates to a screen by name.',
  handler: args => {
    const { route } = args ?? {}
    if (route) {
      Reactotron.log(`Navigating to: ${route}`)
      navigate(route as any) // this should be tied to the navigator, but since this is for debugging, we can navigate to illegal routes
    } else {
      Reactotron.log('Could not navigate. No route provided.')
    }
  },
  title: 'Navigate To Screen',
})

reactotron.onCustomCommand({
  command: 'goBack',
  description: 'Goes back',
  handler: () => {
    Reactotron.log('Going back')
    goBack()
  },
  title: 'Go Back',
})

/**
 * We're going to add `console.tron` to the Reactotron object.
 * Now, anywhere in our app in development, we can use Reactotron like so:
 *
 * ```
 * if (__DEV__) {
 *  console.tron.display({
 *    name: 'JOKE',
 *    preview: 'What's the best thing about Switzerland?',
 *    value: 'I don't know, but the flag is a big plus!',
 *    important: true
 *  })
 * }
 * ```
 *
 * Use this power responsibly! :)
 */
// eslint-disable-next-line no-console
console.tron = reactotron

/**
 * We tell typescript about our dark magic
 *
 * You can also import Reactotron yourself from ./reactotronClient
 * and use it directly, like Reactotron.log('hello world')
 */
declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance, and more.
     * @see https://github.com/infinitered/reactotron
     * @example
     * if (__DEV__) {
     *  console.tron.display({
     *    name: 'JOKE',
     *    preview: 'What's the best thing about Switzerland?',
     *    value: 'I don't know, but the flag is a big plus!',
     *    important: true
     *  })
     * }
     */
    tron: typeof reactotron
  }
}

/**
 * Now that we've setup all our Reactotron configuration, let's connect!
 */
reactotron.connect()
