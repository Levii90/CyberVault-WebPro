import { NavLink } from 'react-router-dom'
import { menuBawah, menuFitur, menuUtama } from '../../models/navigationModel.js'

function SidebarMenu({ items }) {
  return items.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      title={item.label}
      className={({ isActive }) => `cv-sidebar-menu-item${isActive ? ' active' : ''}`}
    >
      <i className={`bi ${item.icon}`} />
      <span className="cv-menu-text">{item.label}</span>
      {item.badge ? <span className="cv-sidebar-badge">{item.badge}</span> : null}
    </NavLink>
  ))
}

function Sidebar({ collapsed = false }) {
  return (
    <aside className={`cv-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="cv-sidebar-welcome">
        <h4>Welcome</h4>
        <p>Maman</p>
      </div>

      <nav className="cv-sidebar-nav" aria-label="Menu utama">
        <SidebarMenu items={menuUtama} />
      </nav>

      <div className="cv-sidebar-section">
        <p className="cv-sidebar-section__label cv-sidebar-section-title">
          Fitur Aplikasi
        </p>
        <nav className="cv-sidebar-nav" aria-label="Fitur aplikasi">
          <SidebarMenu items={menuFitur} />
        </nav>
      </div>

      <div className="cv-sidebar-bottom">
        <nav className="cv-sidebar-nav cv-sidebar-nav--secondary" aria-label="Menu bawah">
          <SidebarMenu items={menuBawah} />
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
