import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import timelineHero from '../../../WhatsApp Image 2026-06-10 at 16.50.02.jpeg'
import timelineChart from '../../../WhatsApp Image 2026-06-10 at 16.52.06.jpeg'
import '../../styles/TimelinePage.css'
import {
  getActivityById,
  getTimelineActivities,
  getTimelineFilters,
  getTimelineStats,
  markActivityAsReviewed,
} from '../../services/timeline/timelineService.js'

function formatActivityDate(value) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getTypeLabel(type) {
  const labels = {
    learning: 'Learning',
    assessment: 'Assessment',
    certificate: 'Certificate',
    incident: 'Incident',
    alert: 'Alert',
    forum: 'Forum',
    account: 'Account',
    system: 'System',
  }

  return labels[type] || type
}

function getStatusLabel(status) {
  const labels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    pending: 'Pending',
    updated: 'Updated',
    warning: 'Warning',
  }

  return labels[status] || status
}

function getActionLabel(actionLabel) {
  const normalizedLabel = String(actionLabel || '').trim()
  return normalizedLabel || 'Buka Halaman'
}

function isWithinRange(createdAt, activeRange) {
  if (activeRange === 'all') {
    return true
  }

  const createdDate = new Date(createdAt)
  const now = new Date()
  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  if (activeRange === 'today') {
    return createdDate.toDateString() === now.toDateString()
  }

  if (activeRange === '7d') {
    return diffInDays <= 7
  }

  if (activeRange === '30d') {
    return diffInDays <= 30
  }

  return true
}

function stringifyMetadata(metadata) {
  return Object.values(metadata || {})
    .map((value) => String(value))
    .join(' ')
    .toLowerCase()
}

function Timeline() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [activities, setActivities] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    statuses: [],
    ranges: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeRange, setActiveRange] = useState('all')
  const [selectedActivityId, setSelectedActivityId] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    async function loadTimelinePage() {
      setIsLoading(true)

      try {
        const [statsResponse, activitiesResponse, filtersResponse] = await Promise.all([
          getTimelineStats(),
          getTimelineActivities(),
          getTimelineFilters(),
        ])

        const nextActivities = activitiesResponse.data || []

        setStats(statsResponse.data || [])
        setActivities(nextActivities)
        setFilterOptions(filtersResponse.data || { types: [], statuses: [], ranges: [] })
        setSelectedActivityId(nextActivities[0]?.id || '')
        setSelectedActivity(nextActivities[0] || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadTimelinePage()
  }, [])

  const filteredActivities = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return activities.filter((activity) => {
      const matchesType = activeType === 'all' || activity.type === activeType
      const matchesStatus = activeStatus === 'all' || activity.status === activeStatus
      const matchesRange = isWithinRange(activity.createdAt, activeRange)

      if (!normalizedQuery) {
        return matchesType && matchesStatus && matchesRange
      }

      const searchableContent = [
        activity.title,
        activity.description,
        activity.source,
        activity.type,
        activity.status,
        stringifyMetadata(activity.metadata),
      ]
        .join(' ')
        .toLowerCase()

      return (
        matchesType &&
        matchesStatus &&
        matchesRange &&
        searchableContent.includes(normalizedQuery)
      )
    })
  }, [activeRange, activeStatus, activeType, activities, searchQuery])

  useEffect(() => {
    async function syncSelectedActivity() {
      if (!filteredActivities.length) {
        setSelectedActivityId('')
        setSelectedActivity(null)
        return
      }

      const fallbackActivity = filteredActivities[0]
      const nextSelectedId = filteredActivities.some((item) => item.id === selectedActivityId)
        ? selectedActivityId
        : fallbackActivity.id

      const response = await getActivityById(nextSelectedId)
      setSelectedActivityId(nextSelectedId)
      setSelectedActivity(response.data || fallbackActivity)
    }

    syncSelectedActivity()
  }, [filteredActivities, selectedActivityId])

  const overviewCards = useMemo(() => {
    const reviewedCount = activities.filter((item) => item.reviewed).length
    const highPriorityCount = activities.filter((item) => item.priority === 'high').length
    const touchedModules = new Set(activities.map((item) => item.source)).size
    const latestActivity = activities[0]

    return [
      {
        id: 'visible',
        title: 'Aktivitas Terlihat',
        value: String(filteredActivities.length),
        note: 'Menyesuaikan search dan filter aktif',
      },
      {
        id: 'reviewed',
        title: 'Sudah Ditinjau',
        value: String(reviewedCount),
        note: 'Aktivitas yang sudah diberi status reviewed mock',
      },
      {
        id: 'priority',
        title: 'Prioritas Tinggi',
        value: String(highPriorityCount),
        note: 'Perlu ditinjau lebih cepat',
      },
      {
        id: 'modules',
        title: 'Source Aktif',
        value: String(touchedModules),
        note: latestActivity ? `Aktivitas terbaru dari ${latestActivity.source}` : 'Belum ada data',
      },
    ]
  }, [activities, filteredActivities.length])

  async function handleSelectActivity(activityId) {
    const response = await getActivityById(activityId)

    if (response.data) {
      setSelectedActivityId(activityId)
      setSelectedActivity(response.data)
      setFeedbackMessage(`Preview aktivitas "${response.data.title}" berhasil dibuka.`)
    }
  }

  function handleResetFilters() {
    setSearchQuery('')
    setActiveType('all')
    setActiveStatus('all')
    setActiveRange('all')
    setFeedbackMessage('Filter timeline berhasil direset.')
  }

  async function handleMarkReviewed() {
    if (!selectedActivity) {
      return
    }

    const response = await markActivityAsReviewed(selectedActivity.id)

    setActivities((currentActivities) =>
      currentActivities.map((item) =>
        item.id === response.data.activityId
          ? {
              ...item,
              reviewed: response.data.reviewed,
              status: response.data.status,
            }
          : item,
      ),
    )
    setSelectedActivity((currentSelected) =>
      currentSelected
        ? {
            ...currentSelected,
            reviewed: response.data.reviewed,
            status: response.data.status,
          }
        : currentSelected,
    )
    setFeedbackMessage(response.message)
  }

  return (
    <div className="cv-dashboard-container cv-timeline-page cv-timeline-page--restored">
      <section className="cv-timeline-hero">
        <div className="cv-hero-text">
          <div className="cv-hero-greeting">Activity Timeline</div>
          <h1>Timeline Aktivitas CyberVault</h1>
          <p>
            Pantau riwayat belajar, asesmen, sertifikat, insiden, forum, alert, akun,
            dan sistem dalam satu halaman yang tetap ringkas dan mudah ditindaklanjuti.
          </p>
        </div>

        <div className="cv-timeline-hero-image">
          <img src={timelineHero} alt="Ilustrasi Timeline Aktivitas CyberVault" />
        </div>
      </section>

      {feedbackMessage ? (
        <div className="cv-timeline-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="cv-timeline-summary-grid">
        {stats.map((item) => (
          <article key={item.id} className="cv-timeline-summary-card">
            <div className="cv-icon-box">
              <i className={`bi ${item.icon}`} />
            </div>
            <div>
              <p className="cv-stat-card__title">{item.title}</p>
              <h3 className="cv-stat-card__value">{item.value}</h3>
              <p className="cv-stat-card__note">{item.note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-roadmap-section">
        <div className="cv-section-head">
          <h3>Feed Aktivitas CyberVault</h3>
          <button type="button" className="cv-chip-button" onClick={handleResetFilters}>
            Reset Filter
          </button>
        </div>

        <div className="cv-timeline-toolbar">
          <label className="cv-timeline-search" htmlFor="timeline-search">
            <span>Cari Aktivitas</span>
            <div className="cv-timeline-search__field">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                id="timeline-search"
                type="search"
                placeholder="Cari asesmen, sertifikat, forum, alert, atau akun..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </label>

          <div className="cv-timeline-filter-stack">
            <div className="cv-timeline-filter-group">
              <span>Tipe</span>
              <div className="cv-timeline-filter-row">
                {filterOptions.types.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`cv-timeline-filter-chip${
                      activeType === item.id ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveType(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cv-timeline-filter-group">
              <span>Status</span>
              <div className="cv-timeline-filter-row">
                {filterOptions.statuses.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`cv-timeline-filter-chip${
                      activeStatus === item.id ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveStatus(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cv-timeline-filter-group">
              <span>Rentang Waktu</span>
              <div className="cv-timeline-filter-row">
                {filterOptions.ranges.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`cv-timeline-filter-chip${
                      activeRange === item.id ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveRange(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="cv-timeline-empty-state">
            <i className="bi bi-arrow-repeat" aria-hidden="true" />
            <h3>Memuat aktivitas timeline...</h3>
            <p>Riwayat aktivitas lintas modul sedang disiapkan untuk mode demo.</p>
          </div>
        ) : null}

        {!isLoading && filteredActivities.length === 0 ? (
          <div className="cv-timeline-empty-state">
            <i className="bi bi-inboxes" aria-hidden="true" />
            <h3>Tidak ada aktivitas yang cocok</h3>
            <p>Coba ubah kata kunci atau reset filter untuk melihat seluruh histori aktivitas.</p>
            <button
              type="button"
              className="cv-timeline-empty-state__button"
              onClick={handleResetFilters}
            >
              Reset Filter
            </button>
          </div>
        ) : null}

        {!isLoading && filteredActivities.length > 0 ? (
          <div className="cv-roadmap-grid">
            {filteredActivities.map((item) => (
              <article
                key={item.id}
                className={`cv-roadmap-card cv-timeline-activity-card${
                  selectedActivityId === item.id ? ' is-selected' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectActivity(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelectActivity(item.id)
                  }
                }}
              >
                <div className="cv-timeline-card__top">
                  <div className="cv-roadmap-icon">
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div className="cv-timeline-card__badges">
                    <span className="cv-timeline-type-chip">{getTypeLabel(item.type)}</span>
                    <span className={`cv-timeline-status-chip is-${item.status}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>

                <div className="cv-timeline-card__copy">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

                <div className="cv-timeline-card__meta">
                  <span>{item.source}</span>
                  <span>{formatActivityDate(item.createdAt)}</span>
                  <span>Prioritas {item.priority}</span>
                </div>

                <div className="cv-timeline-card__footer">
                  <div className="cv-timeline-card__actions">
                    <button
                      type="button"
                      className="cv-timeline-card__button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleSelectActivity(item.id)
                      }}
                    >
                      Lihat Detail
                    </button>
                    {item.relatedRoute ? (
                      <button
                        type="button"
                        className="cv-timeline-card__link"
                        onClick={(event) => {
                          event.stopPropagation()
                          navigate(item.relatedRoute)
                        }}
                      >
                        {getActionLabel(item.actionLabel)}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="cv-timeline-bottom-grid">
        <article className="cv-dashboard-panel cv-timeline-stat-card">
          <div className="cv-dashboard-panel__header">
            <h3>Statistik Aktivitas Anda</h3>
          </div>

          <div className="cv-chart-placeholder">
            <img src={timelineChart} alt="Ringkasan statistik aktivitas CyberVault" />
          </div>

          <div className="cv-timeline-overview-list">
            {overviewCards.map((item) => (
              <article key={item.id} className="cv-timeline-overview-card">
                <h4>{item.title}</h4>
                <strong>{item.value}</strong>
                <div className="cv-timeline-overview-card__meta">
                  <span>{item.note}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="cv-dashboard-panel cv-timeline-achievement-card">
          <div className="cv-dashboard-panel__header">
            <h3>Detail Aktivitas Terpilih</h3>
          </div>

          {selectedActivity ? (
            <div className="cv-timeline-detail">
              <div className="cv-timeline-card__badges">
                <span className="cv-timeline-type-chip">
                  {getTypeLabel(selectedActivity.type)}
                </span>
                <span className={`cv-timeline-status-chip is-${selectedActivity.status}`}>
                  {getStatusLabel(selectedActivity.status)}
                </span>
              </div>

              <h3>{selectedActivity.title}</h3>
              <p>{selectedActivity.description}</p>

              <div className="cv-timeline-detail__meta">
                <span>{selectedActivity.source}</span>
                <span>{formatActivityDate(selectedActivity.createdAt)}</span>
                <span>Prioritas {selectedActivity.priority}</span>
              </div>

              <section className="cv-timeline-detail__section">
                <h4>Metadata</h4>
                <div className="cv-timeline-detail__tags">
                  {Object.entries(selectedActivity.metadata || {}).map(([key, value]) => (
                    <span key={key} className="cv-timeline-detail__tag">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </section>

              <section className="cv-timeline-detail__section">
                <h4>Status Review</h4>
                <p>
                  {selectedActivity.reviewed
                    ? 'Aktivitas ini sudah ditandai ditinjau pada mode demo.'
                    : 'Aktivitas ini belum ditinjau. Anda bisa menandainya secara lokal.'}
                </p>
              </section>

              <div className="cv-timeline-detail__actions">
                {selectedActivity.relatedRoute ? (
                  <button
                    type="button"
                    className="cv-timeline-detail__button"
                    onClick={() => navigate(selectedActivity.relatedRoute)}
                  >
                    {getActionLabel(selectedActivity.actionLabel)}
                  </button>
                ) : null}
                {!selectedActivity.reviewed ? (
                  <button
                    type="button"
                    className="cv-timeline-detail__button cv-timeline-detail__button--ghost"
                    onClick={handleMarkReviewed}
                  >
                    Tandai Ditinjau
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="cv-timeline-empty-state">
              <i className="bi bi-card-text" aria-hidden="true" />
              <h3>Pilih salah satu aktivitas</h3>
              <p>Detail aktivitas akan tampil di panel ini setelah Anda membuka preview.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  )
}

export default Timeline
