export const helpCategories = [
  {
    id: 'all',
    title: 'Semua Bantuan',
    description: 'Tampilkan seluruh topik bantuan yang tersedia.',
    icon: 'bi-grid',
    route: '/pusat-bantuan',
  },
  {
    id: 'account-security',
    title: 'Keamanan Akun',
    description: 'Bantuan terkait login, MFA, perangkat, dan pengaturan akun.',
    icon: 'bi-shield-lock',
    route: '/akun',
  },
  {
    id: 'incident-report',
    title: 'Pelaporan Insiden',
    description: 'Panduan membuat laporan insiden digital dengan benar.',
    icon: 'bi-bug',
    route: '/pelaporan-insiden',
  },
  {
    id: 'education',
    title: 'Pusat Edukasi',
    description: 'Cari panduan belajar, progress, dan kategori modul.',
    icon: 'bi-journal-text',
    route: '/pusat-edukasi',
  },
  {
    id: 'alerts',
    title: 'Peringatan Siber',
    description: 'Bantuan membaca alert dan informasi ancaman terbaru.',
    icon: 'bi-building-exclamation',
    route: '/informasi-peringatan',
  },
]

export const faqItems = [
  {
    id: 'faq-phishing-001',
    category: 'Pelaporan Insiden',
    question: 'Apa yang harus saya lakukan jika menerima link phishing?',
    answer:
      'Jangan klik link, ambil tangkapan layar, catat sumber pesan, lalu buat laporan insiden digital agar detailnya terdokumentasi.',
    tags: ['phishing', 'laporan', 'link palsu'],
    relatedRoute: '/pelaporan-insiden',
  },
  {
    id: 'faq-account-002',
    category: 'Keamanan Akun',
    question: 'Bagaimana cara memeriksa perangkat yang masih login ke akun saya?',
    answer:
      'Buka halaman Akun untuk melihat daftar device session mock, lalu revoke perangkat non-current bila perlu.',
    tags: ['akun', 'session', 'perangkat'],
    relatedRoute: '/akun',
  },
  {
    id: 'faq-education-003',
    category: 'Pusat Edukasi',
    question: 'Bagaimana cara melanjutkan modul yang belum selesai?',
    answer:
      'Masuk ke Pusat Edukasi, pilih modul yang statusnya in progress, lalu lanjutkan dari preview modul yang tersedia.',
    tags: ['modul', 'edukasi', 'progress'],
    relatedRoute: '/pusat-edukasi',
  },
  {
    id: 'faq-alert-004',
    category: 'Peringatan Siber',
    question: 'Mengapa saya menerima alert keamanan dengan prioritas tinggi?',
    answer:
      'Alert prioritas tinggi muncul jika ada ancaman yang lebih relevan dengan aktivitas digital user atau laporan komunitas terbaru.',
    tags: ['alert', 'phishing', 'prioritas tinggi'],
    relatedRoute: '/informasi-peringatan',
  },
  {
    id: 'faq-settings-005',
    category: 'Keamanan Akun',
    question: 'Di mana saya bisa mengubah preferensi notifikasi dan privasi?',
    answer:
      'Masuk ke halaman Pengaturan untuk mengelola notification preferences, privacy controls, dan data control secara mock.',
    tags: ['pengaturan', 'privasi', 'notifikasi'],
    relatedRoute: '/pengaturan',
  },
]

export const troubleshootingSteps = [
  {
    id: 'check-account',
    title: 'Periksa keamanan akun',
    description: 'Pastikan email, profil, dan MFA mock pada akun sudah sesuai.',
    relatedRoute: '/akun',
    completed: false,
  },
  {
    id: 'check-alert',
    title: 'Tinjau alert yang relevan',
    description: 'Buka pusat informasi dan pastikan ancaman terbaru sudah dibaca.',
    relatedRoute: '/informasi-peringatan',
    completed: false,
  },
  {
    id: 'continue-learning',
    title: 'Lanjutkan materi edukasi',
    description: 'Gunakan modul edukasi untuk memahami penyebab kendala lebih dalam.',
    relatedRoute: '/pusat-edukasi',
    completed: false,
  },
  {
    id: 'report-incident',
    title: 'Buat laporan insiden jika dibutuhkan',
    description: 'Laporkan kejadian jika masalah terkait phishing, scam, atau pembajakan akun.',
    relatedRoute: '/pelaporan-insiden',
    completed: false,
  },
]

export const quickActions = [
  { id: 'quick-incident', label: 'Laporkan Insiden', route: '/pelaporan-insiden' },
  { id: 'quick-education', label: 'Baca Pusat Edukasi', route: '/pusat-edukasi' },
  { id: 'quick-alert', label: 'Cek Peringatan', route: '/informasi-peringatan' },
  { id: 'quick-account', label: 'Kelola Akun', route: '/akun' },
  { id: 'quick-settings', label: 'Buka Pengaturan', route: '/pengaturan' },
  { id: 'quick-forum', label: 'Forum Komunitas', route: '/forum' },
]

export const supportTopics = [
  'Masalah Login',
  'Keamanan Akun',
  'Pelaporan Insiden',
  'Asesmen atau Sertifikat',
  'Notifikasi',
  'Masalah Lainnya',
]

export const helpStats = [
  {
    id: 'faq',
    title: 'FAQ Aktif',
    icon: 'bi-question-circle',
  },
  {
    id: 'category',
    title: 'Kategori Bantuan',
    icon: 'bi-life-preserver',
  },
  {
    id: 'troubleshooting',
    title: 'Checklist',
    icon: 'bi-tools',
  },
  {
    id: 'quickAction',
    title: 'Quick Action',
    icon: 'bi-lightning-charge',
  },
]
