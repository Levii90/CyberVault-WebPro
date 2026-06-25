# Backend Auth Endpoint Test

## Endpoints

- `GET /backend/index.php/api/auth/status`
- `GET /backend/index.php/api/auth/contract`
- `POST /backend/index.php/api/auth/register`
- `POST /backend/index.php/api/auth/login`
- `GET /backend/index.php/api/auth/me`
- `POST /backend/index.php/api/auth/logout`
- `PUT /backend/index.php/api/auth/profile`
- `GET /backend/index.php/api/auth/sessions`
- `POST /backend/index.php/api/auth/sessions/revoke`

## Register Payload

```json
{
  "name": "Hafid Test",
  "username": "hafid_test",
  "email": "hafid.test@example.com",
  "password": "Password123",
  "password_confirmation": "Password123"
}
```

## Login Payload

```json
{
  "email": "hafid.test@example.com",
  "password": "Password123"
}
```

## Expected Safety

- response tidak boleh mengandung `password_hash`
- database hanya menyimpan `session_token_hash`
- login salah harus mengembalikan pesan generik
- token logout harus gagal dipakai lagi untuk endpoint `me`

## Frontend Integration Note

- frontend backend mode memakai bearer token dari storage key `auth_token`
- frontend menyimpan public user di storage key `current_user`
- halaman Akun memakai `/api/auth/me` untuk sinkronisasi dan `/api/auth/profile` untuk update

## Session Management Note

- session list tidak boleh mengandung `session_token_hash`
- revoke session hanya boleh untuk session milik user sendiri
