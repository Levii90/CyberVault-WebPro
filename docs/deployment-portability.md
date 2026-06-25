# Deployment Portability

## Ringkasan Mode

CyberVault saat ini adalah frontend React + Vite. Konfigurasi dibagi menjadi tiga mode:

1. Development mode
2. XAMPP static subfolder mode
3. Vercel production SPA mode

## Packaging Modes

Project ini sekarang punya dua jenis package:

- `npm run release:source` untuk kolaborasi coding
- `npm run release:zip` untuk static deploy

Jangan zip manual full folder project karena `.git`, `node_modules`, `.env.local`, `dist`, dan `release` bisa ikut terbawa.

## 1. Development Mode

Dipakai untuk:

- `npm run dev`

Env yang disarankan:

```env
VITE_ROUTER_BASENAME=
VITE_API_BASE_URL=
```

Hasil:

- route berjalan dari root dev server
- API masih opsional/mock

## 2. XAMPP Static Subfolder Mode

Dipakai saat hasil build diletakkan di subfolder seperti:

- `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`
- `http://localhost/CyberVault-v1.0/CyberVault-WebPro/dist/`

Contoh env:

```env
VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist
VITE_API_BASE_URL=
```

Jika folder dipindah, update basename:

- dari `/CyberVault-v1.0/CyberVault-WebPro/dist`
- menjadi basename baru sesuai nama folder hasil pindahan

Jika folder nanti diganti agar tanpa spasi, misalnya `CyberVault-v1.0`, gunakan:

```env
VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist
VITE_API_BASE_URL=
```

Setelah update env, build ulang wajib dijalankan.

## 3. Vercel Production SPA Mode

Dipakai untuk deploy root project ke Vercel.

Env:

```env
VITE_ROUTER_BASENAME=
VITE_API_BASE_URL=
```

Jika backend nanti dipisah, `VITE_API_BASE_URL` bisa diisi domain API sebenarnya.

## Vite Base dan Asset Path

Project memakai `base: './'` di Vite agar asset build tetap aman untuk static subfolder dan release ZIP. Ini membantu saat folder project dipindah di XAMPP atau hosting static biasa.

## Router Basename

Router memakai `VITE_ROUTER_BASENAME` dari env. Jika env kosong, ada fallback deteksi `/dist` untuk mode static. Ini berguna, tetapi env tetap menjadi sumber konfigurasi utama.

Required env untuk folder XAMPP saat ini:

```env
VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist
VITE_API_BASE_URL=
```

## Root vs Subfolder

Perbedaan utama:

- deploy root: basename kosong
- deploy subfolder: basename harus menunjuk path menuju `dist`

## Kenapa Harus Build Ulang Setelah Env Berubah

Build Vite membaca env saat proses build. Jika folder pindah tetapi build lama tetap dipakai, route dan asset bisa mengarah ke path yang salah.

## Kenapa ZIP `dist` Saja Bisa Error

Jika hanya mengirim `dist/` tanpa konteks basename yang benar:

- refresh route bisa salah
- asset CSS/JS bisa tidak ketemu
- landing via `index.php` root tidak ikut terbawa

## Troubleshooting

### Blank page

- cek `VITE_ROUTER_BASENAME`
- cek build terbaru sudah dibuat
- cek asset path di browser devtools

### CSS/JS not found

- biasanya basename atau path subfolder salah
- build ulang setelah ubah `.env.local`

### Refresh route 404

- di Vercel, pastikan `vercel.json` tetap ada
- di static hosting biasa, pastikan server mendukung fallback SPA atau gunakan entry root yang sesuai

### Masuk ke `TidakDitemukanPage`

- route aktif tetapi basename salah
- cek apakah project pindah folder tanpa build ulang

### Asset path salah setelah pindah folder

- update `VITE_ROUTER_BASENAME`
- jalankan `npm run build`

## Boundary Backend

Frontend ini belum terhubung ke backend CodeIgniter nyata.

- `VITE_API_BASE_URL` masih placeholder
- jangan mengklaim API production sudah aktif
- jangan buat backend palsu di repo ini
- `docs/` aman untuk source package, tetapi tidak wajib ikut static deploy
