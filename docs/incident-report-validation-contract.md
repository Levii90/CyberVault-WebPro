# Incident Report Validation Contract

## Scope

- dipakai untuk fondasi backend incident report
- belum menangani upload file real
- belum menyimpan data ke database

## Rules

- `incident_type` wajib
- `title` wajib, maksimum 150 karakter
- `description` wajib, minimum 20 karakter
- `platform` opsional, maksimum 120 karakter
- `city` opsional, maksimum 120 karakter
- `suspicious_url` opsional, harus URL valid, maksimum 500 karakter
- `evidence_summary` opsional, maksimum 1000 karakter
- `incident_date` opsional, harus format datetime valid
- `severity` opsional, enum: `low`, `medium`, `high`, `critical`
- `contact_preference` opsional, enum: `email`, `in_app`, `none`

## Security Validation

- field sensitif seperti `password`, `otp`, `token`, `private_key`, `identity_number`, dan `bank_account_number` harus ditolak jika dikirim sebagai field terpisah
- string harus disanitasi sebelum diproses lebih lanjut
- input user tidak boleh dirender sebagai HTML
- log backend tidak boleh mencatat payload sensitif penuh
- bukti file belum diterima di backend phase ini
- `evidence_files` atau `evidenceFiles` non-kosong harus ditolak dengan pesan bahwa upload evidence belum tersedia

## Frontend Mapping Notes

Field frontend saat ini yang cocok langsung:

- `incident_type`
- `title`
- `description`
- `platform`
- `city`
- `incident_date`

Field frontend yang belum dipersist di phase ini:

- `evidence_files`

Field yang disarankan untuk phase backend berikutnya:

- `suspicious_url`
- `evidence_summary`
- `contact_preference`
- `severity`
