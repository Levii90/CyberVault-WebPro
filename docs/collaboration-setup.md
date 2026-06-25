# Collaboration Setup

## Tujuan

Dokumen ini membantu tim menjalankan frontend CyberVault dengan aman di mesin masing-masing tanpa membawa file lokal yang tidak perlu ke Git.

## Packaging yang Benar

Jangan zip manual full folder project dari File Explorer karena itu bisa ikut membawa:

- `node_modules/`
- `.git/`
- `.env.local`
- `dist/`
- `release/`

Gunakan:

- `npm run release:source` untuk source collaboration ZIP
- `npm run release:zip` untuk static deploy ZIP

## Clone dan Setup Dasar

```powershell
git clone <repo-url>
cd CyberVault-WebPro
npm install
Copy-Item .env.example .env.local
npm run dev
```

## Alur GitHub yang Disarankan

Sebelum push, cek dulu file yang akan masuk commit:

```powershell
git status
git add .
git status
git commit -m "chore: prepare CyberVault frontend portability and collaboration setup"
git push origin main
```

Catatan:

- jangan pakai `git add -f` untuk memaksa file ignored
- pastikan `.env.local`, `dist/`, `release/`, dan `node_modules/` tidak ikut staging

## Environment Files

File yang boleh di-commit:

- `.env.example`
- `.env.xampp.example`
- `.env.vercel.example`

File yang tidak boleh di-commit:

- `.env.local`
- `.env.*.local`
- secret atau credential pribadi

## Mode Development

Pakai `.env.example` sebagai dasar:

```env
VITE_ROUTER_BASENAME=
VITE_API_BASE_URL=
```

Catatan:

- router basename kosong cocok untuk `npm run dev`
- `VITE_API_BASE_URL` masih placeholder karena backend nyata belum tersedia

## Mode XAMPP Static

Jika project dibuild ke subfolder XAMPP, salin file ini:

```powershell
Copy-Item .env.xampp.example .env.local
```

Lalu sesuaikan `VITE_ROUTER_BASENAME` jika folder berbeda.

Contoh:

- folder project saat ini: `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`
- basename XAMPP saat ini: `/CyberVault-v1.0/CyberVault-WebPro/dist`
- jika folder diganti tanpa spasi, misalnya `htdocs/CyberVault-v1.0/`, basename menjadi `/CyberVault-v1.0/CyberVault-WebPro/dist`

Catatan:

- karena folder `CyberVault-v1.0` tidak mengandung spasi, URL tidak perlu `%20`
- `VITE_API_BASE_URL` tetap kosong karena backend nyata belum tersedia

Setelah env berubah, jalankan build ulang:

```powershell
npm run build
```

## Mode Vercel

Untuk deploy frontend-only ke Vercel:

```powershell
Copy-Item .env.vercel.example .env.local
npm run build
```

Mode ini memakai basename kosong.

## Perintah Harian Tim

```powershell
npm install
npm run dev
npm run build
npm run preview
```

## Yang Tidak Boleh Di-commit

- `node_modules/`
- `dist/`
- `.env.local`
- `release/`
- `framework-sources/`

Yang tidak boleh ikut source collaboration package:

- `node_modules/`
- `.git/`
- `.env.local`
- `dist/`
- `release/`

## Catatan Route Basename

Project memakai `VITE_ROUTER_BASENAME` dan fallback deteksi `/dist` untuk mode static subfolder. Kalau folder project pindah, cukup ubah env lalu build ulang.

URL lokal yang dipakai setelah folder move:

- app root: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/`
- static build: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/`

## Boundary Backend

Backend CodeIgniter 3 HMVC belum tersedia di repo runnable ini.

- jangan membuat folder `backend/` palsu
- jangan menganggap `VITE_API_BASE_URL` sudah aktif
- jangan commit source framework staging ke repo utama kecuali memang sudah menjadi backend final yang tervalidasi
- folder `docs/` aman dan boleh tetap ada di repo maupun source package
