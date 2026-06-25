# Backend API Foundation

## Scope

Phase ini hanya membangun fondasi API minimal di atas bootstrap CodeIgniter 3 + HMVC yang sudah aktif.

Yang dibuat:

- response helper global
- base API controller
- local CORS policy
- `health` response yang konsisten
- `api/ping` endpoint minimal

Yang belum dibuat:

- auth module
- incidents module
- endpoint fitur bisnis
- database fisik
- migration
- seeder

## Response Standard

Response sukses:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "message": "string",
  "errors": {}
}
```

## Files

File fondasi API:

- `backend/application/helpers/api_response_helper.php`
- `backend/application/core/API_Controller.php`
- `backend/application/modules/api/controllers/Ping.php`

## Local CORS Policy

Origin yang diizinkan pada phase ini:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost`
- `http://127.0.0.1`

Methods:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`

Headers:

- `Content-Type`
- `Authorization`
- `X-Requested-With`

## Routes

Route yang aktif:

- `GET /backend/index.php/health`
- `GET /backend/index.php/api/ping`

## Testing

Test browser atau Postman:

- `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php/health`
- `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php/api/ping`

Test preflight jika perlu:

- `OPTIONS /backend/index.php/api/ping`

## Guidance For Next Modules

Module API berikutnya sebaiknya:

1. extend `API_Controller`
2. gunakan `respond_success()` atau `respond_error()`
3. jangan echo JSON manual
4. jangan autoload database jika endpoint tidak membutuhkannya
5. tambahkan route seperlunya, jangan membuka banyak route sekaligus

## Next Phase

Langkah kecil berikutnya yang direkomendasikan:

- `Phase 19 — Backend Auth Module Foundation`
