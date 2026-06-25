const AUTH_MODE = String(import.meta.env.VITE_AUTH_MODE || 'demo').trim().toLowerCase()
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').trim()

export const AUTH_TOKEN_STORAGE_KEY = 'auth_token'
export const AUTH_USER_STORAGE_KEY = 'current_user'

export function getAuthMode() {
  return AUTH_MODE === 'backend' ? 'backend' : 'demo'
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function isBackendAuthMode() {
  return getAuthMode() === 'backend' && Boolean(getApiBaseUrl())
}

export function isDemoAuthMode() {
  return !isBackendAuthMode()
}
