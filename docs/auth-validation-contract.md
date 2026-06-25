# Auth Validation Contract

## Scope

- phase ini hanya mendefinisikan kontrak validasi backend auth
- frontend demo auth tetap berjalan dan belum disambungkan ke endpoint backend auth
- kontrak ini menjadi acuan sebelum persistence database diaktifkan

## Register

Endpoint:

- `POST /api/auth/register`

Payload:

- `name`
- `email`
- `password`
- `confirm_password`

Rules:

- `name`: required, trim, panjang 3-100 karakter
- `email`: required, trim, lowercase, format email valid, max 190 karakter
- `password`: required, panjang 8-72 karakter
- `confirm_password`: required, harus sama dengan `password`

Error response shape:

```json
{
  "success": false,
  "message": "Register payload is invalid",
  "errors": {
    "email": "Email format is invalid"
  }
}
```

## Login

Endpoint:

- `POST /api/auth/login`

Payload:

- `email`
- `password`

Rules:

- `email`: required, trim, lowercase, format email valid, max 190 karakter
- `password`: required, panjang 8-72 karakter

## Stub Availability

Endpoint berikut sudah ada sebagai fondasi, tetapi belum melakukan persistence:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Status current behavior:

- payload valid: backend mengembalikan `501`
- payload tidak valid: backend mengembalikan `422`

## Public User Shape

Field aman untuk response publik:

- `id`
- `email`
- `status`
- `full_name`
- `username`
- `role`
- `bio`
- `avatar_path`
- `created_at`
- `updated_at`

Field yang tidak boleh dikembalikan:

- `password_hash`
- `session_token_hash`
- `reset_token_hash`
- `remember_token_hash`
