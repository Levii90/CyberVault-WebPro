const assessmentStats = [
  {
    title: 'Skor Keamanan Anda',
    value: '80',
    suffix: '/ 100',
    note: 'Baik',
  },
  {
    title: 'Asesmen Selesai',
    value: '6',
    note: 'Tes',
  },
  {
    title: 'Kategori Dievaluasi',
    value: '5',
    note: 'Kategori',
  },
  {
    title: 'Rekomendasi Aktif',
    value: '8',
    note: 'Saran',
  },
]

const latestAssessments = [
  {
    icon: 'bi-three-dots',
    title: 'Kebiasaan Kata Sandi',
    date: '20 Mei 2024',
    score: 85,
  },
  {
    icon: 'bi-lock-fill',
    title: 'Perlindungan Data Pribadi',
    date: '18 Mei 2024',
    score: 65,
  },
  {
    icon: 'bi-pc-display',
    title: 'Keamanan Perangkat',
    date: '15 Mei 2024',
    score: 70,
  },
  {
    icon: 'bi-globe2',
    title: 'Keamanan Jaringan',
    date: '13 Mei 2024',
    score: 60,
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    title: 'Phising Awareness',
    date: '10 Mei 2024',
    score: 83,
  },
]

const categoryScores = [
  {
    icon: 'bi-three-dots',
    title: 'Kata Sandi',
    score: 85,
  },
  {
    icon: 'bi-lock-fill',
    title: 'Privasi & Data',
    score: 65,
  },
  {
    icon: 'bi-pc-display',
    title: 'Perangkat',
    score: 70,
  },
  {
    icon: 'bi-globe2',
    title: 'Jaringan',
    score: 60,
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    title: 'Phising Awareness',
    score: 83,
  },
]

const startCategories = [
  {
    icon: 'bi-three-dots',
    title: 'Kebiasaan Kata Sandi',
  },
  {
    icon: 'bi-lock-fill',
    title: 'Perlindungan Data Pribadi',
  },
  {
    icon: 'bi-pc-display',
    title: 'Keamanan Perangkat',
  },
  {
    icon: 'bi-globe2',
    title: 'Keamanan Jaringan',
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    title: 'Phising Awareness',
  },
]

function Asesmen() {
  return (
    <div className="cv-assessment-page">
      <section className="cv-assessment-hero">
        <h1>Asesmen Keamanan Digital</h1>
        <p>
          Uji dan tingkatkan kesiapan keamanan digital Anda. Dapatkan rekomendasi
          untuk perlindungan yang lebih baik.
        </p>

        <div className="cv-assessment-stat-grid">
          {assessmentStats.map((item) => (
            <article key={item.title} className="cv-assessment-stat-card">
              <p>{item.title}</p>
              <h3>
                {item.value}
                {item.suffix ? <span>{item.suffix}</span> : null}
              </h3>
              <strong>{item.note}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-assessment-overview-grid">
        <article className="cv-assessment-panel">
          <div className="cv-assessment-panel__head">
            <h2>Asesmen Terbaru</h2>
          </div>

          <div className="cv-assessment-latest-list">
            {latestAssessments.map((item) => (
              <article key={item.title} className="cv-assessment-latest-row">
                <div className="cv-assessment-latest-row__main">
                  <div className="cv-assessment-icon-badge" aria-hidden="true">
                    <i className={`bi ${item.icon}`} />
                  </div>

                  <div className="cv-assessment-latest-row__copy">
                    <h3>{item.title}</h3>
                    <p>{item.date}</p>
                  </div>
                </div>

                <div className="cv-assessment-latest-row__score">
                  {item.score} / 100
                </div>

                <button type="button" className="cv-assessment-outline-button">
                  Lihat Detail
                </button>
              </article>
            ))}
          </div>
        </article>

        <article className="cv-assessment-panel">
          <div className="cv-assessment-panel__head">
            <h2>Kategori Keamanan</h2>
          </div>

          <div className="cv-assessment-category-list">
            {categoryScores.map((item) => (
              <article key={item.title} className="cv-assessment-category-item">
                <div className="cv-assessment-icon-badge" aria-hidden="true">
                  <i className={`bi ${item.icon}`} />
                </div>

                <div className="cv-assessment-category-item__body">
                  <div className="cv-assessment-category-item__head">
                    <h3>{item.title}</h3>
                    <strong>{item.score} / 100</strong>
                  </div>

                  <div className="cv-assessment-progress">
                    <span
                      className="cv-assessment-progress__fill"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="cv-assessment-panel cv-assessment-panel--start">
        <div className="cv-assessment-panel__head">
          <div>
            <h2>Mulai Asesmen Baru</h2>
            <p>Pilih kategori asesmen yang ingin Anda kerjakan.</p>
          </div>

          <button type="button" className="cv-assessment-outline-button">
            Lihat Semua Kategori
          </button>
        </div>

        <div className="cv-assessment-start-grid">
          {startCategories.map((item) => (
            <article key={item.title} className="cv-assessment-start-card">
              <div className="cv-assessment-icon-badge cv-assessment-icon-badge--large" aria-hidden="true">
                <i className={`bi ${item.icon}`} />
              </div>

              <h3>{item.title}</h3>
              <p>15 Menit</p>

              <button type="button" className="cv-assessment-outline-button">
                Mulai
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Asesmen
