import { useEffect, useMemo, useState } from 'react'
import heroIllustration from '../../../hero.png'
import { getCurrentUser } from '../../services/auth/authService.js'
import {
  communityGuidelines,
  forumStats,
  forumStatusOptions,
  reportReasons,
} from '../../data/forum/forumData.js'
import {
  addComment,
  closeThread,
  createThread,
  getForumCategories,
  getForumThreads,
  likeThread,
  reportThread,
  saveThread,
} from '../../services/forum/forumService.js'
import '../../styles/ForumPage.css'

const DEFAULT_CATEGORY = 'Semua Kategori'
const DEFAULT_STATUS = 'Semua Status'

function sanitizeTags(input) {
  return String(input || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5)
}

function getStatusLabel(status) {
  if (status === 'answered') {
    return 'Answered'
  }

  if (status === 'reported') {
    return 'Reported'
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function Forum() {
  const currentUser = getCurrentUser()
  const [threads, setThreads] = useState([])
  const [categories, setCategories] = useState([DEFAULT_CATEGORY])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)
  const [activeStatus, setActiveStatus] = useState(DEFAULT_STATUS)
  const [selectedThread, setSelectedThread] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newThreadForm, setNewThreadForm] = useState({
    title: '',
    category: 'Keamanan Akun',
    content: '',
    tags: '',
  })
  const [newCommentForm, setNewCommentForm] = useState('')
  const [reportReason, setReportReason] = useState(reportReasons[0])
  const [validationErrors, setValidationErrors] = useState({})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadForumPage() {
      setIsLoading(true)

      try {
        const [threadsResponse, categoriesResponse] = await Promise.all([
          getForumThreads(),
          getForumCategories(),
        ])

        const threadsData = threadsResponse.data || []

        setThreads(threadsData)
        setCategories(categoriesResponse.data || [DEFAULT_CATEGORY])
        setSelectedThread(threadsData[0] || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadForumPage()
  }, [])

  const filteredThreads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return threads.filter((thread) => {
      const matchesCategory =
        activeCategory === DEFAULT_CATEGORY || thread.category === activeCategory
      const matchesStatus =
        activeStatus === DEFAULT_STATUS || thread.status === activeStatus

      if (!normalizedQuery) {
        return matchesCategory && matchesStatus
      }

      const searchableFields = [
        thread.title,
        thread.summary,
        thread.content,
        thread.category,
        thread.author,
        ...thread.tags,
      ]

      const matchesQuery = searchableFields.some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      )

      return matchesCategory && matchesStatus && matchesQuery
    })
  }, [activeCategory, activeStatus, searchQuery, threads])

  const stats = useMemo(() => {
    const answeredCount = threads.filter((thread) => thread.status === 'answered').length
    const openCount = threads.filter((thread) => thread.status === 'open').length
    const commentCount = threads.reduce((sum, thread) => sum + thread.comments.length, 0)

    return forumStats.map((item) => {
      if (item.id === 'answered') {
        return { ...item, value: answeredCount, note: 'Sudah mendapat respons' }
      }

      if (item.id === 'open') {
        return { ...item, value: openCount, note: 'Masih bisa dilanjutkan' }
      }

      if (item.id === 'comments') {
        return { ...item, value: commentCount, note: 'Komentar pada mode demo' }
      }

      return { ...item, value: threads.length, note: 'Total thread komunitas' }
    })
  }, [threads])

  const activeThread =
    filteredThreads.find((thread) => thread.id === selectedThread?.id) ||
    selectedThread ||
    filteredThreads[0] ||
    null

  function resetFilters() {
    setSearchQuery('')
    setActiveCategory(DEFAULT_CATEGORY)
    setActiveStatus(DEFAULT_STATUS)
    setFeedbackMessage('Filter forum berhasil direset.')
  }

  function validateThreadForm() {
    const nextErrors = {}
    const title = newThreadForm.title.trim()
    const category = newThreadForm.category.trim()
    const content = newThreadForm.content.trim()

    if (!title) {
      nextErrors.title = 'Judul wajib diisi.'
    } else if (title.length < 8) {
      nextErrors.title = 'Judul minimal 8 karakter.'
    }

    if (!category) {
      nextErrors.category = 'Kategori wajib dipilih.'
    }

    if (!content) {
      nextErrors.content = 'Isi diskusi wajib diisi.'
    } else if (content.length < 20) {
      nextErrors.content = 'Isi diskusi minimal 20 karakter.'
    } else if (content.length > 1000) {
      nextErrors.content = 'Isi diskusi maksimal 1000 karakter.'
    }

    return nextErrors
  }

  async function handleCreateDiscussion(event) {
    event.preventDefault()

    const nextErrors = validateThreadForm()
    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors)
      return
    }

    const response = await createThread({
      title: newThreadForm.title.trim(),
      category: newThreadForm.category.trim(),
      content: newThreadForm.content.trim(),
      tags: sanitizeTags(newThreadForm.tags),
      author: currentUser?.name || 'CyberVault User',
      role: 'Community Member',
    })

    setThreads((currentThreads) => [response.data, ...currentThreads])
    setSelectedThread(response.data)
    setNewThreadForm({
      title: '',
      category: 'Keamanan Akun',
      content: '',
      tags: '',
    })
    setValidationErrors({})
    setIsCreateModalOpen(false)
    setFeedbackMessage(response.message)
    setActiveCategory(DEFAULT_CATEGORY)
    setActiveStatus(DEFAULT_STATUS)
    setSearchQuery('')
  }

  async function handleAddComment(event) {
    event.preventDefault()

    const content = newCommentForm.trim()
    if (!content) {
      setValidationErrors((current) => ({
        ...current,
        comment: 'Komentar wajib diisi.',
      }))
      return
    }

    if (content.length < 5) {
      setValidationErrors((current) => ({
        ...current,
        comment: 'Komentar minimal 5 karakter.',
      }))
      return
    }

    if (content.length > 500) {
      setValidationErrors((current) => ({
        ...current,
        comment: 'Komentar maksimal 500 karakter.',
      }))
      return
    }

    const response = await addComment(activeThread.id, {
      content,
      author: currentUser?.name || 'CyberVault User',
      role: 'Community Member',
    })

    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              comments: [...thread.comments, response.data.comment],
              status: thread.status === 'open' ? 'answered' : thread.status,
            }
          : thread,
      ),
    )
    setSelectedThread((currentSelected) =>
      currentSelected?.id === activeThread.id
        ? {
            ...currentSelected,
            comments: [...currentSelected.comments, response.data.comment],
            status: currentSelected.status === 'open' ? 'answered' : currentSelected.status,
          }
        : currentSelected,
    )
    setNewCommentForm('')
    setValidationErrors((current) => {
      const next = { ...current }
      delete next.comment
      return next
    })
    setFeedbackMessage(response.message)
  }

  async function handleLikeThread(thread) {
    const response = await likeThread(thread.id, thread.likedByCurrentUser, thread.likes)

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.id === thread.id
          ? {
              ...item,
              likes: response.data.likes,
              likedByCurrentUser: response.data.likedByCurrentUser,
            }
          : item,
      ),
    )
    setSelectedThread((currentSelected) =>
      currentSelected?.id === thread.id
        ? {
            ...currentSelected,
            likes: response.data.likes,
            likedByCurrentUser: response.data.likedByCurrentUser,
          }
        : currentSelected,
    )
  }

  async function handleSaveThread(thread) {
    const response = await saveThread(thread.id, thread.saved)

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.id === thread.id ? { ...item, saved: response.data.saved } : item,
      ),
    )
    setSelectedThread((currentSelected) =>
      currentSelected?.id === thread.id
        ? { ...currentSelected, saved: response.data.saved }
        : currentSelected,
    )
    setFeedbackMessage('Status simpan thread berhasil diperbarui pada mode demo.')
  }

  async function handleReportThread(thread) {
    if (!reportReason.trim()) {
      setValidationErrors((current) => ({
        ...current,
        report: 'Alasan report wajib dipilih.',
      }))
      return
    }

    const response = await reportThread(thread.id, reportReason)

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.id === thread.id
          ? { ...item, reported: response.data.reported, status: response.data.status }
          : item,
      ),
    )
    setSelectedThread((currentSelected) =>
      currentSelected?.id === thread.id
        ? {
            ...currentSelected,
            reported: response.data.reported,
            status: response.data.status,
          }
        : currentSelected,
    )
    setValidationErrors((current) => {
      const next = { ...current }
      delete next.report
      return next
    })
    setFeedbackMessage(response.message)
  }

  async function handleCloseThread(thread) {
    const response = await closeThread(thread.id)

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.id === thread.id ? { ...item, status: response.data.status } : item,
      ),
    )
    setSelectedThread((currentSelected) =>
      currentSelected?.id === thread.id
        ? { ...currentSelected, status: response.data.status }
        : currentSelected,
    )
    setFeedbackMessage(response.message)
  }

  return (
    <div className="cv-forum-page">
      <section className="cv-forum-hero cv-forum-hero--interactive">
        <div className="cv-forum-hero__content">
          <span className="cv-forum-eyebrow">Community Space</span>
          <h1>Forum Kesadaran Digital</h1>
          <p>
            Cari diskusi, buka thread, beri komentar, dan bangun percakapan aman
            seputar keamanan digital tanpa mencampurkan backend ke phase ini.
          </p>

          <div className="cv-forum-search">
            <div className="cv-forum-search__field">
              <i className="bi bi-search" />
              <input
                type="search"
                value={searchQuery}
                placeholder="Cari thread phishing, whatsapp, password, atau penulis..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="cv-forum-primary-button"
              onClick={() => {
                setIsCreateModalOpen((current) => !current)
                setFeedbackMessage('')
                setValidationErrors({})
              }}
            >
              {isCreateModalOpen ? 'Tutup Form' : '+ Buat Diskusi'}
            </button>
          </div>

          <div className="cv-forum-filter-stack">
            <div className="cv-forum-chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`cv-forum-filter-chip${
                    activeCategory === category ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="cv-forum-chip-row">
              {forumStatusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`cv-forum-filter-chip${
                    activeStatus === status ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <button type="button" className="cv-forum-pill-button" onClick={resetFilters}>
              Reset Filter
            </button>
          </div>

          {feedbackMessage ? (
            <div className="cv-forum-feedback" role="status">
              {feedbackMessage}
            </div>
          ) : null}

          {isCreateModalOpen ? (
            <form className="cv-forum-composer" onSubmit={handleCreateDiscussion}>
              <div className="cv-forum-composer__grid">
                <div className="cv-forum-field">
                  <label htmlFor="forum-title">Judul Diskusi</label>
                  <input
                    id="forum-title"
                    value={newThreadForm.title}
                    onChange={(event) =>
                      setNewThreadForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Minimal 8 karakter"
                  />
                  {validationErrors.title ? (
                    <span className="cv-forum-field__error">{validationErrors.title}</span>
                  ) : null}
                </div>

                <div className="cv-forum-field">
                  <label htmlFor="forum-category">Kategori</label>
                  <select
                    id="forum-category"
                    value={newThreadForm.category}
                    onChange={(event) =>
                      setNewThreadForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  >
                    {categories
                      .filter((item) => item !== DEFAULT_CATEGORY)
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                  {validationErrors.category ? (
                    <span className="cv-forum-field__error">{validationErrors.category}</span>
                  ) : null}
                </div>
              </div>

              <div className="cv-forum-field">
                <label htmlFor="forum-content">Isi Diskusi</label>
                <textarea
                  id="forum-content"
                  value={newThreadForm.content}
                  onChange={(event) =>
                    setNewThreadForm((current) => ({ ...current, content: event.target.value }))
                  }
                  placeholder="Jelaskan konteks atau pertanyaan Anda dengan jelas."
                  rows={5}
                />
                {validationErrors.content ? (
                  <span className="cv-forum-field__error">{validationErrors.content}</span>
                ) : null}
              </div>

              <div className="cv-forum-field">
                <label htmlFor="forum-tags">Tags Opsional</label>
                <input
                  id="forum-tags"
                  value={newThreadForm.tags}
                  onChange={(event) =>
                    setNewThreadForm((current) => ({ ...current, tags: event.target.value }))
                  }
                  placeholder="Pisahkan dengan koma, misal: phishing, email, akun"
                />
              </div>

              <div className="cv-forum-composer__actions">
                <button type="submit" className="cv-forum-primary-button">
                  Kirim Diskusi
                </button>
                <button
                  type="button"
                  className="cv-forum-pill-button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : null}

          <div className="cv-forum-stat-grid">
            {stats.map((item) => (
              <article key={item.id} className="cv-forum-stat-card">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                <div>
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                  <small>{item.note}</small>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="cv-forum-hero__visual">
          <img src={heroIllustration} alt="Forum Kesadaran Digital" />
        </div>
      </section>

      <section className="cv-forum-main-grid cv-forum-main-grid--interactive">
        <article className="cv-forum-panel cv-forum-panel--discussions">
          <div className="cv-forum-panel__head">
            <h2>Daftar Diskusi</h2>
            <span>{filteredThreads.length} thread cocok dengan filter saat ini</span>
          </div>

          {isLoading ? (
            <div className="cv-forum-empty-state">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>Memuat thread forum...</h3>
              <p>Data komunitas sedang disiapkan untuk mode demo.</p>
            </div>
          ) : null}

          {!isLoading && filteredThreads.length === 0 ? (
            <div className="cv-forum-empty-state">
              <i className="bi bi-inboxes" aria-hidden="true" />
              <h3>Tidak ada thread yang cocok</h3>
              <p>Coba ubah kata kunci atau reset filter untuk melihat semua diskusi.</p>
            </div>
          ) : null}

          {!isLoading && filteredThreads.length > 0 ? (
            <div className="cv-forum-discussion-list">
              {filteredThreads.map((item) => (
                <article
                  key={item.id}
                  className={`cv-forum-discussion-card${
                    activeThread?.id === item.id ? ' is-selected' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedThread(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedThread(item)
                    }
                  }}
                >
                  <div className="cv-forum-avatar is-blue" aria-hidden="true">
                    {item.avatar || item.author.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="cv-forum-discussion-card__body">
                    <div className="cv-forum-discussion-card__head">
                      <h3>{item.title}</h3>
                      <span className={`cv-forum-status-chip is-${item.status}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <p>
                      {item.author} • {item.role} • {item.createdAt}
                    </p>
                    <p className="cv-forum-discussion-card__summary">{item.summary}</p>

                    <div className="cv-forum-discussion-card__meta">
                      <span className="cv-forum-tag">{item.category}</span>
                      <span>
                        <i className="bi bi-chat-left-text" /> {item.comments.length}
                      </span>
                      <span>
                        <i className="bi bi-heart" /> {item.likes}
                      </span>
                      <span>
                        <i className="bi bi-eye" /> {item.views}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </article>

        <div className="cv-forum-side-grid cv-forum-side-grid--interactive">
          <article className="cv-forum-panel cv-forum-panel--detail">
            <div className="cv-forum-panel__head">
              <h2>Detail Thread</h2>
            </div>

            {activeThread ? (
              <div className="cv-forum-thread-detail">
                <div className="cv-forum-thread-detail__header">
                  <div>
                    <span className={`cv-forum-status-chip is-${activeThread.status}`}>
                      {getStatusLabel(activeThread.status)}
                    </span>
                    <h3>{activeThread.title}</h3>
                    <p>
                      {activeThread.author} • {activeThread.role} • {activeThread.createdAt}
                    </p>
                  </div>
                </div>

                <div className="cv-forum-thread-detail__section">
                  <h4>Isi Diskusi</h4>
                  <p>{activeThread.content}</p>
                </div>

                <div className="cv-forum-tag-list">
                  {activeThread.tags.map((tag) => (
                    <span key={`${activeThread.id}-${tag}`} className="cv-forum-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="cv-forum-thread-detail__actions">
                  <button
                    type="button"
                    className="cv-forum-pill-button"
                    onClick={() => handleLikeThread(activeThread)}
                  >
                    {activeThread.likedByCurrentUser ? 'Unlike' : 'Like'} ({activeThread.likes})
                  </button>
                  <button
                    type="button"
                    className="cv-forum-pill-button"
                    onClick={() => handleSaveThread(activeThread)}
                  >
                    {activeThread.saved ? 'Tersimpan' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    className="cv-forum-pill-button"
                    onClick={() => handleCloseThread(activeThread)}
                  >
                    Tutup Thread
                  </button>
                </div>

                <div className="cv-forum-thread-detail__moderation">
                  <div className="cv-forum-field">
                    <label htmlFor="report-reason">Alasan Report</label>
                    <select
                      id="report-reason"
                      value={reportReason}
                      onChange={(event) => setReportReason(event.target.value)}
                    >
                      {reportReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    {validationErrors.report ? (
                      <span className="cv-forum-field__error">{validationErrors.report}</span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className="cv-forum-primary-button"
                    onClick={() => handleReportThread(activeThread)}
                  >
                    {activeThread.reported ? 'Sudah Dilaporkan' : 'Laporkan Thread'}
                  </button>
                </div>

                <div className="cv-forum-thread-detail__section">
                  <h4>Komentar</h4>
                  <div className="cv-forum-comment-list">
                    {activeThread.comments.length > 0 ? (
                      activeThread.comments.map((comment) => (
                        <article key={comment.id} className="cv-forum-comment-card">
                          <div className="cv-forum-comment-card__head">
                            <strong>{comment.author}</strong>
                            <span>
                              {comment.role} • {comment.createdAt}
                            </span>
                          </div>
                          <p>{comment.content}</p>
                        </article>
                      ))
                    ) : (
                      <div className="cv-forum-empty-state cv-forum-empty-state--compact">
                        <i className="bi bi-chat-square-dots" aria-hidden="true" />
                        <h3>Belum ada komentar</h3>
                        <p>Mulai komentar pertama untuk membantu menjawab thread ini.</p>
                      </div>
                    )}
                  </div>
                </div>

                <form className="cv-forum-comment-form" onSubmit={handleAddComment}>
                  <div className="cv-forum-field">
                    <label htmlFor="forum-comment">Tulis Komentar</label>
                    <textarea
                      id="forum-comment"
                      rows={4}
                      value={newCommentForm}
                      onChange={(event) => setNewCommentForm(event.target.value)}
                      placeholder="Minimal 5 karakter. Teks akan ditampilkan sebagai plain text."
                    />
                    {validationErrors.comment ? (
                      <span className="cv-forum-field__error">{validationErrors.comment}</span>
                    ) : null}
                  </div>
                  <button type="submit" className="cv-forum-primary-button">
                    Kirim Komentar
                  </button>
                </form>
              </div>
            ) : null}
          </article>

          <article className="cv-forum-panel cv-forum-panel--rules">
            <div className="cv-forum-panel__head">
              <h2>Panduan Komunitas</h2>
            </div>

            <div className="cv-forum-rule-list">
              {communityGuidelines.map((rule) => (
                <div key={rule} className="cv-forum-rule-item">
                  <span className="cv-forum-rule-item__dot" aria-hidden="true" />
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Forum
