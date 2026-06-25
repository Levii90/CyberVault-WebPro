export const assessmentTypes = [
  {
    id: 'personal-security',
    title: 'Keamanan Digital Pribadi',
    description: 'Mengukur kebiasaan dasar keamanan akun, perangkat, dan data pribadi.',
    duration: '5-7 menit',
    questionCount: 4,
    difficulty: 'Beginner',
    category: 'Personal Security',
    icon: 'bi-shield-lock',
  },
  {
    id: 'online-transaction',
    title: 'Keamanan Transaksi Online',
    description: 'Menilai kewaspadaan saat belanja, mobile banking, dan pembayaran digital.',
    duration: '4-6 menit',
    questionCount: 4,
    difficulty: 'Intermediate',
    category: 'Digital Transaction',
    icon: 'bi-credit-card-2-front',
  },
  {
    id: 'phishing-awareness',
    title: 'Kesiapan Menghadapi Phishing',
    description: 'Mengukur kemampuan mengenali tautan, pesan, dan situs palsu.',
    duration: '4-5 menit',
    questionCount: 4,
    difficulty: 'Beginner',
    category: 'Threat Awareness',
    icon: 'bi-envelope-exclamation',
  },
]

export const assessmentQuestions = [
  {
    id: 'ps-password-001',
    assessmentTypeId: 'personal-security',
    category: 'Password Security',
    question: 'Apakah kamu menggunakan password yang berbeda untuk setiap akun penting?',
    options: [
      { id: 'always', label: 'Ya, selalu berbeda', score: 10 },
      { id: 'sometimes', label: 'Kadang berbeda', score: 5 },
      { id: 'never', label: 'Tidak, sering sama', score: 0 },
    ],
    recommendationIfLow: 'Gunakan password manager dan hindari penggunaan password yang sama.',
  },
  {
    id: 'ps-mfa-002',
    assessmentTypeId: 'personal-security',
    category: 'Authentication',
    question: 'Seberapa konsisten kamu mengaktifkan autentikasi dua faktor pada akun utama?',
    options: [
      { id: 'all', label: 'Aktif di semua akun utama', score: 10 },
      { id: 'partial', label: 'Baru di sebagian akun', score: 5 },
      { id: 'none', label: 'Belum diaktifkan', score: 0 },
    ],
    recommendationIfLow: 'Aktifkan autentikasi dua faktor minimal untuk email, media sosial, dan mobile banking.',
  },
  {
    id: 'ps-update-003',
    assessmentTypeId: 'personal-security',
    category: 'Device Security',
    question: 'Bagaimana kebiasaanmu memperbarui sistem operasi dan aplikasi?',
    options: [
      { id: 'auto', label: 'Update otomatis atau rutin', score: 10 },
      { id: 'sometimes', label: 'Kadang saya update manual', score: 5 },
      { id: 'rarely', label: 'Jarang saya perbarui', score: 0 },
    ],
    recommendationIfLow: 'Perbarui perangkat dan aplikasi secara rutin untuk menutup celah keamanan.',
  },
  {
    id: 'ps-backup-004',
    assessmentTypeId: 'personal-security',
    category: 'Recovery Readiness',
    question: 'Apakah data pentingmu memiliki cadangan yang aman?',
    options: [
      { id: 'routine', label: 'Ya, backup rutin dan aman', score: 10 },
      { id: 'limited', label: 'Ada backup tapi tidak rutin', score: 5 },
      { id: 'none', label: 'Belum punya backup', score: 0 },
    ],
    recommendationIfLow: 'Siapkan backup berkala untuk dokumen penting di lokasi yang aman.',
  },
  {
    id: 'ot-domain-001',
    assessmentTypeId: 'online-transaction',
    category: 'Transaction Verification',
    question: 'Apa yang kamu lakukan sebelum login ke layanan finansial atau checkout?',
    options: [
      { id: 'verify', label: 'Memeriksa domain dan keamanan situs', score: 10 },
      { id: 'quick', label: 'Kadang memeriksa jika terasa janggal', score: 5 },
      { id: 'skip', label: 'Langsung lanjut tanpa cek', score: 0 },
    ],
    recommendationIfLow: 'Selalu verifikasi domain resmi dan indikator keamanan sebelum login atau membayar.',
  },
  {
    id: 'ot-qris-002',
    assessmentTypeId: 'online-transaction',
    category: 'Payment Safety',
    question: 'Saat membayar via QR atau transfer, bagaimana kamu memastikan tujuan benar?',
    options: [
      { id: 'confirm', label: 'Cek nama merchant dan nominal', score: 10 },
      { id: 'sometimes', label: 'Kadang saya cek', score: 5 },
      { id: 'never', label: 'Jarang atau tidak pernah cek', score: 0 },
    ],
    recommendationIfLow: 'Biasakan memeriksa nama penerima, merchant, dan nominal sebelum konfirmasi pembayaran.',
  },
  {
    id: 'ot-network-003',
    assessmentTypeId: 'online-transaction',
    category: 'Network Hygiene',
    question: 'Seberapa sering kamu bertransaksi saat terhubung ke Wi-Fi publik?',
    options: [
      { id: 'avoid', label: 'Saya hindari', score: 10 },
      { id: 'urgent', label: 'Hanya jika mendesak', score: 5 },
      { id: 'often', label: 'Cukup sering', score: 0 },
    ],
    recommendationIfLow: 'Hindari transaksi sensitif di Wi-Fi publik atau gunakan koneksi yang lebih aman.',
  },
  {
    id: 'ot-alert-004',
    assessmentTypeId: 'online-transaction',
    category: 'Account Monitoring',
    question: 'Apakah notifikasi transaksi dan aktivitas login sudah aktif di akun finansialmu?',
    options: [
      { id: 'active', label: 'Ya, semuanya aktif', score: 10 },
      { id: 'partial', label: 'Baru beberapa yang aktif', score: 5 },
      { id: 'off', label: 'Belum aktif', score: 0 },
    ],
    recommendationIfLow: 'Aktifkan notifikasi transaksi dan login agar aktivitas mencurigakan cepat terdeteksi.',
  },
  {
    id: 'ph-link-001',
    assessmentTypeId: 'phishing-awareness',
    category: 'Link Awareness',
    question: 'Jika menerima tautan hadiah atau reset akun mendadak, apa langkahmu?',
    options: [
      { id: 'verify', label: 'Verifikasi sumber sebelum klik', score: 10 },
      { id: 'cautious', label: 'Kadang klik jika terlihat meyakinkan', score: 5 },
      { id: 'direct', label: 'Biasanya langsung saya buka', score: 0 },
    ],
    recommendationIfLow: 'Jangan klik tautan mendadak; buka layanan lewat aplikasi atau situs resmi.',
  },
  {
    id: 'ph-sender-002',
    assessmentTypeId: 'phishing-awareness',
    category: 'Sender Validation',
    question: 'Seberapa teliti kamu memeriksa alamat email atau nomor pengirim?',
    options: [
      { id: 'careful', label: 'Selalu saya periksa detailnya', score: 10 },
      { id: 'sometimes', label: 'Kadang saya periksa', score: 5 },
      { id: 'rarely', label: 'Jarang saya cek', score: 0 },
    ],
    recommendationIfLow: 'Periksa alamat email, domain, dan nomor pengirim untuk mendeteksi peniruan identitas.',
  },
  {
    id: 'ph-urgency-003',
    assessmentTypeId: 'phishing-awareness',
    category: 'Social Engineering',
    question: 'Bagaimana responsmu pada pesan yang mendesakmu segera login atau transfer?',
    options: [
      { id: 'pause', label: 'Saya berhenti dan verifikasi dulu', score: 10 },
      { id: 'uncertain', label: 'Saya sering ragu tapi tetap cek cepat', score: 5 },
      { id: 'rush', label: 'Saya cenderung mengikuti instruksi', score: 0 },
    ],
    recommendationIfLow: 'Waspadai teknik urgensi palsu; verifikasi lewat kanal resmi sebelum bertindak.',
  },
  {
    id: 'ph-report-004',
    assessmentTypeId: 'phishing-awareness',
    category: 'Incident Response',
    question: 'Jika menemukan pesan phishing, apa tindakanmu?',
    options: [
      { id: 'report', label: 'Laporkan dan hapus pesan tersebut', score: 10 },
      { id: 'delete', label: 'Hanya menghapus tanpa melapor', score: 5 },
      { id: 'ignore', label: 'Didiamkan saja', score: 0 },
    ],
    recommendationIfLow: 'Laporkan pesan phishing agar insiden bisa ditindaklanjuti dan pengguna lain ikut terlindungi.',
  },
]

export const riskLevels = [
  {
    id: 'safe',
    min: 85,
    max: 100,
    label: 'Aman',
    tone: 'safe',
    summary: 'Kebiasaan keamanan digital Anda sudah kuat dan konsisten.',
  },
  {
    id: 'fairly-safe',
    min: 70,
    max: 84,
    label: 'Cukup Aman',
    tone: 'good',
    summary: 'Fondasi keamanan sudah baik, namun masih ada beberapa area yang perlu diperkuat.',
  },
  {
    id: 'vulnerable',
    min: 50,
    max: 69,
    label: 'Rentan',
    tone: 'warning',
    summary: 'Beberapa kebiasaan masih membuka celah keamanan dan perlu segera diperbaiki.',
  },
  {
    id: 'high-risk',
    min: 0,
    max: 49,
    label: 'Berisiko Tinggi',
    tone: 'danger',
    summary: 'Risiko keamanan digital Anda tinggi dan memerlukan tindak lanjut secepatnya.',
  },
]

export const recommendationRules = {
  universal: [
    'Aktifkan autentikasi dua faktor untuk akun utama dan layanan finansial.',
    'Gunakan password unik serta verifikasi tautan atau domain sebelum login.',
  ],
  scoreBands: {
    safe: ['Pertahankan kebiasaan baik dan review ulang pengaturan keamanan setiap bulan.'],
    'fairly-safe': ['Tutup celah kecil yang tersisa agar akun dan perangkat lebih konsisten terlindungi.'],
    vulnerable: ['Fokus dulu pada password, autentikasi, dan validasi tautan atau transaksi yang masuk.'],
    'high-risk': ['Prioritaskan pengamanan akun utama, ganti password penting, dan pelajari ulang dasar keamanan digital.'],
  },
}

export const assessmentStats = [
  {
    id: 'types',
    title: 'Jenis Asesmen',
    value: '3',
    note: 'Siap dikerjakan',
  },
  {
    id: 'questions',
    title: 'Total Pertanyaan',
    value: '12',
    note: 'Mock assessment',
  },
  {
    id: 'result',
    title: 'Hasil yang Didapat',
    value: 'Skor Risiko',
    note: 'Lokal & instan',
  },
  {
    id: 'followup',
    title: 'Arah Tindak Lanjut',
    value: '2 CTA',
    note: 'Edukasi & penilaian',
  },
]
