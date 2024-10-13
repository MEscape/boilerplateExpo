import { isNetworkConnected } from 'app/utils'

import api from './apiHandler' // Import the API handler
import { API_METHODS } from './apiMethods.type'

export default async function serviceAdapter<T, reqParams>(
  method: API_METHODS,
  url: string,
  requestParam?: reqParams,
  signal?: AbortSignal,
): Promise<T> {
  const status = await isNetworkConnected()

  if (status) {
    try {
      switch (method) {
        case API_METHODS.GET:
          return api.get(url, signal, requestParam || {})
        case API_METHODS.POST:
          return api.post(url, requestParam || {})
        case API_METHODS.PUT:
          return api.put(url, requestParam || {})
        case API_METHODS.DELETE:
          return api.delete(url, requestParam || {})
        default:
          return Promise.reject(new Error('Rest method not supported.'))
      }
    } catch (error) {
      return Promise.reject(error)
    }
  } else {
    return Promise.reject(
      new Error('No internet connection available. Please check your network connection.'),
    )
  }
}
