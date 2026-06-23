import { Navigate, Outlet } from 'react-router-dom'
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
import { isAuthenticated } from './authController.js'

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
    path: '/keluar',
    element: <Logout />,
  },
]

export function ProtectedRoutes() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoutes() {
  return <Outlet />
}
