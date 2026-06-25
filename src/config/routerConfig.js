function normalizeBasename(value = '') {
  const trimmedValue = String(value).trim()

  if (!trimmedValue || trimmedValue === '/') {
    return '/'
  }

  return `/${trimmedValue.replace(/^\/+|\/+$/g, '')}`
}

export function getRouterBasename() {
  const configuredBasename = import.meta.env.VITE_ROUTER_BASENAME

  if (configuredBasename) {
    return normalizeBasename(configuredBasename)
  }

  if (typeof window === 'undefined') {
    return '/'
  }

  const normalizedPathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const distSegmentIndex = normalizedPathname.toLowerCase().indexOf('/dist')

  if (distSegmentIndex === -1) {
    return '/'
  }

  const detectedBasename = normalizedPathname.slice(0, distSegmentIndex + '/dist'.length)

  return normalizeBasename(detectedBasename)
}

export function getDefaultAppRoute(isLoggedIn) {
  return isLoggedIn ? '/dashboard' : '/login'
}
