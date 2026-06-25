# Source Collaboration Package

## Tujuan

Source collaboration package dipakai untuk berbagi source project ke teman yang akan ikut coding, bukan untuk deploy static.

## Beda Source ZIP dan Static ZIP

Source ZIP:

- dipakai untuk kolaborasi coding
- teman harus menjalankan `npm install` sendiri
- tidak membawa `node_modules/`
- tidak membawa `.git/`
- tidak membawa `.env.local`
- tidak membawa `dist/`
- tidak membawa `release/`

Static ZIP:

- dipakai untuk deploy atau preview static
- tidak ditujukan untuk ngoding
- hanya membawa hasil build yang diperlukan

## Cara Membuat Source ZIP

```powershell
npm run release:source
```

Output:

- `release/cybervault-source-collaboration.zip`

## Alur GitHub Sebelum Kirim ke Teman

Jika source akan dibagikan lewat GitHub, alur minimalnya:

```powershell
git status
git add .
git status
git commit -m "chore: prepare CyberVault frontend portability and collaboration setup"
git push origin main
```

Setelah itu, teman bisa clone repo langsung atau memakai source ZIP jika diperlukan.

## Isi Source ZIP

Source ZIP boleh membawa:

- `src/`
- `docs/`
- `scripts/`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `vercel.json`
- `index.html`
- `index.php`
- `.htaccess`
- `README.md`
- `.env.example`
- `.env.xampp.example`
- `.env.vercel.example`
- asset root yang memang dipakai project

## Yang Tidak Boleh Ikut

- `node_modules/`
- `.git/`
- `.env.local`
- `.env`
- `dist/`
- `release/`
- `framework-sources/`
- backend palsu
- file log atau cache lokal

## Cara Teman Menjalankan Project

Untuk development:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Untuk XAMPP static:

```powershell
Copy-Item .env.xampp.example .env.local
npm run build
```

Setelah itu, teman harus menyesuaikan `VITE_ROUTER_BASENAME` sesuai folder XAMPP masing-masing.

## Warning

- jangan pakai `node_modules` dari orang lain
- jangan zip manual full folder dari File Explorer
- gunakan `npm run release:source` untuk source coding
- gunakan `npm run release:zip` untuk static deploy
