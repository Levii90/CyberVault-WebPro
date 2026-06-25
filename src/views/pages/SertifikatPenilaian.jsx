import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  certificateStats,
  certificateStatusOptions,
  recommendationCards,
} from '../../data/certificates/certificateData.js'
import {
  downloadCertificate,
  generateCertificate,
  getAssessmentHistory,
  getCertificates,
  getScoreSummary,
  verifyCertificateCode,
} from '../../services/certificates/certificateService.js'
import '../../styles/SertifikatPenilaianPage.css'

function getCertificateStatusLabel(status) {
  if (status === 'not_eligible') {
    return 'Not Eligible'
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function SectionHeading({ title, description }) {
  return (
    <div className="cv-cert-section__head cv-cert-section__head--rich">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  )
}

function SertifikatPenilaian() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [history, setHistory] = useState([])
  const [certificates, setCertificates] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [activeStatus, setActiveStatus] = useState('all')
  const [feedback, setFeedback] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [verificationTone, setVerificationTone] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCertificatePage() {
      setIsLoading(true)

      try {
        const [summaryResponse, historyResponse, certificatesResponse] = await Promise.all([
          getScoreSummary(),
          getAssessmentHistory(),
          getCertificates(),
        ])

        const historyData = historyResponse.data || []
        const certificatesData = certificatesResponse.data || []

        setSummary(summaryResponse.data || null)
        setHistory(historyData)
        setCertificates(certificatesData)
        setSelectedHistory(historyData[0] || null)
        setSelectedCertificate(certificatesData[0] || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificatePage()
  }, [])

  const statCards = useMemo(() => {
    const issuedCount = certificates.filter((item) => item.status === 'issued').length
    const eligibleCount = certificates.filter((item) => item.status === 'eligible').length
    const notEligibleCount = certificates.filter((item) => item.status === 'not_eligible').length

    return certificateStats.map((item) => {
      if (item.id === 'issued') {
        return { ...item, value: issuedCount, note: 'Sertifikat aktif' }
      }

      if (item.id === 'eligible') {
        return { ...item, value: eligibleCount, note: 'Siap digenerate' }
      }

      if (item.id === 'notEligible') {
        return { ...item, value: notEligibleCount, note: 'Perlu asesmen ulang' }
      }

      return { ...item, value: history.length, note: 'Skor terekam pada mock' }
    })
  }, [certificates, history])

  const filteredCertificates = useMemo(() => {
    if (activeStatus === 'all') {
      return certificates
    }

    return certificates.filter((item) => item.status === activeStatus)
  }, [activeStatus, certificates])

  async function handleGenerateCertificate(certificate) {
    if (certificate.status === 'not_eligible') {
      setFeedback('Skor belum memenuhi syarat. Silakan ulangi asesmen atau pelajari materi terkait.')
      return
    }

    if (certificate.status === 'issued') {
      setFeedback('Sertifikat ini sudah berstatus issued pada mode demo.')
      return
    }

    const response = await generateCertificate(certificate.id)

    setCertificates((currentCertificates) =>
      currentCertificates.map((item) =>
        item.id === certificate.id
          ? {
              ...item,
              status: response.data.status,
              issuedAt: response.data.issuedAt,
              validUntil: response.data.validUntil,
            }
          : item,
      ),
    )
    setSelectedCertificate((currentSelected) =>
      currentSelected?.id === certificate.id
        ? {
            ...currentSelected,
            status: response.data.status,
            issuedAt: response.data.issuedAt,
            validUntil: response.data.validUntil,
          }
        : currentSelected,
    )
    setFeedback(response.message)
  }

  async function handleDownloadCertificate(certificate) {
    const response = await downloadCertificate(certificate.id)
    setFeedback(response.message)
  }

  async function handleVerifyCertificate() {
    if (!verificationCode.trim()) {
      setVerificationTone('error')
      setVerificationMessage('Masukkan kode sertifikat terlebih dahulu.')
      return
    }

    const response = await verifyCertificateCode(verificationCode.trim())

    if (!response.success) {
      setVerificationTone('error')
      setVerificationMessage(response.message)
      return
    }

    setVerificationTone('success')
    setVerificationMessage(`${response.message} (${response.data.title})`)
  }

  return (
    <div className="cv-cert-page">
      <section className="cv-cert-hero cv-cert-hero--interactive">
        <div className="cv-cert-hero__copy">
          <span className="cv-cert-eyebrow">Certificate Center</span>
          <h1>Sertifikat dan Penilaian</h1>
          <p>
            Pantau skor keamanan digital, riwayat hasil asesmen, status sertifikat,
            dan tindak lanjut mock dalam satu halaman yang siap dihubungkan ke module
            certificates dan assessments nanti.
          </p>
        </div>

        {summary ? (
          <div className="cv-cert-hero__summary">
            <div>
              <span>Current Score</span>
              <strong>{summary.currentScore}</strong>
            </div>
            <div>
              <span>Risk Level</span>
              <strong>{summary.riskLevel}</strong>
            </div>
            <div>
              <span>Last Assessment</span>
              <strong>{summary.lastAssessment}</strong>
            </div>
          </div>
        ) : null}
      </section>

      {feedback ? (
        <div className="cv-cert-feedback" role="status">
          {feedback}
        </div>
      ) : null}

      <section className="cv-cert-section cv-cert-section--summary">
        <SectionHeading
          title="Ringkasan Skor & Status"
          description="Skor saat ini, progres peningkatan, dan distribusi status sertifikat secara mock."
        />

        {isLoading ? (
          <div className="cv-cert-empty-state">
            <i className="bi bi-arrow-repeat" aria-hidden="true" />
            <h3>Memuat ringkasan sertifikat...</h3>
            <p>Data pencapaian sedang disiapkan untuk mode demo.</p>
          </div>
        ) : null}

        {!isLoading && summary ? (
          <>
            <div className="cv-cert-summary-grid cv-cert-summary-grid--interactive">
              <article className="cv-cert-summary-card cv-cert-summary-card--score">
                <div className="cv-cert-summary-card__icon">
                  <i className="bi bi-graph-up-arrow" />
                </div>
                <div className="cv-cert-summary-card__body">
                  <p>Current Score</p>
                  <h3>
                    {summary.currentScore}
                    <span>/ 100</span>
                  </h3>
                  <strong>{summary.improvement} dari asesmen sebelumnya</strong>
                </div>
              </article>

              <article className="cv-cert-summary-card">
                <div className="cv-cert-summary-card__icon">
                  <i className="bi bi-shield-check" />
                </div>
                <div className="cv-cert-summary-card__body">
                  <p>Risk Level</p>
                  <h3>{summary.riskLevel}</h3>
                  <strong>{summary.completedAssessments} asesmen selesai</strong>
                </div>
              </article>

              <article className="cv-cert-summary-card">
                <div className="cv-cert-summary-card__icon">
                  <i className="bi bi-calendar-check" />
                </div>
                <div className="cv-cert-summary-card__body">
                  <p>Last Assessment</p>
                  <h3>{summary.lastAssessment}</h3>
                  <strong>{summary.lastAssessmentDate}</strong>
                </div>
              </article>

              <article className="cv-cert-summary-card">
                <div className="cv-cert-summary-card__icon">
                  <i className="bi bi-stars" />
                </div>
                <div className="cv-cert-summary-card__body">
                  <p>Area Kuat</p>
                  <h3>{summary.strongAreas.length}</h3>
                  <strong>{summary.strongAreas.join(', ')}</strong>
                </div>
              </article>
            </div>

            <div className="cv-cert-stat-grid">
              {statCards.map((item) => (
                <article key={item.id} className="cv-cert-stat-card">
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <div>
                    <span>{item.title}</span>
                    <strong>{item.value}</strong>
                    <small>{item.note}</small>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="cv-cert-layout-grid">
        <div className="cv-cert-layout-grid__main">
          <section className="cv-cert-section">
            <SectionHeading
              title="Riwayat Hasil Asesmen"
              description="Klik salah satu hasil untuk melihat detail skor, area kuat, dan area yang perlu diperbaiki."
            />

            {!isLoading ? (
              <div className="cv-cert-assessment-list">
                {history.map((item) => (
                  <article
                    key={item.id}
                    className={`cv-cert-assessment-row${
                      selectedHistory?.id === item.id ? ' is-selected' : ''
                    }`}
                    onClick={() => setSelectedHistory(item)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedHistory(item)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cv-cert-assessment-row__main">
                      <div className="cv-cert-assessment-row__icon" aria-hidden="true">
                        <i className="bi bi-journal-richtext" />
                      </div>

                      <div className="cv-cert-assessment-row__copy">
                        <h3>{item.assessmentTitle}</h3>
                        <p>
                          {item.completedAt} • {item.questionCount} pertanyaan
                        </p>
                      </div>
                    </div>

                    <div className="cv-cert-assessment-row__score">{item.score}/100</div>
                    <div className="cv-cert-assessment-row__status">{item.riskLevel}</div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <section className="cv-cert-section">
            <SectionHeading
              title="Daftar Sertifikat"
              description="Filter status sertifikat lalu buka detail untuk download, generate, atau verifikasi kode."
            />

            <div className="cv-cert-filter-row">
              {certificateStatusOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`cv-cert-filter-chip${activeStatus === item.id ? ' is-active' : ''}`}
                  onClick={() => setActiveStatus(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {!isLoading && filteredCertificates.length === 0 ? (
              <div className="cv-cert-empty-state">
                <i className="bi bi-inboxes" aria-hidden="true" />
                <h3>Tidak ada sertifikat pada filter ini</h3>
                <p>Coba pilih filter lain untuk melihat status sertifikat yang tersedia.</p>
              </div>
            ) : null}

            {!isLoading && filteredCertificates.length > 0 ? (
              <div className="cv-cert-certificate-grid cv-cert-certificate-grid--interactive">
                {filteredCertificates.map((item) => (
                  <article
                    key={item.id}
                    className={`cv-cert-certificate-card${
                      selectedCertificate?.id === item.id ? ' is-selected' : ''
                    }`}
                  >
                    <div className="cv-cert-certificate-card__icon" aria-hidden="true">
                      <i className="bi bi-patch-check-fill" />
                    </div>

                    <span className={`cv-cert-status-chip is-${item.status}`}>
                      {getCertificateStatusLabel(item.status)}
                    </span>

                    <h3>{item.title}</h3>

                    <p className="cv-cert-certificate-card__meta">
                      Assessment
                      <span>{item.relatedAssessment}</span>
                    </p>

                    <p className="cv-cert-certificate-card__score">
                      Skor {item.userScore} / Target {item.eligibleScore}
                    </p>

                    <div className="cv-cert-certificate-card__actions">
                      <button
                        type="button"
                        className="cv-cert-outline-button"
                        onClick={() => setSelectedCertificate(item)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="cv-cert-layout-grid__side">
          <section className="cv-cert-section cv-cert-section--preview">
            <SectionHeading
              title="Detail Penilaian"
              description="Preview hasil asesmen terpilih dan arahan tindak lanjut."
            />

            {selectedHistory ? (
              <div className="cv-cert-preview-card">
                <h3>{selectedHistory.assessmentTitle}</h3>
                <div className="cv-cert-preview-card__meta">
                  <span>{selectedHistory.completedAt}</span>
                  <span>{selectedHistory.score}/100</span>
                  <span>{selectedHistory.riskLevel}</span>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Area Kuat</h4>
                  <div className="cv-cert-tag-list">
                    {selectedHistory.strongAreas.map((item) => (
                      <span key={item} className="cv-cert-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Area Perlu Diperbaiki</h4>
                  <div className="cv-cert-tag-list">
                    {selectedHistory.weakAreas.map((item) => (
                      <span key={item} className="cv-cert-tag cv-cert-tag--warning">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Rekomendasi</h4>
                  <p>{selectedHistory.recommendation}</p>
                </div>

                <div className="cv-cert-preview-card__actions">
                  <button
                    type="button"
                    className="cv-cert-pill-button"
                    onClick={() => navigate('/asesmen')}
                  >
                    Ulangi Asesmen
                  </button>
                  <button
                    type="button"
                    className="cv-cert-outline-button"
                    onClick={() => navigate('/pusat-edukasi')}
                  >
                    Pelajari Rekomendasi
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="cv-cert-section cv-cert-section--preview">
            <SectionHeading
              title="Preview Sertifikat"
              description="Lihat status, kode, skill, dan action mock untuk sertifikat terpilih."
            />

            {selectedCertificate ? (
              <div className="cv-cert-preview-card">
                <span className={`cv-cert-status-chip is-${selectedCertificate.status}`}>
                  {getCertificateStatusLabel(selectedCertificate.status)}
                </span>
                <h3>{selectedCertificate.title}</h3>

                <div className="cv-cert-preview-card__meta">
                  <span>{selectedCertificate.certificateCode}</span>
                  <span>{selectedCertificate.relatedAssessment}</span>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Detail Skor</h4>
                  <p>
                    Skor pengguna {selectedCertificate.userScore}, minimum kelayakan{' '}
                    {selectedCertificate.eligibleScore}.
                  </p>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Masa Berlaku</h4>
                  <p>
                    Diterbitkan: {selectedCertificate.issuedAt || '-'} <br />
                    Berlaku sampai: {selectedCertificate.validUntil || '-'}
                  </p>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Deskripsi</h4>
                  <p>{selectedCertificate.description}</p>
                </div>

                <div className="cv-cert-preview-card__section">
                  <h4>Skills</h4>
                  <div className="cv-cert-tag-list">
                    {selectedCertificate.skills.map((item) => (
                      <span key={item} className="cv-cert-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cv-cert-preview-card__actions">
                  <button
                    type="button"
                    className="cv-cert-pill-button"
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                  >
                    Download Sertifikat
                  </button>
                  <button
                    type="button"
                    className="cv-cert-outline-button"
                    onClick={() => handleGenerateCertificate(selectedCertificate)}
                  >
                    Generate Sertifikat
                  </button>
                  <button
                    type="button"
                    className="cv-cert-outline-button"
                    onClick={() => navigate('/asesmen')}
                  >
                    Ulangi Asesmen
                  </button>
                </div>

                <div className="cv-cert-verify">
                  <label htmlFor="certificate-code">Verifikasi Kode</label>
                  <div className="cv-cert-verify__row">
                    <input
                      id="certificate-code"
                      type="text"
                      placeholder="Masukkan kode sertifikat"
                      value={verificationCode}
                      onChange={(event) => setVerificationCode(event.target.value)}
                    />
                    <button
                      type="button"
                      className="cv-cert-outline-button"
                      onClick={handleVerifyCertificate}
                    >
                      Verifikasi
                    </button>
                  </div>
                  {verificationMessage ? (
                    <div className={`cv-cert-verify__message is-${verificationTone}`}>
                      {verificationMessage}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </aside>
      </section>

      <section className="cv-cert-cta cv-cert-cta--interactive">
        <div>
          <h2>Tindak Lanjut Berikutnya</h2>
          <p>
            Gunakan hasil penilaian ini untuk menentukan apakah Anda perlu belajar
            lagi atau langsung mengulang asesmen.
          </p>
        </div>

        <div className="cv-cert-cta__actions">
          {recommendationCards.map((item) => (
            <button
              key={item.id}
              type="button"
              className="cv-cert-pill-button cv-cert-pill-button--light"
              onClick={() => navigate(item.to)}
            >
              {item.ctaLabel}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SertifikatPenilaian
