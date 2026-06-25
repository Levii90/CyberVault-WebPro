export const dashboardStats = [
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

export const quickActions = [
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

export const learningProgress = [
  { label: 'Keamanan Akun & Password', value: '70%', detail: '4 dari 5 modul' },
  { label: 'Privasi Data Pribadi', value: '50%', detail: '2 kuis menunggu' },
  { label: 'Phising & Social Engineering', value: '35%', detail: 'Lanjutkan sesi ke-3' },
]

export const alertNews = [
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

export const recentActivities = [
  {
    id: 'activity-1',
    icon: 'bi-book',
    title: 'Menyelesaikan materi',
    subtitle: 'Phishing: Kenali & Hindari',
    time: 'Hari ini, 09:30',
    tone: 'green',
    detail: 'Anda menuntaskan satu materi inti dan membuka rekomendasi latihan lanjutan.',
  },
  {
    id: 'activity-2',
    icon: 'bi-ui-checks-grid',
    title: 'Menyelesaikan kuis',
    subtitle: 'Keamanan Password',
    time: 'Kemarin, 16:45',
    tone: 'purple',
    detail: 'Skor kuis stabil dan sistem menyarankan materi lanjutan seputar 2FA dan password manager.',
  },
  {
    id: 'activity-3',
    icon: 'bi-file-earmark-text',
    title: 'Laporan #CV-2024-0017',
    subtitle: 'Diterima oleh sistem',
    time: 'Kemarin, 11:20',
    tone: 'red',
    detail: 'Laporan insiden berhasil masuk ke antrian dan sedang menunggu verifikasi awal.',
  },
  {
    id: 'activity-4',
    icon: 'bi-clock-history',
    title: 'Laporan #CV-2024-0016',
    subtitle: 'Sedang diproses',
    time: '2 hari lalu',
    tone: 'orange',
    detail: 'Tim peninjau sedang memeriksa bukti lampiran dan kategori ancaman yang Anda pilih.',
  },
  {
    id: 'activity-5',
    icon: 'bi-shield-check',
    title: 'Mengupdate recovery email',
    subtitle: 'Akun berhasil diperbarui',
    time: '3 hari lalu',
    tone: 'green',
    detail: 'Recovery email telah diperbarui dan dipakai sebagai jalur pemulihan akun yang aktif.',
  },
]

export const identityCategoryOptions = [
  'Semua Identitas',
  'Email',
  'Nomor Telepon',
  'Akun Online',
  'Dokumen Penting',
  'Kontak Darurat',
]

export const identityTypeOptions = [
  'Email',
  'Nomor Telepon',
  'Akun Online',
  'Dokumen Penting',
  'Kontak Darurat',
]

export const identityItems = [
  {
    id: 1,
    category: 'Email',
    type: 'Email Utama',
    detail: 'maman@example.com',
    relatedTo: 'Akun CyberVault',
    status: 'Terverifikasi',
    updatedAt: '23 Apr 2025',
  },
  {
    id: 2,
    category: 'Email',
    type: 'Email Cadangan',
    detail: 'maman.vyndy@gmail.com',
    relatedTo: 'Pemulihan Akun',
    status: 'Terverifikasi',
    updatedAt: '18 Apr 2025',
  },
  {
    id: 3,
    category: 'Nomor Telepon',
    type: 'Nomor Telepon Utama',
    detail: '+62 812 xxxx xxxx',
    relatedTo: 'Verifikasi & Notifikasi',
    status: 'Terverifikasi',
    updatedAt: '23 Apr 2025',
  },
  {
    id: 4,
    category: 'Nomor Telepon',
    type: 'Nomor Telepon Cadangan',
    detail: '+62 857 xxxx xxxx',
    relatedTo: 'Pemulihan Akun',
    status: 'Pending',
    updatedAt: '18 Apr 2025',
  },
  {
    id: 5,
    category: 'Akun Online',
    type: 'Google Account',
    detail: 'maman.vyndy@gmail.com',
    relatedTo: 'Login & Sinkronisasi',
    status: 'Aktif',
    updatedAt: '20 Apr 2025',
  },
  {
    id: 6,
    category: 'Akun Online',
    type: 'Instagram',
    detail: '@mamanyvndy',
    relatedTo: 'Media Sosial',
    status: 'Aktif',
    updatedAt: '15 Apr 2025',
  },
  {
    id: 7,
    category: 'Dokumen Penting',
    type: 'KTP',
    detail: '3273 xxxx xxxx',
    relatedTo: 'Verifikasi Identitas',
    status: 'Terverifikasi',
    updatedAt: '10 Apr 2025',
  },
  {
    id: 8,
    category: 'Kontak Darurat',
    type: 'Kontak Darurat Utama',
    detail: '+62 821-1111-2222',
    relatedTo: 'Pemulihan Darurat',
    status: 'Terverifikasi',
    updatedAt: '08 Apr 2025',
  },
]

export const vaultActivities = [
  ['Email utama diperbarui', '23 Apr 2025'],
  ['2FA diaktifkan', '20 Apr 2025'],
  ['Password diubah', '18 Apr 2025'],
]

export const todayPriorities = [
  'Aktifkan 2FA pada seluruh akun utama',
  'Selesaikan modul Phishing & Social Engineering',
  'Review laporan insiden yang masih diproses',
]
