# Incident Auth Policy

## Phase 20A Policy

- `GET /api/incidents/status` bersifat public
- `GET /api/incidents/contract` bersifat public
- `POST /api/incidents/report` wajib bearer token
- `GET /api/incidents/my` wajib bearer token
- `GET /api/incidents/detail/{report_code}` wajib bearer token
- endpoint admin review belum dibuat
- pelaporan anonymous/public belum diaktifkan

## Reasoning

- laporan insiden berpotensi mengandung data sensitif
- ownership laporan harus jelas dari awal
- modul berikutnya bisa langsung memakai `Auth_guard` dan `API_Controller::require_auth()`
- anonymous reporting, jika dibutuhkan, lebih aman dibahas di phase terpisah dengan rate limit dan abuse policy yang jelas
