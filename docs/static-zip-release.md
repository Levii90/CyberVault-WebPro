# Static ZIP Release

## Tujuan

ZIP release dipakai untuk membagikan paket frontend static ke teman, dosen, atau environment XAMPP tanpa mengirim seluruh source development.

## Jangan Pakai Untuk Kolaborasi Coding

Static ZIP bukan source package. Untuk berbagi source ke teman, gunakan:

```powershell
npm run release:source
```

Jangan zip manual full folder project.

## Cara Membuat ZIP

```powershell
npm run release:zip
```

Script akan:

- menjalankan `npm run build`
- membuat folder `release/`
- membuat file `release/cybervault-static-release.zip`

## Isi ZIP

Paket ZIP hanya membawa file yang diperlukan:

- `dist/`
- `index.php`
- `.htaccess`
- `docs/static-zip-release.md`

## Yang Tidak Boleh Masuk ZIP

- `node_modules/`
- `.env.local`
- `framework-sources/`
- backend palsu
- credential atau secret

Static ZIP juga tidak ditujukan membawa:

- `.git/`
- source coding penuh
- `release/` lama

## Deploy ke XAMPP

1. Extract ZIP ke folder project tujuan.
2. Pastikan isi `dist/` tersedia.
3. Jika folder target berbeda dari build asal, ubah `.env.local` di source repo lalu build ulang sebelum membuat ZIP baru.

Contoh path XAMPP saat ini:

- folder project: `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`
- URL root: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/`
- URL dist: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/`

Required env saat build untuk lokasi ini:

```env
VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist
VITE_API_BASE_URL=
```

Jika nama folder berubah lagi, update basename lalu buat ZIP baru dari build terbaru.

## Deploy ke Hosting Static

Jika hosting hanya menerima file static:

- upload isi `dist/` sesuai kebutuhan hosting
- pastikan basename saat build cocok dengan path hosting

Jika hosting butuh fallback SPA, siapkan aturan rewrite/fallback sesuai platform.

## Checklist Sebelum Dikirim

- build terbaru berhasil
- basename sudah sesuai target deploy
- tidak ada secret
- tidak ada `node_modules`
- tidak ada backend palsu
- file release ZIP berhasil dibuat

Untuk source collaboration checklist, lihat [source-collaboration-package.md](/D:/xampp/htdocs/CyberVault-v1.0/CyberVault-WebPro/docs/source-collaboration-package.md).
