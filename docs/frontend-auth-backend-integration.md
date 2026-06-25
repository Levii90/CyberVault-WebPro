# Frontend Auth Backend Integration

## Auth Mode

- `VITE_AUTH_MODE=backend` untuk XAMPP lokal
- `VITE_AUTH_MODE=demo` untuk static deploy atau Vercel

## API Base

- local backend: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`

## Storage Keys

- `auth_token`
- `current_user`

## Flow

- login backend: `POST /api/auth/login`
- register backend: `POST /api/auth/register`
- session check: `GET /api/auth/me`
- logout backend: `POST /api/auth/logout`
- profile update backend: `PUT /api/auth/profile`

## Behavior

- backend mode memakai bearer token dari storage
- demo mode tetap memakai session demo frontend
- backend unreachable di mode backend akan menampilkan error, bukan auto login demo

## Security Notes

- password tidak disimpan di storage
- `password_hash` tidak disimpan di frontend
- token tidak di-log ke console
- token masih berada di storage frontend, jadi masih punya risiko XSS
- produksi idealnya berpindah ke cookie `httpOnly`

## Testing Checklist

- login backend sukses
- register backend sukses
- duplicate register menampilkan error
- wrong login menampilkan error generik
- refresh protected route memvalidasi `/me`
- logout membersihkan token dan user
- halaman Akun sinkron ke `/me` dan `/profile`
- demo mode tetap berjalan tanpa backend
