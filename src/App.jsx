import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { isAuthenticated } from './controllers/authController.js'
import { dashboardRoutes, GuestRoutes, ProtectedRoutes } from './controllers/routeController.jsx'
import { getDefaultAppRoute, getRouterBasename } from './config/routerConfig.js'
import AuthLayout from './views/layouts/AuthLayout.jsx'
import DashboardLayout from './views/layouts/DashboardLayout.jsx'
import Login from './views/pages/Login.jsx'
import PusatEdukasi from './views/pages/PusatEdukasi'
import Register from './views/pages/Register.jsx'
import ResetPassword from './views/pages/ResetPassword.jsx'
import TidakDitemukanPage from './views/pages/TidakDitemukanPage.jsx'

function App() {
  const defaultRoute = getDefaultAppRoute(isAuthenticated())
  const routerBasename = getRouterBasename()

  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />

        <Route element={<GuestRoutes />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/pusat-edukasi" element={<PusatEdukasi />} />
            {dashboardRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<TidakDitemukanPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
