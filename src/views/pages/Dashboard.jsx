import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/WhatsApp Image 2026-06-10 at 15.47.24.jpeg'
import {
  alertNews,
  dashboardStats,
  identityCategoryOptions,
  identityItems as initialIdentityItems,
  identityTypeOptions,
  learningProgress,
  quickActions,
  recentActivities,
  todayPriorities,
  vaultActivities,
} from '../../data/dashboard/dashboardData.js'
import '../../styles/DashboardPage.css'

const initialIdentityForm = {
  category: '',
  detail: '',
  relatedTo: '',
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date())
}

function buildIdentityTypeLabel(category) {
  const mapping = {
    Email: 'Email Baru',
    'Nomor Telepon': 'Nomor Telepon Baru',
    'Akun Online': 'Akun Online Baru',
    'Dokumen Penting': 'Dokumen Penting Baru',
    'Kontak Darurat': 'Kontak Darurat Baru',
  }

  return mapping[category] || 'Identitas Baru'
}

function resolveStatusClass(status) {
  if (status === 'Terverifikasi') {
    return 'is-success'
  }

  if (status === 'Aktif') {
    return 'is-info'
  }

  return 'is-warning'
}

function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('Semua Identitas')
  const [identityRows, setIdentityRows] = useState(initialIdentityItems)
  const [selectedActivity, setSelectedActivity] = useState(recentActivities[0])
  const [isAddIdentityOpen, setIsAddIdentityOpen] = useState(false)
  const [identityForm, setIdentityForm] = useState(initialIdentityForm)
  const [identityFormErrors, setIdentityFormErrors] = useState(initialIdentityForm)
  const [vaultFeedback, setVaultFeedback] = useState('')

  const identityCategoryCounts = useMemo(
    () =>
      identityCategoryOptions.map((category) => ({
        label: category,
        count:
          category === 'Semua Identitas'
            ? identityRows.length
            : identityRows.filter((item) => item.category === category).length,
      })),
    [identityRows],
  )

  const filteredIdentityRows = useMemo(() => {
    if (activeCategory === 'Semua Identitas') {
      return identityRows
    }

    return identityRows.filter((item) => item.category === activeCategory)
  }, [activeCategory, identityRows])

  const handleIdentityFormChange = (event) => {
    const { name, value } = event.target

    setIdentityForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))

    setIdentityFormErrors((currentValue) => ({
      ...currentValue,
      [name]: '',
    }))
  }

  const handleOpenIdentityModal = () => {
    setIsAddIdentityOpen(true)
    setVaultFeedback('')
  }

  const handleCloseIdentityModal = () => {
    setIsAddIdentityOpen(false)
    setIdentityForm(initialIdentityForm)
    setIdentityFormErrors(initialIdentityForm)
  }

  const handleIdentitySubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      category: identityForm.category ? '' : 'Tipe identitas wajib dipilih.',
      detail: identityForm.detail.trim() ? '' : 'Nilai identitas wajib diisi.',
      relatedTo: identityForm.relatedTo.trim() ? '' : 'Field terkait dengan wajib diisi.',
    }

    setIdentityFormErrors(nextErrors)

    if (nextErrors.category || nextErrors.detail || nextErrors.relatedTo) {
      return
    }

    const newIdentityItem = {
      id: Date.now(),
      category: identityForm.category,
      type: buildIdentityTypeLabel(identityForm.category),
      detail: identityForm.detail.trim(),
      relatedTo: identityForm.relatedTo.trim(),
      status: 'Pending',
      updatedAt: formatCurrentDate(),
    }

    setIdentityRows((currentValue) => [newIdentityItem, ...currentValue])
    setActiveCategory('Semua Identitas')
    setSelectedActivity((currentValue) => currentValue)
    setVaultFeedback('Identitas baru berhasil ditambahkan ke vault dalam mode mock.')
    handleCloseIdentityModal()
  }

  return (
    <div className="cv-dashboard-v2">
      <section className="cv-dash-hero">
        <div className="cv-dash-hero__copy">
          <p className="cv-dash-eyebrow">Security command center</p>
          <h1>CyberVault membuat aktivitas keamanan harian terasa lebih jelas.</h1>
          <p className="cv-dash-hero__lead">
            Pantau skor keamanan, lanjutkan pembelajaran, dan respon insiden dari satu
            dashboard yang lebih fokus dan mudah dipakai.
          </p>

          <div className="cv-dash-hero__actions">
            <Link to="/pusat-edukasi" className="cv-dash-btn cv-dash-btn--primary">
              <i className="bi bi-play-circle" />
              Lanjut Belajar
            </Link>
            <Link to="/pelaporan-insiden" className="cv-dash-btn cv-dash-btn--ghost">
              <i className="bi bi-shield-exclamation" />
              Buat Laporan
            </Link>
          </div>

          <div className="cv-dash-priority">
            <div className="cv-dash-priority__head">
              <span>Fokus hari ini</span>
              <strong>3 prioritas aktif</strong>
            </div>
            <div className="cv-dash-priority__list">
              {todayPriorities.map((item) => (
                <div key={item} className="cv-dash-priority__item">
                  <i className="bi bi-check2-circle" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cv-dash-hero__visual">
          <div className="cv-dash-hero__image-wrap">
            <img src={heroImage} alt="CyberVault Smart City" />
          </div>
        </div>
      </section>

      <section className="cv-dash-metrics">
        {dashboardStats.map((item) => (
          <article key={item.title} className="cv-dash-metric-card">
            <div className="cv-dash-metric-card__icon">
              <i className={`bi ${item.icon}`} />
            </div>
            <div className="cv-dash-metric-card__body">
              <p>{item.title}</p>
              <h3>
                {item.value}
                {item.suffix ? <span>{item.suffix}</span> : null}
              </h3>
              <div className="cv-dash-metric-card__meta">
                <span>{item.note}</span>
                <small>{item.trend}</small>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-dash-quick-actions">
        <div className="cv-dash-section-head">
          <div>
            <p className="cv-dash-eyebrow">Akses cepat</p>
            <h2>Mulai dari tindakan yang paling sering dipakai</h2>
          </div>
          <Link to="/notifikasi" className="cv-dash-text-link">
            Buka notifikasi
          </Link>
        </div>

        <div className="cv-dash-quick-actions__grid">
          {quickActions.map((item) => (
            <Link key={item.title} to={item.to} className="cv-dash-action-card">
              <div className="cv-dash-action-card__icon">
                <i className={`bi ${item.icon}`} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <i className="bi bi-arrow-up-right" />
            </Link>
          ))}
        </div>
      </section>

      <section className="cv-dash-main-grid">
        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Learning progress</p>
              <h2>Progres belajar Anda</h2>
            </div>
            <Link to="/pusat-edukasi" className="cv-dash-pill-link">
              Semua materi
            </Link>
          </div>

          <div className="cv-dash-learning">
            <div className="cv-dash-learning__score">
              <div className="cv-dash-learning__ring">
                <strong>50%</strong>
                <span>Selesai</span>
              </div>
              <p>Jaga ritme belajar. Anda tinggal 12 materi lagi untuk menyelesaikan jalur dasar.</p>
            </div>

            <div className="cv-dash-learning__list">
              {learningProgress.map((item) => (
                <div key={item.label} className="cv-dash-progress-row">
                  <div className="cv-dash-progress-row__top">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="cv-dash-progress-bar">
                    <span style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Alert stream</p>
              <h2>Berita dan peringatan</h2>
            </div>
            <Link to="/informasi-peringatan" className="cv-dash-text-link">
              Lihat semua
            </Link>
          </div>

          <div className="cv-dash-alert-list">
            {alertNews.map((item) => (
              <article key={item.title} className={`cv-dash-alert-card is-${item.tone}`}>
                <div className="cv-dash-alert-card__icon">
                  <i className={`bi ${item.icon}`} />
                </div>
                <div>
                  <div className="cv-dash-alert-card__meta">
                    <span>{item.tag}</span>
                    <small>{item.time}</small>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="cv-dash-main-grid cv-dash-main-grid--secondary">
        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Recent moves</p>
              <h2>Aktivitas terbaru</h2>
            </div>
            <Link to="/timeline" className="cv-dash-text-link">
              Buka timeline
            </Link>
          </div>

          {selectedActivity ? (
            <div className="cv-dash-timeline-detail" role="status" aria-live="polite">
              <strong>{selectedActivity.title}</strong>
              <span>{selectedActivity.subtitle}</span>
              <p>{selectedActivity.detail}</p>
            </div>
          ) : null}

          <div className="cv-dash-timeline">
            {recentActivities.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cv-dash-timeline-item${
                  selectedActivity?.id === item.id ? ' is-active' : ''
                }`}
                onClick={() => setSelectedActivity(item)}
              >
                <div className={`cv-dash-timeline-item__icon is-${item.tone}`}>
                  <i className={`bi ${item.icon}`} />
                </div>
                <div className="cv-dash-timeline-item__body">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span>{item.time}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="cv-dash-panel cv-dash-panel--vault">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Identity vault</p>
              <h2>Kelola identitas digital</h2>
            </div>
            <button
              type="button"
              className="cv-dash-btn cv-dash-btn--soft"
              onClick={handleOpenIdentityModal}
            >
              + Tambah Identitas
            </button>
          </div>

          <div className="cv-dash-vault-grid">
            <aside className="cv-dash-vault-sidebar">
              <div className="cv-dash-vault-score">
                <span>Skor keamanan</span>
                <strong>84</strong>
                <small>Baik dan stabil</small>
              </div>

              <div className="cv-dash-vault-tags">
                {identityCategoryCounts.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`cv-dash-vault-tag${
                      activeCategory === item.label ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveCategory(item.label)}
                  >
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </button>
                ))}
              </div>

              <div className="cv-dash-vault-activity">
                <h3>Aktivitas vault</h3>
                {vaultActivities.map((item) => (
                  <div key={item[0]} className="cv-dash-vault-activity__item">
                    <strong>{item[0]}</strong>
                    <span>{item[1]}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="cv-dash-vault-table-wrap">
              {vaultFeedback ? (
                <div className="cv-dash-vault-feedback" role="status" aria-live="polite">
                  {vaultFeedback}
                </div>
              ) : null}

              <table className="cv-dash-vault-table">
                <thead>
                  <tr>
                    <th>Jenis Identitas</th>
                    <th>Detail</th>
                    <th>Terkait Dengan</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdentityRows.map((item) => (
                    <tr key={item.id}>
                      <td>{item.type}</td>
                      <td title={item.detail} className="cv-dash-vault-table__truncate">
                        {item.detail}
                      </td>
                      <td title={item.relatedTo} className="cv-dash-vault-table__truncate">
                        {item.relatedTo}
                      </td>
                      <td>
                        <span className={`cv-dash-status ${resolveStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.updatedAt}</td>
                    </tr>
                  ))}
                  {filteredIdentityRows.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="cv-dash-vault-table__empty">
                        Belum ada data identitas pada kategori ini.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      {isAddIdentityOpen ? (
        <div className="cv-dash-modal-backdrop" role="presentation" onClick={handleCloseIdentityModal}>
          <div
            className="cv-dash-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-add-identity-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cv-dash-modal__head">
              <div>
                <p className="cv-dash-eyebrow">Identity vault</p>
                <h2 id="cv-add-identity-title">Tambah identitas mock</h2>
              </div>
              <button
                type="button"
                className="cv-dash-modal__close"
                aria-label="Tutup modal tambah identitas"
                onClick={handleCloseIdentityModal}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form className="cv-dash-modal__form" onSubmit={handleIdentitySubmit}>
              <label className="cv-dash-field">
                <span>Tipe identitas</span>
                <select
                  name="category"
                  value={identityForm.category}
                  onChange={handleIdentityFormChange}
                >
                  <option value="">Pilih tipe identitas</option>
                  {identityTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {identityFormErrors.category ? (
                  <small>{identityFormErrors.category}</small>
                ) : null}
              </label>

              <label className="cv-dash-field">
                <span>Nilai identitas</span>
                <input
                  type="text"
                  name="detail"
                  value={identityForm.detail}
                  onChange={handleIdentityFormChange}
                  placeholder="Contoh: nama@email.com atau +62 812..."
                />
                {identityFormErrors.detail ? <small>{identityFormErrors.detail}</small> : null}
              </label>

              <label className="cv-dash-field">
                <span>Terkait dengan</span>
                <input
                  type="text"
                  name="relatedTo"
                  value={identityForm.relatedTo}
                  onChange={handleIdentityFormChange}
                  placeholder="Contoh: Pemulihan akun"
                />
                {identityFormErrors.relatedTo ? (
                  <small>{identityFormErrors.relatedTo}</small>
                ) : null}
              </label>

              <div className="cv-dash-modal__actions">
                <button type="button" className="cv-dash-btn cv-dash-btn--ghost-dark" onClick={handleCloseIdentityModal}>
                  Batal
                </button>
                <button type="submit" className="cv-dash-btn cv-dash-btn--soft">
                  Simpan ke vault
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard
