import { AxiosError } from 'axios'

export const getGeneralApiProblem = (
  error: AxiosError,
): { kind: string; temporary?: boolean } | null => {
  // Check for cancellation errors first
  if (error.message === 'Canceled') {
    return null
  }

  if (!error.response) {
    switch (error.message) {
      case 'Network Error':
        return { kind: 'cannot-connect', temporary: true }
      case 'timeout of 0ms exceeded':
        return { kind: 'timeout', temporary: true }
      default:
        return { kind: 'unknown', temporary: true }
    }
  }

  const { status } = error.response
  switch (status) {
    case 401:
      return { kind: 'unauthorized' }
    case 403:
      return { kind: 'forbidden' }
    case 404:
      return { kind: 'not-found' }
    case 500:
      return { kind: 'server' }
    default:
      return { kind: 'rejected' }
  }
}
