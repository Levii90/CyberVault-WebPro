import { NavLink } from 'react-router-dom'
import { menuBawah, menuFitur, menuUtama } from '../../models/navigationModel.js'
import { getCurrentUser } from '../../controllers/authController.js'
import { useEffect, useState } from 'react'
import { AUTH_USER_UPDATED_EVENT } from '../../services/auth/authService.js'
import {
  getUnreadNotificationCount,
  NOTIFICATIONS_UPDATED_EVENT,
} from '../../services/notifications/notificationService.js'

function buildNotificationBadge(unreadCount) {
  if (unreadCount <= 0) {
    return ''
  }

  return unreadCount > 99 ? '99+' : String(unreadCount)
}

function SidebarMenu({ items, unreadNotificationCount = 0 }) {
  return items.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      title={item.label}
      className={({ isActive }) => `cv-sidebar-menu-item${isActive ? ' active' : ''}`}
    >
      <i className={`bi ${item.icon}`} />
      <span className="cv-menu-text">{item.label}</span>
      {item.to === '/notifikasi' && unreadNotificationCount > 0 ? (
        <span className="cv-sidebar-badge">
          {buildNotificationBadge(unreadNotificationCount)}
        </span>
      ) : null}
    </NavLink>
  ))
}

function Sidebar({ collapsed = false }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(
    () => getUnreadNotificationCount(),
  )
  const displayName = currentUser?.name || currentUser?.username || 'Pengguna'
  const welcomeName = String(displayName).split(' ')[0] || 'Pengguna'

  useEffect(() => {
    const handleUserUpdated = () => {
      setCurrentUser(getCurrentUser())
    }

    const handleNotificationsUpdated = () => {
      setUnreadNotificationCount(getUnreadNotificationCount())
    }

    window.addEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated)
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated)
    window.addEventListener('storage', handleUserUpdated)

    return () => {
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated)
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated)
      window.removeEventListener('storage', handleUserUpdated)
    }
  }, [])

  return (
    <aside className={`cv-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="cv-sidebar-welcome">
        <h4>Welcome</h4>
        <p>{welcomeName}</p>
      </div>

      <nav className="cv-sidebar-nav" aria-label="Menu utama">
        <SidebarMenu items={menuUtama} unreadNotificationCount={unreadNotificationCount} />
      </nav>

      <div className="cv-sidebar-section">
        <p className="cv-sidebar-section__label cv-sidebar-section-title">
          Fitur Aplikasi
        </p>
        <nav className="cv-sidebar-nav" aria-label="Fitur aplikasi">
          <SidebarMenu items={menuFitur} unreadNotificationCount={unreadNotificationCount} />
        </nav>
      </div>

      <div className="cv-sidebar-bottom">
        <nav className="cv-sidebar-nav cv-sidebar-nav--secondary" aria-label="Menu bawah">
          <SidebarMenu items={menuBawah} unreadNotificationCount={unreadNotificationCount} />
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
