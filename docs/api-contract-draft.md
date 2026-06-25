# API Contract Draft

## Response Standard

### Success

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "string",
  "errors": {}
}
```

## Auth

Frontend source:

- `src/services/auth/authService.js`

Endpoints:

- `GET /api/auth/status`
- `GET /api/auth/contract`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`

Important payload/data shape:

- register/login:
  - `email`
  - `password`
  - `name`
  - `username`
  - `password_confirmation`
- me/profile:
  - `id`
  - `name`
  - `username`
  - `email`
  - `role`
  - `bio`
  - `phone`
  - `institution`
- sessions:
  - `id`
  - `user_agent`
  - `ip_address`
  - `expires_at`
  - `revoked_at`
  - `created_at`
  - `is_current`

Priority:

- highest

Security:

- password hash wajib
- session/JWT strategy wajib jelas
- never return password hash
- never return session_token_hash

Current phase note:

- backend auth lokal sudah memakai MySQL + tabel `users`, `user_profiles`, dan `user_sessions`
- session memakai bearer token sederhana, database hanya menyimpan hash token
- frontend auth sekarang mendukung mode `backend` dan `demo` lewat env `VITE_AUTH_MODE`

## Incidents

Frontend source:

- `src/services/incidents/incidentService.js`

Endpoints:

- `GET /api/incidents/status`
- `GET /api/incidents/contract`
- `POST /api/incidents/report`
- `GET /api/incidents/my`
- `GET /api/incidents/detail/{report_code}`

Important payload/data shape:

- incident report:
  - `incident_type`
  - `title`
  - `description`
  - `platform`
  - `city`
  - `suspicious_url`
  - `evidence_summary`
  - `incident_date`
  - `severity`
  - `contact_preference`
- response:
  - `report_code`
  - `status`

Priority:

- highest

Security:

- create report wajib auth
- ownership check wajib
- rate limit submit wajib
- upload evidence belum aktif di phase fondasi
- jangan terima field sensitif seperti password, OTP, token, private key

## Dashboard

Frontend source:

- `src/data/dashboard/dashboardData.js`

Endpoints:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/activity`
- `GET /api/dashboard/identity-vault`

Important payload/data shape:

- summary cards
- recent activity list
- alert stream
- learning progress
- identity vault rows

Priority:

- high

Security:

- semua data harus scoping per user

## Learning

Frontend source:

- `src/services/education/educationService.js`

Endpoints:

- `GET /api/learning/modules`
- `GET /api/learning/modules/{id}`
- `GET /api/learning/categories`
- `GET /api/learning/levels`
- `POST /api/learning/modules/{id}/start`
- `PUT /api/learning/modules/{id}/progress`

Important payload/data shape:

- module:
  - `id`
  - `title`
  - `description`
  - `category`
  - `level`
  - `duration`
  - `lessons`
  - `progress`
  - `status`

Priority:

- high

Security:

- progress update must be owned by current user

## Alerts

Frontend source:

- `src/services/alerts/alertService.js`

Endpoints:

- `GET /api/alerts`
- `GET /api/alerts/{id}`
- `GET /api/alerts/meta`
- `PUT /api/alerts/{id}/read`
- `PUT /api/alerts/{id}/save`

Important payload/data shape:

- alert:
  - `id`
  - `title`
  - `category`
  - `severity`
  - `status`
  - `description`
  - `published_at`

Priority:

- high

Security:

- read/save state per user

## Assessments

Frontend source:

- `src/services/assessments/assessmentService.js`

Endpoints:

- `GET /api/assessments/types`
- `GET /api/assessments/{typeId}/questions`
- `POST /api/assessments/submit`
- `GET /api/assessments/history`

Important payload/data shape:

- type:
  - `id`
  - `title`
- question:
  - `id`
  - `assessmentTypeId`
  - `question`
  - `category`
  - `options[]`
- submit:
  - `type_id`
  - `answers`

Priority:

- high

Security:

- result calculation should be validated server-side

## Certificates

Frontend source:

- `src/services/certificates/certificateService.js`

Endpoints:

- `GET /api/certificates`
- `GET /api/certificates/{id}`
- `GET /api/certificates/summary`
- `GET /api/certificates/history`
- `POST /api/certificates/{id}/generate`
- `GET /api/certificates/{id}/download`
- `POST /api/certificates/verify`

Important payload/data shape:

- certificate:
  - `id`
  - `title`
  - `status`
  - `certificateCode`
  - `relatedAssessment`
  - `userScore`
  - `eligibleScore`
  - `issuedAt`
  - `validUntil`

Priority:

- high

Security:

- download authorization wajib
- verify endpoint should sanitize input

## Forum

Frontend source:

- `src/services/forum/forumService.js`

Endpoints:

- `GET /api/forum/threads`
- `GET /api/forum/categories`
- `POST /api/forum/threads`
- `GET /api/forum/threads/{id}`
- `POST /api/forum/threads/{id}/comments`
- `PUT /api/forum/threads/{id}/like`
- `PUT /api/forum/threads/{id}/save`
- `POST /api/forum/threads/{id}/report`
- `PUT /api/forum/threads/{id}/close`

Important payload/data shape:

- thread:
  - `id`
  - `title`
  - `content`
  - `summary`
  - `category`
  - `tags[]`
  - `status`
  - `likes`
  - `saved`
  - `reported`
- comment:
  - `id`
  - `thread_id`
  - `content`
  - `author`

Priority:

- medium-high

Security:

- sanitization and moderation wajib

## Notifications

Frontend source:

- `src/services/notifications/notificationService.js`

Endpoints:

- `GET /api/notifications`
- `GET /api/notifications/meta`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/{id}/unread`
- `PUT /api/notifications/read-all`
- `PUT /api/notifications/{id}/archive`
- `DELETE /api/notifications/{id}`

Important payload/data shape:

- notification:
  - `id`
  - `type`
  - `priority`
  - `status`
  - `title`
  - `message`
  - `source`
  - `createdAt`

Priority:

- medium-high

Security:

- ownership scope wajib

## Account

Frontend source:

- `src/services/account/accountService.js`

Endpoints:

- `GET /api/account/profile`
- `PUT /api/account/profile`
- `GET /api/account/security`
- `GET /api/account/sessions`
- `DELETE /api/account/sessions/{id}`
- `GET /api/account/activity`

Important payload/data shape:

- profile:
  - `fullName`
  - `username`
  - `email`
  - `bio`
- sessions:
  - `id`
  - `device`
  - `location`
  - `isCurrent`

Priority:

- medium

Security:

- revoke session harus invalidate session sungguhan

## Settings

Frontend source:

- `src/services/settings/settingsService.js`

Endpoints:

- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/settings/reset`
- `GET /api/settings/export`

Important payload/data shape:

- sections
- account preferences
- security settings
- notification settings
- privacy settings
- appearance settings

Priority:

- medium

Security:

- enum validation wajib

## Help

Frontend source:

- `src/services/help/helpService.js`

Endpoints:

- `GET /api/help/categories`
- `GET /api/help/faqs`
- `GET /api/help/troubleshooting`
- `GET /api/help/topics`
- `POST /api/help/tickets`

Important payload/data shape:

- support ticket:
  - `subject`
  - `category`
  - `message`
  - `email`

Priority:

- medium

Security:

- anti-spam and sanitization wajib

## Timeline

Frontend source:

- `src/services/timeline/timelineService.js`

Endpoints:

- `GET /api/timeline`
- `GET /api/timeline/{id}`
- `GET /api/timeline/meta`
- `PUT /api/timeline/{id}/reviewed`

Important payload/data shape:

- timeline item:
  - `id`
  - `type`
  - `status`
  - `title`
  - `description`
  - `source`
  - `relatedRoute`
  - `actionLabel`
  - `priority`
  - `reviewed`
  - `createdAt`
  - `metadata`

Priority:

- medium

Security:

- events should be scoped per user
