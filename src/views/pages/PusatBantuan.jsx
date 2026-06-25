import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { helpStats } from '../../data/help/helpData.js'
import {
  getFaqItems,
  getHelpCategories,
  getQuickActions,
  getSupportTopics,
  getTroubleshootingSteps,
  submitSupportTicket,
} from '../../services/help/helpService.js'
import '../../styles/PusatBantuanPage.css'

const DEFAULT_CATEGORY = 'all'
const INITIAL_SUPPORT_FORM = {
  name: '',
  email: '',
  topic: 'Masalah Login',
  priority: 'medium',
  message: '',
}

function PusatBantuan() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)
  const [categories, setCategories] = useState([])
  const [faqItems, setFaqItems] = useState([])
  const [troubleshootingSteps, setTroubleshootingSteps] = useState([])
  const [quickActions, setQuickActions] = useState([])
  const [supportTopics, setSupportTopics] = useState([])
  const [selectedFaqId, setSelectedFaqId] = useState(null)
  const [supportForm, setSupportForm] = useState(INITIAL_SUPPORT_FORM)
  const [validationErrors, setValidationErrors] = useState({})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHelpCenter() {
      setIsLoading(true)

      try {
        const [
          categoriesResponse,
          faqResponse,
          troubleshootingResponse,
          quickActionsResponse,
          supportTopicsResponse,
        ] = await Promise.all([
          getHelpCategories(),
          getFaqItems(),
          getTroubleshootingSteps(),
          getQuickActions(),
          getSupportTopics(),
        ])

        setCategories(categoriesResponse.data || [])
        setFaqItems(faqResponse.data || [])
        setTroubleshootingSteps(troubleshootingResponse.data || [])
        setQuickActions(quickActionsResponse.data || [])
        setSupportTopics(supportTopicsResponse.data || [])
        setSelectedFaqId((faqResponse.data || [])[0]?.id || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadHelpCenter()
  }, [])

  const filteredFaqItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === DEFAULT_CATEGORY ||
        item.category === categories.find((category) => category.id === activeCategory)?.title

      if (!normalizedQuery) {
        return matchesCategory
      }

      const searchableFields = [
        item.question,
        item.answer,
        item.category,
        ...item.tags,
      ]

      const matchesQuery = searchableFields.some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      )

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, categories, faqItems, searchQuery])

  const helpSummary = useMemo(() => {
    const completedSteps = troubleshootingSteps.filter((item) => item.completed).length

    return helpStats.map((item) => {
      if (item.id === 'faq') {
        return { ...item, value: faqItems.length, note: 'Siap dibuka' }
      }

      if (item.id === 'category') {
        return { ...item, value: categories.length - 1, note: 'Topik bantuan utama' }
      }

      if (item.id === 'troubleshooting') {
        return {
          ...item,
          value: `${completedSteps}/${troubleshootingSteps.length}`,
          note: 'Progress checklist',
        }
      }

      return { ...item, value: quickActions.length, note: 'Akses cepat halaman terkait' }
    })
  }, [categories.length, faqItems.length, quickActions.length, troubleshootingSteps])

  const troubleshootingProgress = troubleshootingSteps.length
    ? Math.round(
        (troubleshootingSteps.filter((item) => item.completed).length /
          troubleshootingSteps.length) *
          100,
      )
    : 0

  function resetFilter() {
    setSearchQuery('')
    setActiveCategory(DEFAULT_CATEGORY)
    setFeedbackMessage('Filter bantuan berhasil direset.')
  }

  function validateSupportForm() {
    const nextErrors = {}
    const name = String(supportForm.name || '').trim()
    const email = String(supportForm.email || '').trim()
    const topic = String(supportForm.topic || '').trim()
    const priority = String(supportForm.priority || '').trim()
    const message = String(supportForm.message || '').trim()

    if (!name) {
      nextErrors.name = 'Nama wajib diisi.'
    }

    if (!email) {
      nextErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Format email belum valid.'
    }

    if (!topic) {
      nextErrors.topic = 'Topik wajib dipilih.'
    }

    if (!priority) {
      nextErrors.priority = 'Prioritas wajib dipilih.'
    }

    if (!message) {
      nextErrors.message = 'Pesan wajib diisi.'
    } else if (message.length < 20) {
      nextErrors.message = 'Pesan minimal 20 karakter.'
    } else if (message.length > 800) {
      nextErrors.message = 'Pesan maksimal 800 karakter.'
    }

    return nextErrors
  }

  async function handleSubmitSupportForm(event) {
    event.preventDefault()

    const nextErrors = validateSupportForm()
    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors)
      return
    }

    const response = await submitSupportTicket({
      ...supportForm,
      name: supportForm.name.trim(),
      email: supportForm.email.trim(),
      message: supportForm.message.trim(),
    })

    setSupportForm(INITIAL_SUPPORT_FORM)
    setValidationErrors({})
    setFeedbackMessage(`Tiket bantuan berhasil dibuat: ${response.data.ticketCode}`)
  }

  function toggleFaq(faqId) {
    setSelectedFaqId((current) => (current === faqId ? null : faqId))
  }

  function toggleTroubleshootingStep(stepId) {
    setTroubleshootingSteps((current) =>
      current.map((item) =>
        item.id === stepId ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  function resetTroubleshooting() {
    setTroubleshootingSteps((current) =>
      current.map((item) => ({ ...item, completed: false })),
    )
    setFeedbackMessage('Checklist troubleshooting berhasil direset.')
  }

  return (
    <div className="cv-help-page">
      <section className="cv-help-hero">
        <div className="cv-help-hero__copy">
          <span className="cv-help-eyebrow">Help Center</span>
          <h1>Pusat Bantuan CyberVault</h1>
          <p>
            Temukan jawaban cepat, filter FAQ, ikuti troubleshooting checklist, dan
            kirim tiket bantuan mock dari satu halaman yang siap disambungkan ke
            helpdesk backend nanti.
          </p>
        </div>

        <label className="cv-help-search" htmlFor="help-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            id="help-search"
            type="search"
            value={searchQuery}
            placeholder="Cari phishing, akun, login, notifikasi..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </section>

      {feedbackMessage ? (
        <div className="cv-help-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="cv-help-summary-grid">
        {helpSummary.map((item) => (
          <article key={item.id} className="cv-help-summary-card">
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <div>
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-help-category-section">
        <div className="cv-help-section-head">
          <h2>Kategori Bantuan</h2>
          <button
            type="button"
            className="cv-help-secondary-button"
            onClick={resetFilter}
          >
            Reset Filter
          </button>
        </div>

        <div className="cv-help-category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`cv-help-category-card${
                activeCategory === category.id ? ' is-active' : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <i className={`bi ${category.icon}`} aria-hidden="true" />
              <div>
                <strong>{category.title}</strong>
                <span>{category.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="cv-help-main-grid">
        <article className="cv-help-panel">
          <div className="cv-help-section-head">
            <h2>FAQ & Panduan</h2>
            <span>{filteredFaqItems.length} item cocok dengan pencarian</span>
          </div>

          {isLoading ? (
            <div className="cv-help-empty-state">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>Memuat FAQ bantuan...</h3>
              <p>Konten help center sedang disiapkan untuk mode demo.</p>
            </div>
          ) : null}

          {!isLoading && filteredFaqItems.length === 0 ? (
            <div className="cv-help-empty-state">
              <i className="bi bi-inboxes" aria-hidden="true" />
              <h3>Tidak ada FAQ yang cocok</h3>
              <p>Coba ubah kata kunci pencarian atau reset filter kategori bantuan.</p>
            </div>
          ) : null}

          {!isLoading && filteredFaqItems.length > 0 ? (
            <div className="cv-help-faq-list">
              {filteredFaqItems.map((item) => (
                <article
                  key={item.id}
                  className={`cv-help-faq-item${selectedFaqId === item.id ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="cv-help-faq-item__trigger"
                    onClick={() => toggleFaq(item.id)}
                  >
                    <div>
                      <strong>{item.question}</strong>
                      <span>{item.category}</span>
                    </div>
                    <i
                      className={`bi ${
                        selectedFaqId === item.id ? 'bi-dash-lg' : 'bi-plus-lg'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {selectedFaqId === item.id ? (
                    <div className="cv-help-faq-item__content">
                      <p>{item.answer}</p>
                      <div className="cv-help-tag-row">
                        {item.tags.map((tag) => (
                          <span key={`${item.id}-${tag}`} className="cv-help-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {item.relatedRoute ? (
                        <button
                          type="button"
                          className="cv-help-secondary-button"
                          onClick={() => navigate(item.relatedRoute)}
                        >
                          Buka Halaman Terkait
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </article>

        <div className="cv-help-side-grid">
          <article className="cv-help-panel">
            <div className="cv-help-section-head">
              <h2>Troubleshooting Checklist</h2>
              <span>{troubleshootingProgress}% selesai</span>
            </div>

            <div className="cv-help-progress">
              <span className="cv-help-progress__fill" style={{ width: `${troubleshootingProgress}%` }} />
            </div>

            <div className="cv-help-troubleshooting-list">
              {troubleshootingSteps.map((item) => (
                <article key={item.id} className="cv-help-troubleshooting-item">
                  <button
                    type="button"
                    className={`cv-help-check-toggle${item.completed ? ' is-complete' : ''}`}
                    onClick={() => toggleTroubleshootingStep(item.id)}
                  >
                    <i
                      className={`bi ${item.completed ? 'bi-check2-circle' : 'bi-circle'}`}
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </button>
                  {item.relatedRoute ? (
                    <button
                      type="button"
                      className="cv-help-secondary-button"
                      onClick={() => navigate(item.relatedRoute)}
                    >
                      Buka
                    </button>
                  ) : null}
                </article>
              ))}
            </div>

            <button
              type="button"
              className="cv-help-secondary-button"
              onClick={resetTroubleshooting}
            >
              Reset Checklist
            </button>
          </article>

          <article className="cv-help-panel">
            <div className="cv-help-section-head">
              <h2>Quick Actions</h2>
            </div>

            <div className="cv-help-quick-grid">
              {quickActions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="cv-help-quick-action"
                  onClick={() => navigate(item.route)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="cv-help-panel">
        <div className="cv-help-section-head">
          <h2>Hubungi Dukungan</h2>
          <span>Form tiket bantuan mock dengan validasi dasar</span>
        </div>

        <form className="cv-help-support-form" onSubmit={handleSubmitSupportForm}>
          <div className="cv-help-form-grid">
            <div className="cv-help-field">
              <label htmlFor="support-name">Nama</label>
              <input
                id="support-name"
                value={supportForm.name}
                onChange={(event) =>
                  setSupportForm((current) => ({ ...current, name: event.target.value }))
                }
              />
              {validationErrors.name ? (
                <span className="cv-help-field__error">{validationErrors.name}</span>
              ) : null}
            </div>

            <div className="cv-help-field">
              <label htmlFor="support-email">Email</label>
              <input
                id="support-email"
                type="email"
                value={supportForm.email}
                onChange={(event) =>
                  setSupportForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              {validationErrors.email ? (
                <span className="cv-help-field__error">{validationErrors.email}</span>
              ) : null}
            </div>

            <div className="cv-help-field">
              <label htmlFor="support-topic">Topik</label>
              <select
                id="support-topic"
                value={supportForm.topic}
                onChange={(event) =>
                  setSupportForm((current) => ({ ...current, topic: event.target.value }))
                }
              >
                {supportTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              {validationErrors.topic ? (
                <span className="cv-help-field__error">{validationErrors.topic}</span>
              ) : null}
            </div>

            <div className="cv-help-field">
              <label htmlFor="support-priority">Prioritas</label>
              <select
                id="support-priority"
                value={supportForm.priority}
                onChange={(event) =>
                  setSupportForm((current) => ({ ...current, priority: event.target.value }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {validationErrors.priority ? (
                <span className="cv-help-field__error">{validationErrors.priority}</span>
              ) : null}
            </div>
          </div>

          <div className="cv-help-field">
            <label htmlFor="support-message">Pesan</label>
            <textarea
              id="support-message"
              rows={5}
              value={supportForm.message}
              onChange={(event) =>
                setSupportForm((current) => ({ ...current, message: event.target.value }))
              }
            />
            {validationErrors.message ? (
              <span className="cv-help-field__error">{validationErrors.message}</span>
            ) : null}
          </div>

          <div className="cv-help-action-row">
            <button type="submit" className="cv-help-primary-button">
              Kirim Tiket Bantuan
            </button>
            <button
              type="button"
              className="cv-help-secondary-button"
              onClick={() => {
                setSupportForm(INITIAL_SUPPORT_FORM)
                setValidationErrors({})
                setFeedbackMessage('Form bantuan berhasil direset.')
              }}
            >
              Reset Form
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PusatBantuan
