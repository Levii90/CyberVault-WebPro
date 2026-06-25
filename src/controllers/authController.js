import {
  clearAuth,
  clearAuthSession,
  getCurrentUser,
  getCurrentUserFromApi,
  getStoredToken,
  getStoredUser,
  hasAuthToken,
  isAuthenticated as isAuthenticatedService,
  login as loginService,
  logout as logoutService,
  register as registerService,
  saveAuthSession,
  setDemoSession,
  updateProfile as updateProfileService,
  updateStoredUser,
  validateSession as validateSessionService,
} from '../services/auth/authService.js'

export function isAuthenticated() {
  return isAuthenticatedService()
}

export async function login(credentials = {}) {
  return loginService(credentials)
}

export async function register(payload = {}) {
  return registerService(payload)
}

export async function logout() {
  return logoutService()
}

export async function refreshCurrentUser() {
  return getCurrentUserFromApi()
}

export async function validateSession() {
  return validateSessionService()
}

export async function updateProfile(payload = {}) {
  return updateProfileService(payload)
}

export {
  clearAuth,
  clearAuthSession,
  getCurrentUser,
  getStoredToken,
  getStoredUser,
  hasAuthToken,
  saveAuthSession,
  setDemoSession,
  updateStoredUser,
}
