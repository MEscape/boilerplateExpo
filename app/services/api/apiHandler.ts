import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import Config from 'app/config'
import { logger } from 'app/utils'

// Create an Axios instance
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
})

// Set up common headers
api.defaults.headers.common['Content-Type'] = 'application/json'
api.defaults.headers.common.Accept = 'application/json'

// Interceptors for handling requests and responses
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: GET TOKEN
    const token = ''
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // Handle request error
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  error => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 400:
          logger.error('Bad Request:', response.data)
          break
        case 401:
          logger.error('Unauthorized:', response.data)
          break
        case 404:
          logger.error('Not Found:', response.data)
          break
        case 500:
          logger.error('Server Error:', response.data)
          break
        default:
          logger.error('Unexpected Error:', response.data)
      }
    } else {
      logger.error('Network Error:', error.message)
    }

    return Promise.reject(error)
  },
)

// API methods for GET, POST, PUT, DELETE
const apiMethods = {
  delete: (url: string, params?: object): Promise<any> => {
    return api.delete(url, { params })
  },

  get: (url: string, signal?: AbortSignal, params?: object): Promise<any> => {
    return api.get(url, { params, signal })
  },

  post: (url: string, data: object): Promise<any> => {
    return api.post(url, JSON.stringify(data))
  },

  put: (url: string, data: object): Promise<any> => {
    return api.put(url, JSON.stringify(data))
  },
}

export default { api, ...apiMethods }
