const summaryCards = [
  {
    icon: 'bi-patch-check-fill',
    title: 'Sertifikat Diraih',
    value: '8',
    total: 'Sertifikat',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Rata - Rata Skor',
    value: '80',
    total: '/ 100',
    note: 'Baik',
  },
  {
    icon: 'bi-book-half',
    title: 'Materi Selesai',
    value: '12',
    total: '/ 24',
    note: 'Materi',
  },
  {
    icon: 'bi-check2-circle',
    title: 'Ujian Lulus',
    value: '12',
    total: 'Ujian',
  },
]

const certificates = [
  {
    title: 'Keamanan Media Sosial',
    date: '28 Mei 2024',
    score: '85/100',
  },
  {
    title: 'Phicing dan Social Engineering',
    date: '20 Mei 2024',
    score: '90/100',
  },
  {
    title: 'Pengetahuan Lanjutan',
    date: '15 Mei 2024',
    score: '80/100',
  },
  {
    title: 'Privasi Data Digital',
    date: '11 Mei 2024',
    score: '78/100',
  },
]

const assessments = [
  {
    title: 'Kuis: Phising - Tingkat Lanjutan',
    meta: '22 Mei 2024 (15 Soal)',
    score: '95/100',
    status: 'Lulus',
  },
  {
    title: 'Ujian: Keamanan E-Wallet',
    meta: '18 Mei 2024 (10 Soal)',
    score: '85/100',
    status: 'Lulus',
  },
  {
    title: 'Kuis: Kebocoran Data',
    meta: '15 Mei 2024 (10 Soal)',
    score: '77/100',
    status: 'Lulus',
  },
  {
    title: 'Ujian: Penggunaan Sandi',
    meta: '10 Mei 2024 (20 Soal)',
    score: '80/100',
    status: 'Lulus',
  },
]

function SectionHeading({ title, actionLabel }) {
  return (
    <div className="cv-cert-section__head">
      <h2>{title}</h2>
      {actionLabel ? (
        <button type="button" className="cv-cert-pill-button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function SertifikatPenilaian() {
  return (
    <div className="cv-cert-page">
      <section className="cv-cert-hero">
        <h1>Sertifikat dan Penilaian</h1>
        <p>
          Lihat pencapaian belajar Anda, hasil penilaian, dan sertifikat yang
          telah diraih.
        </p>
      </section>

      <section className="cv-cert-section">
        <SectionHeading title="Ringkasan Pencapaian" />

        <div className="cv-cert-summary-grid">
          {summaryCards.map((item) => (
            <article key={item.title} className="cv-cert-summary-card">
              <div className="cv-cert-summary-card__icon">
                <i className={`bi ${item.icon}`} />
              </div>

              <div className="cv-cert-summary-card__body">
                <p>{item.title}</p>
                <h3>
                  {item.value}
                  <span>{item.total}</span>
                </h3>
                <strong>{item.note ?? item.total}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-cert-section">
        <SectionHeading title="Sertifikat Terbaru" actionLabel="Lihat Semua" />

        <div className="cv-cert-certificate-grid">
          {certificates.map((item) => (
            <article key={item.title} className="cv-cert-certificate-card">
              <div className="cv-cert-certificate-card__icon" aria-hidden="true">
                <i className="bi bi-patch-check-fill" />
              </div>

              <h3>{item.title}</h3>

              <p className="cv-cert-certificate-card__meta">
                Diperoleh pada
                <span>{item.date}</span>
              </p>

              <p className="cv-cert-certificate-card__score">Skor: {item.score}</p>

              <button type="button" className="cv-cert-outline-button">
                Lihat Sertifikat
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-cert-section cv-cert-section--assessments">
        <SectionHeading title="Riwayat Penilaian Terakhir" actionLabel="Lihat Semua" />

        <div className="cv-cert-assessment-list">
          {assessments.map((item) => (
            <article key={item.title} className="cv-cert-assessment-row">
              <div className="cv-cert-assessment-row__main">
                <div className="cv-cert-assessment-row__icon" aria-hidden="true">
                  <i className="bi bi-journal-richtext" />
                </div>

                <div className="cv-cert-assessment-row__copy">
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
              </div>

              <div className="cv-cert-assessment-row__score">{item.score}</div>

              <div className="cv-cert-assessment-row__status">{item.status}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-cert-cta">
        <div>
          <h2>terus Tingkatkan Kemampuan Anda!</h2>
          <p>
            Ikuti lebih banyak materi dan ujian untuk mendapatkan sertifikat
            berikutnya.
          </p>
        </div>

        <button type="button" className="cv-cert-pill-button cv-cert-pill-button--light">
          Jelajahi Materi
        </button>
      </section>
    </div>
  )
}

export default SertifikatPenilaian
