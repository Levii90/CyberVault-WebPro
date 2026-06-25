import { demoUser } from '../../data/auth/demoUser.js'
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY, isBackendAuthMode } from '../../config/authConfig.js'
import httpClient from '../httpClient.js'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../../utils/storage.js'

const AUTH_USER_UPDATED_EVENT = 'auth:user-updated'

function buildDemoUser(overrides = {}) {
  const email = String(overrides.email || demoUser.email).trim()
  const derivedName =
    String(overrides.name || '').trim() ||
    email.split('@')[0] ||
    demoUser.name

  return {
    ...demoUser,
    ...overrides,
    name: derivedName,
    email,
  }
}

function toValidationResult(message, errors = {}, status = null) {
  return {
    success: false,
    message,
    errors,
    status,
  }
}

function notifyAuthUserUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_USER_UPDATED_EVENT))
  }
}

function normalizeBackendAuthResponse(response) {
  return {
    success: Boolean(response?.success),
    message: response?.message || '',
    data: {
      user: response?.data?.user || null,
      token: response?.data?.token || '',
      expires_at: response?.data?.expires_at || null,
    },
  }
}

function deriveNameFromEmail(email = '') {
  const localPart = String(email).trim().split('@')[0] || 'CyberVault User'
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export function saveAuthSession(token, user) {
  if (token) {
    setStorageItem(AUTH_TOKEN_STORAGE_KEY, token)
  } else {
    removeStorageItem(AUTH_TOKEN_STORAGE_KEY)
  }

  if (user) {
    setStorageItem(AUTH_USER_STORAGE_KEY, user)
  } else {
    removeStorageItem(AUTH_USER_STORAGE_KEY)
  }

  notifyAuthUserUpdated()

  return {
    token,
    user,
  }
}

export function setDemoSession(user) {
  const normalizedUser = buildDemoUser(user)

  saveAuthSession('', normalizedUser)

  return {
    user: normalizedUser,
    session_mode: 'demo',
  }
}

export function clearAuth() {
  removeStorageItem(AUTH_TOKEN_STORAGE_KEY)
  removeStorageItem(AUTH_USER_STORAGE_KEY)
  notifyAuthUserUpdated()
}

export function clearAuthSession() {
  clearAuth()
}

export function getAuthToken() {
  return getStorageItem(AUTH_TOKEN_STORAGE_KEY, '')
}

export function getStoredToken() {
  return getAuthToken()
}

export function hasAuthToken() {
  return Boolean(getStoredToken())
}

export function getStoredUser() {
  return getStorageItem(AUTH_USER_STORAGE_KEY, null)
}

export function getCurrentUser() {
  return getStoredUser()
}

export function updateStoredUser(user) {
  if (!user) {
    removeStorageItem(AUTH_USER_STORAGE_KEY)
    notifyAuthUserUpdated()
    return null
  }

  setStorageItem(AUTH_USER_STORAGE_KEY, user)
  notifyAuthUserUpdated()
  return user
}

export function updateCurrentUserProfile(updates = {}) {
  const currentUser = getStoredUser()

  if (!currentUser) {
    return null
  }

  const sanitizedUpdates = {
    name: String(updates.name || currentUser.name || '').trim(),
    username: String(updates.username || currentUser.username || '').trim(),
    email: String(updates.email || currentUser.email || '').trim(),
    bio: String(updates.bio || currentUser.bio || '').trim(),
  }

  const nextUser = {
    ...currentUser,
    ...sanitizedUpdates,
  }

  updateStoredUser(nextUser)

  return nextUser
}

export function isAuthenticated() {
  if (isBackendAuthMode()) {
    return hasAuthToken()
  }

  return Boolean(getStoredUser())
}

export async function getCurrentUserFromApi() {
  if (!isBackendAuthMode()) {
    return {
      success: true,
      message: 'Demo user fetched.',
      data: {
        user: getStoredUser(),
      },
      status: 200,
      isAuthError: false,
      skipRequest: true,
    }
  }

  if (!hasAuthToken()) {
    return {
      success: false,
      message: 'No auth token available.',
      errors: {},
      status: 401,
      data: {
        user: null,
      },
      isAuthError: true,
      skipRequest: true,
    }
  }

  try {
    const response = await httpClient.get('/api/auth/me')
    const user = response?.data?.user || null

    if (user) {
      updateStoredUser(user)
    }

    return {
      success: Boolean(response?.success),
      message: response?.message || 'Current user fetched successfully.',
      errors: {},
      status: 200,
      data: {
        user,
      },
      isAuthError: false,
      skipRequest: false,
    }
  } catch (error) {
    const isAuthError = error.status === 401 || error.status === 403

    if (isAuthError) {
      clearAuth()
    }

    return {
      success: false,
      message: error.message || 'Current user fetch failed.',
      errors: error.errors || {},
      status: error.status ?? null,
      data: {
        user: null,
      },
      isAuthError,
      skipRequest: false,
    }
  }
}

export async function validateSession() {
  if (!isBackendAuthMode()) {
    const user = getStoredUser()

    return {
      success: Boolean(user),
      authenticated: Boolean(user),
      message: user ? 'Demo session is active.' : 'Demo session not found.',
      errors: {},
      status: user ? 200 : 401,
      user,
      isAuthError: !user,
      skipRequest: true,
    }
  }

  if (!hasAuthToken()) {
    return {
      success: false,
      authenticated: false,
      message: 'No auth token available.',
      errors: {},
      status: 401,
      user: null,
      isAuthError: true,
      skipRequest: true,
    }
  }

  const response = await getCurrentUserFromApi()
  const user = response?.data?.user || null

  return {
    success: Boolean(response?.success),
    authenticated: Boolean(response?.success && user),
    message: response?.message || '',
    errors: response?.errors || {},
    status: response?.status ?? null,
    user,
    isAuthError: Boolean(response?.isAuthError),
    skipRequest: Boolean(response?.skipRequest),
  }
}

export async function updateProfile(payload = {}) {
  const allowedPayload = {
    name: String(payload.name || '').trim(),
    username: String(payload.username || '').trim(),
    bio: String(payload.bio || '').trim(),
    phone: String(payload.phone || '').trim(),
    institution: String(payload.institution || '').trim(),
  }

  if (isBackendAuthMode()) {
    try {
      const response = await httpClient.put('/api/auth/profile', allowedPayload)
      const user = response?.data?.user || null

      if (user) {
        updateStoredUser(user)
      }

      return {
        success: Boolean(response?.success),
        message: response?.message || 'Profil berhasil diperbarui.',
        data: {
          user,
        },
      }
    } catch (error) {
      if (error.status === 401) {
        clearAuth()
      }

      return toValidationResult(
        error.message || 'Profil gagal diperbarui.',
        error.errors || {},
        error.status ?? null,
      )
    }
  }

  const nextUser = updateCurrentUserProfile(allowedPayload)

  return {
    success: true,
    message: 'Profil akun berhasil diperbarui secara lokal.',
    data: {
      user: nextUser,
    },
  }
}

export async function login(credentials = {}) {
  const email = String(credentials.email || '').trim()
  const password = String(credentials.password || '')

  if (!email || !password) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: {
        email: !email ? 'Email wajib diisi.' : '',
        password: !password ? 'Password wajib diisi.' : '',
      },
    }
  }

  if (isBackendAuthMode()) {
    try {
      const response = await httpClient.post('/api/auth/login', {
        email,
        password,
      })
      const normalizedResponse = normalizeBackendAuthResponse(response)

      saveAuthSession(normalizedResponse.data.token, normalizedResponse.data.user)

      return normalizedResponse
    } catch (error) {
      return toValidationResult(
        error.message || 'Login gagal.',
        error.errors || {},
        error.status ?? null,
      )
    }
  }

  const session = setDemoSession({
    email,
    name: credentials.name,
  })

  return {
    success: true,
    message: 'Login berhasil',
    data: session,
  }
}

export async function register(payload = {}) {
  const email = String(payload.email || '').trim()
  const password = String(payload.password || '')
  const passwordConfirmation = String(
    payload.password_confirmation || payload.confirmPassword || '',
  )
  const username = String(payload.username || '').trim()
  const derivedName = String(payload.name || '').trim() || deriveNameFromEmail(email)

  const validationErrors = {
    name: derivedName ? '' : 'Nama wajib diisi.',
    email: email ? '' : 'Email wajib diisi.',
    password: password ? '' : 'Password wajib diisi.',
    password_confirmation: passwordConfirmation
      ? passwordConfirmation === password
        ? ''
        : 'Konfirmasi password harus sama.'
      : 'Konfirmasi password wajib diisi.',
  }

  if (
    validationErrors.name ||
    validationErrors.email ||
    validationErrors.password ||
    validationErrors.password_confirmation
  ) {
    return toValidationResult('Validasi gagal', validationErrors)
  }

  if (isBackendAuthMode()) {
    try {
      const response = await httpClient.post('/api/auth/register', {
        name: derivedName,
        username: username || null,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      const normalizedResponse = normalizeBackendAuthResponse(response)

      saveAuthSession(normalizedResponse.data.token, normalizedResponse.data.user)

      return normalizedResponse
    } catch (error) {
      return toValidationResult(
        error.message || 'Registrasi gagal.',
        error.errors || {},
        error.status ?? null,
      )
    }
  }

  const session = setDemoSession({
    email,
    name: derivedName,
    username,
  })

  return {
    success: true,
    message: 'Registrasi berhasil',
    data: session,
  }
}

export async function logout() {
  const token = getAuthToken()

  if (isBackendAuthMode() && token) {
    try {
      await httpClient.post('/api/auth/logout')
    } catch {
      // Storage must still be cleared on logout even if backend revoke fails.
    }
  }

  clearAuth()

  return {
    success: true,
    message: 'Logout berhasil',
  }
}

export { AUTH_USER_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY, AUTH_USER_UPDATED_EVENT }
