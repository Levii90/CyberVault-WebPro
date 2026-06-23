import { Link } from 'react-router-dom'
import heroImage from '../../assets/WhatsApp Image 2026-06-10 at 15.47.24.jpeg'
import '../../styles/DashboardPage.css'

function Dashboard() {
  const statistik = [
    {
      icon: 'bi-shield-lock',
      title: 'Cyber Awareness Score',
      value: '80',
      suffix: '/100',
      note: 'Baik',
      trend: '+8 minggu ini',
    },
    {
      icon: 'bi-mortarboard',
      title: 'Progres Belajar',
      value: '50%',
      note: '12 / 24 Materi Selesai',
      trend: '3 modul aktif',
    },
    {
      icon: 'bi-file-earmark-text',
      title: 'Laporan Keaktifan',
      value: '3',
      note: '2 Sedang Diproses',
      trend: '1 prioritas tinggi',
    },
    {
      icon: 'bi-patch-check',
      title: 'Sertifikat Pembelajaran',
      value: '6',
      note: 'Lihat Semua',
      trend: '2 siap diunduh',
    },
  ]

  const aksiCepat = [
    {
      icon: 'bi-book',
      title: 'Mulai Belajar',
      text: 'Akses materi & kuis keamanan digital',
      to: '/pusat-edukasi',
    },
    {
      icon: 'bi-bug',
      title: 'Laporkan Insiden',
      text: 'Laporkan kejadian mencurigakan',
      to: '/pelaporan-insiden',
    },
    {
      icon: 'bi-file-earmark-lock',
      title: 'Baca Cyber Alert',
      text: 'Dapatkan berita & peringatan terbaru',
      to: '/informasi-peringatan',
    },
  ]

  const progresBelajar = [
    { label: 'Keamanan Akun & Password', value: '70%', detail: '4 dari 5 modul' },
    { label: 'Privasi Data Pribadi', value: '50%', detail: '2 kuis menunggu' },
    { label: 'Phising & Social Engineering', value: '35%', detail: 'Lanjutkan sesi ke-3' },
  ]

  const berita = [
    {
      icon: 'bi-exclamation-triangle-fill',
      title: 'Peringatan: Modus Penipuan QRIS Palsu Meningkat',
      text: 'Waspadai modus penipuan menggunakan QRIS palsu yang marak terjadi di berbagai kota.',
      tag: 'Peringatan',
      time: '2 Jam Lalu',
      tone: 'danger',
    },
    {
      icon: 'bi-lock-fill',
      title: 'Kebocoran Data di Platform E-Commerce',
      text: 'Beberapa data pengguna e-commerce dilaporkan bocor. Segera ubah password dan aktifkan autentikasi dua faktor.',
      tag: 'Informasi',
      time: '2 Jam Lalu',
      tone: 'info',
    },
  ]

  const aktivitasTerbaru = [
    {
      icon: 'bi-book',
      title: 'Menyelesaikan materi',
      subtitle: 'Phishing: Kenali & Hindari',
      time: 'Hari ini, 09:30',
      tone: 'green',
    },
    {
      icon: 'bi-ui-checks-grid',
      title: 'Menyelesaikan kuis',
      subtitle: 'Keamanan Password',
      time: 'Kemarin, 16:45',
      tone: 'purple',
    },
    {
      icon: 'bi-file-earmark-text',
      title: 'Laporan #CV-2024-0017',
      subtitle: 'Diterima oleh sistem',
      time: 'Kemarin, 11:20',
      tone: 'red',
    },
    {
      icon: 'bi-clock-history',
      title: 'Laporan #CV-2024-0016',
      subtitle: 'Sedang diproses',
      time: '2 hari lalu',
      tone: 'orange',
    },
    {
      icon: 'bi-shield-check',
      title: 'Mengupdate recovery email',
      subtitle: 'Akun berhasil diperbarui',
      time: '3 hari lalu',
      tone: 'green',
    },
  ]

  const kategoriIdentitas = [
    'Semua Identitas (5)',
    'Email (2)',
    'Nomor Telepon (2)',
    'Akun Online (4)',
    'Dokumen Penting (2)',
    'Kontak Darurat (1)',
  ]

  const daftarIdentitas = [
    ['Email Utama', 'maman@example.com', 'Akun CyberVault', 'Terverifikasi', '23 Apr 2025'],
    ['Email Cadangan', 'maman.vyndy@gmail.com', 'Pemulihan Akun', 'Terverifikasi', '18 Apr 2025'],
    ['Nomor Telepon Utama', '+62 812 xxxx xxxx', 'Verifikasi & Notifikasi', 'Terverifikasi', '23 Apr 2025'],
    ['Nomor Telepon Cadangan', '+62 857 xxxx xxxx', 'Pemulihan Akun', 'Pending', '18 Apr 2025'],
    ['Google Account', 'maman.vyndy@gmail.com', 'Login & Sinkronisasi', 'Aktif', '20 Apr 2025'],
    ['Instagram', '@mamanyvndy', 'Media Sosial', 'Aktif', '15 Apr 2025'],
    ['KTP', '3273 xxxx xxxx', 'Verifikasi Identitas', 'Terverifikasi', '10 Apr 2025'],
  ]

  const aktivitasVault = [
    ['Email utama diperbarui', '23 Apr 2025'],
    ['2FA diaktifkan', '20 Apr 2025'],
    ['Password diubah', '18 Apr 2025'],
  ]

  const prioritasHariIni = [
    'Aktifkan 2FA pada seluruh akun utama',
    'Selesaikan modul Phishing & Social Engineering',
    'Review laporan insiden yang masih diproses',
  ]

  return (
    <div className="cv-dashboard-v2">
      <section className="cv-dash-hero">
        <div className="cv-dash-hero__copy">
          <p className="cv-dash-eyebrow">Security command center</p>
          <h1>CyberVault membuat aktivitas keamanan harian terasa lebih jelas.</h1>
          <p className="cv-dash-hero__lead">
            Pantau skor keamanan, lanjutkan pembelajaran, dan respon insiden dari satu
            dashboard yang lebih fokus dan mudah dipakai.
          </p>

          <div className="cv-dash-hero__actions">
            <Link to="/pusat-edukasi" className="cv-dash-btn cv-dash-btn--primary">
              <i className="bi bi-play-circle" />
              Lanjut Belajar
            </Link>
            <Link to="/pelaporan-insiden" className="cv-dash-btn cv-dash-btn--ghost">
              <i className="bi bi-shield-exclamation" />
              Buat Laporan
            </Link>
          </div>

          <div className="cv-dash-priority">
            <div className="cv-dash-priority__head">
              <span>Fokus hari ini</span>
              <strong>3 prioritas aktif</strong>
            </div>
            <div className="cv-dash-priority__list">
              {prioritasHariIni.map((item) => (
                <div key={item} className="cv-dash-priority__item">
                  <i className="bi bi-check2-circle" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cv-dash-hero__visual">
          <div className="cv-dash-hero__image-wrap">
            <img src={heroImage} alt="CyberVault Smart City" />
          </div>
          <div className="cv-dash-floating-card cv-dash-floating-card--score">
            <span>Identity safety</span>
            <strong>84 / 100</strong>
            <small>naik 6 poin bulan ini</small>
          </div>
          <div className="cv-dash-floating-card cv-dash-floating-card--signal">
            <i className="bi bi-broadcast-pin" />
            <div>
              <strong>2 alert penting</strong>
              <span>perlu ditinjau hari ini</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cv-dash-metrics">
        {statistik.map((item) => (
          <article key={item.title} className="cv-dash-metric-card">
            <div className="cv-dash-metric-card__icon">
              <i className={`bi ${item.icon}`} />
            </div>
            <div className="cv-dash-metric-card__body">
              <p>{item.title}</p>
              <h3>
                {item.value}
                {item.suffix ? <span>{item.suffix}</span> : null}
              </h3>
              <div className="cv-dash-metric-card__meta">
                <span>{item.note}</span>
                <small>{item.trend}</small>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="cv-dash-quick-actions">
        <div className="cv-dash-section-head">
          <div>
            <p className="cv-dash-eyebrow">Akses cepat</p>
            <h2>Mulai dari tindakan yang paling sering dipakai</h2>
          </div>
          <Link to="/notifikasi" className="cv-dash-text-link">
            Buka notifikasi
          </Link>
        </div>

        <div className="cv-dash-quick-actions__grid">
          {aksiCepat.map((item) => (
            <Link key={item.title} to={item.to} className="cv-dash-action-card">
              <div className="cv-dash-action-card__icon">
                <i className={`bi ${item.icon}`} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <i className="bi bi-arrow-up-right" />
            </Link>
          ))}
        </div>
      </section>

      <section className="cv-dash-main-grid">
        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Learning progress</p>
              <h2>Progres belajar Anda</h2>
            </div>
            <Link to="/pusat-edukasi" className="cv-dash-pill-link">
              Semua materi
            </Link>
          </div>

          <div className="cv-dash-learning">
            <div className="cv-dash-learning__score">
              <div className="cv-dash-learning__ring">
                <strong>50%</strong>
                <span>Selesai</span>
              </div>
              <p>Jaga ritme belajar. Anda tinggal 12 materi lagi untuk menyelesaikan jalur dasar.</p>
            </div>

            <div className="cv-dash-learning__list">
              {progresBelajar.map((item) => (
                <div key={item.label} className="cv-dash-progress-row">
                  <div className="cv-dash-progress-row__top">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="cv-dash-progress-bar">
                    <span style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Alert stream</p>
              <h2>Berita dan peringatan</h2>
            </div>
            <Link to="/informasi-peringatan" className="cv-dash-text-link">
              Lihat semua
            </Link>
          </div>

          <div className="cv-dash-alert-list">
            {berita.map((item) => (
              <article key={item.title} className={`cv-dash-alert-card is-${item.tone}`}>
                <div className="cv-dash-alert-card__icon">
                  <i className={`bi ${item.icon}`} />
                </div>
                <div>
                  <div className="cv-dash-alert-card__meta">
                    <span>{item.tag}</span>
                    <small>{item.time}</small>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="cv-dash-main-grid cv-dash-main-grid--secondary">
        <article className="cv-dash-panel">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Recent moves</p>
              <h2>Aktivitas terbaru</h2>
            </div>
            <Link to="/timeline" className="cv-dash-text-link">
              Buka timeline
            </Link>
          </div>

          <div className="cv-dash-timeline">
            {aktivitasTerbaru.map((item) => (
              <article key={`${item.title}-${item.time}`} className="cv-dash-timeline-item">
                <div className={`cv-dash-timeline-item__icon is-${item.tone}`}>
                  <i className={`bi ${item.icon}`} />
                </div>
                <div className="cv-dash-timeline-item__body">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span>{item.time}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="cv-dash-panel cv-dash-panel--vault">
          <div className="cv-dash-section-head">
            <div>
              <p className="cv-dash-eyebrow">Identity vault</p>
              <h2>Kelola identitas digital</h2>
            </div>
            <button type="button" className="cv-dash-btn cv-dash-btn--soft">
              + Tambah Identitas
            </button>
          </div>

          <div className="cv-dash-vault-grid">
            <aside className="cv-dash-vault-sidebar">
              <div className="cv-dash-vault-score">
                <span>Skor keamanan</span>
                <strong>84</strong>
                <small>Baik dan stabil</small>
              </div>

              <div className="cv-dash-vault-tags">
                {kategoriIdentitas.map((item, index) => (
                  <span
                    key={item}
                    className={`cv-dash-vault-tag${index === 0 ? ' is-active' : ''}`}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="cv-dash-vault-activity">
                <h3>Aktivitas vault</h3>
                {aktivitasVault.map((item) => (
                  <div key={item[0]} className="cv-dash-vault-activity__item">
                    <strong>{item[0]}</strong>
                    <span>{item[1]}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="cv-dash-vault-table-wrap">
              <table className="cv-dash-vault-table">
                <thead>
                  <tr>
                    <th>Jenis Identitas</th>
                    <th>Detail</th>
                    <th>Terkait Dengan</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarIdentitas.map((item) => (
                    <tr key={`${item[0]}-${item[1]}`}>
                      <td>{item[0]}</td>
                      <td>{item[1]}</td>
                      <td>{item[2]}</td>
                      <td>
                        <span
                          className={`cv-dash-status ${
                            item[3] === 'Terverifikasi'
                              ? 'is-success'
                              : item[3] === 'Aktif'
                                ? 'is-info'
                                : 'is-warning'
                          }`}
                        >
                          {item[3]}
                        </span>
                      </td>
                      <td>{item[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
