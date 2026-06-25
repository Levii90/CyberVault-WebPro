# Backend Auth Security Policy

## Current Position

- backend auth CyberVault sudah aktif secara lokal
- frontend hybrid auth sudah bisa memakai backend real
- hardening masih bertahap dan belum setara production

## Password Policy

- password wajib di-hash dengan `password_hash()`
- verifikasi password wajib menggunakan `password_verify()`
- panjang password backend saat ini: 8-72 karakter
- `password_hash` tidak boleh pernah keluar ke response API

## Session Policy

- target auth CyberVault adalah session-based backend
- session/token yang disimpan manual wajib dalam bentuk hash
- logout harus benar-benar merevoke session server-side
- endpoint `me` hanya boleh membaca session yang valid

## Validation Policy

- semua input auth wajib divalidasi di backend
- `trim` dan normalisasi lowercase email wajib
- error response harus konsisten dengan helper API global
- validasi frontend tetap dipertahankan, tetapi tidak dianggap cukup

## Persistence Policy

- jangan aktifkan query DB auth sebelum schema final siap
- jangan membuat user dummy diam-diam di backend
- jangan menyimpan password plain text di file, log, atau session

## Next Enforcement Targets

- unique email check di database
- brute-force throttle / rate limit login
- audit login attempt
- secure session expiration
- optional email verification flow
- reusable auth guard untuk module lain
