import axios from 'axios'
import { getApiBaseUrl, AUTH_TOKEN_STORAGE_KEY } from '../config/authConfig.js'
import { getStorageItem } from '../utils/storage.js'

const API_BASE_URL = getApiBaseUrl() || '/api'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config) => {
    const token = getStorageItem(AUTH_TOKEN_STORAGE_KEY, '')
    const nextConfig = { ...config }
    const nextHeaders = {
      ...(config.headers || {}),
    }

    if (token) {
      nextHeaders.Authorization = `Bearer ${token}`
    } else {
      delete nextHeaders.Authorization
    }

    if (nextConfig.data && typeof nextConfig.data === 'object' && !(nextConfig.data instanceof FormData)) {
      nextHeaders['Content-Type'] = nextHeaders['Content-Type'] || 'application/json'
    }

    nextConfig.headers = nextHeaders

    return nextConfig
  },
  (error) => Promise.reject(error),
)

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const backendPayload = error.response?.data
    const normalizedError = {
      success: false,
      message: backendPayload?.message || error.message || 'Terjadi kesalahan pada permintaan.',
      status: error.response?.status ?? null,
      errors: backendPayload?.errors || {},
      data: backendPayload?.data ?? null,
      originalError: error,
    }

    return Promise.reject(normalizedError)
  },
)

export { API_BASE_URL }
export default httpClient
