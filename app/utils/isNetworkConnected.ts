import NetInfo from '@react-native-community/netinfo'

export const isNetworkConnected = async () => {
  const state = await NetInfo.refresh()
  return state.isConnected || false
}
