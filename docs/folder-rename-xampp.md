# Folder Rename XAMPP

## Status

Rename parent folder **tidak aman dilakukan otomatis** dari sesi ini karena workspace aktif masih berjalan dari:

- `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`

Jika folder parent di-rename saat terminal/editor masih memakai path ini, path kerja bisa putus dan phase berikutnya berisiko membaca lokasi yang salah.

## Target Rename

Dari:

- `D:\xampp\htdocs\CyberVault-v1.0`

Menjadi:

- `D:\xampp\htdocs\CyberVault-v1.0`

## Langkah Manual yang Aman

1. Tutup dev server, preview server, atau terminal lain yang masih memakai folder project ini.
2. Buka PowerShell baru.
3. Jalankan command berikut dari `D:\xampp\htdocs`:

```powershell
cd D:\xampp\htdocs
Rename-Item -LiteralPath "<old-folder-name>" -NewName "CyberVault-v1.0"
```

4. Buka ulang project dari path baru:

```text
D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro
```

5. Verifikasi path baru sudah aktif.
6. Setelah itu baru lanjut update env, build ulang, dan audit source CI3/HMVC.

## Setelah Rename Berhasil

Nilai XAMPP yang akan dipakai pada phase berikutnya:

```env
VITE_ROUTER_BASENAME=/CyberVault-v1.0/CyberVault-WebPro/dist
VITE_API_BASE_URL=
```

Target backend nanti:

- `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/`

## Catatan Penting

- jangan rename dari terminal yang current working directory-nya masih berada di folder lama
- jangan update build sebelum rename benar-benar selesai
- jangan membuat `backend/` pada phase ini
- jangan membuat `framework-sources/` palsu
- jika source CI3/HMVC belum tersedia setelah rename, phase backend tetap harus berhenti di audit
