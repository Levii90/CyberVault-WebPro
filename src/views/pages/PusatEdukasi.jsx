import { useEffect, useMemo, useState } from 'react'
import heroImage from '../../assets/WhatsApp Image 2026-06-10 at 15.47.24.jpeg'
import {
  educationActivities,
  educationCategoryCards,
  educationLevels as defaultEducationLevels,
  educationStatistics,
  educationTips,
} from '../../data/education/educationData.js'
import {
  getEducationCategories,
  getEducationLevels,
  getEducationModules,
  startModule,
  updateModuleProgress,
} from '../../services/education/educationService.js'

function getModuleActionLabel(status) {
  if (status === 'completed') {
    return 'Lihat Ulang'
  }

  if (status === 'in_progress') {
    return 'Lanjutkan'
  }

  return 'Mulai Belajar'
}

function getModuleStatusLabel(status) {
  if (status === 'completed') {
    return 'Selesai'
  }

  if (status === 'in_progress') {
    return 'Sedang dipelajari'
  }

  return 'Belum dimulai'
}

function PusatEdukasi() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [activeLevel, setActiveLevel] = useState(defaultEducationLevels[0])
  const [selectedModule, setSelectedModule] = useState(null)
  const [modules, setModules] = useState([])
  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState(defaultEducationLevels)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    async function loadEducationData() {
      setIsLoading(true)

      const [modulesResponse, categoriesResponse, levelsResponse] = await Promise.all([
        getEducationModules(),
        getEducationCategories(),
        getEducationLevels(),
      ])

      setModules(modulesResponse.data)
      setCategories(categoriesResponse.data)
      setLevels(levelsResponse.data)
      setSelectedModule(modulesResponse.data[0] ?? null)
      setIsLoading(false)
    }

    loadEducationData()
  }, [])

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return modules.filter((item) => {
      const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory
      const matchesLevel = activeLevel === 'Semua Level' || item.level === activeLevel
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesLevel && matchesQuery
    })
  }, [activeCategory, activeLevel, modules, searchQuery])

  const handleOpenModule = (module) => {
    setSelectedModule(module)
    setFeedbackMessage('')
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setActiveCategory('Semua')
    setActiveLevel('Semua Level')
    setFeedbackMessage('')
  }

  const handleStartModule = async (moduleId) => {
    const currentModule = modules.find((item) => item.id === moduleId)

    if (!currentModule) {
      return
    }

    let nextProgress = currentModule.progress
    let nextStatus = currentModule.status

    if (currentModule.status === 'completed') {
      nextProgress = 100
      nextStatus = 'completed'
    } else if (currentModule.status === 'in_progress') {
      nextProgress = Math.min(currentModule.progress + 10, 100)
      nextStatus = nextProgress >= 100 ? 'completed' : 'in_progress'
      await updateModuleProgress(moduleId, nextProgress)
    } else {
      nextProgress = Math.max(currentModule.progress, 10)
      nextStatus = 'in_progress'
      await startModule(moduleId)
    }

    const updatedModules = modules.map((item) =>
      item.id === moduleId
        ? {
            ...item,
            progress: nextProgress,
            status: nextStatus,
          }
        : item,
    )

    setModules(updatedModules)
    setSelectedModule(updatedModules.find((item) => item.id === moduleId) ?? currentModule)
    setFeedbackMessage('Mode demo: progress belajar diperbarui sementara.')
  }

  const handleCompleteModule = () => {
    if (!selectedModule) {
      return
    }

    const updatedModules = modules.map((item) =>
      item.id === selectedModule.id
        ? {
            ...item,
            progress: 100,
            status: 'completed',
          }
        : item,
    )

    setModules(updatedModules)
    setSelectedModule(updatedModules.find((item) => item.id === selectedModule.id) ?? selectedModule)
    setFeedbackMessage('Mode demo: modul ditandai selesai untuk sesi ini.')
  }

  return (
    <div className="cv-dashboard-container cv-education-page">
      <section className="cv-education-hero-card">
        <div className="cv-education-hero-card__content">
          <p className="cv-section-kicker">Pusat Edukasi</p>
          <h1>Cyber Learning Center</h1>
          <p className="cv-education-hero-card__text">
            Pusat pembelajaran keamanan digital CyberVault untuk membantu Anda memahami
            ancaman siber, memperkuat privasi, dan membangun kebiasaan online yang lebih
            aman di era smart city.
          </p>

          <div className="cv-education-search">
            <i className="bi bi-search" />
            <input
              type="text"
              value={searchQuery}
              placeholder="Cari materi, topik, atau kategori..."
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="cv-education-chip-row">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`cv-education-chip${activeCategory === item ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="cv-education-chip-row cv-education-chip-row--secondary">
            {levels.map((item) => (
              <button
                key={item}
                type="button"
                className={`cv-education-chip${activeLevel === item ? ' is-active' : ''}`}
                onClick={() => setActiveLevel(item)}
              >
                {item}
              </button>
            ))}

            <button
              type="button"
              className="cv-education-chip cv-education-chip--reset"
              onClick={handleResetFilters}
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div className="cv-education-hero-card__visual">
          <div className="cv-education-hero-illustration">
            <img src={heroImage} alt="Cyber Learning Center" />
            <div className="cv-education-hero-illustration__overlay">
              <span>24 Modul Aktif</span>
              <strong>Belajar lebih aman, langkah demi langkah</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cv-education-stats-grid">
        {educationStatistics.map((item) => (
          <article key={item.title} className="cv-education-stat-card">
            <div className={`cv-education-stat-card__icon is-${item.tone}`}>
              <i className={`bi ${item.icon}`} />
            </div>
            <div>
              <p>{item.title}</p>
              <h3>{item.value}</h3>
              <span>{item.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-education-section-card">
        <div className="cv-education-section-head">
          <div>
            <p className="cv-section-kicker">Materi Pilihan</p>
            <h2>Materi Pilihan Untuk Anda</h2>
          </div>
        </div>

        {feedbackMessage ? <div className="alert alert-info">{feedbackMessage}</div> : null}

        {selectedModule ? (
          <div className="cv-education-preview">
            <div className="cv-education-preview__content">
              <p className="cv-section-kicker">Preview Modul</p>
              <h3>{selectedModule.title}</h3>
              <p>{selectedModule.description}</p>

              <div className="cv-education-preview__meta">
                <span>{selectedModule.category}</span>
                <span>{selectedModule.level}</span>
                <span>{selectedModule.duration}</span>
                <span>{selectedModule.lessons} lessons</span>
              </div>

              <div className="cv-education-preview__progress">
                <div className="cv-education-material-card__progress-bar">
                  <span style={{ width: `${selectedModule.progress}%` }} />
                </div>
                <strong>{selectedModule.progress}%</strong>
              </div>
            </div>

            <div className="cv-education-preview__actions">
              <button
                type="button"
                className="cv-education-action-button"
                onClick={() => handleStartModule(selectedModule.id)}
              >
                {getModuleActionLabel(selectedModule.status)}
              </button>
              <button
                type="button"
                className="cv-education-action-button cv-education-action-button--ghost"
                onClick={handleCompleteModule}
              >
                Tandai Selesai
              </button>
            </div>
          </div>
        ) : null}

        <div className="cv-education-material-grid">
          {isLoading ? (
            <div className="cv-education-empty-state">Memuat materi edukasi...</div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((item) => (
              <article
                key={item.id}
                className="cv-education-material-card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenModule(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpenModule(item)
                  }
                }}
              >
                <div className={`cv-education-material-card__thumb is-${item.imageTone}`}>
                  <i className={`bi ${item.icon}`} />
                </div>

                <div className="cv-education-material-card__body">
                  <h3>{item.title}</h3>

                  <div className="cv-education-material-card__meta">
                    <span>{item.duration}</span>
                    <span>{getModuleStatusLabel(item.status)}</span>
                    <span>{item.level}</span>
                  </div>

                  <div className="cv-education-material-card__progress">
                    <div className="cv-education-material-card__progress-bar">
                      <span style={{ width: `${item.progress}%` }} />
                    </div>
                    <strong>{item.progress}%</strong>
                  </div>

                  <div className="cv-education-material-card__footer">
                    <span>{item.lessons} lessons</span>
                    <button
                      type="button"
                      className="cv-education-action-button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleStartModule(item.id)
                      }}
                    >
                      {getModuleActionLabel(item.status)}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="cv-education-empty-state">
              Tidak ada materi yang cocok dengan filter atau pencarian Anda.
            </div>
          )}
        </div>
      </section>

      <section className="cv-education-section-card">
        <div className="cv-education-section-head">
          <div>
            <p className="cv-section-kicker">Kategori</p>
            <h2>Kategori Materi</h2>
          </div>
        </div>

        <div className="cv-education-category-grid">
          {educationCategoryCards.map((item) => (
            <button
              key={item.title}
              type="button"
              className={`cv-education-category-card${
                activeCategory === item.title ? ' is-active' : ''
              }`}
              onClick={() => setActiveCategory(item.title)}
            >
              <div className="cv-education-category-card__icon">
                <i className={`bi ${item.icon}`} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="cv-education-bottom-grid">
        <article className="cv-education-section-card">
          <div className="cv-education-section-head">
            <div>
              <p className="cv-section-kicker">Aktivitas</p>
              <h2>Aktivitas Belajar Terbaru</h2>
            </div>
          </div>

          <div className="cv-education-activity-timeline">
            {educationActivities.map((item, index) => (
              <article key={`${item.title}-${item.time}`} className="cv-education-activity-row">
                <div className="cv-education-activity-row__rail">
                  <div className="cv-education-activity-row__icon">
                    <i className={`bi ${item.icon}`} />
                  </div>
                  {index < educationActivities.length - 1 ? (
                    <span className="cv-education-activity-row__line" aria-hidden="true" />
                  ) : null}
                </div>

                <div className="cv-education-activity-row__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span>{item.time}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="cv-education-section-card cv-education-tips-card">
          <div className="cv-education-section-head">
            <div>
              <p className="cv-section-kicker">Tips Hari Ini</p>
              <h2>Tetap Aman Saat Online</h2>
            </div>
          </div>

          <div className="cv-education-tips-list">
            {educationTips.map((item) => (
              <div key={item} className="cv-education-tip-item">
                <i className="bi bi-stars" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="cv-education-tips-highlight">
            <strong>Fokus hari ini:</strong>
            <p>
              Selesaikan materi phishing sebelum membuka tautan yang tidak dikenal di pesan
              instan atau email kerja.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

export default PusatEdukasi
