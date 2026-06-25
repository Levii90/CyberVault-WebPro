export const incidentTypes = [
  {
    id: 'phishing',
    label: 'Phishing',
    description: 'Upaya penipuan untuk mendapatkan data pribadi',
    icon: 'bi-envelope-paper',
  },
  {
    id: 'online-fraud',
    label: 'Penipuan Online',
    description: 'Penipuan jual beli, investasi, atau jasa',
    icon: 'bi-eyeglasses',
  },
  {
    id: 'account-hijack',
    label: 'Akun Diretas',
    description: 'Akun media sosial, email, atau aplikasi',
    icon: 'bi-lock-fill',
  },
  {
    id: 'data-breach',
    label: 'Kebocoran Data',
    description: 'Data pribadi Anda tersebar atau bocor',
    icon: 'bi-file-earmark-lock2',
  },
  {
    id: 'malware',
    label: 'Malware atau Virus',
    description: 'Perangkat terinfeksi malware atau virus',
    icon: 'bi-cpu-fill',
  },
  {
    id: 'other',
    label: 'Lainnya',
    description: 'Jenis insiden lainnya',
    icon: 'bi-three-dots',
  },
]

export const reportingSteps = [
  'Jenis & Detail Insiden',
  'Informasi Tambahan',
  'Tinjau & Kirim',
]

export const allowedEvidenceTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
]

export const maxEvidenceFileSize = 2 * 1024 * 1024

export const initialIncidentForm = {
  incidentType: '',
  title: '',
  description: '',
  platform: '',
  city: '',
  incidentDate: '',
  evidenceFiles: [],
}

export const helpCards = [
  {
    title: 'Sebelum Melaporkan',
    type: 'checklist',
    items: [
      'Pastikan informasi yang Anda berikan benar dan lengkap.',
      'Lampirkan bukti jika tersedia (screenshot, email, dll).',
      'Jangan bagikan informasi sensitif di deskripsi.',
    ],
  },
  {
    title: 'Butuh Bantuan Mendesak?',
    type: 'contact',
    description:
      'Jika Anda sedang mengalami situasi darurat atau kerugian besar, segera hubungi:',
    contacts: [
      {
        title: 'CSIRT Kota Bandung',
        detail: '(022) 1234 5678',
      },
      {
        title: 'csirt@bandung.go.id',
        detail: 'Layanan 24/7',
      },
    ],
  },
]
