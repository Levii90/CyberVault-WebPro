import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationStats } from '../../data/notifications/notificationData.js'
import {
  archiveNotification,
  deleteNotification,
  getNotificationPriorityOptions,
  getNotifications,
  getNotificationStatusOptions,
  getNotificationTypes,
  markAllAsRead,
  markAsRead,
  markAsUnread,
} from '../../services/notifications/notificationService.js'
import '../../styles/NotifikasiPage.css'

const DEFAULT_TYPE = 'Semua Tipe'
const DEFAULT_STATUS = 'Semua Status'
const DEFAULT_PRIORITY = 'Semua Prioritas'

function getBadgeLabel(value) {
  if (value === 'unread' || value === 'read' || value === 'archived') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  if (value === 'high' || value === 'medium' || value === 'low') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function Notifikasi() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [types, setTypes] = useState([DEFAULT_TYPE])
  const [statusOptions, setStatusOptions] = useState([DEFAULT_STATUS])
  const [priorityOptions, setPriorityOptions] = useState([DEFAULT_PRIORITY])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState(DEFAULT_TYPE)
  const [activeStatus, setActiveStatus] = useState(DEFAULT_STATUS)
  const [activePriority, setActivePriority] = useState(DEFAULT_PRIORITY)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    async function loadNotificationCenter() {
      setIsLoading(true)

      try {
        const [
          notificationsResponse,
          typesResponse,
          statusResponse,
          priorityResponse,
        ] = await Promise.all([
          getNotifications(),
          getNotificationTypes(),
          getNotificationStatusOptions(),
          getNotificationPriorityOptions(),
        ])

        const nextNotifications = notificationsResponse.data || []

        setNotifications(nextNotifications)
        setTypes(typesResponse.data || [DEFAULT_TYPE])
        setStatusOptions(statusResponse.data || [DEFAULT_STATUS])
        setPriorityOptions(priorityResponse.data || [DEFAULT_PRIORITY])
        setSelectedNotification(nextNotifications[0] || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotificationCenter()
  }, [])

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return notifications.filter((item) => {
      const matchesType = activeType === DEFAULT_TYPE || item.type === activeType
      const matchesStatus = activeStatus === DEFAULT_STATUS || item.status === activeStatus
      const matchesPriority =
        activePriority === DEFAULT_PRIORITY || item.priority === activePriority

      if (!normalizedQuery) {
        return matchesType && matchesStatus && matchesPriority
      }

      const searchableFields = [
        item.title,
        item.message,
        item.source,
        item.type,
        item.priority,
        item.metadata?.category,
        item.metadata?.severity,
      ]

      const matchesQuery = searchableFields.some((value) =>
        String(value || '').toLowerCase().includes(normalizedQuery),
      )

      return matchesType && matchesStatus && matchesPriority && matchesQuery
    })
  }, [activePriority, activeStatus, activeType, notifications, searchQuery])

  const summaryCards = useMemo(() => {
    const unreadCount = notifications.filter((item) => item.status === 'unread').length
    const highCount = notifications.filter((item) => item.priority === 'high').length
    const archivedCount = notifications.filter((item) => item.status === 'archived').length
    const todayCount = notifications.filter((item) => item.createdAt.startsWith('2026-06-24')).length

    return notificationStats.map((item) => {
      if (item.id === 'unread') {
        return { ...item, value: unreadCount, note: 'Perlu ditinjau' }
      }

      if (item.id === 'high') {
        return { ...item, value: highCount, note: 'Prioritas tinggi aktif' }
      }

      if (item.id === 'archived') {
        return { ...item, value: archivedCount, note: 'Masuk arsip lokal' }
      }

      if (item.id === 'today') {
        return { ...item, value: todayCount, note: 'Masuk hari ini' }
      }

      return { ...item, value: notifications.length, note: 'Total feed notifikasi' }
    })
  }, [notifications])

  const activeNotification =
    filteredNotifications.find((item) => item.id === selectedNotification?.id) ||
    selectedNotification ||
    filteredNotifications[0] ||
    null

  function resetFilters() {
    setSearchQuery('')
    setActiveType(DEFAULT_TYPE)
    setActiveStatus(DEFAULT_STATUS)
    setActivePriority(DEFAULT_PRIORITY)
    setFeedbackMessage('Filter notifikasi berhasil direset.')
  }

  async function handleMarkAsRead(notificationId) {
    const response = await markAsRead(notificationId)

    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, status: response.data.status } : item,
      ),
    )
    setSelectedNotification((current) =>
      current?.id === notificationId ? { ...current, status: response.data.status } : current,
    )
    setFeedbackMessage(response.message)
  }

  async function handleMarkAsUnread(notificationId) {
    const response = await markAsUnread(notificationId)

    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, status: response.data.status } : item,
      ),
    )
    setSelectedNotification((current) =>
      current?.id === notificationId ? { ...current, status: response.data.status } : current,
    )
    setFeedbackMessage(response.message)
  }

  async function handleMarkAllAsRead() {
    const response = await markAllAsRead()

    setNotifications((current) =>
      current.map((item) =>
        item.status === 'unread' ? { ...item, status: response.data.status } : item,
      ),
    )
    setSelectedNotification((current) =>
      current?.status === 'unread' ? { ...current, status: response.data.status } : current,
    )
    setFeedbackMessage(response.message)
  }

  async function handleArchive(notificationId) {
    const response = await archiveNotification(notificationId)

    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, status: response.data.status } : item,
      ),
    )
    setSelectedNotification((current) =>
      current?.id === notificationId ? { ...current, status: response.data.status } : current,
    )
    setFeedbackMessage(response.message)
  }

  async function handleDelete(notificationId) {
    const response = await deleteNotification(notificationId)

    setNotifications((current) => current.filter((item) => item.id !== notificationId))
    setSelectedNotification((current) => (current?.id === notificationId ? null : current))
    setFeedbackMessage(response.message)
  }

  return (
    <div className="cv-notification-center">
      <section className="cv-notification-hero">
        <div className="cv-notification-hero__copy">
          <span className="cv-notification-eyebrow">Notification Center</span>
          <h1>Pusat Notifikasi</h1>
          <p>
            Pantau alert, reminder, update forum, hasil asesmen, dan aktivitas akun
            dalam satu feed yang siap dihubungkan ke backend notifications module nanti.
          </p>
        </div>

        <div className="cv-notification-hero__actions">
          <button
            type="button"
            className="cv-notification-primary-button"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </button>
          <button
            type="button"
            className="cv-notification-secondary-button"
            onClick={resetFilters}
          >
            Reset Filter
          </button>
        </div>
      </section>

      {feedbackMessage ? (
        <div className="cv-notification-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="cv-notification-summary-grid">
        {summaryCards.map((item) => (
          <article key={item.id} className="cv-notification-summary-card">
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <div>
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-notification-toolbar">
        <label className="cv-notification-search" htmlFor="notification-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            id="notification-search"
            type="search"
            value={searchQuery}
            placeholder="Cari phishing, sertifikat, forum, akun..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="cv-notification-filter-group">
          <span>Tipe</span>
          <div className="cv-notification-chip-row">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className={`cv-notification-filter-chip${
                  activeType === type ? ' is-active' : ''
                }`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="cv-notification-filter-group">
          <span>Status</span>
          <div className="cv-notification-chip-row">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className={`cv-notification-filter-chip${
                  activeStatus === status ? ' is-active' : ''
                }`}
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="cv-notification-filter-group">
          <span>Prioritas</span>
          <div className="cv-notification-chip-row">
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                type="button"
                className={`cv-notification-filter-chip${
                  activePriority === priority ? ' is-active' : ''
                }`}
                onClick={() => setActivePriority(priority)}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-notification-layout">
        <article className="cv-notification-panel">
          <div className="cv-notification-panel__head">
            <h2>Daftar Notifikasi</h2>
            <span>{filteredNotifications.length} item sesuai filter</span>
          </div>

          {isLoading ? (
            <div className="cv-notification-empty-state">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>Memuat notifikasi...</h3>
              <p>Notification center sedang disiapkan untuk mode demo.</p>
            </div>
          ) : null}

          {!isLoading && filteredNotifications.length === 0 ? (
            <div className="cv-notification-empty-state">
              <i className="bi bi-inboxes" aria-hidden="true" />
              <h3>Tidak ada notifikasi yang cocok</h3>
              <p>Coba ubah kata kunci atau reset filter untuk melihat semua notifikasi.</p>
            </div>
          ) : null}

          {!isLoading && filteredNotifications.length > 0 ? (
            <div className="cv-notification-list">
              {filteredNotifications.map((item) => (
                <article
                  key={item.id}
                  className={`cv-notification-item${
                    item.status === 'unread' ? ' is-unread' : ''
                  }${activeNotification?.id === item.id ? ' is-selected' : ''}`}
                  onClick={() => setSelectedNotification(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedNotification(item)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cv-notification-item__top">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.message}</p>
                    </div>
                    <div className="cv-notification-item__badges">
                      <span className={`cv-notification-chip is-${item.type}`}>
                        {getBadgeLabel(item.type)}
                      </span>
                      <span className={`cv-notification-chip is-priority-${item.priority}`}>
                        {getBadgeLabel(item.priority)}
                      </span>
                      <span className={`cv-notification-chip is-status-${item.status}`}>
                        {getBadgeLabel(item.status)}
                      </span>
                    </div>
                  </div>

                  <div className="cv-notification-item__meta">
                    <span>{item.source}</span>
                    <strong>{item.createdAt.replace('T', ' • ').slice(0, 16)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="cv-notification-panel cv-notification-panel--detail">
          <div className="cv-notification-panel__head">
            <h2>Detail Notifikasi</h2>
          </div>

          {activeNotification ? (
            <div className="cv-notification-detail">
              <div className="cv-notification-detail__header">
                <div className="cv-notification-item__badges">
                  <span className={`cv-notification-chip is-${activeNotification.type}`}>
                    {getBadgeLabel(activeNotification.type)}
                  </span>
                  <span
                    className={`cv-notification-chip is-priority-${activeNotification.priority}`}
                  >
                    {getBadgeLabel(activeNotification.priority)}
                  </span>
                  <span className={`cv-notification-chip is-status-${activeNotification.status}`}>
                    {getBadgeLabel(activeNotification.status)}
                  </span>
                </div>

                <h3>{activeNotification.title}</h3>
                <p>{activeNotification.message}</p>
              </div>

              <div className="cv-notification-detail__meta">
                <span>Sumber: {activeNotification.source}</span>
                <span>Waktu: {activeNotification.createdAt.replace('T', ' • ').slice(0, 16)}</span>
                <span>Kategori: {activeNotification.metadata?.category || '-'}</span>
                <span>Severity: {activeNotification.metadata?.severity || '-'}</span>
              </div>

              <div className="cv-notification-detail__actions">
                {activeNotification.status !== 'read' ? (
                  <button
                    type="button"
                    className="cv-notification-primary-button"
                    onClick={() => handleMarkAsRead(activeNotification.id)}
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cv-notification-secondary-button"
                    onClick={() => handleMarkAsUnread(activeNotification.id)}
                  >
                    Mark as Unread
                  </button>
                )}

                <button
                  type="button"
                  className="cv-notification-secondary-button"
                  onClick={() => handleArchive(activeNotification.id)}
                >
                  Archive
                </button>

                <button
                  type="button"
                  className="cv-notification-secondary-button"
                  onClick={() => handleDelete(activeNotification.id)}
                >
                  Delete
                </button>
              </div>

              {activeNotification.relatedRoute ? (
                <button
                  type="button"
                  className="cv-notification-primary-button"
                  onClick={() => navigate(activeNotification.relatedRoute)}
                >
                  {activeNotification.actionLabel || 'Buka Halaman Terkait'}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="cv-notification-empty-state">
              <i className="bi bi-bell-slash" aria-hidden="true" />
              <h3>Tidak ada detail aktif</h3>
              <p>Pilih salah satu notifikasi dari daftar untuk membuka preview detailnya.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default Notifikasi
