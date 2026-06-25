export const scoreSummary = {
  currentScore: 82,
  riskLevel: 'Cukup Aman',
  lastAssessment: 'Keamanan Digital Pribadi',
  lastAssessmentDate: '2026-06-24',
  improvement: '+12%',
  completedAssessments: 3,
  strongAreas: ['Device Security', 'Privacy Habit'],
  improvementAreas: ['Password Security', 'Phishing Awareness'],
}

export const assessmentHistory = [
  {
    id: 'assessment-result-001',
    assessmentTitle: 'Keamanan Digital Pribadi',
    score: 82,
    riskLevel: 'Cukup Aman',
    completedAt: '2026-06-24',
    status: 'completed',
    questionCount: 4,
    weakAreas: ['Password Security', 'Phishing Awareness'],
    strongAreas: ['Device Security', 'Privacy Habit'],
    recommendation: 'Perkuat autentikasi dua faktor dan kebiasaan validasi tautan.',
  },
  {
    id: 'assessment-result-002',
    assessmentTitle: 'Keamanan Transaksi Online',
    score: 76,
    riskLevel: 'Cukup Aman',
    completedAt: '2026-06-20',
    status: 'completed',
    questionCount: 4,
    weakAreas: ['Network Hygiene'],
    strongAreas: ['Transaction Verification', 'Payment Safety'],
    recommendation: 'Hindari transaksi melalui Wi-Fi publik dan aktifkan alert transaksi.',
  },
  {
    id: 'assessment-result-003',
    assessmentTitle: 'Kesiapan Menghadapi Phishing',
    score: 61,
    riskLevel: 'Rentan',
    completedAt: '2026-06-18',
    status: 'completed',
    questionCount: 4,
    weakAreas: ['Sender Validation', 'Incident Response'],
    strongAreas: ['Link Awareness'],
    recommendation: 'Latih verifikasi pengirim dan biasakan melaporkan pesan phishing.',
  },
]

export const certificateStatusOptions = [
  { id: 'all', label: 'Semua' },
  { id: 'issued', label: 'Issued' },
  { id: 'eligible', label: 'Eligible' },
  { id: 'not_eligible', label: 'Not Eligible' },
  { id: 'expired', label: 'Expired' },
]

export const certificates = [
  {
    id: 'cv-cert-001',
    title: 'Sertifikat Literasi Keamanan Digital Dasar',
    certificateCode: 'CV-CERT-20260624-001',
    status: 'issued',
    eligibleScore: 75,
    userScore: 82,
    issuedAt: '2026-06-24',
    validUntil: '2027-06-24',
    relatedAssessment: 'Keamanan Digital Pribadi',
    description: 'Diberikan setelah menyelesaikan asesmen keamanan digital dasar dengan skor memenuhi syarat.',
    skills: ['Password Security', 'Phishing Awareness', 'Data Privacy'],
  },
  {
    id: 'cv-cert-002',
    title: 'Sertifikat Keamanan Transaksi Digital',
    certificateCode: 'CV-CERT-20260620-002',
    status: 'eligible',
    eligibleScore: 75,
    userScore: 76,
    issuedAt: '',
    validUntil: '',
    relatedAssessment: 'Keamanan Transaksi Online',
    description: 'Siap diterbitkan setelah pengguna melakukan generate certificate pada mode demo.',
    skills: ['Transaction Verification', 'QR Payment Safety', 'Account Monitoring'],
  },
  {
    id: 'cv-cert-003',
    title: 'Sertifikat Kesiapan Anti Phishing',
    certificateCode: 'CV-CERT-20260618-003',
    status: 'not_eligible',
    eligibleScore: 75,
    userScore: 61,
    issuedAt: '',
    validUntil: '',
    relatedAssessment: 'Kesiapan Menghadapi Phishing',
    description: 'Belum memenuhi syarat karena skor asesmen masih berada di bawah batas minimum.',
    skills: ['Link Awareness', 'Sender Validation', 'Incident Response'],
  },
  {
    id: 'cv-cert-004',
    title: 'Sertifikat Privasi Data Digital',
    certificateCode: 'CV-CERT-20250515-004',
    status: 'expired',
    eligibleScore: 70,
    userScore: 88,
    issuedAt: '2025-05-15',
    validUntil: '2026-05-15',
    relatedAssessment: 'Privasi Data Digital',
    description: 'Sertifikat mock yang masa berlakunya telah berakhir dan memerlukan asesmen ulang.',
    skills: ['Privacy Habit', 'Permission Awareness', 'Data Sharing Control'],
  },
]

export const recommendationCards = [
  {
    id: 'recommendation-education',
    title: 'Pelajari Materi Terkait',
    description: 'Lanjutkan pembelajaran untuk meningkatkan area yang masih rentan.',
    ctaLabel: 'Buka Pusat Edukasi',
    to: '/pusat-edukasi',
  },
  {
    id: 'recommendation-assessment',
    title: 'Ulangi Asesmen',
    description: 'Kerjakan asesmen ulang setelah memperbaiki kebiasaan keamanan digital.',
    ctaLabel: 'Ke Halaman Asesmen',
    to: '/asesmen',
  },
]

export const certificateStats = [
  {
    id: 'issued',
    title: 'Issued',
    icon: 'bi-patch-check-fill',
  },
  {
    id: 'eligible',
    title: 'Eligible',
    icon: 'bi-award',
  },
  {
    id: 'notEligible',
    title: 'Butuh Perbaikan',
    icon: 'bi-exclamation-triangle',
  },
  {
    id: 'history',
    title: 'Riwayat Asesmen',
    icon: 'bi-bar-chart-steps',
  },
]
