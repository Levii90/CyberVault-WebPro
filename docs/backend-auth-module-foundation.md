# Backend Auth Module Foundation

## Scope Phase 19A-19B

- membangun struktur module `auth` di CodeIgniter 3 HMVC
- menyediakan endpoint status dan contract
- menyediakan stub endpoint auth dengan response aman
- menyediakan service validasi dan utilitas hash password
- menyediakan draft schema SQL user
- mengaktifkan persistence auth lokal dengan MySQL XAMPP
- mengaktifkan register/login/logout/me/profile berbasis token session hash

## Module Structure

- `backend/application/modules/auth/controllers/Auth.php`
- `backend/application/modules/auth/models/Auth_model.php`
- `backend/application/modules/auth/services/Auth_service.php`
- `backend/application/libraries/Auth_guard.php`

## Implemented Endpoints

- `GET /api/auth/status`
- `GET /api/auth/contract`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PATCH /api/auth/profile`
- `POST /api/auth/profile`
- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`

Behavior:

- method salah: `405`
- payload invalid: `422`
- duplicate email/username: `409`
- invalid credentials/token: `401`
- inactive or suspended account: `403`

## Design Notes

- controller hanya menangani request, method guard, dan response
- validation logic ditempatkan di `Auth_service`
- model sekarang sudah memakai Query Builder CI3
- helper response global tetap dipakai supaya format API konsisten
- token raw hanya dikirim ke client, database hanya menyimpan hash sha256
- validasi bearer token sekarang tersedia sebagai guard reusable

## Out of Scope

- koneksi frontend auth ke backend
