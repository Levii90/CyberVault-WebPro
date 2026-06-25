export const settingsSections = [
  {
    id: 'general',
    label: 'Umum',
    description: 'Atur preferensi dasar akun dan pengalaman harian.',
    icon: 'bi-sliders',
  },
  {
    id: 'security',
    label: 'Keamanan',
    description: 'Kelola proteksi akun dan perangkat tepercaya.',
    icon: 'bi-shield-lock',
  },
  {
    id: 'notifications',
    label: 'Notifikasi',
    description: 'Tentukan notifikasi yang ingin diterima.',
    icon: 'bi-bell',
  },
  {
    id: 'privacy',
    label: 'Privasi',
    description: 'Atur visibilitas profil dan pembagian data.',
    icon: 'bi-incognito',
  },
  {
    id: 'appearance',
    label: 'Tampilan',
    description: 'Sesuaikan mode, kepadatan, dan aksen visual demo.',
    icon: 'bi-palette',
  },
  {
    id: 'data',
    label: 'Data',
    description: 'Kelola export, reset, dan kontrol data akun.',
    icon: 'bi-database-gear',
  },
]

export const accountPreferences = {
  language: 'Bahasa Indonesia',
  timezone: 'Asia/Jakarta',
  defaultDashboardView: 'Ringkasan Keamanan',
  weeklySummary: true,
  smartRecommendations: true,
}

export const securitySettings = [
  {
    id: 'mfa',
    label: 'Multi-Factor Authentication',
    description: 'Tambahkan lapisan keamanan saat login.',
    type: 'toggle',
    enabled: true,
  },
  {
    id: 'login-alert',
    label: 'Login Alert',
    description: 'Kirim notifikasi saat ada login baru.',
    type: 'toggle',
    enabled: true,
  },
  {
    id: 'trusted-device',
    label: 'Trusted Device',
    description: 'Izinkan perangkat tepercaya untuk akses lebih lancar.',
    type: 'toggle',
    enabled: true,
  },
  {
    id: 'recovery-email',
    label: 'Recovery Verification',
    description: 'Status pemulihan email untuk akun demo.',
    type: 'status',
    enabled: true,
    valueLabel: 'Terverifikasi',
  },
  {
    id: 'password-last-changed',
    label: 'Password Last Changed',
    description: 'Informasi mock terakhir perubahan password.',
    type: 'info',
    valueLabel: '2026-06-01',
  },
]

export const notificationSettings = [
  {
    id: 'notif-email',
    label: 'Email Notification',
    description: 'Kirim ringkasan penting melalui email.',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'notif-inapp',
    label: 'In-App Notification',
    description: 'Tampilkan notifikasi langsung di CyberVault.',
    channel: 'in-app',
    enabled: true,
  },
  {
    id: 'notif-forum',
    label: 'Forum Activity',
    description: 'Notifikasi balasan thread dan mention forum.',
    channel: 'forum',
    enabled: true,
  },
  {
    id: 'notif-alert',
    label: 'Cyber Alert',
    description: 'Peringatan phishing, malware, dan ancaman lain.',
    channel: 'alert',
    enabled: true,
  },
  {
    id: 'notif-certificate',
    label: 'Certificate Update',
    description: 'Update terkait hasil penilaian dan sertifikat.',
    channel: 'certificate',
    enabled: true,
  },
  {
    id: 'notif-assessment',
    label: 'Assessment Reminder',
    description: 'Pengingat asesmen yang belum atau perlu diulang.',
    channel: 'assessment',
    enabled: false,
  },
  {
    id: 'notif-incident',
    label: 'Incident Report Update',
    description: 'Perkembangan laporan insiden digital Anda.',
    channel: 'incident',
    enabled: true,
  },
]

export const privacySettings = {
  profileVisibility: 'Private',
  showCertificate: true,
  allowCommunityMention: true,
  recommendationDataSharing: false,
  securityInsightSharing: false,
}

export const appearanceSettings = {
  themeMode: 'System',
  density: 'Comfortable',
  accentColor: 'Ocean Blue',
  compactSidebar: false,
  motionEffects: true,
}

export const dataControlActions = [
  {
    id: 'export',
    label: 'Export Data',
    description: 'Siapkan export preferensi dan ringkasan aktivitas akun.',
    tone: 'default',
  },
  {
    id: 'reset',
    label: 'Reset Preferences',
    description: 'Kembalikan seluruh pengaturan ke nilai default mock.',
    tone: 'warning',
  },
  {
    id: 'delete',
    label: 'Delete Account',
    description: 'Mode demo: action ini dinonaktifkan dan tidak akan menghapus sesi.',
    tone: 'danger',
    disabled: true,
  },
]
