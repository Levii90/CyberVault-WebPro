# Frontend Incident History And Detail

## Scope

- menampilkan riwayat laporan user di page `PelaporanInsiden`
- mengambil detail laporan dari backend real saat backend mode aktif
- tetap mendukung demo mode
- tidak membuat route baru dan tidak membuat upload file

## Endpoint Used

- `POST /api/incidents/report`
- `GET /api/incidents/my`
- `GET /api/incidents/detail/{report_code}`

## History Mapping

Item riwayat minimal menampilkan:

- `report_code`
- `title`
- `incident_type`
- `platform`
- `city`
- `severity`
- `status`
- `created_at`

## Detail Mapping

Detail laporan menampilkan:

- `report_code`
- `title`
- `description`
- `incident_type`
- `platform`
- `city`
- `suspicious_url`
- `evidence_summary`
- `severity`
- `status`
- `contact_preference`
- `incident_date`
- `created_at`
- `status_logs`

## Filter Behavior

Filter ringan yang dipakai:

- `status`
- `severity`
- `incident_type`

## Demo Mode

- riwayat tetap berasal dari penyimpanan demo lokal
- detail laporan dibaca dari data demo lokal
- tidak memanggil backend

## Evidence Limitation

- `evidenceFiles` tetap tidak dikirim ke backend
- jika user memilih file, UI memberi tahu bahwa upload bukti belum tersedia
- ringkasan bukti hanya bisa ditampilkan lewat `evidence_summary` jika nanti UI menambah field itu

## Testing Checklist

- submit laporan sukses menampilkan `report_code` backend
- riwayat refresh setelah submit
- filter riwayat tetap bekerja
- detail laporan bisa dibuka dan ditutup
- empty state muncul saat belum ada data
- error state muncul saat backend gagal

## Risk Notes

- UI belum punya field `suspicious_url`, `evidence_summary`, `severity`, dan `contact_preference`
- detail akan menampilkan nilai `-` untuk field yang belum dikirim dari form frontend
