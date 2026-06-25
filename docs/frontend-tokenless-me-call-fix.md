# Frontend Tokenless `/me` Call Fix

## Masalah

Halaman public auth seperti `/login` dan `/register` masih bisa memicu request `GET /api/auth/me` walaupun `auth_token` belum ada di `localStorage`. Dampaknya adalah muncul `401` di network dan UX terlihat seperti sesi rusak padahal user memang belum login.

## Penyebab

- `GuestRoutes` dan `ProtectedRoutes` sama-sama memakai refresh session berbasis `/api/auth/me`.
- `getCurrentUserFromApi()` sebelumnya langsung memanggil backend pada mode backend auth tanpa short-circuit token kosong.
- Saat request `401`, flow lama langsung membersihkan auth sehingga public page terlihat seperti auto logout check.

## File yang Diperbaiki

- `src/services/auth/authService.js`
- `src/controllers/authController.js`
- `src/controllers/routeController.jsx`

## Perubahan Inti

- Menambahkan `getStoredToken()` dan `hasAuthToken()` agar pengecekan token terpusat.
- Menambahkan short-circuit di `getCurrentUserFromApi()` dan `validateSession()` saat token kosong.
- Mengubah route guard supaya:
  - public auth page tidak memanggil `/me` jika token tidak ada
  - protected route langsung redirect ke login jika token tidak ada
  - `401/403` tetap membersihkan auth
  - error jaringan tidak langsung menghapus sesi permanen

## Public dan Protected Route

Public auth route:

- `/login`
- `/register`
- `/reset-password`
- `/`

Protected route:

- `/dashboard`
- `/pelaporan-insiden`
- `/akun`
- `/timeline`
- `/pengaturan`
- `/notifikasi`
- `/informasi-peringatan`
- `/sertifikat-penilaian`
- `/forum`
- `/asesmen`
- `/pusat-edukasi`
- route alias protected lain yang diarahkan ke halaman utama

## Checklist Test

- `npm run build`
- buka `/login` dengan storage kosong: tidak ada call `/api/auth/me`
- buka `/register` dengan storage kosong: tidak ada call `/api/auth/me`
- login valid: token tersimpan, redirect dashboard, `/me` boleh dipakai untuk protected route
- refresh `/dashboard` saat token valid: sesi tetap aktif
- ubah token jadi invalid: `/me` gagal, auth dibersihkan, redirect login
- logout: storage bersih, kembali ke `/login`, tidak ada `/me` tanpa token
