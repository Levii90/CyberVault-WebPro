# Frontend Incident QA Report

## Desktop Checklist

- build frontend berhasil
- submit form tetap memakai backend real pada backend mode
- success state menampilkan `report_code` backend
- riwayat laporan muncul di page yang sama
- detail panel bisa dibuka dan ditutup
- filter status, severity, dan jenis insiden tersedia

## Mobile Checklist

- grid filter turun menjadi satu kolom
- card riwayat ikut menumpuk vertikal
- detail panel ikut turun satu kolom
- teks panjang disetel agar wrap dan tidak mudah overflow

## Functional Result

- dev server `npm run dev` hidup dan root Vite merespons di `http://127.0.0.1:5173`
- submit valid: pass
- invalid payload: pass
- detail panel: pass
- filter list: pass
- refresh riwayat setelah submit: pass
- backend contract incident: pass
- session invalid via API: pass

## Issues Found

- pesan `422` dari backend masih terlalu teknis untuk UX
- URL atau deskripsi panjang berisiko membuat detail panel terasa padat
- manual browser inspection penuh tetap belum bisa diselesaikan hanya dari terminal tanpa tool browser automation

## Micro-fix Applied

- normalisasi pesan `422` menjadi lebih ramah pengguna
- normalisasi pesan evidence file yang belum didukung
- perbaikan wrapping teks panjang di detail panel dan item riwayat
- verifikasi dev server aktif dan halaman Vite dapat diakses lokal

## Remaining Risks

- visual QA manual di browser desktop dan mobile tetap diperlukan
- form frontend belum punya field `suspicious_url`, `evidence_summary`, `severity`, dan `contact_preference`
- hasil akhir spacing dan kenyamanan interaksi masih perlu dicek langsung dengan `npm run dev`
- console error browser tidak bisa diverifikasi penuh dari terminal ini

## Next Step

- jalankan QA manual browser penuh pada `/pelaporan-insiden`
- catat hanya micro-fix visual/interaksi sebelum masuk phase berikutnya
