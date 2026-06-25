function parseStoredValue(value, fallback) {
  if (value === null) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function serializeValue(value) {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }

  return String(value)
}

export function getStorageItem(key, fallback = null) {
  try {
    return parseStoredValue(localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, serializeValue(value))
    return true
  } catch {
    return false
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function clearStorage() {
  try {
    localStorage.clear()
    return true
  } catch {
    return false
  }
}

export function getSessionItem(key, fallback = null) {
  try {
    return parseStoredValue(sessionStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

export function setSessionItem(key, value) {
  try {
    sessionStorage.setItem(key, serializeValue(value))
    return true
  } catch {
    return false
  }
}

export function removeSessionItem(key) {
  try {
    sessionStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
