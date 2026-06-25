import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  alertStats,
  recommendedActions,
} from '../../data/alerts/alertData.js'
import {
  getAlertCategories,
  getAlertSeverityLevels,
  getAlertStatusOptions,
  getCyberAlerts,
  markAlertAsRead,
  saveAlert,
} from '../../services/alerts/alertService.js'
import '../../styles/InformasiPeringatanPage.css'

const DEFAULT_CATEGORY = 'Semua Kategori'
const DEFAULT_SEVERITY = 'Semua Tingkat'
const DEFAULT_STATUS = 'Semua Status'

function getSeverityTone(severity) {
  if (severity === 'Critical') {
    return 'critical'
  }

  if (severity === 'High') {
    return 'high'
  }

  if (severity === 'Medium') {
    return 'medium'
  }

  return 'low'
}

function getStatusLabel(alert) {
  if (alert.saved) {
    return 'Saved'
  }

  return alert.status === 'read' ? 'Read' : 'Unread'
}

function getStatusTone(alert) {
  if (alert.saved) {
    return 'saved'
  }

  return alert.status === 'read' ? 'read' : 'unread'
}

function InformasiPeringatan() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)
  const [activeSeverity, setActiveSeverity] = useState(DEFAULT_SEVERITY)
  const [activeStatus, setActiveStatus] = useState(DEFAULT_STATUS)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [categories, setCategories] = useState([DEFAULT_CATEGORY])
  const [severityLevels, setSeverityLevels] = useState([DEFAULT_SEVERITY])
  const [statusOptions, setStatusOptions] = useState([DEFAULT_STATUS])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    async function loadAlertData() {
      setIsLoading(true)

      try {
        const [
          alertsResponse,
          categoriesResponse,
          severityResponse,
          statusResponse,
        ] = await Promise.all([
          getCyberAlerts(),
          getAlertCategories(),
          getAlertSeverityLevels(),
          getAlertStatusOptions(),
        ])

        const nextAlerts = alertsResponse.data || []

        setAlerts(nextAlerts)
        setCategories(categoriesResponse.data || [DEFAULT_CATEGORY])
        setSeverityLevels(severityResponse.data || [DEFAULT_SEVERITY])
        setStatusOptions(statusResponse.data || [DEFAULT_STATUS])
        setSelectedAlert(nextAlerts[0] || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlertData()
  }, [])

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return alerts.filter((alert) => {
      const matchesCategory =
        activeCategory === DEFAULT_CATEGORY || alert.category === activeCategory
      const matchesSeverity =
        activeSeverity === DEFAULT_SEVERITY || alert.severity === activeSeverity
      const matchesStatus =
        activeStatus === DEFAULT_STATUS ||
        (activeStatus === 'saved' ? alert.saved : alert.status === activeStatus)

      if (!normalizedQuery) {
        return matchesCategory && matchesSeverity && matchesStatus
      }

      const searchableFields = [
        alert.title,
        alert.summary,
        alert.category,
        alert.severity,
        alert.recommendation,
        alert.impact,
        alert.affectedUsers,
        ...alert.tags,
      ]

      const matchesQuery = searchableFields.some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      )

      return matchesCategory && matchesSeverity && matchesStatus && matchesQuery
    })
  }, [activeCategory, activeSeverity, activeStatus, alerts, searchQuery])

  const summaryCards = useMemo(() => {
    const criticalHighCount = alerts.filter(
      (alert) => alert.severity === 'Critical' || alert.severity === 'High',
    ).length
    const unreadCount = alerts.filter((alert) => alert.status === 'unread').length
    const savedCount = alerts.filter((alert) => alert.saved).length

    return alertStats.map((item) => {
      if (item.id === 'criticalHigh') {
        return { ...item, value: criticalHighCount, note: 'Perlu perhatian cepat' }
      }

      if (item.id === 'unread') {
        return { ...item, value: unreadCount, note: 'Belum ditinjau pengguna' }
      }

      if (item.id === 'saved') {
        return { ...item, value: savedCount, note: 'Disimpan untuk tindak lanjut' }
      }

      return { ...item, value: alerts.length, note: 'Total alert yang tersedia' }
    })
  }, [alerts])

  const activePreview =
    filteredAlerts.find((alert) => alert.id === selectedAlert?.id) ||
    selectedAlert ||
    filteredAlerts[0] ||
    null

  async function handleMarkAsRead(alertId) {
    const response = await markAlertAsRead(alertId)

    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: response.data.status } : alert,
      ),
    )
    setSelectedAlert((currentSelected) =>
      currentSelected?.id === alertId
        ? { ...currentSelected, status: response.data.status }
        : currentSelected,
    )
    setFeedbackMessage(response.message)
  }

  async function handleSaveAlert(alertId) {
    const response = await saveAlert(alertId)

    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, saved: response.data.saved } : alert,
      ),
    )
    setSelectedAlert((currentSelected) =>
      currentSelected?.id === alertId
        ? { ...currentSelected, saved: response.data.saved }
        : currentSelected,
    )
    setFeedbackMessage(response.message)
  }

  function handleOpenAlert(alert) {
    setSelectedAlert(alert)
    setFeedbackMessage(`Preview alert "${alert.title}" berhasil dibuka.`)
  }

  function handleResetFilters() {
    setSearchQuery('')
    setActiveCategory(DEFAULT_CATEGORY)
    setActiveSeverity(DEFAULT_SEVERITY)
    setActiveStatus(DEFAULT_STATUS)
    setFeedbackMessage('Filter alert berhasil direset.')
  }

  return (
    <div className="cv-info-page">
      <section className="cv-info-hero">
        <div className="cv-info-hero__copy">
          <span className="cv-info-eyebrow">Cyber Alert Center</span>
          <h1>Pusat Informasi &amp; Peringatan Siber</h1>
          <p>
            Pantau alert ancaman digital, kebocoran data, dan pembaruan keamanan
            penting dalam satu halaman yang siap disambungkan ke backend alerts module.
          </p>
        </div>

        <div className="cv-info-hero__actions">
          {recommendedActions.map((action) => (
            <div key={action} className="cv-info-hero__action">
              <i className="bi bi-shield-check" aria-hidden="true" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cv-info-board">
        <div className="cv-info-toolbar">
          <label className="cv-info-search" htmlFor="cyber-alert-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              id="cyber-alert-search"
              type="search"
              placeholder="Cari alert phishing, akun, QRIS, malware, atau rekomendasi..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <button
            type="button"
            className="cv-info-button cv-info-button--ghost"
            onClick={handleResetFilters}
          >
            Reset Filter
          </button>
        </div>

        <div className="cv-info-filter-block">
          <div className="cv-info-filter-group">
            <span>Kategori</span>
            <div className="cv-info-chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`cv-info-filter-chip${
                    activeCategory === category ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="cv-info-filter-group">
            <span>Severity</span>
            <div className="cv-info-chip-row">
              {severityLevels.map((severity) => (
                <button
                  key={severity}
                  type="button"
                  className={`cv-info-filter-chip${
                    activeSeverity === severity ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveSeverity(severity)}
                >
                  {severity}
                </button>
              ))}
            </div>
          </div>

          <div className="cv-info-filter-group">
            <span>Status</span>
            <div className="cv-info-chip-row">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`cv-info-filter-chip${
                    activeStatus === status ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cv-info-summary-grid">
          {summaryCards.map((item) => (
            <article key={item.id} className={`cv-info-summary-card is-${item.tone}`}>
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <div>
                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <small>{item.note}</small>
              </div>
            </article>
          ))}
        </div>

        {feedbackMessage ? (
          <div className="cv-info-feedback" role="status">
            {feedbackMessage}
          </div>
        ) : null}

        <div className="cv-info-content">
          <section className="cv-info-list-section">
            <div className="cv-info-section__head">
              <h2>Cyber Alert Feed</h2>
              <span>{filteredAlerts.length} alert cocok dengan filter saat ini</span>
            </div>

            {isLoading ? (
              <div className="cv-info-empty-state">
                <i className="bi bi-arrow-repeat" aria-hidden="true" />
                <h3>Memuat alert siber...</h3>
                <p>Data mock sedang disiapkan untuk preview halaman informasi peringatan.</p>
              </div>
            ) : null}

            {!isLoading && filteredAlerts.length === 0 ? (
              <div className="cv-info-empty-state">
                <i className="bi bi-inboxes" aria-hidden="true" />
                <h3>Tidak ada alert yang cocok</h3>
                <p>
                  Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh
                  alert yang tersedia.
                </p>
              </div>
            ) : null}

            {!isLoading && filteredAlerts.length > 0 ? (
              <div className="cv-info-alert-grid">
                {filteredAlerts.map((alert) => (
                  <article
                    key={alert.id}
                    className={`cv-info-alert-card${
                      activePreview?.id === alert.id ? ' is-selected' : ''
                    }`}
                    onClick={() => handleOpenAlert(alert)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenAlert(alert)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cv-info-alert-card__badges">
                      <span className={`cv-info-chip is-${getSeverityTone(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`cv-info-chip is-status-${getStatusTone(alert)}`}>
                        {getStatusLabel(alert)}
                      </span>
                    </div>

                    <div className="cv-info-alert-card__copy">
                      <span className="cv-info-alert-card__category">{alert.category}</span>
                      <h3>{alert.title}</h3>
                      <p>{alert.summary}</p>
                    </div>

                    <div className="cv-info-alert-card__meta">
                      <span>{alert.source}</span>
                      <strong>{alert.publishedAt}</strong>
                    </div>

                    <div className="cv-info-tag-list">
                      {alert.tags.map((tag) => (
                        <span key={`${alert.id}-${tag}`} className="cv-info-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="cv-info-alert-card__footer">
                      <button
                        type="button"
                        className="cv-info-button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleOpenAlert(alert)
                        }}
                      >
                        Baca Detail
                      </button>
                      <button
                        type="button"
                        className="cv-info-link-button"
                        onClick={async (event) => {
                          event.stopPropagation()
                          await handleMarkAsRead(alert.id)
                        }}
                      >
                        Tandai Dibaca
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <aside className="cv-info-preview-panel">
            {activePreview ? (
              <>
                <div className="cv-info-preview-panel__header">
                  <div>
                    <span className="cv-info-preview-panel__eyebrow">
                      Detail Alert Terpilih
                    </span>
                    <h2>{activePreview.title}</h2>
                  </div>
                  <div className="cv-info-preview-panel__badges">
                    <span
                      className={`cv-info-chip is-${getSeverityTone(activePreview.severity)}`}
                    >
                      {activePreview.severity}
                    </span>
                    <span
                      className={`cv-info-chip is-status-${getStatusTone(activePreview)}`}
                    >
                      {getStatusLabel(activePreview)}
                    </span>
                  </div>
                </div>

                <div className="cv-info-preview-panel__meta">
                  <span>{activePreview.category}</span>
                  <span>{activePreview.source}</span>
                  <span>{activePreview.publishedAt}</span>
                </div>

                <div className="cv-info-preview-panel__section">
                  <h3>Ringkasan</h3>
                  <p>{activePreview.summary}</p>
                </div>

                <div className="cv-info-preview-panel__section">
                  <h3>Dampak</h3>
                  <p>{activePreview.impact}</p>
                </div>

                <div className="cv-info-preview-panel__section">
                  <h3>Rekomendasi</h3>
                  <p>{activePreview.recommendation}</p>
                </div>

                <div className="cv-info-preview-panel__section">
                  <h3>Pengguna Terdampak</h3>
                  <p>{activePreview.affectedUsers}</p>
                </div>

                <div className="cv-info-tag-list">
                  {activePreview.tags.map((tag) => (
                    <span key={`preview-${tag}`} className="cv-info-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="cv-info-preview-panel__actions">
                  <button
                    type="button"
                    className="cv-info-button"
                    onClick={() => handleMarkAsRead(activePreview.id)}
                  >
                    Tandai Dibaca
                  </button>
                  <button
                    type="button"
                    className="cv-info-button cv-info-button--ghost"
                    onClick={() => handleSaveAlert(activePreview.id)}
                  >
                    Simpan Alert
                  </button>
                  <button
                    type="button"
                    className="cv-info-link-button"
                    onClick={() => navigate('/pelaporan-insiden')}
                  >
                    Buat Laporan Terkait
                  </button>
                </div>
              </>
            ) : (
              <div className="cv-info-empty-state cv-info-empty-state--compact">
                <i className="bi bi-shield-exclamation" aria-hidden="true" />
                <h3>Pilih salah satu alert</h3>
                <p>Detail alert akan tampil di panel ini setelah Anda membuka preview.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

export default InformasiPeringatan
