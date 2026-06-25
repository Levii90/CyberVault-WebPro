# Backend Framework Source Staging

## Hasil Discovery Phase 18A-S2

Sumber framework CodeIgniter 3 dan HMVC berhasil ditemukan pada sistem lokal dan telah distaging ke project ini tanpa membuat backend runnable.

### Candidate yang ditemukan

1. `D:\xampp\htdocs\ci3_project\ci3_project`
   - dianggap kandidat utama
   - memiliki source CodeIgniter 3 asli dan HMVC/MX yang lengkap
2. `D:\xampp\htdocs\Pemrograman_Web\WebPro4904\smarttrash_monitor2\codeigniter`
   - juga valid tetapi berisi artefak praktikum tambahan
3. `D:\xampp\htdocs\Pemrograman_Web\WebPro4904\Pekan-08`
   - juga valid tetapi berisi materi tugas tambahan
4. `D:\xampp\htdocs\Pemrograman_Web\WebPro4904\Pekan-09`
   - juga valid tetapi berisi materi tugas tambahan
5. `D:\xampp\htdocs\KumpulanTubes`
   - tidak valid sebagai source CI3 karena file framework tidak lengkap

## Source yang terpilih untuk staging

- `D:\xampp\htdocs\ci3_project\ci3_project`

Alasan:
- struktur folder lebih bersih dan dekat dengan source framework murni
- tidak berisi dokumen tugas praktikum besar seperti PDF/DOCX/SQL tambahan
- memiliki file validasi CI3 dan HMVC lengkap

## Validasi CI3

Ditemukan:
- `system/core/CodeIgniter.php`
- `application/config/config.php`
- `application/config/routes.php`
- `application/config/database.php`

## Validasi HMVC

Ditemukan:
- `application/core/MY_Loader.php`
- `application/core/MY_Router.php`
- `application/third_party/MX/Controller.php`
- `application/third_party/MX/Loader.php`
- `application/third_party/MX/Router.php`

## Staging yang dibuat

### `framework-sources/codeigniter3/`

Berisi:
- `index.php`
- `.htaccess`
- `application/`
- `system/`

Validasi akhir:
- `framework-sources/codeigniter3/system/core/CodeIgniter.php`
- `framework-sources/codeigniter3/application/config/config.php`
- `framework-sources/codeigniter3/application/config/routes.php`
- `framework-sources/codeigniter3/application/config/database.php`

### `framework-sources/hmvc/`

Berisi:
- `application/core/MY_Loader.php`
- `application/core/MY_Router.php`
- `application/third_party/MX/Controller.php`
- `application/third_party/MX/Loader.php`
- `application/third_party/MX/Router.php`

## Catatan Keamanan

- `backend/` tetap belum dibuat.
- `framework-sources/` hanya staging, bukan backend executable.
- `framework-sources/` diabaikan oleh Git lewat `.gitignore`.
- Jangan commit `framework-sources/` ke repositori.
- Jangan membuat database, endpoint, migration, atau module fungsi baru.

## Next Step

Jika Phase 18A Retry dilanjutkan, gunakan staging ini sebagai sumber CI3/HMVC. Namun jangan lanjut otomatised Phase 18A Retry dari dokumentasi ini.

- Jika backend bootstrap diperlukan, verifikasi source staging terlebih dahulu.
- Jika HMVC dibutuhkan, stage ini sudah menyediakan file `MX` yang valid.
- Jangan gunakan source praktikum lain tanpa membersihkan artefak tugas.
