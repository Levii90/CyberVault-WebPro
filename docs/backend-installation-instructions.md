# Backend Installation Instructions

> Catatan status terbaru:
> bootstrap backend nyata sekarang sudah ada di folder `backend/`.
> Dokumen verifikasi runtime terbaru ada di [backend-bootstrap-verification.md](/D:/xampp/htdocs/CyberVault-v1.0/CyberVault-WebPro/docs/backend-bootstrap-verification.md).

## Status Phase 18A Retry

Phase 18A Retry sudah menemukan source staging yang valid untuk framework CodeIgniter 3 dan HMVC.

Audit retry ini dilakukan terhadap path yang diminta langsung oleh phase, lalu dibandingkan dengan struktur repo aktif di:

- `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`

Sumber valid telah distaging ke:

- `framework-sources/codeigniter3/`
- `framework-sources/hmvc/`

Checklist source yang gagal divalidasi pada retry ini:

- `framework-sources/codeigniter3/index.php`
- `framework-sources/codeigniter3/application/`
- `framework-sources/codeigniter3/system/`
- `framework-sources/codeigniter3/system/core/CodeIgniter.php`
- `framework-sources/codeigniter3/application/config/config.php`
- `framework-sources/codeigniter3/application/config/routes.php`
- `framework-sources/codeigniter3/application/config/database.php`
- `framework-sources/codeigniter3/application/controllers/Welcome.php`
- `framework-sources/hmvc/application/core/MY_Loader.php`
- `framework-sources/hmvc/application/core/MY_Router.php`
- `framework-sources/hmvc/application/third_party/MX/`
- class `MX_Controller`
- class `MX_Loader`
- class `MX_Router`

Temuan tambahan pada phase source preparation:

- tidak ditemukan folder hasil extract manual bernama `CodeIgniter-3*`, `codeigniter*`, `Modular-Extensions*`, `codeigniter-modular-extensions-hmvc*`, `HMVC*`, atau `modular*` di root project
- tidak ditemukan arsip source framework seperti `CodeIgniter*.zip`, `HMVC*.zip`, atau `modular*.zip` di root project
- di parent folder hanya ditemukan `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro.zip`, yang merupakan arsip project dan **bukan** source CI3/HMVC

## Status Phase 18A

Phase 18A **tidak dapat melanjutkan pemasangan backend runnable** karena backend belum dibuat di root frontend, tetapi source staging untuk CodeIgniter 3 dan HMVC telah tersedia.

Temuan audit:

- folder `framework-sources/` ada dan berisi sumber staging
- folder `framework-sources/codeigniter3/` ada
- folder `framework-sources/hmvc/` ada
- folder `backend/` belum ada
- folder `application/` belum ada di root proyek frontend
- folder `system/` belum ada di root proyek frontend
- folder `application/third_party/MX/` belum ada di root proyek frontend
- file `framework-sources/codeigniter3/system/core/CodeIgniter.php` ada
- file `framework-sources/codeigniter3/application/config/config.php` ada
- file `framework-sources/codeigniter3/application/config/routes.php` ada
- file `framework-sources/codeigniter3/application/config/database.php` ada
- file `framework-sources/hmvc/application/core/MY_Loader.php` ada
- file `framework-sources/hmvc/application/core/MY_Router.php` ada
- file `framework-sources/hmvc/application/third_party/MX/Controller.php` ada
- file `framework-sources/hmvc/application/third_party/MX/Loader.php` ada
- file `framework-sources/hmvc/application/third_party/MX/Router.php` ada
- file arsip lokal `.zip/.rar/.7z/.tar/.gz` untuk CI3/HMVC tidak ditemukan di repo

Karena itu:

- backend runnable **tidak dibuat**
- `backend/system` palsu **tidak dibuat**
- `backend/application` palsu **tidak dibuat**
- HMVC palsu **tidak dibuat**

## Why This Phase Stops

Phase ini hanya boleh menambahkan backend jika source asli benar-benar tersedia.

Tanpa source asli:

- membuat `backend/` manual akan menyesatkan status implementasi
- membuat `system/` atau `application/` dummy akan melanggar aturan engineering
- mengklaim HMVC aktif tanpa file MX asli akan salah
- menginstal backend dari path staging yang tidak ada akan menghasilkan bootstrap palsu

## Required Manual Sources

Sebelum Phase 18A/18B bisa lanjut, source berikut harus tersedia:

### 1. CodeIgniter 3 Official Source

Yang harus tersedia minimal:

- `index.php`
- `system/core/CodeIgniter.php`
- `application/config/config.php`
- `application/config/routes.php`
- `application/config/autoload.php`
- `application/config/database.php`

### 2. HMVC Modular Extensions / MX Source

Yang harus tersedia minimal:

- `application/third_party/MX/`
- class `MX_Controller`
- class `MX_Loader`
- class `MX_Router`
- extension `MY_Loader.php`
- extension `MY_Router.php`

## Safe Staging Preparation Note

Phase 18A-S hanya boleh menyiapkan staging jika source asli sudah tersedia secara manual.

Yang harus dilakukan user sebelum retry berikutnya:

1. Download atau extract source CodeIgniter 3 stable asli.
2. Download atau extract source Modular Extensions HMVC/MX yang kompatibel.
3. Pastikan source tersebut tersedia di workspace ini sebelum normalisasi ke:
   - `framework-sources/codeigniter3/`
   - `framework-sources/hmvc/`

Yang tidak boleh dilakukan:

- membuat `framework-sources/` palsu tanpa source asli
- menyalin file random project zip ke staging framework
- membuat `system/`, `application/`, atau `MX/` dummy agar phase terlihat lanjut

## Target Folder Structure After Real Source Is Added

```text
backend/
├── index.php
├── .htaccess
├── application/
│   ├── config/
│   ├── controllers/
│   ├── core/
│   ├── helpers/
│   ├── hooks/
│   ├── language/
│   ├── libraries/
│   ├── logs/
│   ├── models/
│   ├── third_party/
│   │   └── MX/
│   ├── modules/
│   └── views/
└── system/
```

## Safe Manual Installation Plan

Setelah source asli tersedia, langkah aman berikutnya:

1. Tambahkan source CodeIgniter 3 asli ke folder `backend/`
2. Pastikan file berikut benar-benar ada:
   - `backend/system/core/CodeIgniter.php`
   - `backend/application/config/config.php`
   - `backend/application/config/routes.php`
   - `backend/application/config/database.php`
3. Tambahkan source HMVC asli ke:
   - `backend/application/third_party/MX/`
   - `backend/application/core/MY_Loader.php`
   - `backend/application/core/MY_Router.php`
4. Buat `backend/application/modules/` hanya setelah HMVC source valid
5. Verifikasi bootstrap backend dasar
6. Baru setelah itu lanjut ke health check minimal

## Local XAMPP Expectations

Project saat ini berada di:

- `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`

Frontend saat ini berjalan dari:

- root redirect ke `dist/`

Target backend nanti:

- `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/`

Catatan penting:

- jangan ubah `src/` React
- jangan rusak `index.php` root yang masih dipakai untuk frontend static redirect
- jika backend sudah ada nanti, `.htaccess` backend harus terpisah dari root `.htaccess`

## Placeholder Configuration Guidance

Setelah CI3 asli tersedia, konfigurasi lokal awal boleh memakai placeholder aman:

- `base_url`: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/`
- database host: `localhost`
- database user: `root`
- database password: kosong
- database name: `cybervault_db`

Catatan:

- ini hanya placeholder konfigurasi
- jangan membuat database fisik pada phase ini
- jangan isi secret production

## Verification Checklist For Next Retry

Phase 18A retry baru boleh lanjut implementasi jika checklist ini terpenuhi:

- source CI3 asli tersedia
- source HMVC/MX asli tersedia atau jelas belum tersedia
- `backend/index.php` adalah bootstrap CI3 asli
- `backend/system/core/CodeIgniter.php` ada
- `backend/application/config/config.php` ada
- `backend/application/config/routes.php` ada
- `backend/application/config/database.php` ada

## Next Phase Recommendation

Karena source asli belum tersedia, langkah berikutnya adalah:

- **ulang Phase 18A** setelah source CodeIgniter 3 resmi dan HMVC extension asli sudah ditambahkan ke workspace

Jangan lanjut ke endpoint auth/incidents sebelum source framework nyata tersedia.
