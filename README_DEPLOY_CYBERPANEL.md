# CyberVault CyberPanel Deploy Guide

## Requirement

- CyberPanel / OpenLiteSpeed hosting
- PHP version compatible with CodeIgniter 3
- MySQL or MariaDB database

## Upload Steps

1. Create Website in CyberPanel.
2. Open File Manager.
3. Go to `public_html`.
4. Upload `cybervault-cyberpanel-deploy.zip`.
5. Extract the ZIP inside `public_html`.

## Database Setup

1. Create a new database in CyberPanel.
2. Import `database/cybervault_schema_for_cyberpanel.sql`.
3. Edit `backend/application/config/database.php`.
4. Review `backend/application/config/config.php` jika ingin menyesuaikan `base_url` untuk domain hosting.

## Database Config To Edit

Update these values in `backend/application/config/database.php`:

- `hostname`
- `username`
- `password`
- `database`

If your hosting database name is not `cybervault_db`, replace it with the real database name you created in CyberPanel.

## Optional Backend Base URL

Di package saat ini, `backend/application/config/config.php` masih memakai `base_url` localhost untuk environment lokal.

Jika diperlukan di hosting:

- buka `backend/application/config/config.php`
- sesuaikan `base_url` ke URL domain atau subdomain hosting Anda

## Frontend Build Config

CyberPanel deploy package is built with:

- `VITE_ROUTER_BASENAME=/dist`
- `VITE_API_BASE_URL=/backend/index.php`
- `VITE_AUTH_MODE=backend`

If you deploy inside a subfolder instead of the root domain, adjust `VITE_ROUTER_BASENAME` and rebuild the package.

## Backend Smoke Test

After upload and database config, test:

- `/backend/index.php/health`
- `/backend/index.php/api/ping`
- `/backend/index.php/api/auth/status`
- `/backend/index.php/api/incidents/status`

## Frontend Smoke Test

After deploy, test:

- `/dist/login`
- `/dist/dashboard`
- `/dist/pelaporan-insiden`

## Known Limitations

- Upload bukti file belum tersedia
- Admin review incident belum tersedia
- Notification backend belum tersedia
- Beberapa page masih mock frontend
- Token masih localStorage
