export const forumCategories = [
  'Semua Kategori',
  'Keamanan Akun',
  'Privasi & Data',
  'Phishing',
  'Perangkat & Jaringan',
  'Edukasi & Literasi',
]

export const forumStatusOptions = ['Semua Status', 'open', 'answered', 'closed', 'reported']

export const forumThreads = [
  {
    id: 'thread-phishing-wa-001',
    title: 'Bagaimana cara membedakan link phishing di WhatsApp?',
    category: 'Phishing',
    status: 'answered',
    author: 'Karina',
    role: 'Intermediate User',
    createdAt: '2026-06-24',
    summary: 'Saya sering menerima link undian palsu di grup keluarga dan ingin tahu ciri utamanya.',
    content:
      'Saya ingin tahu tanda-tanda link phishing yang paling mudah dicek oleh orang awam, terutama di WhatsApp dan Telegram. Kadang domainnya mirip sekali dengan situs resmi.',
    tags: ['phishing', 'whatsapp', 'link palsu'],
    likes: 12,
    likedByCurrentUser: false,
    saved: false,
    reported: false,
    views: 142,
    comments: [
      {
        id: 'comment-001',
        author: 'Aldan',
        role: 'Security Enthusiast',
        createdAt: '2026-06-24',
        content: 'Cek domain, jangan percaya urgency palsu, dan hindari login dari link chat.',
      },
      {
        id: 'comment-002',
        author: 'Maya',
        role: 'Community Moderator',
        createdAt: '2026-06-24',
        content: 'Kalau ragu, buka layanan lewat aplikasi resmi dan laporkan link mencurigakan.',
      },
    ],
  },
  {
    id: 'thread-password-manager-002',
    title: 'Apakah password manager aman untuk pemula?',
    category: 'Keamanan Akun',
    status: 'open',
    author: 'Siti Rahma',
    role: 'Beginner User',
    createdAt: '2026-06-23',
    summary: 'Saya ingin mulai pakai password manager tapi masih takut semua akun tersimpan di satu tempat.',
    content:
      'Boleh minta saran, apa hal paling penting yang harus saya perhatikan sebelum memakai password manager? Saya juga ingin tahu risiko kalau master password lupa.',
    tags: ['password', 'akun', 'pemula'],
    likes: 8,
    likedByCurrentUser: true,
    saved: true,
    reported: false,
    views: 87,
    comments: [],
  },
  {
    id: 'thread-public-wifi-003',
    title: 'Masih amankah pakai Wi-Fi publik untuk cek email kerja?',
    category: 'Perangkat & Jaringan',
    status: 'open',
    author: 'Dewi Lestari',
    role: 'Remote Worker',
    createdAt: '2026-06-22',
    summary: 'Saya sering kerja dari cafe dan ingin tahu batas aman menggunakan jaringan publik.',
    content:
      'Biasanya saya hanya buka email dan dokumen cloud, tapi kadang harus login ke dashboard kantor. Apakah cukup aman kalau hanya pakai browser biasa tanpa VPN?',
    tags: ['wifi publik', 'jaringan', 'remote work'],
    likes: 5,
    likedByCurrentUser: false,
    saved: false,
    reported: false,
    views: 64,
    comments: [
      {
        id: 'comment-003',
        author: 'Budi Santoso',
        role: 'Network Analyst',
        createdAt: '2026-06-22',
        content: 'Kalau bisa hindari login sensitif di Wi-Fi publik tanpa perlindungan tambahan.',
      },
    ],
  },
  {
    id: 'thread-data-sharing-004',
    title: 'Kapan sebaiknya aplikasi diberi akses lokasi dan kontak?',
    category: 'Privasi & Data',
    status: 'closed',
    author: 'Rina Amelia',
    role: 'Privacy Advocate',
    createdAt: '2026-06-20',
    summary: 'Banyak aplikasi minta izin akses berlebihan dan saya bingung menilainya.',
    content:
      'Adakah aturan praktis untuk menilai apakah izin lokasi, kamera, mikrofon, atau kontak itu relevan dengan fungsi aplikasi? Saya ingin lebih disiplin mengatur permission.',
    tags: ['privasi', 'izin aplikasi', 'data pribadi'],
    likes: 15,
    likedByCurrentUser: false,
    saved: true,
    reported: false,
    views: 131,
    comments: [
      {
        id: 'comment-004',
        author: 'Karina',
        role: 'Intermediate User',
        createdAt: '2026-06-20',
        content: 'Saya biasanya cek apakah fitur itu benar-benar butuh izin tersebut sebelum menyetujui.',
      },
    ],
  },
  {
    id: 'thread-education-hoax-005',
    title: 'Cara menjelaskan hoaks digital ke keluarga tanpa bikin panik',
    category: 'Edukasi & Literasi',
    status: 'reported',
    author: 'Aldan',
    role: 'Security Enthusiast',
    createdAt: '2026-06-19',
    summary: 'Butuh pendekatan yang mudah dipahami saat edukasi anggota keluarga tentang hoaks dan scam.',
    content:
      'Saya ingin berbagi materi sederhana untuk keluarga yang belum terbiasa dengan istilah digital. Poin apa yang paling efektif dijelaskan lebih dulu?',
    tags: ['edukasi', 'hoaks', 'keluarga'],
    likes: 4,
    likedByCurrentUser: false,
    saved: false,
    reported: true,
    views: 52,
    comments: [
      {
        id: 'comment-005',
        author: 'Moderator CV',
        role: 'Community Moderator',
        createdAt: '2026-06-19',
        content: 'Thread ini sedang ditinjau karena ada laporan komunitas dan tetap tampil pada mode demo.',
      },
    ],
  },
]

export const forumStats = [
  {
    id: 'threads',
    title: 'Thread Aktif',
    icon: 'bi-chat-left-dots',
  },
  {
    id: 'answered',
    title: 'Sudah Dijawab',
    icon: 'bi-check2-circle',
  },
  {
    id: 'open',
    title: 'Masih Terbuka',
    icon: 'bi-lightning-charge',
  },
  {
    id: 'comments',
    title: 'Komentar',
    icon: 'bi-chat-left-text',
  },
]

export const communityGuidelines = [
  'Gunakan bahasa yang sopan dan fokus pada edukasi keamanan digital.',
  'Jangan membagikan password, OTP, atau data pribadi milik siapa pun.',
  'Sertakan konteks secukupnya agar diskusi mudah dipahami anggota lain.',
  'Laporkan thread yang menyesatkan, menyerang personal, atau berpotensi berbahaya.',
]

export const reportReasons = [
  'Spam atau promosi',
  'Informasi menyesatkan',
  'Bahasa tidak pantas',
  'Potensi penipuan atau phishing',
]
