export const educationStatistics = [
  {
    icon: 'bi-bar-chart-line',
    title: 'Progress Belajar',
    value: '68%',
    note: 'Naik 12% bulan ini',
    tone: 'blue',
  },
  {
    icon: 'bi-clock-history',
    title: 'Total Waktu Belajar',
    value: '18j 12m',
    note: '4j 12m minggu ini',
    tone: 'sky',
  },
  {
    icon: 'bi-journal-check',
    title: 'Materi Diselesaikan',
    value: '12 Modul',
    note: 'dari 24 materi aktif',
    tone: 'green',
  },
  {
    icon: 'bi-patch-check',
    title: 'Sertifikat',
    value: '6 Badge',
    note: '2 badge siap dibuka',
    tone: 'amber',
  },
  {
    icon: 'bi-trophy',
    title: 'Level',
    value: 'Level 2',
    note: 'Waspada Digital',
    tone: 'violet',
  },
]

export const educationCategories = [
  'Semua',
  'Keamanan Dasar',
  'Privasi Data',
  'Phishing',
  'Mobile Banking',
  'Smart City',
]

export const educationLevels = ['Semua Level', 'Beginner', 'Intermediate', 'Advanced']

export const educationModules = [
  {
    id: 'phishing-awareness',
    title: 'Waspada Phishing',
    progress: 82,
    duration: '28 menit',
    status: 'in_progress',
    imageTone: 'blue',
    icon: 'bi-shield-exclamation',
    category: 'Phishing',
    level: 'Beginner',
    description: 'Pelajari cara mengenali email, chat, dan tautan phishing yang menipu pengguna.',
    tags: ['phishing', 'email', 'akun'],
    lessons: 5,
  },
  {
    id: 'strong-passwords',
    title: 'Password yang Kuat',
    progress: 100,
    duration: '22 menit',
    status: 'completed',
    imageTone: 'green',
    icon: 'bi-key',
    category: 'Keamanan Dasar',
    level: 'Beginner',
    description: 'Bangun kebiasaan membuat password yang kuat dan mengelola akun dengan aman.',
    tags: ['password', 'akun', 'login'],
    lessons: 4,
  },
  {
    id: 'social-media-security',
    title: 'Keamanan Media Sosial',
    progress: 56,
    duration: '31 menit',
    status: 'in_progress',
    imageTone: 'sky',
    icon: 'bi-instagram',
    category: 'Privasi Data',
    level: 'Intermediate',
    description: 'Atur privasi akun media sosial dan hindari penyebaran data pribadi berlebihan.',
    tags: ['privasi', 'media sosial', 'data pribadi'],
    lessons: 6,
  },
  {
    id: 'mobile-banking-safety',
    title: 'Keamanan Mobile Banking',
    progress: 34,
    duration: '26 menit',
    status: 'in_progress',
    imageTone: 'amber',
    icon: 'bi-phone',
    category: 'Mobile Banking',
    level: 'Intermediate',
    description: 'Pahami langkah dasar mengamankan transaksi perbankan digital dan e-wallet.',
    tags: ['banking', 'mobile', 'otp'],
    lessons: 5,
  },
  {
    id: 'smart-city-data-safety',
    title: 'Smart City & Keamanan Data',
    progress: 12,
    duration: '35 menit',
    status: 'not_started',
    imageTone: 'violet',
    icon: 'bi-buildings',
    category: 'Smart City',
    level: 'Advanced',
    description: 'Kenali risiko data di layanan publik digital, IoT, dan ekosistem smart city.',
    tags: ['smart city', 'iot', 'data'],
    lessons: 7,
  },
]

export const educationCategoryCards = [
  {
    title: 'Keamanan Dasar',
    desc: 'Mulai dari fondasi keamanan akun dan perangkat.',
    icon: 'bi-shield-lock',
  },
  {
    title: 'Privasi Data',
    desc: 'Belajar mengelola izin, data pribadi, dan jejak digital.',
    icon: 'bi-file-earmark-lock',
  },
  {
    title: 'Phishing',
    desc: 'Kenali modus penipuan online dan serangan rekayasa sosial.',
    icon: 'bi-bug',
  },
  {
    title: 'Mobile Banking',
    desc: 'Amankan transaksi mobile banking dan e-wallet dari ancaman umum.',
    icon: 'bi-phone',
  },
  {
    title: 'Smart City',
    desc: 'Pahami risiko data di layanan cerdas dan perangkat terhubung.',
    icon: 'bi-cpu',
  },
]

export const educationActivities = [
  {
    title: 'Menyelesaikan modul Password yang Kuat',
    description: 'Anda berhasil menamatkan materi dan membuka ringkasan praktik terbaik.',
    time: 'Hari ini, 09:30',
    icon: 'bi-check2-circle',
  },
  {
    title: 'Melanjutkan kuis Waspada Phishing',
    description: 'Skor sementara 80%. Satu sesi lagi untuk menuntaskan evaluasi.',
    time: 'Kemarin, 16:45',
    icon: 'bi-lightning-charge',
  },
  {
    title: 'Membuka kategori Smart City & Keamanan Data',
    description: 'Kategori baru aktif berdasarkan progres dan minat pembelajaran Anda.',
    time: 'Kemarin, 11:20',
    icon: 'bi-grid-1x2',
  },
  {
    title: 'Meraih badge Akun Lebih Aman',
    description: 'Badge diberikan setelah menyelesaikan materi autentikasi dua faktor.',
    time: '2 hari lalu',
    icon: 'bi-award',
  },
]

export const educationTips = [
  'Gunakan password manager agar setiap akun memiliki password unik.',
  'Jangan pernah membagikan kode OTP, bahkan kepada pihak yang mengaku resmi.',
  'Periksa ulang URL sebelum login ke layanan finansial atau pemerintahan digital.',
]
