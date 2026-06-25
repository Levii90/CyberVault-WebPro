import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { searchCyberVault } from '../../services/search/searchService.js'
import { getCurrentUser } from '../../controllers/authController.js'
import { AUTH_USER_UPDATED_EVENT } from '../../services/auth/authService.js'

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const displayName = currentUser?.name || currentUser?.username || 'CyberVault User'
  const avatarLabel = String(displayName)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CV'

  const results = useMemo(() => searchCyberVault(query), [query])
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleUserUpdated = () => {
      setCurrentUser(getCurrentUser())
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated)
    window.addEventListener('storage', handleUserUpdated)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated)
      window.removeEventListener('storage', handleUserUpdated)
    }
  }, [])

  const handleChange = (event) => {
    setQuery(event.target.value)
    setIsOpen(true)
  }

  const handleNavigate = (path) => {
    setIsOpen(false)
    setQuery('')
    setFeedback('')
    navigate(path)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    if (!hasQuery) {
      inputRef.current?.focus()
      setFeedback('Masukkan kata kunci untuk mencari fitur CyberVault.')
      return
    }

    if (results.length > 0) {
      handleNavigate(results[0].path)
      return
    }

    setIsOpen(true)
    setFeedback('Belum ada hasil yang cocok. Coba kata kunci lain.')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event)
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <header className="cv-navbar">
      <div className="cv-navbar-left">
        <button className="cv-menu-button" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>

        <img src={logo} alt="CyberVault Logo" className="cv-navbar-logo-img" />

        <span className="cv-navbar-brand">CyberVault</span>
      </div>

      <div ref={containerRef} className="cv-navbar-search">
        <form className="cv-navbar-search__field" onSubmit={handleSearchSubmit}>
          <i className="bi bi-search cv-navbar-search__icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Cari fitur CyberVault"
            onChange={handleChange}
            onFocus={() => {
              setIsOpen(true)
              setFeedback('')
            }}
            onKeyDown={handleKeyDown}
            aria-label="Cari fitur CyberVault"
            aria-expanded={isOpen}
            aria-controls="cv-navbar-search-results"
          />
          <button
            type="submit"
            className="cv-navbar-search__submit"
            aria-label="Cari"
          >
            Cari
          </button>
          {hasQuery ? (
            <button
              type="button"
              className="cv-navbar-search__clear"
              aria-label="Hapus pencarian"
              title="Hapus pencarian"
              onClick={() => {
                setQuery('')
                setIsOpen(false)
                setFeedback('')
                inputRef.current?.focus()
              }}
            >
              <i className="bi bi-x-lg" />
            </button>
          ) : null}
        </form>

        {feedback ? <div className="cv-navbar-search__feedback">{feedback}</div> : null}

        {isOpen && hasQuery ? (
          <div id="cv-navbar-search-results" className="cv-navbar-search__dropdown">
            {results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="cv-navbar-search__result"
                  onClick={() => handleNavigate(item.path)}
                >
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </button>
              ))
            ) : (
              <div className="cv-navbar-search__empty">Tidak ada hasil ditemukan</div>
            )}
          </div>
        ) : null}
      </div>

      <div className="cv-navbar-right">
        <button
          type="button"
          className="cv-navbar-icon-btn"
          aria-label="Notifikasi"
          onClick={() => navigate('/notifikasi')}
        >
          <i className="bi bi-bell" />
        </button>

        <button
          type="button"
          className="cv-navbar-profile"
          aria-label="Buka profil akun"
          onClick={() => navigate('/akun')}
        >
          <div className="cv-navbar-profile__avatar">{avatarLabel}</div>
          <span className="cv-navbar-profile__name">{displayName}</span>
          <i className="bi bi-chevron-down cv-navbar-profile__chevron" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
