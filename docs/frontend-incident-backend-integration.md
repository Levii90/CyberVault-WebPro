# Frontend Incident Backend Integration

## Phase 20C Scope

- page `PelaporanInsiden` tetap memakai layout yang sama
- service incidents sekarang hybrid: `backend` dan `demo`
- submit laporan memakai backend real jika `VITE_AUTH_MODE=backend`
- `report_code` sumbernya dari backend saat backend mode aktif
- upload file bukti belum dikirim ke backend

## Backend Mode

Prerequisite:

- `VITE_AUTH_MODE=backend`
- `VITE_API_BASE_URL` mengarah ke backend CI3
- user harus login

Service endpoint:

- `POST /api/incidents/report`
- `GET /api/incidents/my`
- `GET /api/incidents/detail/{report_code}`

Behavior:

- bearer token dikirim otomatis lewat `httpClient`
- `evidenceFiles` tidak dikirim ke backend
- payload hanya mengirim field aman yang sudah masuk contract backend

## Demo Mode

- tidak memanggil backend
- laporan disimpan lokal sebagai fallback ringan
- `report_code` dibuat mock di frontend

## Error Mapping

- `401`: tampilkan pesan sesi berakhir lalu auth lokal dibersihkan
- `422`: tampilkan pesan umum "Periksa kembali data laporan." dan tetap tampilkan error field jika tersedia
- `500+`: tampilkan pesan server belum dapat memproses laporan
- network error: tampilkan pesan backend tidak terhubung

## QA Note

- upload file tetap dipilih di UI, tetapi tidak pernah dikirim ke backend
- jika backend mengembalikan error upload evidence, frontend menormalkan pesannya menjadi lebih ramah pengguna
