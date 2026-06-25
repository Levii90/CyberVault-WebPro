export const profileSummary = {
  fullName: 'Maman Cyber',
  username: 'maman.cyber',
  role: 'CyberVault Learner',
  email: 'demo@cybervault.local',
  bio: 'Pengguna demo yang sedang meningkatkan literasi keamanan digital.',
  joinedAt: '2026-06-24',
}

export const securitySummary = {
  mfaEnabled: true,
  passwordLastChanged: '2026-06-01',
  recoveryEmailVerified: true,
  activeSessions: 3,
  securityScore: 82,
}

export const deviceSessions = [
  {
    id: 'session-001',
    device: 'Chrome on Windows',
    location: 'Bandung, Indonesia',
    lastActive: 'Baru saja',
    current: true,
    trusted: true,
  },
  {
    id: 'session-002',
    device: 'Edge on Laptop',
    location: 'Jakarta, Indonesia',
    lastActive: 'Hari ini, 08:14',
    current: false,
    trusted: true,
  },
  {
    id: 'session-003',
    device: 'Android App View',
    location: 'Surabaya, Indonesia',
    lastActive: 'Kemarin, 21:40',
    current: false,
    trusted: false,
  },
]

export const accountActivities = [
  {
    id: 'activity-login-001',
    type: 'login',
    title: 'Login berhasil dari Chrome on Windows',
    description: 'Sesi utama akun demo aktif dan terhubung ke dashboard CyberVault.',
    createdAt: '2026-06-24 09:20',
    relatedRoute: '/dashboard',
    actionLabel: 'Buka Dashboard',
  },
  {
    id: 'activity-profile-002',
    type: 'profile',
    title: 'Profil akun diperbarui',
    description: 'Perubahan nama tampilan dan bio akun berhasil disimpan di mode demo.',
    createdAt: '2026-06-23 18:10',
    relatedRoute: '/akun',
    actionLabel: 'Lihat Profil',
  },
  {
    id: 'activity-assessment-003',
    type: 'assessment',
    title: 'Asesmen Keamanan Digital selesai',
    description: 'Skor terbaru berhasil dihitung dan rekomendasi keamanan diperbarui.',
    createdAt: '2026-06-23 12:45',
    relatedRoute: '/asesmen',
    actionLabel: 'Lihat Asesmen',
  },
  {
    id: 'activity-certificate-004',
    type: 'certificate',
    title: 'Sertifikat transaksi digital masuk status eligible',
    description: 'Sertifikat mock dapat digenerate setelah review hasil penilaian.',
    createdAt: '2026-06-22 16:30',
    relatedRoute: '/sertifikat-penilaian',
    actionLabel: 'Buka Sertifikat',
  },
  {
    id: 'activity-forum-005',
    type: 'forum',
    title: 'Komentar forum baru diterima',
    description: 'Diskusi keamanan akun Anda mendapat tanggapan dari komunitas.',
    createdAt: '2026-06-22 08:50',
    relatedRoute: '/forum',
    actionLabel: 'Buka Forum',
  },
  {
    id: 'activity-incident-006',
    type: 'incident',
    title: 'Laporan insiden perlu tindak lanjut',
    description: 'Ada permintaan detail tambahan pada laporan phishing yang pernah dibuat.',
    createdAt: '2026-06-21 14:05',
    relatedRoute: '/pelaporan-insiden',
    actionLabel: 'Lihat Laporan',
  },
]

export const profileCompletionItems = [
  {
    id: 'completion-name',
    title: 'Nama profil terisi',
    completed: true,
  },
  {
    id: 'completion-username',
    title: 'Username tersedia',
    completed: true,
  },
  {
    id: 'completion-bio',
    title: 'Bio profil diisi',
    completed: true,
  },
  {
    id: 'completion-recovery',
    title: 'Recovery email terverifikasi',
    completed: true,
  },
]
