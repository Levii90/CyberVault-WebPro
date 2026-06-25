import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAccountPreferences,
  getAppearanceSettings,
  getDataControlActions,
  getNotificationSettings,
  getPrivacySettings,
  getSecuritySettings,
  getSettingsSections,
  exportSettings,
  resetSettings,
  updateSetting,
} from '../../services/settings/settingsService.js'
import '../../styles/PengaturanPage.css'

function Pengaturan() {
  const navigate = useNavigate()
  const [sections, setSections] = useState([])
  const [activeSection, setActiveSection] = useState('general')
  const [preferences, setPreferences] = useState(null)
  const [security, setSecurity] = useState([])
  const [notifications, setNotifications] = useState([])
  const [privacy, setPrivacy] = useState(null)
  const [appearance, setAppearance] = useState(null)
  const [dataActions, setDataActions] = useState([])
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSettingsPage() {
      setIsLoading(true)

      try {
        const [
          sectionsResponse,
          preferencesResponse,
          securityResponse,
          notificationsResponse,
          privacyResponse,
          appearanceResponse,
          dataActionsResponse,
        ] = await Promise.all([
          getSettingsSections(),
          getAccountPreferences(),
          getSecuritySettings(),
          getNotificationSettings(),
          getPrivacySettings(),
          getAppearanceSettings(),
          getDataControlActions(),
        ])

        setSections(sectionsResponse.data || [])
        setPreferences(preferencesResponse.data || null)
        setSecurity(securityResponse.data || [])
        setNotifications(notificationsResponse.data || [])
        setPrivacy(privacyResponse.data || null)
        setAppearance(appearanceResponse.data || null)
        setDataActions(dataActionsResponse.data || [])
      } finally {
        setIsLoading(false)
      }
    }

    loadSettingsPage()
  }, [])

  const stats = useMemo(() => {
    return [
      {
        id: 'sections',
        title: 'Section Aktif',
        value: sections.length,
        note: 'Distribusi pengaturan seimbang',
      },
      {
        id: 'toggles',
        title: 'Toggle Aktif',
        value:
          security.filter((item) => item.type === 'toggle' && item.enabled).length +
          notifications.filter((item) => item.enabled).length +
          Number(privacy?.showCertificate || false) +
          Number(privacy?.allowCommunityMention || false) +
          Number(privacy?.recommendationDataSharing || false) +
          Number(privacy?.securityInsightSharing || false) +
          Number(preferences?.weeklySummary || false) +
          Number(preferences?.smartRecommendations || false) +
          Number(appearance?.compactSidebar || false) +
          Number(appearance?.motionEffects || false),
        note: 'Dapat disimpan secara lokal',
      },
      {
        id: 'channels',
        title: 'Kanal Notifikasi',
        value: notifications.length,
        note: 'Email, in-app, forum, dan lainnya',
      },
      {
        id: 'controls',
        title: 'Data Control',
        value: dataActions.length,
        note: 'Export, reset, dan danger zone',
      },
    ]
  }, [appearance, dataActions.length, notifications, preferences, privacy, sections.length, security])

  async function handlePreferenceChange(settingId, value) {
    await updateSetting('general', settingId, value)
    setPreferences((current) => ({
      ...current,
      [settingId]: value,
    }))
  }

  async function handleSecurityToggle(settingId) {
    const currentItem = security.find((item) => item.id === settingId)
    if (!currentItem || currentItem.type !== 'toggle') {
      return
    }

    const nextValue = !currentItem.enabled
    await updateSetting('security', settingId, nextValue)
    setSecurity((current) =>
      current.map((item) =>
        item.id === settingId ? { ...item, enabled: nextValue } : item,
      ),
    )
  }

  async function handleNotificationToggle(settingId) {
    const currentItem = notifications.find((item) => item.id === settingId)
    if (!currentItem) {
      return
    }

    const nextValue = !currentItem.enabled
    await updateSetting('notifications', settingId, nextValue)
    setNotifications((current) =>
      current.map((item) =>
        item.id === settingId ? { ...item, enabled: nextValue } : item,
      ),
    )
  }

  async function handlePrivacyChange(settingId, value) {
    await updateSetting('privacy', settingId, value)
    setPrivacy((current) => ({
      ...current,
      [settingId]: value,
    }))
  }

  async function handleAppearanceChange(settingId, value) {
    await updateSetting('appearance', settingId, value)
    setAppearance((current) => ({
      ...current,
      [settingId]: value,
    }))
    setFeedbackMessage('Perubahan tampilan disimpan sebagai mode demo dan tidak mengubah tema global.')
  }

  function validateGeneralSection() {
    const nextErrors = {}

    if (!String(preferences?.language || '').trim()) {
      nextErrors.language = 'Bahasa wajib dipilih.'
    }

    if (!String(preferences?.timezone || '').trim()) {
      nextErrors.timezone = 'Timezone wajib dipilih.'
    }

    if (!String(preferences?.defaultDashboardView || '').trim()) {
      nextErrors.defaultDashboardView = 'Default dashboard view wajib dipilih.'
    }

    return nextErrors
  }

  function handleSaveGeneral() {
    const nextErrors = validateGeneralSection()
    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors)
      return
    }

    setValidationErrors({})
    setFeedbackMessage('Preferensi umum berhasil disimpan secara lokal.')
  }

  function handleResetGeneral() {
    resetSettings().then((response) => {
      setPreferences(response.data.accountPreferences)
      setValidationErrors({})
      setFeedbackMessage('Preferensi umum berhasil dikembalikan ke default mock.')
    })
  }

  function handleSaveNotification() {
    setFeedbackMessage('Pengaturan notifikasi berhasil disimpan secara lokal.')
  }

  function handleSavePrivacy() {
    setFeedbackMessage('Pengaturan privasi berhasil disimpan secara lokal.')
  }

  async function handleResetAllSettings() {
    const response = await resetSettings()
    setPreferences(response.data.accountPreferences)
    setSecurity(response.data.securitySettings)
    setNotifications(response.data.notificationSettings)
    setPrivacy(response.data.privacySettings)
    setAppearance(response.data.appearanceSettings)
    setFeedbackMessage(response.message)
  }

  async function handleExportSettings() {
    const response = await exportSettings()
    setFeedbackMessage(response.message)
  }

  const sectionContent = useMemo(() => {
    if (activeSection === 'general' && preferences) {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Preferensi Akun</h3>
              <p>Atur bahasa, timezone, dan dashboard default yang paling nyaman.</p>
            </div>
            <div className="cv-settings-form-grid">
              <div className="cv-settings-field">
                <label htmlFor="settings-language">Language</label>
                <select
                  id="settings-language"
                  value={preferences.language}
                  onChange={(event) => handlePreferenceChange('language', event.target.value)}
                >
                  <option>Bahasa Indonesia</option>
                  <option>English</option>
                </select>
                {validationErrors.language ? (
                  <span className="cv-settings-field__error">{validationErrors.language}</span>
                ) : null}
              </div>
              <div className="cv-settings-field">
                <label htmlFor="settings-timezone">Timezone</label>
                <select
                  id="settings-timezone"
                  value={preferences.timezone}
                  onChange={(event) => handlePreferenceChange('timezone', event.target.value)}
                >
                  <option>Asia/Jakarta</option>
                  <option>Asia/Singapore</option>
                  <option>UTC</option>
                </select>
                {validationErrors.timezone ? (
                  <span className="cv-settings-field__error">{validationErrors.timezone}</span>
                ) : null}
              </div>
              <div className="cv-settings-field">
                <label htmlFor="settings-dashboard-view">Default Dashboard View</label>
                <select
                  id="settings-dashboard-view"
                  value={preferences.defaultDashboardView}
                  onChange={(event) =>
                    handlePreferenceChange('defaultDashboardView', event.target.value)
                  }
                >
                  <option>Ringkasan Keamanan</option>
                  <option>Aktivitas Terbaru</option>
                  <option>Progress Belajar</option>
                </select>
                {validationErrors.defaultDashboardView ? (
                  <span className="cv-settings-field__error">
                    {validationErrors.defaultDashboardView}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="cv-settings-toggle-list">
              <button
                type="button"
                className={`cv-settings-toggle${preferences.weeklySummary ? ' is-active' : ''}`}
                onClick={() => handlePreferenceChange('weeklySummary', !preferences.weeklySummary)}
              >
                <div>
                  <strong>Weekly Summary</strong>
                  <span>Terima ringkasan progres mingguan akun demo.</span>
                </div>
                <span className="cv-settings-toggle__switch" />
              </button>
              <button
                type="button"
                className={`cv-settings-toggle${
                  preferences.smartRecommendations ? ' is-active' : ''
                }`}
                onClick={() =>
                  handlePreferenceChange(
                    'smartRecommendations',
                    !preferences.smartRecommendations,
                  )
                }
              >
                <div>
                  <strong>Smart Recommendations</strong>
                  <span>Aktifkan saran otomatis berbasis aktivitas pembelajaran.</span>
                </div>
                <span className="cv-settings-toggle__switch" />
              </button>
            </div>
            <div className="cv-settings-action-row">
              <button
                type="button"
                className="cv-settings-primary-button"
                onClick={handleSaveGeneral}
              >
                Save Preferences
              </button>
              <button
                type="button"
                className="cv-settings-secondary-button"
                onClick={handleResetGeneral}
              >
                Reset Section
              </button>
            </div>
          </article>
        </div>
      )
    }

    if (activeSection === 'security') {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Security Settings</h3>
              <p>Kelola toggle proteksi akun dan akses perangkat tepercaya.</p>
            </div>
            <div className="cv-settings-security-grid">
              {security.map((item) => (
                <div key={item.id} className="cv-settings-security-item">
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                  {item.type === 'toggle' ? (
                    <button
                      type="button"
                      className={`cv-settings-toggle cv-settings-toggle--compact${
                        item.enabled ? ' is-active' : ''
                      }`}
                      onClick={() => handleSecurityToggle(item.id)}
                    >
                      <span className="cv-settings-toggle__switch" />
                    </button>
                  ) : (
                    <span className="cv-settings-badge">{item.valueLabel}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="cv-settings-action-row">
              <button
                type="button"
                className="cv-settings-primary-button"
                onClick={() =>
                  setFeedbackMessage(
                    'Mode demo: perubahan password akan tersedia setelah backend aktif.',
                  )
                }
              >
                Ubah Password
              </button>
              <button
                type="button"
                className="cv-settings-secondary-button"
                onClick={() => navigate('/akun')}
              >
                Kelola Perangkat
              </button>
            </div>
          </article>
        </div>
      )
    }

    if (activeSection === 'notifications') {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Notification Preferences</h3>
              <p>Atur channel notifikasi penting agar tetap relevan dan tidak berlebihan.</p>
            </div>
            <div className="cv-settings-toggle-list">
              {notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`cv-settings-toggle${item.enabled ? ' is-active' : ''}`}
                  onClick={() => handleNotificationToggle(item.id)}
                >
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </div>
                  <span className="cv-settings-toggle__switch" />
                </button>
              ))}
            </div>
            <div className="cv-settings-action-row">
              <button
                type="button"
                className="cv-settings-primary-button"
                onClick={handleSaveNotification}
              >
                Save Notification Settings
              </button>
            </div>
          </article>
        </div>
      )
    }

    if (activeSection === 'privacy' && privacy) {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Privacy Controls</h3>
              <p>Atur visibilitas profil dan batas data demo yang dipakai sistem.</p>
            </div>
            <div className="cv-settings-form-grid">
              <div className="cv-settings-field">
                <label htmlFor="settings-profile-visibility">Profile Visibility</label>
                <select
                  id="settings-profile-visibility"
                  value={privacy.profileVisibility}
                  onChange={(event) =>
                    handlePrivacyChange('profileVisibility', event.target.value)
                  }
                >
                  <option>Private</option>
                  <option>Community Only</option>
                  <option>Public</option>
                </select>
              </div>
            </div>
            <div className="cv-settings-toggle-list">
              {[
                ['showCertificate', 'Show Achievement/Certificate', 'Tampilkan badge pencapaian di area profil demo.'],
                ['allowCommunityMention', 'Allow Community Mention', 'Izinkan anggota forum mention akun Anda.'],
                ['recommendationDataSharing', 'Data Sharing for Recommendation', 'Izinkan data aktivitas dipakai untuk rekomendasi mock.'],
                ['securityInsightSharing', 'Security Insight Sharing', 'Gunakan insight keamanan untuk personalisasi demo.'],
              ].map(([key, title, description]) => (
                <button
                  key={key}
                  type="button"
                  className={`cv-settings-toggle${privacy[key] ? ' is-active' : ''}`}
                  onClick={() => handlePrivacyChange(key, !privacy[key])}
                >
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>
                  <span className="cv-settings-toggle__switch" />
                </button>
              ))}
            </div>
            <div className="cv-settings-action-row">
              <button
                type="button"
                className="cv-settings-primary-button"
                onClick={handleSavePrivacy}
              >
                Save Privacy Settings
              </button>
            </div>
          </article>
        </div>
      )
    }

    if (activeSection === 'appearance' && appearance) {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Appearance Settings</h3>
              <p>Atur mode tampilan demo tanpa mengubah theme global aplikasi saat ini.</p>
            </div>
            <div className="cv-settings-form-grid">
              <div className="cv-settings-field">
                <label htmlFor="settings-theme-mode">Theme Mode</label>
                <select
                  id="settings-theme-mode"
                  value={appearance.themeMode}
                  onChange={(event) => handleAppearanceChange('themeMode', event.target.value)}
                >
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="cv-settings-field">
                <label htmlFor="settings-density">Density</label>
                <select
                  id="settings-density"
                  value={appearance.density}
                  onChange={(event) => handleAppearanceChange('density', event.target.value)}
                >
                  <option>Comfortable</option>
                  <option>Compact</option>
                </select>
              </div>
              <div className="cv-settings-field">
                <label htmlFor="settings-accent-color">Accent Color</label>
                <select
                  id="settings-accent-color"
                  value={appearance.accentColor}
                  onChange={(event) => handleAppearanceChange('accentColor', event.target.value)}
                >
                  <option>Ocean Blue</option>
                  <option>Sky Cyan</option>
                  <option>Forest Green</option>
                </select>
              </div>
            </div>
            <div className="cv-settings-toggle-list">
              <button
                type="button"
                className={`cv-settings-toggle${appearance.compactSidebar ? ' is-active' : ''}`}
                onClick={() =>
                  handleAppearanceChange('compactSidebar', !appearance.compactSidebar)
                }
              >
                <div>
                  <strong>Compact Sidebar</strong>
                  <span>Gunakan kepadatan sidebar yang lebih ringkas di mode demo.</span>
                </div>
                <span className="cv-settings-toggle__switch" />
              </button>
              <button
                type="button"
                className={`cv-settings-toggle${appearance.motionEffects ? ' is-active' : ''}`}
                onClick={() => handleAppearanceChange('motionEffects', !appearance.motionEffects)}
              >
                <div>
                  <strong>Motion Effects</strong>
                  <span>Tampilkan transisi ringan pada komponen antarmuka demo.</span>
                </div>
                <span className="cv-settings-toggle__switch" />
              </button>
            </div>
          </article>
        </div>
      )
    }

    if (activeSection === 'data') {
      return (
        <div className="cv-settings-section-grid">
          <article className="cv-settings-card">
            <div className="cv-settings-card__head">
              <h3>Data Control</h3>
              <p>Kelola export, reset, dan danger zone secara proporsional di mode demo.</p>
            </div>
            <div className="cv-settings-data-grid">
              {dataActions.map((item) => (
                <div
                  key={item.id}
                  className={`cv-settings-data-item${
                    item.tone ? ` is-${item.tone}` : ''
                  }`}
                >
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                  <button
                    type="button"
                    className="cv-settings-secondary-button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.id === 'export') {
                        handleExportSettings()
                        return
                      }

                      if (item.id === 'reset') {
                        handleResetAllSettings()
                        return
                      }

                      setFeedbackMessage(
                        'Mode demo: delete account dinonaktifkan dan tidak akan menghapus sesi.',
                      )
                    }}
                  >
                    {item.id === 'export'
                      ? 'Export Mock'
                      : item.id === 'reset'
                        ? 'Reset Mock'
                        : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>
      )
    }

    return null
  }, [
    activeSection,
    appearance,
    dataActions,
    navigate,
    notifications,
    preferences,
    privacy,
    security,
    validationErrors,
  ])

  return (
    <div className="cv-settings-page">
      <section className="cv-settings-hero">
        <div className="cv-settings-hero__copy">
          <span className="cv-settings-eyebrow">Control Center</span>
          <h1>Pengaturan CyberVault</h1>
          <p>
            Kelola preferensi akun, keamanan mock, notifikasi, privasi, tampilan,
            dan kontrol data dari satu halaman yang seimbang dan siap dihubungkan ke
            backend settings module nanti.
          </p>
        </div>

        <div className="cv-settings-stat-grid">
          {stats.map((item) => (
            <article key={item.id} className="cv-settings-stat-card">
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          ))}
        </div>
      </section>

      {feedbackMessage ? (
        <div className="cv-settings-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="cv-settings-layout">
        <aside className="cv-settings-sidebar">
          <div className="cv-settings-sidebar__head">
            <h2>Sections</h2>
            <p>Pilih area pengaturan yang ingin dikelola.</p>
          </div>

          <div className="cv-settings-tab-list">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`cv-settings-tab${activeSection === section.id ? ' is-active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <i className={`bi ${section.icon}`} aria-hidden="true" />
                <div>
                  <strong>{section.label}</strong>
                  <span>{section.description}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="cv-settings-main">
          {isLoading ? (
            <div className="cv-settings-empty-state">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>Memuat pengaturan...</h3>
              <p>Data pengaturan demo sedang disiapkan untuk halaman ini.</p>
            </div>
          ) : (
            sectionContent
          )}
        </main>
      </section>
    </div>
  )
}

export default Pengaturan
