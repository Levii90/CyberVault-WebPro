import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Akun from '../views/pages/Akun.jsx'
import Asesmen from '../views/pages/Asesmen.jsx'
import Dashboard from '../views/pages/Dashboard.jsx'
import Forum from '../views/pages/Forum.jsx'
import InformasiPeringatan from '../views/pages/InformasiPeringatan.jsx'
import Logout from '../views/pages/Logout.jsx'
import Notifikasi from '../views/pages/Notifikasi.jsx'
import PelaporanInsiden from '../views/pages/PelaporanInsiden.jsx'
import Pengaturan from '../views/pages/Pengaturan.jsx'
import PusatBantuan from '../views/pages/PusatBantuan.jsx'
import SertifikatPenilaian from '../views/pages/SertifikatPenilaian.jsx'
import Timeline from '../views/pages/Timeline.jsx'
import {
  clearAuth,
  hasAuthToken,
  isAuthenticated,
  validateSession as validateAuthSession,
} from './authController.js'
import { isBackendAuthMode } from '../config/authConfig.js'

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/timeline',
    element: <Timeline />,
  },
  {
    path: '/pelaporan-insiden',
    element: <PelaporanInsiden />,
  },
  {
    path: '/akun',
    element: <Akun />,
  },
  {
    path: '/notifikasi',
    element: <Notifikasi />,
  },
  {
    path: '/informasi-peringatan',
    element: <InformasiPeringatan />,
  },
  {
    path: '/sertifikat-penilaian',
    element: <SertifikatPenilaian />,
  },
  {
    path: '/forum',
    element: <Forum />,
  },
  {
    path: '/asesmen',
    element: <Asesmen />,
  },
  {
    path: '/pengaturan',
    element: <Pengaturan />,
  },
  {
    path: '/pusat-bantuan',
    element: <PusatBantuan />,
  },
  {
    path: '/pelaporan-insiden-digital',
    element: <Navigate to="/pelaporan-insiden" replace />,
  },
  {
    path: '/pusat-informasi-dan-peringatan',
    element: <Navigate to="/informasi-peringatan" replace />,
  },
  {
    path: '/sertifikat-dan-penilaian',
    element: <Navigate to="/sertifikat-penilaian" replace />,
  },
  {
    path: '/forum-kesadaran-digital',
    element: <Navigate to="/forum" replace />,
  },
  {
    path: '/asesmen-keamanan-digital',
    element: <Navigate to="/asesmen" replace />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/keluar',
    element: <Navigate to="/logout" replace />,
  },
]

export function ProtectedRoutes() {
  const [guardState, setGuardState] = useState(() => {
    if (!isAuthenticated() || (isBackendAuthMode() && !hasAuthToken())) {
      return 'unauthenticated'
    }

    return isBackendAuthMode() ? 'checking' : 'authenticated'
  })

  useEffect(() => {
    let isActive = true

    async function checkProtectedAccess() {
      if (!isAuthenticated() || (isBackendAuthMode() && !hasAuthToken())) {
        if (isActive) {
          setGuardState('unauthenticated')
        }
        return
      }

      if (!isBackendAuthMode()) {
        if (isActive) {
          setGuardState('authenticated')
        }
        return
      }

      const response = await validateAuthSession()

      if (!isActive) {
        return
      }

      if (response?.authenticated) {
        setGuardState('authenticated')
        return
      }

      if (response?.isAuthError) {
        clearAuth()
        setGuardState('unauthenticated')
        return
      }

      if (response?.status === null) {
        setGuardState('authenticated')
        return
      }

      setGuardState('unauthenticated')
    }

    checkProtectedAccess()

    return () => {
      isActive = false
    }
  }, [])

  if (guardState === 'checking') {
    return (
      <div className="cv-auth-guard-loading">
        <div className="container py-5 text-center">
          <p className="mb-0">Memeriksa sesi login...</p>
        </div>
      </div>
    )
  }

  return guardState === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoutes() {
  const [shouldRedirect, setShouldRedirect] = useState(
    () => isAuthenticated() && (!isBackendAuthMode() || hasAuthToken()),
  )

  useEffect(() => {
    let isActive = true

    async function checkGuestAccess() {
      if (!isAuthenticated() || (isBackendAuthMode() && !hasAuthToken())) {
        if (isActive) {
          setShouldRedirect(false)
        }
        return
      }

      if (!isBackendAuthMode()) {
        if (isActive) {
          setShouldRedirect(true)
        }
        return
      }

      const response = await validateAuthSession()

      if (!isActive) {
        return
      }

      if (response?.authenticated) {
        setShouldRedirect(true)
        return
      }

      if (response?.isAuthError) {
        clearAuth()
      }

      if (response?.status === null) {
        setShouldRedirect(false)
        return
      }

      setShouldRedirect(false)
    }

    checkGuestAccess()

    return () => {
      isActive = false
    }
  }, [])

  return shouldRedirect ? <Navigate to="/dashboard" replace /> : <Outlet />
}
