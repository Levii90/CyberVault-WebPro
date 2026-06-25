# Frontend Dashboard and Notification Regression Fix

## Masalah

- Dashboard hero masih menampilkan floating card dekoratif yang membuat visual terlalu ramai.
- Sidebar masih menampilkan badge notifikasi hardcoded `3`.
- Tombol hero di halaman Notifikasi terlalu besar dan terlihat seperti bubble bulat berlebihan.

## File yang Diubah

- `src/views/pages/Dashboard.jsx`
- `src/models/navigationModel.js`
- `src/services/notifications/notificationService.js`
- `src/views/components/Sidebar.jsx`
- `src/styles/NotifikasiPage.css`

## Ringkasan Fix

- Floating card dashboard dihapus dari JSX hero karena hanya dekorasi.
- Badge notifikasi sidebar tidak lagi hardcoded dan sekarang membaca unread count dari notification service.
- Notification service mock sekarang menyimpan state lokal sederhana dan dispatch event `notifications:updated` setiap ada perubahan.
- Tombol hero Notifikasi dinormalisasi menjadi lebih compact dengan tinggi, padding, dan radius yang proporsional.

## Checklist Testing

- `npm run build`
- `npm run dev`
- buka `/dashboard` dan pastikan floating card hero hilang
- buka `/notifikasi` dan pastikan badge sidebar sesuai unread count
- klik `Mark All as Read` dan pastikan badge sidebar ikut update
- cek tombol `Mark All as Read` dan `Reset Filter` tidak lagi terlalu besar

## Risk Notes

- Modul notifikasi masih frontend mock, jadi unread count masih berasal dari service lokal.
- Saat backend notifications tersedia nanti, helper unread count perlu diarahkan ke API.
- Floating card dashboard dihapus karena regression visual, bukan karena data dashboard dihilangkan.
