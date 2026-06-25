# Backend Auth Session Management

## Scope

- session disimpan di tabel `user_sessions`
- raw token tidak pernah disimpan di database
- database hanya menyimpan `session_token_hash`

## Session Endpoints

- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`

## Response Rules

Session list hanya mengembalikan field aman:

- `id`
- `user_agent`
- `ip_address` yang sudah dimasking
- `expires_at`
- `revoked_at`
- `created_at`
- `is_current`

Field yang tidak boleh keluar:

- `session_token_hash`

## Ownership Rules

- hanya user pemilik token aktif yang bisa melihat session miliknya
- revoke session hanya boleh untuk `session_id` milik user sendiri
- session yang tidak ditemukan atau sudah direvoke mengembalikan `404`

## Current Limitations

- belum ada list session di frontend
- belum ada revoke all sessions
- belum ada metadata device/location enrichment
