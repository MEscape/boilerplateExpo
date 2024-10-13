/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from 'mobx-state-tree'

import { logger, StorageKeys } from 'app/utils'
import * as storage from 'app/utils/storage'

import { RootStore, RootStoreSnapshot } from '../RootStore'

/**
 * Setup the root state.
 */
let _disposer: IDisposer | undefined
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null

  try {
    // load the last known state from AsyncStorage
    restoredState = ((await storage.load(StorageKeys.ROOT_STATE_STORAGE)) ??
      {}) as RootStoreSnapshot
    applySnapshot(rootStore, restoredState)
  } catch (e) {
    if (e instanceof Error) logger.error(e.message)
  }

  // stop tracking state changes if we've already setup
  if (_disposer) _disposer()

  // track changes & save to AsyncStorage
  _disposer = onSnapshot(rootStore, snapshot =>
    storage.save(StorageKeys.ROOT_STATE_STORAGE, snapshot),
  )

  const unsubscribe = () => {
    _disposer?.()
    _disposer = undefined
  }

  return { restoredState, rootStore, unsubscribe }
}
