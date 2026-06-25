# Backend Security Checklist

## Auth

- gunakan `password_hash()` untuk penyimpanan password
- gunakan `password_verify()` untuk verifikasi password
- jangan return `password_hash` ke frontend
- tentukan strategi auth dengan jelas:
  - session-based
  - atau JWT-based
- rate limit login wajib
- lockout / throttling perlu dipertimbangkan

## Validation

- semua input wajib divalidasi di backend
- frontend validation tidak cukup
- lakukan `trim`
- validasi `required`
- validasi `max_length`
- validasi enum untuk status/type/priority
- validasi email
- validasi route param id

## Authorization

- user hanya boleh mengakses data miliknya
- semua endpoint update/delete butuh ownership check
- role admin/moderator dipisahkan nanti jika dibutuhkan
- endpoint download sertifikat dan evidence harus auth-protected

## File Upload

- whitelist MIME type
- batasi ukuran file
- gunakan nama file acak
- jangan percaya nama file dari user
- verifikasi extension dan MIME
- simpan file di luar public root jika memungkinkan
- buat metadata file di database

## Forum and Help Input

- sanitization backend wajib
- output escaping wajib
- moderation/report flow wajib
- rate limit posting wajib
- cegah spam dan abuse

## Database

- gunakan query builder / parameterized query
- jangan bangun query raw dari input user
- index foreign key dan kolom filter umum
- tambah `created_at` dan `updated_at`
- pertimbangkan soft delete untuk entitas tertentu

## Session / Token

- jika session-based, simpan session securely
- jika token-based, simpan refresh/access strategy jelas
- revoke session harus benar-benar invalidate server-side session/token
- jangan pakai demo auth frontend sebagai acuan keamanan production

## HTTP / API

- response error jangan membocorkan stack trace ke client
- format response harus konsisten
- gunakan HTTP status code yang tepat
- definisikan CORS strategy jelas
- definisikan CSRF strategy jelas

## Module-Specific Notes

### Auth

- protect brute-force login
- audit login attempt
- gunakan sanitize layer agar field sensitif user tidak ikut keluar
- endpoint stub sebelum DB siap harus gagal aman, bukan pura-pura sukses
- simpan raw token hanya di client response, database wajib menyimpan hash token
- logout harus merevoke token lewat `revoked_at`
- gunakan auth guard reusable agar verification bearer token tidak tersebar
- endpoint session list wajib menyembunyikan `session_token_hash`

### Incidents

- upload evidence paling sensitif
- scan dan validasi file wajib

### Assessments

- scoring jangan sepenuhnya percaya client

### Certificates

- certificate code harus unik
- verify endpoint harus dibatasi input dan rate-nya

### Forum

- komentar/thread wajib sanitized
- report abuse wajib tercatat

### Notifications

- semua state per user

### Account and Settings

- profile update wajib validasi email dan panjang field
- session revoke wajib ownership check

## Readiness Verdict

Checklist security ini **belum bisa dianggap implemented** karena backend belum ada.

Status saat ini:

- security requirement: `terdefinisi`
- security enforcement: `belum diimplementasikan`
