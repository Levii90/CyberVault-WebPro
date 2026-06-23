import '../../styles/InformasiPeringatanPage.css'

function InformasiPeringatan() {
  const tabs = [
    'Beranda',
    'Tren Ancaman',
    'Kebocoran Data',
    'Peringatan Phising',
    'Regulasi & Kebijakan',
  ]

  const peringatanTerbaru = [
    {
      level: 'Peringatan Tinggi',
      tone: 'danger',
      title: 'Modus Penipuan QRIS Palsu Meningkat',
      description:
        'Waspadai penipuan menggunakan QRIS palsu di merchant atau donasi online.',
      date: '28 Mei 2024, 14:30 WIB',
    },
    {
      level: 'Waspada',
      tone: 'warning',
      title: 'Phising Email Mengatasnamakan Pemerintah',
      description:
        'Jangan klik tautan mencurigakan pada email yang mengatasnamakan instansi pemerintah.',
      date: '27 Mei 2024, 10:15 WIB',
    },
    {
      level: 'Waspada',
      tone: 'warning',
      title: 'Akun Media Sosial Diretas Melalui Tautan Palsu',
      description:
        'Banyak laporan akun diretas setelah mengklik tautan hadiah atau kuis palsu.',
      date: '26 Mei 2024, 09:20 WIB',
    },
  ]

  const trenAncaman = [
    { icon: 'bi-envelope-x-fill', label: 'Phising', value: '45%' },
    { icon: 'bi-mask', label: 'Penipuan Online', value: '25%' },
    { icon: 'bi-file-earmark-lock-fill', label: 'Kebocoran Data', value: '15%' },
    { icon: 'bi-unlock-fill', label: 'Akun Diretas', value: '10%' },
    { icon: 'bi-cpu-fill', label: 'Malware atau Virus', value: '5%' },
  ]

  const kebocoranData = [
    {
      title: 'Platform E-Commerce Indonesia',
      subtitle: 'Data: Email, Nomor Telepon, Alamat',
      level: 'Tinggi',
      tone: 'danger',
      date: '26 Mei 2024',
    },
    {
      title: 'Aplikasi Kesehatan',
      subtitle: 'Data: Email, Tanggal Lahir',
      level: 'Sedang',
      tone: 'warning',
      date: '22 Mei 2024',
    },
    {
      title: 'Marketplace Lokal',
      subtitle: 'Data: Nama, Email',
      level: 'Sedang',
      tone: 'warning',
      date: '20 Mei 2024',
    },
    {
      title: 'Aplikasi Transportasi Lokal',
      subtitle: 'Data: Nomor Telepon',
      level: 'Rendah',
      tone: 'success',
      date: '18 Mei 2024',
    },
  ]

  const regulasi = [
    {
      title: 'PP No. 71 Tahun 2019',
      description: 'Penyelenggaraan Sistem dan Transaksi Elektronik (PSET)',
      date: '10 Mei 2024',
    },
    {
      title: 'Permen Kominfo No. 5 tahun 2020',
      description: 'Penyelenggara Sistem Elektronik Lingkup Privat',
      date: '08 Mei 2024',
    },
    {
      title: 'UU No. 27 Tahun 2022',
      description: 'Perlindungan Data Pribadi',
      date: '05 Mei 2024',
    },
  ]

  return (
    <div className="cv-info-page">
      <section className="cv-info-hero">
        <h1>Pusat Informasi &amp; Peringatan Siber</h1>
        <p>
          informasi terbaru seputar keamanan digital, keamanan siber, dan peringatan
          penting untuk masyarakat
        </p>
      </section>

      <section className="cv-info-board">
        <div className="cv-info-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`cv-info-tabs__item${index === 0 ? ' is-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="cv-info-section">
          <div className="cv-info-section__head">
            <h2>Peringatan Terbaru</h2>
            <button type="button" className="cv-info-button">
              Lihat Semua
            </button>
          </div>

          <div className="cv-info-alert-grid">
            {peringatanTerbaru.map((item) => (
              <article key={item.title} className="cv-info-alert-card">
                <span className={`cv-info-chip is-${item.tone}`}>{item.level}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="cv-info-alert-card__footer">
                  <span>{item.date}</span>
                  <button type="button" className="cv-info-link-button">
                    Baca Selengkapnya
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="cv-info-columns">
          <section className="cv-info-panel">
            <div className="cv-info-section__head">
              <h2>Tren Ancaman</h2>
              <button type="button" className="cv-info-button">
                Lihat Semua
              </button>
            </div>

            <div className="cv-info-threat-list">
              {trenAncaman.map((item) => (
                <article key={item.label} className="cv-info-threat-item">
                  <div className="cv-info-threat-item__main">
                    <i className={`bi ${item.icon}`} />
                    <strong>{item.label}</strong>
                  </div>
                  <span>{item.value}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="cv-info-panel">
            <div className="cv-info-section__head">
              <h2>Kebocoran Data Terbaru</h2>
              <button type="button" className="cv-info-button">
                Lihat Semua
              </button>
            </div>

            <div className="cv-info-breach-list">
              {kebocoranData.map((item) => (
                <article key={item.title} className="cv-info-breach-item">
                  <div className="cv-info-breach-item__copy">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="cv-info-breach-item__meta">
                    <span className={`cv-info-chip is-${item.tone}`}>{item.level}</span>
                    <strong>{item.date}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="cv-info-section cv-info-section--regulation">
          <div className="cv-info-section__head">
            <h2>Update Regulasi &amp; Kebijakan</h2>
            <button type="button" className="cv-info-button">
              Lihat Semua
            </button>
          </div>

          <div className="cv-info-regulation-grid">
            {regulasi.map((item) => (
              <article key={item.title} className="cv-info-regulation-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>{item.date}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default InformasiPeringatan
