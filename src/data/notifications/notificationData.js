export const notificationTypes = [
  'Semua Tipe',
  'alert',
  'forum',
  'assessment',
  'certificate',
  'incident',
  'account',
  'system',
]

export const notificationStatusOptions = ['Semua Status', 'unread', 'read', 'archived']

export const notificationPriorityOptions = ['Semua Prioritas', 'high', 'medium', 'low']

export const notifications = [
  {
    id: 'notif-alert-001',
    type: 'alert',
    priority: 'high',
    status: 'unread',
    title: 'Peringatan phishing baru terdeteksi',
    message: 'Ada peningkatan laporan phishing yang mengatasnamakan bank digital pada 24 Juni 2026.',
    createdAt: '2026-06-24T09:30:00',
    source: 'Pusat Informasi & Peringatan',
    relatedRoute: '/informasi-peringatan',
    actionLabel: 'Baca Alert',
    metadata: {
      category: 'Phishing',
      severity: 'High',
    },
  },
  {
    id: 'notif-forum-002',
    type: 'forum',
    priority: 'medium',
    status: 'unread',
    title: 'Thread forum Anda mendapat balasan baru',
    message: 'Diskusi tentang password manager menerima komentar baru dari anggota komunitas.',
    createdAt: '2026-06-24T08:10:00',
    source: 'Forum Kesadaran Digital',
    relatedRoute: '/forum',
    actionLabel: 'Buka Forum',
    metadata: {
      category: 'Keamanan Akun',
      severity: 'Community',
    },
  },
  {
    id: 'notif-certificate-003',
    type: 'certificate',
    priority: 'medium',
    status: 'read',
    title: 'Sertifikat siap ditinjau',
    message: 'Sertifikat Keamanan Transaksi Digital Anda sudah masuk status eligible.',
    createdAt: '2026-06-23T15:20:00',
    source: 'Sertifikat & Penilaian',
    relatedRoute: '/sertifikat-penilaian',
    actionLabel: 'Lihat Sertifikat',
    metadata: {
      category: 'Certificate',
      severity: 'Eligible',
    },
  },
  {
    id: 'notif-assessment-004',
    type: 'assessment',
    priority: 'high',
    status: 'unread',
    title: 'Lanjutkan asesmen keamanan digital',
    message: 'Masih ada asesmen phishing yang dapat Anda ulangi untuk meningkatkan skor keamanan.',
    createdAt: '2026-06-23T11:45:00',
    source: 'Asesmen Keamanan Digital',
    relatedRoute: '/asesmen',
    actionLabel: 'Lanjut Asesmen',
    metadata: {
      category: 'Assessment',
      severity: 'Reminder',
    },
  },
  {
    id: 'notif-incident-005',
    type: 'incident',
    priority: 'high',
    status: 'read',
    title: 'Laporan insiden membutuhkan tindak lanjut',
    message: 'Laporan phishing Anda masih memerlukan detail tambahan agar dapat diproses lebih lanjut.',
    createdAt: '2026-06-22T14:05:00',
    source: 'Pelaporan Insiden Digital',
    relatedRoute: '/pelaporan-insiden',
    actionLabel: 'Lihat Laporan',
    metadata: {
      category: 'Incident',
      severity: 'Follow Up',
    },
  },
  {
    id: 'notif-account-006',
    type: 'account',
    priority: 'low',
    status: 'archived',
    title: 'Profil akun demo diperbarui',
    message: 'Nama tampilan akun demo berhasil diperbarui pada mode frontend.',
    createdAt: '2026-06-21T10:30:00',
    source: 'Akun',
    relatedRoute: '/akun',
    actionLabel: 'Buka Akun',
    metadata: {
      category: 'Account',
      severity: 'Info',
    },
  },
  {
    id: 'notif-system-007',
    type: 'system',
    priority: 'low',
    status: 'read',
    title: 'Sinkronisasi data mock selesai',
    message: 'Ringkasan dashboard dan modul pembelajaran demo telah diperbarui.',
    createdAt: '2026-06-20T16:00:00',
    source: 'CyberVault System',
    relatedRoute: '/dashboard',
    actionLabel: 'Buka Dashboard',
    metadata: {
      category: 'System',
      severity: 'Info',
    },
  },
]

export const notificationStats = [
  {
    id: 'total',
    title: 'Total Notifikasi',
    icon: 'bi-bell',
  },
  {
    id: 'unread',
    title: 'Belum Dibaca',
    icon: 'bi-envelope-exclamation',
  },
  {
    id: 'high',
    title: 'Prioritas Tinggi',
    icon: 'bi-exclamation-octagon',
  },
  {
    id: 'archived',
    title: 'Arsip',
    icon: 'bi-archive',
  },
  {
    id: 'today',
    title: 'Hari Ini',
    icon: 'bi-calendar2-check',
  },
]
