import heroIllustration from '../../../hero.png'

const discussionCategories = [
  { icon: 'bi-shield-lock-fill', title: 'Keamanan Akun', count: '128 Diskusi' },
  { icon: 'bi-lock-fill', title: 'Privasi & Data', count: '96 Diskusi' },
  { icon: 'bi-exclamation-square-fill', title: 'Phising & Penipuan', count: '112 Diskusi' },
  { icon: 'bi-pc-display', title: 'Perangkat & jaringan', count: '84 Diskusi' },
  { icon: 'bi-book-half', title: 'Edukasi & Literasi', count: '76 Diskusi' },
  { icon: 'bi-houses-fill', title: 'Lainnya', count: '45 Diskusi' },
]

const popularDiscussions = [
  {
    avatar: 'SR',
    avatarClass: 'is-red',
    title: 'Bagaimana cara membuat kata sandi yang kuat dan aman?',
    author: 'Siti Rahma',
    time: '2 jam yang lalu',
    tag: 'Privasi & Data',
    comments: 24,
    views: 320,
  },
  {
    avatar: 'AP',
    avatarClass: 'is-blue',
    title: 'Waspada modus phising terbaru melalui email undangan',
    author: 'Andi Pratama',
    time: '5 jam yang lalu',
    tag: 'Phising & penipuan',
    comments: 18,
    views: 280,
  },
  {
    avatar: 'DL',
    avatarClass: 'is-sand',
    title: 'Apakah aman menggunakan Wi-Fi publik di tempat umum',
    author: 'Dewi Lestari',
    time: '1 hari yang lalu',
    tag: 'Perangkat & Jaringan',
    comments: 15,
    views: 210,
  },
  {
    avatar: 'BS',
    avatarClass: 'is-cyan',
    title: 'Tips menjaga privasi data di media sosial',
    author: 'Budi Santoso',
    time: '1 hari yang lalu',
    tag: 'Privasi & Data',
    comments: 12,
    views: 198,
  },
  {
    avatar: 'RA',
    avatarClass: 'is-orange',
    title: 'Rekomendasi aplikasi pengelola password terbaik',
    author: 'Rina Amelia',
    time: '2 hari yang lalu',
    tag: 'Keamanan Akun',
    comments: 9,
    views: 156,
  },
]

const topContributors = [
  { avatar: 'SR', avatarClass: 'is-red', name: 'Siti Rahma', posts: '126 Postingan' },
  { avatar: 'AP', avatarClass: 'is-blue', name: 'Andi Pratama', posts: '96 Postingan' },
  { avatar: 'DL', avatarClass: 'is-sand', name: 'Dewi Lestari', posts: '84 Postingan' },
  { avatar: 'BS', avatarClass: 'is-cyan', name: 'Budi Santoso', posts: '75 Postingan' },
  { avatar: 'RA', avatarClass: 'is-orange', name: 'Rina Amelia', posts: '60 Postingan' },
]

const forumRules = [
  'Gunakan bahasa yang sopan dan saling menghargai.',
  'Jangan membagikan informasi pribadi sendiri atau orang lain.',
  'Pastikan informasi yang dibagikan akurat dan dapat dipercaya.',
  'Dilarang spam, promosi, dan konten yang melanggar hukum.',
  'Laporkan konten yang melanggar aturan.',
]

function Forum() {
  return (
    <div className="cv-forum-page">
      <section className="cv-forum-hero">
        <div className="cv-forum-hero__content">
          <h1>Forum Kesadaran Digital</h1>
          <p>
            Berbagi pengetahuan, pengalaman, dan tips seputar keamanan digital.
            mari bangun kesadaran bersama untuk ruang digital yang lebih aman.
          </p>

          <div className="cv-forum-search">
            <div className="cv-forum-search__field">
              <i className="bi bi-search" />
              <input type="text" placeholder="Cari topik atau diskusi" />
            </div>

            <button type="button" className="cv-forum-primary-button">
              + Buat Diskusi
            </button>
          </div>

          <div className="cv-forum-section-head">
            <h2>Kategori Diskusi</h2>
            <button type="button" className="cv-forum-pill-button">
              Lihat Semua
            </button>
          </div>

          <div className="cv-forum-category-grid">
            {discussionCategories.map((item) => (
              <article key={item.title} className="cv-forum-category-card">
                <div className="cv-forum-icon-badge" aria-hidden="true">
                  <i className={`bi ${item.icon}`} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.count}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        
      </section>

      <section className="cv-forum-main-grid">
        <article className="cv-forum-panel cv-forum-panel--discussions">
          <div className="cv-forum-panel__head">
            <h2>Diskusi Populer</h2>
          </div>

          <div className="cv-forum-tabs">
            <button type="button" className="is-active">
              Terbaru
            </button>
            <button type="button">Popupler</button>
            <button type="button">Belum Dijawab</button>
          </div>

          <div className="cv-forum-discussion-list">
            {popularDiscussions.map((item) => (
              <article key={item.title} className="cv-forum-discussion-card">
                <div className={`cv-forum-avatar ${item.avatarClass}`} aria-hidden="true">
                  {item.avatar}
                </div>

                <div className="cv-forum-discussion-card__body">
                  <h3>{item.title}</h3>
                  <p>
                    {item.author} - {item.time}
                  </p>

                  <div className="cv-forum-discussion-card__meta">
                    <span className="cv-forum-tag">{item.tag}</span>
                    <span>
                      <i className="bi bi-chat-left-text" /> {item.comments}
                    </span>
                    <span>
                      <i className="bi bi-eye" /> {item.views}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="cv-forum-wide-button">
            Lihat Semua Diskusi &gt;
          </button>
        </article>

        <div className="cv-forum-side-grid">
          <article className="cv-forum-panel cv-forum-panel--contributors">
            <div className="cv-forum-panel__head">
              <h2>Top Kontributor</h2>
            </div>

            <div className="cv-forum-contributor-list">
              {topContributors.map((item) => (
                <article key={item.name} className="cv-forum-contributor-item">
                  <div className={`cv-forum-avatar ${item.avatarClass}`} aria-hidden="true">
                    {item.avatar}
                  </div>

                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.posts}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="cv-forum-panel cv-forum-panel--rules">
            <div className="cv-forum-panel__head">
              <h2>aturan Forum</h2>
            </div>

            <div className="cv-forum-rule-list">
              {forumRules.map((rule) => (
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
