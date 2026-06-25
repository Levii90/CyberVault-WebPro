# Final Fullstack QA Report

## Environment

- Project path: `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`
- Frontend dev mode:
  - `VITE_ROUTER_BASENAME=/`
  - `VITE_AUTH_MODE=backend`
  - `VITE_API_BASE_URL=http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`
- Frontend XAMPP dist mode:
  - `VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist`
  - `VITE_AUTH_MODE=backend`
  - `VITE_API_BASE_URL=http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`
- Backend:
  - CodeIgniter 3
  - HMVC active
  - database target: `cybervault_db`

## Frontend Status

- `npm run build` berhasil.
- `npm run dev -- --host 127.0.0.1` berhasil start dan route public merespons `200`.
- Public auth page tidak memiliki session check langsung di page component.
- Route guard backend auth sudah short-circuit saat token kosong.
- `Authorization` header hanya ditempel saat token truthy.
- Incident form tidak mengirim `evidenceFiles` ke backend; payload hanya memetakan field teks.

## Backend Status

- PHP syntax check lulus untuk:
  - `backend/application/core/API_Controller.php`
  - `backend/application/libraries/Auth_guard.php`
  - `backend/application/modules/auth/controllers/Auth.php`
  - `backend/application/modules/auth/models/Auth_model.php`
  - `backend/application/modules/auth/services/Auth_service.php`
  - `backend/application/modules/incidents/controllers/Incidents.php`
  - `backend/application/modules/incidents/models/Incident_model.php`
  - `backend/application/modules/incidents/services/Incident_service.php`
  - `backend/application/config/routes.php`
- Endpoint regression lulus:
  - `GET /health`
  - `GET /api/ping`
  - `GET /api/auth/status`
  - `GET /api/auth/contract`
  - `GET /api/incidents/status`
  - `GET /api/incidents/contract`

## Database Status

- Auth schema tersedia di `backend/database/schema/auth_schema_v1.sql`.
- Incident schema tersedia di `backend/database/schema/incidents_schema_v1.sql`.
- Auth persistence aktif.
- Incident persistence aktif.

## Auth QA Result

- Register valid: berhasil.
- Email register test terbaru: `hafid.freeze.20260625193413.2603@example.com`
- Register duplicate email: ditolak benar.
- Login invalid: ditolak benar.
- Login valid: berhasil.
- `GET /api/auth/me` setelah login/register: `200`.
- Logout: berhasil dan sesi backend invalid.
- `GET /api/auth/me` setelah logout: gagal benar dengan session invalid.
- Protected API behavior setelah logout: aman.
- Public route `/me` tanpa token:
  - diverifikasi langsung dari browser QA pada `/login`
  - tidak ada resource request ke `/api/auth/me` saat public route dimuat tanpa token
  - `GuestRoutes` dan auth service sekarang short-circuit saat token kosong

## Profile QA Result

- Update profile berhasil untuk:
  - `name`
  - `username`
  - `bio`
  - `phone`
  - `institution`
- Session list endpoint berhasil.
- Response profil setelah update sinkron dengan data backend.
- Storage frontend hanya menyimpan user publik dan token, tanpa password.
- Data akun test utama dikembalikan ke nilai semula setelah QA selesai.

## Incident QA Result

- Submit invalid: ditolak dengan error validasi.
- Submit valid: berhasil.
- Report code test API terbaru: `CV-INC-20260625-617925`
- Report code test browser terbaru: `CV-INC-20260625-223243`
- History refresh: berhasil, item baru muncul di urutan atas.
- History filtered: berhasil memuat data terfilter untuk `online-fraud`, `submitted`, `medium`.
- Detail report backend: berhasil menampilkan isi deskripsi, suspicious URL, evidence summary, dan status log.
- Spot-check UI detail dari automation headless tidak dijadikan blocker karena selector otomatis sempat salah mengenai tombol filter, sementara data detail backend dan riwayat UI tetap konsisten.
- Bukti file upload:
  - frontend hanya menampilkan notice
  - backend contract tetap menyatakan upload file belum didukung

## XAMPP Dist QA Result

- `npm run build` kembali berhasil pada phase ini.
- Direct deep-link XAMPP:
  - `/dist/login` => `200`
  - `/dist/dashboard` => `200`
  - `/dist/pelaporan-insiden` => `200`
- Browser QA XAMPP dist:
  - `/dist/login` tampil benar
  - login berhasil
  - `/dist/dashboard` tampil dengan navbar dan sidebar
  - `/dist/pelaporan-insiden` tampil dan search navbar tetap terlihat
- Route hasil build sekarang siap untuk deep-link Apache/XAMPP.

## Git Hygiene Result

- Ignore check lulus untuk:
  - `.env.local`
  - `.env.development.local`
  - `node_modules`
  - `dist`
  - `release`
  - `framework-sources`
- `backend/`, `docs/`, `src/`, `scripts/`, dan `public/` tetap boleh tracked.
- Worktree masih memiliki banyak perubahan dan file baru lintas phase, jadi freeze candidate ini belum berarti repo sudah committed bersih.

## Secret Scan Result

- Tidak ditemukan bearer token asli atau API key production di source yang diaudit.
- Temuan string sensitif yang muncul bersifat wajar:
  - nama field seperti `auth_token`, `password`, `session_token_hash`
  - dokumentasi yang menjelaskan field sensitif
  - source framework CodeIgniter bawaan
- Tidak ditemukan `.env.local` atau `.env.development.local` yang tracked git.
- Database password lokal di config adalah kosong untuk XAMPP lokal.
- `.env.local` dan `.env.development.local` tidak tracked.

## Known Limitations

- Upload evidence file belum tersedia.
- Admin review incident belum tersedia.
- Notification backend belum tersedia.
- Rate limit policy belum enforcement penuh.
- Token masih disimpan di `localStorage`.
- Beberapa halaman non-auth/non-incident masih frontend mock.
- Build masih memberi warning ukuran bundle di atas 500 kB.

## Freeze Decision

**Freeze candidate accepted with notes**

Alasan:

- Flow utama auth, profile, dan incident backend real berjalan.
- Build frontend berhasil.
- Endpoint backend utama sehat.
- Deep-link XAMPP dist sudah aman untuk route utama.
- Tidak ditemukan blocker pada login, logout, profile update, incident submit, history, dan detail backend.
- Masih ada limitation minor non-blocking untuk presentasi dan belum semua page non-prioritas terhubung backend real.
