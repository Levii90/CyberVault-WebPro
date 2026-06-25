# Backend CI3 HMVC Readiness Audit

> Status ini sudah tersalip oleh implementasi bootstrap nyata.
> Lihat [backend-bootstrap-verification.md](/D:/xampp/htdocs/CyberVault-v1.0/CyberVault-WebPro/docs/backend-bootstrap-verification.md) untuk status backend runnable saat ini.

## Executive Summary

Dokumen ini adalah hasil audit readiness sebelum backend dipasang. Saat ini CyberVault **sudah memiliki bootstrap backend CodeIgniter 3 + HMVC** di folder `backend/`, tetapi belum memiliki endpoint fitur bisnis.

Hasil audit utama:

- folder `backend/` tidak ditemukan
- folder `application/` tidak ditemukan
- folder `system/` tidak ditemukan
- folder `application/modules/` tidak ditemukan
- folder `application/third_party/MX/` tidak ditemukan
- `composer.json` backend tidak ditemukan
- `database.php`, `routes.php`, `autoload.php` CodeIgniter tidak ditemukan
- controller/model CodeIgniter 3 asli tidak ditemukan
- `index.php` root **bukan** bootstrap CodeIgniter 3, melainkan redirect ke `dist/`

Keputusan readiness:

- status CI3: `TIDAK ADA`
- status HMVC: `TIDAK ADA`
- status backend runnable: `BELUM SIAP`
- status readiness planning: `SIAP DIDOKUMENTASIKAN`

## Repository Audit

### Root Project

Temuan di root:

- frontend React + Vite aktif
- `package.json` tersedia untuk frontend
- `vite.config.js` tersedia
- `vercel.json` tersedia
- `.env.example` tersedia
- `index.php` root hanya redirect static build
- `.htaccess` root hanya helper `DirectoryIndex`

### CodeIgniter Audit

Checklist:

- `backend/`: tidak ada
- `application/`: tidak ada
- `system/`: tidak ada
- `application/modules/`: tidak ada
- `application/third_party/MX/`: tidak ada
- `application/config/database.php`: tidak ada
- `application/config/routes.php`: tidak ada
- `application/config/autoload.php`: tidak ada
- CI3 controller asli: tidak ada
- CI3 model asli: tidak ada
- HMVC `MX_Controller` / `MX_Model`: tidak ada

### Root PHP Files

- `index.php`
  - fungsi: redirect ke `./dist/?v=...`
  - status: **bukan** bootstrap CodeIgniter
- `.htaccess`
  - fungsi: `DirectoryIndex index.php index.html`
  - status: helper static hosting, bukan routing CodeIgniter

## Backend Existence Decision

Klasifikasi yang berlaku:

### A. CI3 tidak ada

Karena CodeIgniter 3 tidak ada di repo ini:

- tidak boleh membuat `system/` palsu
- tidak boleh membuat `application/` palsu seolah runnable
- tidak boleh membuat controller/model CI3 yang diklaim bisa jalan
- tidak boleh membuat `backend/` setengah jadi yang menipu status implementasi

Keputusan phase:

- phase ini hanya menghasilkan dokumentasi readiness
- implementasi backend ditunda sampai source CodeIgniter 3 resmi dan extension HMVC benar-benar ditambahkan

## Proposed Backend Structure

Struktur target setelah CI3 asli dan HMVC nyata ditambahkan:

```text
backend/
├── index.php
├── application/
│   ├── config/
│   │   ├── config.php
│   │   ├── database.php
│   │   ├── routes.php
│   │   └── autoload.php
│   ├── core/
│   ├── helpers/
│   ├── libraries/
│   ├── third_party/
│   │   └── MX/
│   └── modules/
│       ├── auth/
│       │   ├── controllers/
│       │   │   └── Auth.php
│       │   ├── models/
│       │   │   └── Auth_model.php
│       │   └── services/
│       │       └── Auth_service.php
│       ├── incidents/
│       ├── dashboard/
│       ├── learning/
│       ├── alerts/
│       ├── assessments/
│       ├── certificates/
│       ├── forum/
│       ├── notifications/
│       ├── account/
│       ├── settings/
│       ├── help/
│       └── timeline/
└── system/
```

## Architectural Rules

- backend harus berada di luar `src/`
- controller hanya handle request, response, dan validasi awal
- service/module library handle business logic
- model handle query database
- response API harus konsisten
- validasi backend wajib walaupun frontend sudah memvalidasi

## Frontend Service Readiness Mapping

### Auth

- frontend file: `src/services/auth/authService.js`
- status: mock, API-ready
- kebutuhan backend:
  - register
  - login
  - logout
  - me/profile
- auth guard: ya
- upload: tidak

### Incidents

- frontend file: `src/services/incidents/incidentService.js`
- status: mock, API-ready
- kebutuhan backend:
  - create incident
  - list incident
  - detail incident
  - update incident
  - upload evidence
- auth guard: ya
- upload: ya

### Learning

- frontend file: `src/services/education/educationService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list modules
  - list category
  - list level
  - start module
  - update progress
- auth guard: ya
- upload: tidak

### Alerts

- frontend file: `src/services/alerts/alertService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list alerts
  - categories/severity/status filters
  - read/save user state
- auth guard: ya untuk state user
- upload: tidak

### Assessments

- frontend file: `src/services/assessments/assessmentService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list assessment types
  - get questions
  - submit result
  - history
- auth guard: ya
- upload: tidak

### Certificates

- frontend file: `src/services/certificates/certificateService.js`
- status: mock, API-ready
- kebutuhan backend:
  - summary
  - history
  - certificates list/detail
  - generate
  - download
  - verify
- auth guard: ya, kecuali verify code bisa public terbatas
- upload: tidak

### Forum

- frontend file: `src/services/forum/forumService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list threads
  - categories
  - create thread
  - add comment
  - like/save/report/close
- auth guard: ya untuk write action
- upload: belum

### Notifications

- frontend file: `src/services/notifications/notificationService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list notifications
  - filter options
  - read/unread/archive/delete
  - read all
- auth guard: ya
- upload: tidak

### Account

- frontend file: `src/services/account/accountService.js`
- status: mock, API-ready
- kebutuhan backend:
  - profile
  - security summary
  - sessions
  - revoke session
  - activity log
- auth guard: ya
- upload: belum

### Settings

- frontend file: `src/services/settings/settingsService.js`
- status: mock, API-ready
- kebutuhan backend:
  - sections
  - get settings
  - update setting
  - reset
  - export
- auth guard: ya
- upload: tidak

### Help

- frontend file: `src/services/help/helpService.js`
- status: mock, API-ready
- kebutuhan backend:
  - categories
  - faq
  - troubleshooting
  - support topics
  - submit ticket
- auth guard: opsional untuk FAQ, ya untuk ticket milik user
- upload: belum

### Timeline

- frontend file: `src/services/timeline/timelineService.js`
- status: mock, API-ready
- kebutuhan backend:
  - list activity
  - detail activity
  - filter metadata
  - mark reviewed
- auth guard: ya
- upload: tidak

## Module Priority

Urutan implementasi backend yang direkomendasikan:

1. `auth`
2. `incidents`
3. `dashboard`
4. `learning`
5. `alerts`
6. `assessments`
7. `certificates`
8. `notifications`
9. `account`
10. `settings`
11. `forum`
12. `help`
13. `timeline`

Alasan:

- `auth` dibutuhkan untuk identitas, session, dan proteksi endpoint
- `incidents` adalah core flow pertama yang butuh persistence, validasi, dan upload evidence
- `dashboard` butuh agregasi dari module lain
- `learning`, `alerts`, `assessments`, dan `certificates` saling terkait dengan data progres dan evaluasi
- `forum` dan `help` lebih sensitif karena input user dan moderasi
- `timeline` paling sehat jika dibangun setelah event source dari module lain tersedia

## Next Implementation Guidance

Karena CI3 dan HMVC belum ada:

- tambahkan source CodeIgniter 3 resmi ke folder `backend/`
- tambahkan extension HMVC yang benar ke `application/third_party/MX/`
- verifikasi bootstrap CI3 dan module loading
- baru setelah itu implementasi health check dan response helper

## Decision Summary

- backend code dibuat pada phase ini: `tidak ada`
- folder backend palsu dibuat: `tidak ada`
- database fisik dibuat: `tidak ada`
- frontend disentuh besar-besaran: `tidak ada`
