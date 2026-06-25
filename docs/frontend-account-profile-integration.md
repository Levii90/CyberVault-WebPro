# Frontend Account Profile Integration

## Scope

- halaman Akun memakai `current_user` sebagai initial render
- backend mode me-refresh user dari `GET /api/auth/me`
- update profile dikirim ke `PUT /api/auth/profile`
- statistik keamanan, device session, dan activity tetap mock untuk phase ini

## Storage

- token: `auth_token`
- public user: `current_user`

## Allowed Profile Fields

- `name`
- `username`
- `bio`
- `phone`
- `institution`

## Forbidden Fields

- `role`
- `status`
- `password`
- `password_hash`
- `token`
- `session_token_hash`
- `email_verified_at`
- `last_login_at`

## Mode Behavior

- backend mode:
  - Akun page refresh ke `/api/auth/me`
  - update profile ke `/api/auth/profile`
  - `current_user` diperbarui setelah sukses
- demo mode:
  - Akun page memakai data lokal/mock
  - update profile bersifat lokal

## UI Sync

- Navbar dan Sidebar mendengar event `auth:user-updated`
- perubahan nama user akan langsung ikut berubah setelah profile update

## Error Handling

- `401`: clear auth dan redirect login
- `409`: tampilkan conflict username/email
- `422`: tampilkan validation error field
- `500` / network: tampilkan pesan umum tanpa stack trace
