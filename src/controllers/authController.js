const AUTH_STORAGE_KEY = 'cv-authenticated'

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function login() {
  sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
}

export function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
