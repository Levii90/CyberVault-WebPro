import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import profileIllustration from '../../assets/hero_gaia-1.png'
import { getStoredUser } from '../../controllers/authController.js'
import {
  getAccountActivities,
  getAccountProfile,
  getDeviceSessions,
  getProfileCompletionItems,
  getSecuritySummary,
  revokeDeviceSession,
  updateAccountProfile,
} from '../../services/account/accountService.js'
import '../../styles/AkunPage.css'

const INITIAL_PROFILE_FORM = {
  fullName: '',
  username: '',
  email: '',
  bio: '',
  phone: '',
  institution: '',
}

function buildInitialProfileFromStoredUser() {
  const storedUser = getStoredUser()

  if (!storedUser) {
    return null
  }

  return {
    fullName: storedUser.name || '',
    username: storedUser.username || '',
    role: storedUser.role || 'User',
    email: storedUser.email || '',
    bio: storedUser.bio || '',
    phone: storedUser.phone || '',
    institution: storedUser.institution || '',
    joinedAt: storedUser.created_at ? String(storedUser.created_at).slice(0, 10) : '',
  }
}

function Akun() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => buildInitialProfileFromStoredUser())
  const [security, setSecurity] = useState(null)
  const [sessions, setSessions] = useState([])
  const [activities, setActivities] = useState([])
  const [profileCompletion, setProfileCompletion] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAccountPage() {
      setIsLoading(true)

      try {
        const [
          profileResponse,
          securityResponse,
          sessionsResponse,
          activitiesResponse,
          completionResponse,
        ] = await Promise.all([
          getAccountProfile(),
          getSecuritySummary(),
          getDeviceSessions(),
          getAccountActivities(),
          getProfileCompletionItems(),
        ])

        setProfile(profileResponse.data || null)
        setProfileForm(profileResponse.data || INITIAL_PROFILE_FORM)
        setSecurity(securityResponse.data || null)
        setSessions(sessionsResponse.data || [])
        setActivities(activitiesResponse.data || [])
        setProfileCompletion(completionResponse.data || [])
        setSelectedActivity((activitiesResponse.data || [])[0] || null)
      } catch (error) {
        if (error?.status === 401) {
          navigate('/login', { replace: true })
        } else {
          setFeedbackMessage(error?.message || 'Gagal memuat data akun.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadAccountPage()
  }, [navigate])

  const completedProfileCount = useMemo(
    () => profileCompletion.filter((item) => item.completed).length,
    [profileCompletion],
  )

  function handleOpenEditMode() {
    setProfileForm({
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      institution: profile?.institution || '',
    })
    setIsEditingProfile(true)
    setValidationErrors({})
    setFeedbackMessage('')
  }

  function validateProfileForm() {
    const nextErrors = {}
    const fullName = String(profileForm.fullName || '').trim()
    const username = String(profileForm.username || '').trim()
    const email = String(profileForm.email || '').trim()
    const bio = String(profileForm.bio || '').trim()
    const phone = String(profileForm.phone || '').trim()
    const institution = String(profileForm.institution || '').trim()

    if (!fullName) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.'
    }

    if (!username) {
      nextErrors.username = 'Username wajib diisi.'
    } else if (username.length < 3) {
      nextErrors.username = 'Username minimal 3 karakter.'
    }

    if (!email) {
      nextErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Format email belum valid.'
    }

    if (bio.length > 160) {
      nextErrors.bio = 'Bio maksimal 160 karakter.'
    }

    if (phone.length > 30) {
      nextErrors.phone = 'Nomor telepon maksimal 30 karakter.'
    }

    if (institution.length > 150) {
      nextErrors.institution = 'Institusi maksimal 150 karakter.'
    }

    return nextErrors
  }

  async function handleSaveProfile() {
    const nextErrors = validateProfileForm()

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors)
      return
    }

    const response = await updateAccountProfile(profileForm)

    if (!response.success) {
      setValidationErrors((response.errors && Object.keys(response.errors).length > 0)
        ? {
            fullName: response.errors.name || '',
            username: response.errors.username || '',
            bio: response.errors.bio || '',
            phone: response.errors.phone || '',
            institution: response.errors.institution || '',
          }
        : {})
      setFeedbackMessage(response.message || 'Gagal memperbarui profil.')

      if (response.status === 401) {
        navigate('/login', { replace: true })
      }

      return
    }

    setProfile(response.data)
    setProfileForm(response.data)
    setIsEditingProfile(false)
    setValidationErrors({})
    setFeedbackMessage(response.message)
  }

  function handleCancelEdit() {
    setProfileForm({
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      institution: profile?.institution || '',
    })
    setIsEditingProfile(false)
    setValidationErrors({})
    setFeedbackMessage('Perubahan profil dibatalkan.')
  }

  async function handleRevokeSession(session) {
    if (session.current) {
      setFeedbackMessage('Current session tidak dapat direvoke dari halaman ini.')
      return
    }

    const response = await revokeDeviceSession(session.id)

    setSessions((currentSessions) =>
      currentSessions.filter((item) => item.id !== response.data.sessionId),
    )
    setSecurity((currentSecurity) =>
      currentSecurity
        ? {
            ...currentSecurity,
            activeSessions: Math.max(currentSecurity.activeSessions - 1, 1),
          }
        : currentSecurity,
    )
    setFeedbackMessage(response.message)
  }

  return (
    <div className="cv-account-hub">
      <section className="cv-account-hero">
        <div className="cv-account-hero__copy">
          <span className="cv-account-eyebrow">Profile Center</span>
          <h1>Akun Saya</h1>
          <p>
            Kelola profil demo, ringkasan keamanan akun, session perangkat, dan
            aktivitas terbaru tanpa menampilkan password, token, atau data sensitif.
          </p>
        </div>

        {profile ? (
          <div className="cv-account-hero__meta">
            <div>
              <span>Role</span>
              <strong>{profile.role}</strong>
            </div>
            <div>
              <span>Joined</span>
              <strong>{profile.joinedAt}</strong>
            </div>
            <div>
              <span>Completion</span>
              <strong>
                {completedProfileCount}/{profileCompletion.length}
              </strong>
            </div>
          </div>
        ) : null}
      </section>

      {feedbackMessage ? (
        <div className="cv-account-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="cv-account-empty-state">
          <i className="bi bi-arrow-repeat" aria-hidden="true" />
          <h3>Memuat profil akun...</h3>
          <p>Data akun demo sedang disiapkan untuk halaman ini.</p>
        </div>
      ) : null}

      {!isLoading ? (
        <>
          <section className="cv-account-main-grid">
            <article className="cv-account-card cv-account-card--profile">
              <div className="cv-account-card__head">
                <div>
                  <span className="cv-account-card__kicker">Profil</span>
                  <h2>Profile Summary</h2>
                </div>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    className="cv-account-primary-button"
                    onClick={handleOpenEditMode}
                  >
                    Edit Profil
                  </button>
                ) : null}
              </div>

              <div className="cv-account-profile-card">
                <div className="cv-account-profile-card__visual">
                  <img src={profileIllustration} alt={profile?.fullName || 'Profil akun'} />
                </div>

                {!isEditingProfile ? (
                  <div className="cv-account-profile-card__content">
                    <h3>{profile?.fullName}</h3>
                    <p>@{profile?.username}</p>
                    <div className="cv-account-tag-row">
                      <span className="cv-account-tag">{profile?.email}</span>
                      <span className="cv-account-tag">{profile?.role}</span>
                    </div>
                    <p className="cv-account-profile-card__bio">{profile?.bio}</p>
                  </div>
                ) : (
                  <div className="cv-account-edit-form">
                    <div className="cv-account-field">
                      <label htmlFor="account-full-name">Nama Lengkap</label>
                      <input
                        id="account-full-name"
                        value={profileForm.fullName}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            fullName: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.fullName ? (
                        <span className="cv-account-field__error">
                          {validationErrors.fullName}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-field">
                      <label htmlFor="account-username">Username</label>
                      <input
                        id="account-username"
                        value={profileForm.username}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            username: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.username ? (
                        <span className="cv-account-field__error">
                          {validationErrors.username}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-field">
                      <label htmlFor="account-email">Email</label>
                      <input
                        id="account-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.email ? (
                        <span className="cv-account-field__error">
                          {validationErrors.email}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-field">
                      <label htmlFor="account-bio">Bio</label>
                      <textarea
                        id="account-bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            bio: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.bio ? (
                        <span className="cv-account-field__error">
                          {validationErrors.bio}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-field">
                      <label htmlFor="account-phone">Nomor Telepon</label>
                      <input
                        id="account-phone"
                        value={profileForm.phone}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.phone ? (
                        <span className="cv-account-field__error">
                          {validationErrors.phone}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-field">
                      <label htmlFor="account-institution">Institusi</label>
                      <input
                        id="account-institution"
                        value={profileForm.institution}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            institution: event.target.value,
                          }))
                        }
                      />
                      {validationErrors.institution ? (
                        <span className="cv-account-field__error">
                          {validationErrors.institution}
                        </span>
                      ) : null}
                    </div>

                    <div className="cv-account-action-row">
                      <button
                        type="button"
                        className="cv-account-primary-button"
                        onClick={handleSaveProfile}
                      >
                        Simpan Profil
                      </button>
                      <button
                        type="button"
                        className="cv-account-secondary-button"
                        onClick={handleCancelEdit}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="cv-account-card">
              <div className="cv-account-card__head">
                <div>
                  <span className="cv-account-card__kicker">Keamanan</span>
                  <h2>Security Summary</h2>
                </div>
                <button
                  type="button"
                  className="cv-account-secondary-button"
                  onClick={() => navigate('/pengaturan')}
                >
                  Kelola Pengaturan Keamanan
                </button>
              </div>

              {security ? (
                <div className="cv-account-security-grid">
                  <article className="cv-account-security-item">
                    <span>Security Score</span>
                    <strong>{security.securityScore}/100</strong>
                    <small>Ringkasan proteksi akun demo</small>
                  </article>
                  <article className="cv-account-security-item">
                    <span>MFA</span>
                    <strong>{security.mfaEnabled ? 'Aktif' : 'Belum Aktif'}</strong>
                    <small>Status autentikasi dua faktor</small>
                  </article>
                  <article className="cv-account-security-item">
                    <span>Recovery Email</span>
                    <strong>{security.recoveryEmailVerified ? 'Terverifikasi' : 'Belum Verifikasi'}</strong>
                    <small>Alamat pemulihan akun</small>
                  </article>
                  <article className="cv-account-security-item">
                    <span>Password Last Changed</span>
                    <strong>{security.passwordLastChanged}</strong>
                    <small>Informasi mock, tanpa menampilkan password</small>
                  </article>
                </div>
              ) : null}

              <div className="cv-account-completion">
                <h3>Checklist Profil</h3>
                <div className="cv-account-completion__list">
                  {profileCompletion.map((item) => (
                    <div key={item.id} className="cv-account-completion__item">
                      <i
                        className={`bi ${
                          item.completed ? 'bi-check2-circle' : 'bi-circle'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="cv-account-layout-grid">
            <article className="cv-account-card">
              <div className="cv-account-card__head">
                <div>
                  <span className="cv-account-card__kicker">Session</span>
                  <h2>Device & Session</h2>
                </div>
                <span className="cv-account-count-pill">
                  {security?.activeSessions || sessions.length} active
                </span>
              </div>

              <div className="cv-account-session-list">
                {sessions.map((session) => (
                  <article key={session.id} className="cv-account-session-item">
                    <div className="cv-account-session-item__main">
                      <div>
                        <h3>{session.device}</h3>
                        <p>
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                      <div className="cv-account-tag-row">
                        {session.current ? (
                          <span className="cv-account-tag is-info">Current</span>
                        ) : null}
                        {session.trusted ? (
                          <span className="cv-account-tag is-success">Trusted</span>
                        ) : (
                          <span className="cv-account-tag is-warning">Review</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cv-account-secondary-button"
                      onClick={() => handleRevokeSession(session)}
                    >
                      Revoke Session
                    </button>
                  </article>
                ))}
              </div>
            </article>

            <div className="cv-account-side-column">
              <article className="cv-account-card">
                <div className="cv-account-card__head">
                  <div>
                    <span className="cv-account-card__kicker">Aktivitas</span>
                    <h2>Account Activity</h2>
                  </div>
                </div>

                <div className="cv-account-activity-list">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      type="button"
                      className={`cv-account-activity-item${
                        selectedActivity?.id === activity.id ? ' is-active' : ''
                      }`}
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <strong>{activity.title}</strong>
                      <span>{activity.createdAt}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="cv-account-card">
                <div className="cv-account-card__head">
                  <div>
                    <span className="cv-account-card__kicker">Detail</span>
                    <h2>Activity Preview</h2>
                  </div>
                </div>

                {selectedActivity ? (
                  <div className="cv-account-activity-preview">
                    <h3>{selectedActivity.title}</h3>
                    <p>{selectedActivity.description}</p>
                    <span>{selectedActivity.createdAt}</span>
                    {selectedActivity.relatedRoute ? (
                      <button
                        type="button"
                        className="cv-account-primary-button"
                        onClick={() => navigate(selectedActivity.relatedRoute)}
                      >
                        {selectedActivity.actionLabel || 'Buka Aktivitas'}
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="cv-account-empty-state cv-account-empty-state--compact">
                    <i className="bi bi-clock-history" aria-hidden="true" />
                    <h3>Tidak ada aktivitas terpilih</h3>
                    <p>Pilih salah satu aktivitas untuk melihat detailnya.</p>
                  </div>
                )}
              </article>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default Akun
