import { useEffect, useRef, useState } from 'react'
import {
  allowedEvidenceTypes,
  helpCards,
  incidentTypes,
  initialIncidentForm,
  maxEvidenceFileSize,
  reportingSteps,
} from '../../data/incidents/incidentData.js'
import {
  getIncidentDetail,
  getMyIncidentReports,
  submitIncidentReport,
} from '../../services/incidents/incidentService.js'
import '../../styles/IncidentReportPage.css'
import {
  validateEvidenceFiles,
  validateMinLength,
  validateRequired,
} from '../../utils/validators.js'

const statusFilterOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'need_more_info', label: 'Need More Info' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
]

const severityFilterOptions = [
  { value: '', label: 'Semua Severity' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

function buildIncidentPayload(formData) {
  return {
    incident_type: formData.incidentType,
    title: formData.title.trim(),
    description: formData.description.trim(),
    platform: formData.platform.trim(),
    city: formData.city.trim(),
    incident_date: formData.incidentDate,
  }
}

function mapBackendErrorsToForm(errors = {}) {
  const mappedErrors = {
    ...errors,
  }

  if (errors.incident_type) {
    mappedErrors.incidentType = errors.incident_type
  }

  if (errors.incident_date) {
    mappedErrors.incidentDate = errors.incident_date
  }

  if (errors.evidence_files) {
    mappedErrors.evidenceFiles = errors.evidence_files
  }

  return mappedErrors
}

function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getSelectedIncidentTypeLabel(incidentType) {
  const selectedType = incidentTypes.find((item) => item.id === incidentType)
  return selectedType?.label || ''
}

function validateIncidentForm(formData) {
  const nextErrors = {}

  if (!validateRequired(formData.incidentType)) {
    nextErrors.incidentType = 'Pilih jenis insiden terlebih dahulu.'
  }

  if (!validateRequired(formData.title)) {
    nextErrors.title = 'Judul laporan wajib diisi.'
  }

  if (!validateRequired(formData.description)) {
    nextErrors.description = 'Deskripsi kejadian wajib diisi.'
  } else if (!validateMinLength(formData.description, 20)) {
    nextErrors.description = 'Deskripsi kejadian minimal 20 karakter.'
  }

  const fileValidation = validateEvidenceFiles(formData.evidenceFiles, {
    allowedTypes: allowedEvidenceTypes,
    maxFileSize: maxEvidenceFileSize,
  })

  if (!fileValidation.valid) {
    nextErrors.evidenceFiles = fileValidation.error
  }

  return nextErrors
}

function PelaporanInsiden() {
  const [formData, setFormData] = useState({
    ...initialIncidentForm,
    incidentType: incidentTypes[0]?.id ?? '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [historyFilters, setHistoryFilters] = useState({
    status: '',
    severity: '',
    incident_type: '',
  })
  const [historyState, setHistoryState] = useState({
    loading: true,
    error: '',
    items: [],
  })
  const [detailState, setDetailState] = useState({
    loading: false,
    error: '',
    report: null,
    open: false,
  })
  const fileInputRef = useRef(null)

  const loadHistory = async (filters = historyFilters) => {
    setHistoryState((current) => ({
      ...current,
      loading: true,
      error: '',
    }))

    const response = await getMyIncidentReports(filters)

    if (!response.success) {
      setHistoryState({
        loading: false,
        error: response.message || 'Riwayat laporan belum dapat dimuat.',
        items: [],
      })
      return
    }

    setHistoryState({
      loading: false,
      error: '',
      items: response.data?.items || [],
    })
  }

  useEffect(() => {
    loadHistory(historyFilters)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const handleIncidentTypeSelect = (incidentType) => {
    setFormData((current) => ({
      ...current,
      incidentType,
    }))

    setErrors((current) => ({
      ...current,
      incidentType: '',
    }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files ?? [])
    const fileValidation = validateEvidenceFiles(files, {
      allowedTypes: allowedEvidenceTypes,
      maxFileSize: maxEvidenceFileSize,
    })

    if (!fileValidation.valid) {
      setErrors((current) => ({
        ...current,
        evidenceFiles: `${fileValidation.error} Maksimal ukuran file ${
          maxEvidenceFileSize / (1024 * 1024)
        }MB. Upload bukti file belum tersedia di backend saat ini.`,
      }))

      setFormData((current) => ({
        ...current,
        evidenceFiles: [],
      }))

      event.target.value = ''
      return
    }

    setFormData((current) => ({
      ...current,
      evidenceFiles: files,
    }))

    setErrors((current) => ({
      ...current,
      evidenceFiles: '',
    }))
  }

  const resetForm = () => {
    setFormData({
      ...initialIncidentForm,
      incidentType: incidentTypes[0]?.id ?? '',
    })
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleHistoryFilterChange = (event) => {
    const { name, value } = event.target

    setHistoryFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleApplyFilters = async () => {
    await loadHistory(historyFilters)
  }

  const handleResetFilters = async () => {
    const nextFilters = {
      status: '',
      severity: '',
      incident_type: '',
    }

    setHistoryFilters(nextFilters)
    await loadHistory(nextFilters)
  }

  const handleOpenDetail = async (reportCode) => {
    setDetailState({
      loading: true,
      error: '',
      report: null,
      open: true,
    })

    const response = await getIncidentDetail(reportCode)

    if (!response.success) {
      setDetailState({
        loading: false,
        error: response.message || 'Detail laporan belum dapat dimuat.',
        report: null,
        open: true,
      })
      return
    }

    setDetailState({
      loading: false,
      error: '',
      report: response.data?.report || null,
      open: true,
    })
  }

  const handleCloseDetail = () => {
    setDetailState({
      loading: false,
      error: '',
      report: null,
      open: false,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateIncidentForm(formData)
    setErrors(nextErrors)
    setSubmitResult(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await submitIncidentReport(buildIncidentPayload(formData))

      if (!response.success) {
        setErrors((current) => ({
          ...current,
          ...mapBackendErrorsToForm(response.errors || {}),
        }))

        setSubmitResult({
          type: 'error',
          message: response.message || 'Laporan gagal dikirim.',
          reportCode: '',
          status: '',
          createdAt: '',
        })
        return
      }

      const report = response.data?.report || {}

      setSubmitResult({
        type: 'success',
        message: response.message,
        reportCode: report.report_code || response.data?.report_code || '',
        status: report.status || response.data?.status || '',
        createdAt: report.created_at || response.data?.created_at || '',
      })
      resetForm()
      await loadHistory(historyFilters)
    } catch (error) {
      setSubmitResult({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat mengirim laporan.',
        reportCode: '',
        status: '',
        createdAt: '',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="cv-incident-page">
      <header className="cv-incident-page__hero">
        <h1>Pelaporan Insiden Digital</h1>
        <p>
          Laporkan kejadian atau ancaman keamanan digital yang Anda alami. Laporan
          Anda akan membantu menciptakan ruang digital yang lebih aman.
        </p>
      </header>

      <section className="cv-incident-steps" aria-label="Tahapan pelaporan">
        {reportingSteps.map((step, index) => (
          <div key={step} className="cv-incident-steps__item">
            <span className="cv-incident-steps__number">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </section>

      <div className="cv-incident-layout">
        <div className="cv-incident-main">
          <form className="cv-incident-card cv-incident-form" onSubmit={handleSubmit}>
            <div className="cv-incident-form__section-head">
              <div>
                <h2>Jenis Insiden</h2>
                <p>Pilih jenis insiden yang anda alami</p>
              </div>
              <button
                type="submit"
                className="cv-incident-next-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>

            <div className="cv-incident-type-grid">
              {incidentTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`cv-incident-type-card${
                    formData.incidentType === item.id ? ' is-active' : ''
                  }`}
                  onClick={() => handleIncidentTypeSelect(item.id)}
                  aria-pressed={formData.incidentType === item.id}
                  aria-label={`Pilih jenis insiden ${item.label}`}
                >
                  <span className="cv-incident-type-card__icon">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <span className="cv-incident-type-card__body">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                </button>
              ))}
            </div>
            {formData.incidentType ? (
              <p className="cv-incident-feedback cv-incident-feedback--selected" role="status">
                Jenis dipilih: {getSelectedIncidentTypeLabel(formData.incidentType)}
              </p>
            ) : null}
            {errors.incidentType ? (
              <p className="cv-incident-feedback cv-incident-feedback--error">
                {errors.incidentType}
              </p>
            ) : null}

            <div className="cv-incident-form__details">
              <div className="cv-incident-form__section-title">
                <h3>Detail Insiden</h3>
              </div>

              {submitResult ? (
                <div
                  className={`cv-incident-feedback-card cv-incident-feedback-card--${submitResult.type}`}
                >
                  <strong>{submitResult.message}</strong>
                  {submitResult.reportCode ? (
                    <span>Kode laporan: {submitResult.reportCode}</span>
                  ) : null}
                  {submitResult.status ? (
                    <span>Status: {submitResult.status}</span>
                  ) : null}
                  {submitResult.createdAt ? (
                    <span>Dibuat: {submitResult.createdAt}</span>
                  ) : null}
                </div>
              ) : null}

              <label className="cv-incident-field">
                <span>Judul Laporan</span>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Contoh: Saya menerima email phishing yang mengatasnamakan bank"
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title ? (
                  <small className="cv-incident-feedback cv-incident-feedback--error">
                    {errors.title}
                  </small>
                ) : null}
              </label>

              <label className="cv-incident-field">
                <span>Deskripsi Kejadian</span>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan secara detail kronologi kejadian yang anda alami..."
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description ? (
                  <small className="cv-incident-feedback cv-incident-feedback--error">
                    {errors.description}
                  </small>
                ) : null}
              </label>

              <div className="cv-incident-form__grid">
                <label className="cv-incident-field">
                  <span>Waktu Kejadian</span>
                  <div className="cv-incident-field__with-icon">
                    <input
                      name="incidentDate"
                      type="datetime-local"
                      value={formData.incidentDate}
                      onChange={handleChange}
                    />
                    <i className="bi bi-calendar3" />
                  </div>
                </label>

                <label className="cv-incident-field">
                  <span>Lampiran Bukti (Opsional)</span>
                  <button
                    type="button"
                    className="cv-incident-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bi bi-upload" />
                    {formData.evidenceFiles.length > 0
                      ? `${formData.evidenceFiles.length} file dipilih`
                      : 'Upload File'}
                    <small>PNG, JPG, PDF (maks. 2MB)</small>
                  </button>
                  <input
                    ref={fileInputRef}
                    className="cv-incident-file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                  {formData.evidenceFiles.length > 0 ? (
                    <small className="cv-incident-feedback cv-incident-feedback--muted">
                      {formData.evidenceFiles.map((file) => file.name).join(', ')}. Upload
                      bukti file belum tersedia. Ringkas bukti pada deskripsi laporan.
                    </small>
                  ) : null}
                  {errors.evidenceFiles ? (
                    <small className="cv-incident-feedback cv-incident-feedback--error">
                      {errors.evidenceFiles}
                    </small>
                  ) : null}
                </label>

                <label className="cv-incident-field">
                  <span>Platform / Kanal Kejadian (Opsional)</span>
                  <input
                    name="platform"
                    type="text"
                    value={formData.platform}
                    onChange={handleChange}
                    placeholder="Contoh: Email, Whatsapp, Instagram, dll"
                  />
                </label>

                <label className="cv-incident-field">
                  <span>Kota / Lokasi Kejadian (Opsional)</span>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Contoh: Bandung"
                  />
                </label>
              </div>
            </div>
          </form>

          <section className="cv-incident-card cv-incident-history">
            <div className="cv-incident-history__header">
              <div>
                <h2>Riwayat Laporan Anda</h2>
                <p>Lihat laporan yang sudah pernah dikirim, status, dan detail dasarnya.</p>
              </div>
            </div>

            <div className="cv-incident-history__filters">
              <label className="cv-incident-field">
                <span>Status</span>
                <select
                  name="status"
                  value={historyFilters.status}
                  onChange={handleHistoryFilterChange}
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option.value || 'all-status'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="cv-incident-field">
                <span>Severity</span>
                <select
                  name="severity"
                  value={historyFilters.severity}
                  onChange={handleHistoryFilterChange}
                >
                  {severityFilterOptions.map((option) => (
                    <option key={option.value || 'all-severity'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="cv-incident-field">
                <span>Jenis Insiden</span>
                <select
                  name="incident_type"
                  value={historyFilters.incident_type}
                  onChange={handleHistoryFilterChange}
                >
                  <option value="">Semua Jenis</option>
                  {incidentTypes.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="cv-incident-history__filter-actions">
                <button type="button" className="cv-incident-history__action" onClick={handleApplyFilters}>
                  Terapkan
                </button>
                <button
                  type="button"
                  className="cv-incident-history__action is-secondary"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>

            {historyState.loading ? (
              <div className="cv-incident-history__state">Memuat riwayat laporan...</div>
            ) : null}

            {!historyState.loading && historyState.error ? (
              <div className="cv-incident-history__state is-error">{historyState.error}</div>
            ) : null}

            {!historyState.loading && !historyState.error && historyState.items.length === 0 ? (
              <div className="cv-incident-history__state">
                Belum ada laporan yang cocok dengan filter saat ini.
              </div>
            ) : null}

            {!historyState.loading && !historyState.error && historyState.items.length > 0 ? (
              <div className="cv-incident-history__list">
                {historyState.items.map((report) => (
                  <article key={report.report_code} className="cv-incident-history__item">
                    <div className="cv-incident-history__item-main">
                      <div className="cv-incident-history__item-top">
                        <strong>{report.title || report.report_code}</strong>
                        <span className={`cv-incident-history__badge is-${report.status}`}>
                          {report.status}
                        </span>
                      </div>
                      <p>{report.report_code}</p>
                      <div className="cv-incident-history__meta">
                        <span>{report.incident_type}</span>
                        <span>{report.platform || 'Platform tidak diisi'}</span>
                        <span>{report.city || 'Kota tidak diisi'}</span>
                        <span>{report.severity}</span>
                        <span>{formatDateTime(report.created_at)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cv-incident-history__action"
                      onClick={() => handleOpenDetail(report.report_code)}
                    >
                      Lihat Detail
                    </button>
                  </article>
                ))}
              </div>
            ) : null}

            {detailState.open ? (
              <div className="cv-incident-detail-panel">
                <div className="cv-incident-detail-panel__header">
                  <div>
                    <h3>Detail Laporan</h3>
                    <p>Preview laporan insiden yang dipilih dari riwayat Anda.</p>
                  </div>
                  <button
                    type="button"
                    className="cv-incident-history__action is-secondary"
                    onClick={handleCloseDetail}
                  >
                    Tutup
                  </button>
                </div>

                {detailState.loading ? (
                  <div className="cv-incident-history__state">Memuat detail laporan...</div>
                ) : null}

                {!detailState.loading && detailState.error ? (
                  <div className="cv-incident-history__state is-error">{detailState.error}</div>
                ) : null}

                {!detailState.loading && !detailState.error && detailState.report ? (
                  <div className="cv-incident-detail-panel__content">
                    <div className="cv-incident-detail-panel__grid">
                      <div>
                        <span>Kode Laporan</span>
                        <strong>{detailState.report.report_code}</strong>
                      </div>
                      <div>
                        <span>Status</span>
                        <strong>{detailState.report.status}</strong>
                      </div>
                      <div>
                        <span>Jenis Insiden</span>
                        <strong>{detailState.report.incident_type}</strong>
                      </div>
                      <div>
                        <span>Severity</span>
                        <strong>{detailState.report.severity}</strong>
                      </div>
                      <div>
                        <span>Platform</span>
                        <strong>{detailState.report.platform || '-'}</strong>
                      </div>
                      <div>
                        <span>Kota</span>
                        <strong>{detailState.report.city || '-'}</strong>
                      </div>
                      <div>
                        <span>Waktu Kejadian</span>
                        <strong>{formatDateTime(detailState.report.incident_date)}</strong>
                      </div>
                      <div>
                        <span>Dibuat</span>
                        <strong>{formatDateTime(detailState.report.created_at)}</strong>
                      </div>
                    </div>

                    <div className="cv-incident-detail-panel__body">
                      <div>
                        <span>Judul</span>
                        <p>{detailState.report.title || '-'}</p>
                      </div>
                      <div>
                        <span>Deskripsi</span>
                        <p>{detailState.report.description || '-'}</p>
                      </div>
                      <div>
                        <span>Suspicious URL</span>
                        <p>{detailState.report.suspicious_url || '-'}</p>
                      </div>
                      <div>
                        <span>Ringkasan Bukti</span>
                        <p>{detailState.report.evidence_summary || '-'}</p>
                      </div>
                      <div>
                        <span>Contact Preference</span>
                        <p>{detailState.report.contact_preference || '-'}</p>
                      </div>
                    </div>

                    <div className="cv-incident-detail-panel__logs">
                      <h4>Status Log</h4>
                      {detailState.report.status_logs?.length ? (
                        detailState.report.status_logs.map((statusLog) => (
                          <div
                            key={`${statusLog.id}-${statusLog.created_at}`}
                            className="cv-incident-detail-panel__log-item"
                          >
                            <strong>{statusLog.new_status}</strong>
                            <p>{statusLog.note || 'Tidak ada catatan tambahan.'}</p>
                            <span>{formatDateTime(statusLog.created_at)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="cv-incident-history__state">Belum ada status log tambahan.</div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="cv-incident-side">
          {helpCards.map((card) => (
            <section key={card.title} className="cv-incident-card cv-incident-help-card">
              <h2>{card.title}</h2>

              {card.type === 'checklist' ? (
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {card.type === 'contact' ? (
                <>
                  <p>{card.description}</p>

                  <div className="cv-incident-contact-box">
                    {card.contacts.map((contact) => (
                      <div key={contact.title} className="cv-incident-contact-item">
                        <span className="cv-incident-contact-item__dot" />
                        <div>
                          <strong>{contact.title}</strong>
                          <p>{contact.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ))}
        </aside>
      </div>
    </section>
  )
}

export default PelaporanInsiden
