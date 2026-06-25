# Backend Auth Rate Limit Design

## Goal

- mengurangi brute-force login
- mengurangi spam register
- menyiapkan desain sebelum enforcement nyata

## Candidate Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/reset-password` nanti

## Candidate Keys

- `ip_address`
- `email` yang sudah dinormalisasi
- `route`

## Suggested Windows

- login:
  - `5` percobaan / `10` menit
- register:
  - `3` percobaan / `30` menit

## Suggested Response

- HTTP `429 Too Many Requests`
- body JSON standard:

```json
{
  "success": false,
  "message": "Too many requests.",
  "errors": {
    "rate_limit": "Please wait before trying again."
  }
}
```

## Suggested Storage

- ideal: cache atau tabel `auth_rate_limits`
- phase ini belum membuat tabel baru

## Why Deferred

- menghindari schema churn terlalu cepat
- fokus phase ini adalah guard reusable dan session management foundation
