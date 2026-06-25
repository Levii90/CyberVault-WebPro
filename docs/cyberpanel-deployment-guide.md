# CyberPanel Deployment Guide

## Purpose

Dokumen ini dipakai untuk handoff hosting CyberPanel menggunakan ZIP deploy yang sudah dibangun dari source CyberVault.

## Release Package

ZIP final yang harus dipakai:

- `release/cybervault-cyberpanel-deploy.zip`

Isi utama package:

- `index.php`
- `.htaccess`
- `dist/`
- `backend/`
- `README_DEPLOY_CYBERPANEL.md`
- `database/cybervault_schema_for_cyberpanel.sql`

## Build Config

CyberPanel package dibangun dengan env:

- `VITE_ROUTER_BASENAME=/dist`
- `VITE_API_BASE_URL=/backend/index.php`
- `VITE_AUTH_MODE=backend`

Catatan:

- Untuk root domain, config di atas aman.
- Untuk subfolder hosting, `VITE_ROUTER_BASENAME` harus disesuaikan lalu package perlu dibangun ulang.

## Database Notes

- Database lokal default saat development: `cybervault_db`
- Nama database hosting boleh berbeda
- Jangan mengimpor data session, token, atau dump user production ke package deploy
- Review `backend/application/config/config.php` bila `base_url` perlu disesuaikan untuk domain hosting

## Post-Deploy Smoke Test

Test URL berikut:

- `/backend/index.php/health`
- `/backend/index.php/api/ping`
- `/backend/index.php/api/auth/status`
- `/backend/index.php/api/incidents/status`
- `/dist/login`
- `/dist/dashboard`
- `/dist/pelaporan-insiden`

## Security Notes

- `.env.local` dan `.env.development.local` tidak masuk ZIP
- `node_modules`, `.git`, `framework-sources`, `src`, dan `release` nested tidak masuk ZIP
- Token raw, bearer token, dan session dump tidak boleh ikut paket deploy
