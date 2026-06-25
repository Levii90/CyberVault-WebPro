# Backend Auth Hardening

## Scope Phase 19E

- membuat guard reusable untuk bearer token
- memindahkan validasi session dari controller ke layer reusable
- menyiapkan fondasi session management
- menambahkan draft rate limit tanpa mengubah schema

## Reusable Guard

Library:

- `backend/application/libraries/Auth_guard.php`

Responsibility:

- membaca header `Authorization`
- mengambil bearer token
- hash token dengan `sha256`
- validasi session aktif di `user_sessions`
- memastikan user `active` dan `deleted_at IS NULL`
- mengembalikan user public dan session internal jika valid

## API Controller Helper

`API_Controller` sekarang punya helper:

- `require_auth()`
- `current_user()`
- `get_bearer_token()`
- `auth_error_response()`
- `respond_unauthorized()`

Catatan:

- helper ini tidak otomatis memproteksi semua endpoint
- setiap module tetap memanggilnya secara eksplisit
- `health` dan `api/ping` tetap public

## Auth Controller Usage

Endpoint berikut sudah memakai guard reusable:

- `GET /api/auth/me`
- `PUT|PATCH|POST /api/auth/profile`
- `POST /api/auth/logout`
- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`
