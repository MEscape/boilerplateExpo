import { StorageKeys } from 'app/utils'
import * as storage from 'app/utils/storage'

export const isFirstLaunch = async () => {
  const firstLaunch = await storage.load(StorageKeys.FIRST_LAUNCH)

  if (firstLaunch === null) {
    await storage.save(StorageKeys.FIRST_LAUNCH, true)
    return true
  }

  return false
}
