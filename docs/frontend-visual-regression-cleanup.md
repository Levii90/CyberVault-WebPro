# Frontend Visual Regression Cleanup

## Masalah

- Kartu `Jenis Insiden` terasa bisa dipencet tetapi feedback aktifnya kurang jelas.
- Navbar masih menampilkan tombol voice/mic placeholder yang belum punya fitur nyata.
- Filter/chip di halaman Forum terlalu rapat dan kurang nyaman dibaca.

## File yang Diubah

- `src/views/pages/PelaporanInsiden.jsx`
- `src/styles/IncidentReportPage.css`
- `src/views/components/Navbar.jsx`
- `src/styles/ForumPage.css`

## Ringkasan Fix

- Kartu incident type sekarang tetap sinkron ke state `incidentType` yang dipakai payload submit, lalu diberi `aria-pressed`, label aksesibel, dan feedback teks jenis yang sedang dipilih.
- Active, hover, dan focus-visible state pada kartu incident type dibuat lebih jelas.
- Tombol voice/mic yang masih placeholder di navbar dihapus dari render agar tidak menjadi fitur palsu.
- Search navbar tetap dipertahankan dengan input dan tombol `Cari` yang jelas terlihat.
- Spacing filter forum dirapikan dengan gap vertikal dan horizontal yang lebih konsisten agar chip row tidak terasa nabrak.

## Checklist Testing

- `npm run build`
- `npm run dev`
- buka `/pelaporan-insiden`, klik beberapa jenis insiden, lalu pastikan active state berpindah
- submit laporan dan pastikan incident type yang dipilih tetap terkirim
- buka dashboard dan pastikan navbar tidak lagi menampilkan tombol voice
- buka `/forum` dan cek chip/filter lebih renggang serta wrap rapi

## Risk Notes

- Voice search memang belum tersedia dan sengaja tidak dibuat pada phase ini.
- Upload bukti file incident belum tersedia.
- Forum masih mock frontend sampai backend forum dibuat.
- Manual browser QA tetap perlu sebelum freeze final.
