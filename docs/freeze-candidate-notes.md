# Freeze Candidate Notes

## Fitur yang Dianggap Selesai

- React + Vite frontend berjalan untuk dev dan dist XAMPP.
- Backend CodeIgniter 3 HMVC aktif.
- Auth real backend:
  - register
  - login
  - logout
  - current user
  - profile update
  - session list
- Incident real backend:
  - submit report
  - my reports
  - report detail
- Public auth route tidak lagi agresif memanggil `/me` saat token kosong.
- Deep-link XAMPP untuk route `dist` sudah ditangani lewat `dist/.htaccess` post-build.

## Fitur yang Sengaja Ditunda

- Upload evidence file nyata
- Admin review workflow
- Notification backend real
- Dashboard backend real penuh
- Education/forum/notifikasi backend real penuh
- Production auth hardening lanjutan

## Cara Menjalankan Project

### Frontend Dev

1. Pastikan backend XAMPP aktif.
2. Gunakan `.env.development.local`:
   - `VITE_ROUTER_BASENAME=/`
   - `VITE_AUTH_MODE=backend`
   - `VITE_API_BASE_URL=http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`
3. Jalankan `npm run dev`
4. Buka `http://127.0.0.1:5173/login`

### Frontend Dist XAMPP

1. Gunakan `.env.local`:
   - `VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist`
   - `VITE_AUTH_MODE=backend`
   - `VITE_API_BASE_URL=http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`
2. Jalankan `npm run build`
3. Buka:
   - `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/login`
   - `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/dashboard`
   - `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/pelaporan-insiden`

### Backend

1. Letakkan project di dalam `htdocs`.
2. Aktifkan Apache dan MySQL XAMPP.
3. Import schema:
   - `backend/database/schema/auth_schema_v1.sql`
   - `backend/database/schema/incidents_schema_v1.sql`
4. Pastikan database bernama `cybervault_db`.

## Akun Test Lokal

Akun hasil QA lokal phase 20F:

- email: `hafid.freeze.20260625193413.2603@example.com`
- password: `Password123`

Catatan:

- Aman untuk lokal/XAMPP.
- Jangan perlakukan sebagai secret production.

## Endpoint Utama

- `GET /backend/index.php/health`
- `GET /backend/index.php/api/ping`
- `GET /backend/index.php/api/auth/status`
- `GET /backend/index.php/api/auth/contract`
- `POST /backend/index.php/api/auth/register`
- `POST /backend/index.php/api/auth/login`
- `POST /backend/index.php/api/auth/logout`
- `GET /backend/index.php/api/auth/me`
- `PUT /backend/index.php/api/auth/profile`
- `GET /backend/index.php/api/auth/sessions`
- `GET /backend/index.php/api/incidents/status`
- `GET /backend/index.php/api/incidents/contract`
- `POST /backend/index.php/api/incidents/report`
- `GET /backend/index.php/api/incidents/my`
- `GET /backend/index.php/api/incidents/detail/{report_code}`

## Batasan Production

- Token masih `localStorage`, belum `httpOnly` cookie.
- Belum ada upload file nyata untuk bukti insiden.
- Belum ada role admin workflow.
- Belum ada rate limiting enforcement penuh.
- Bundle frontend masih cukup besar dan bisa dipecah lagi.
- Deployment Vercel production akan butuh backend publik atau fallback demo mode.
