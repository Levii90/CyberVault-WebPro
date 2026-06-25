# Database Schema Draft

## Notes

- schema ini masih draft
- belum ada database fisik
- belum ada migration fisik
- penamaan bisa disesuaikan saat CI3 backend nyata sudah tersedia
- draft SQL auth yang lebih spesifik tersedia di `backend/database/schema/users_schema_draft.sql`
- schema auth final phase 19B tersedia di `backend/database/schema/auth_schema_v1.sql`

## `users`

Fungsi:

- menyimpan akun utama user

Kolom utama:

- `id` bigint unsigned
- `email` varchar(190)
- `password_hash` varchar(255)
- `status` enum(`active`,`inactive`,`blocked`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Index penting:

- unique index `email`
- index `status`

Security note:

- jangan pernah return `password_hash` ke frontend

## `user_sessions`

Fungsi:

- menyimpan session/login device user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `session_token_hash` varchar(255)
- `device_name` varchar(120)
- `ip_address` varchar(45)
- `user_agent` text
- `last_activity_at` datetime
- `created_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- index `user_id`
- index `last_activity_at`

Security note:

- simpan token dalam bentuk hash jika session token disimpan manual

## `user_profiles`

Fungsi:

- menyimpan detail profil tambahan user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `full_name` varchar(150)
- `username` varchar(80)
- `bio` text
- `role_label` varchar(80)
- `avatar_path` varchar(255) nullable
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- unique index `user_id`
- unique index `username`

Security note:

- semua output profile harus escaped saat dirender

## `incident_reports`

Fungsi:

- menyimpan laporan insiden digital

Kolom utama:

- `id` bigint unsigned
- `report_code` varchar(40)
- `user_id` bigint unsigned
- `incident_type` varchar(80)
- `title` varchar(150)
- `description` text
- `platform` varchar(120) nullable
- `suspicious_url` varchar(500) nullable
- `evidence_summary` text nullable
- `incident_date` datetime nullable
- `severity` enum(`low`,`medium`,`high`,`critical`)
- `status` enum(`submitted`,`in_review`,`need_more_info`,`resolved`,`rejected`)
- `contact_preference` enum(`email`,`in_app`,`none`)
- `created_at` datetime
- `updated_at` datetime nullable
- `deleted_at` datetime nullable

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- unique index `report_code`
- index `user_id`
- index `incident_type`
- index `severity`
- index `status`
- index `created_at`
- index `deleted_at`

Security note:

- ownership check wajib
- jangan simpan password, OTP, token, atau private key di laporan

Catatan phase:

- phase fondasi backend hanya menyiapkan draft SQL
- tabel evidence file belum dibuat di phase ini

## `incident_report_status_logs`

Fungsi:

- menyimpan histori perubahan status laporan insiden

Kolom utama:

- `id` bigint unsigned
- `incident_report_id` bigint unsigned
- `actor_user_id` bigint unsigned nullable
- `old_status` varchar(50) nullable
- `new_status` varchar(50)
- `note` text nullable
- `created_at` datetime

Primary key:

- `id`

Foreign key:

- `incident_report_id` -> `incident_reports.id`
- `actor_user_id` -> `users.id`

Index penting:

- index `incident_report_id`
- index `actor_user_id`
- index `created_at`

## `learning_modules`

Fungsi:

- master data modul belajar

Kolom utama:

- `id` bigint unsigned
- `title` varchar(180)
- `slug` varchar(180)
- `category` varchar(80)
- `level` varchar(50)
- `description` text
- `duration_minutes` int unsigned
- `lessons_count` int unsigned
- `status` enum(`published`,`draft`,`archived`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Index penting:

- unique index `slug`
- index `category`
- index `level`

Security note:

- content publish flow bisa dipisah untuk admin nanti

## `learning_progress`

Fungsi:

- progress modul per user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `module_id` bigint unsigned
- `progress_percent` tinyint unsigned
- `status` enum(`not_started`,`in_progress`,`completed`)
- `started_at` datetime nullable
- `completed_at` datetime nullable
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`
- `module_id` -> `learning_modules.id`

Index penting:

- unique composite `user_id,module_id`

Security note:

- user hanya boleh update progress miliknya

## `cyber_alerts`

Fungsi:

- master data alert/peringatan siber

Kolom utama:

- `id` bigint unsigned
- `title` varchar(180)
- `category` varchar(80)
- `severity` enum(`low`,`medium`,`high`,`critical`)
- `status` enum(`active`,`resolved`,`archived`)
- `summary` text
- `content` longtext nullable
- `published_at` datetime
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Index penting:

- index `category`
- index `severity`
- index `status`
- index `published_at`

Security note:

- jika konten dari feed eksternal, sanitasi sumber wajib

## `alert_user_states`

Fungsi:

- menyimpan status read/save per user untuk alert

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `alert_id` bigint unsigned
- `is_read` tinyint(1)
- `is_saved` tinyint(1)
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`
- `alert_id` -> `cyber_alerts.id`

Index penting:

- unique composite `user_id,alert_id`

Security note:

- state harus per user

## `assessment_types`

Fungsi:

- master jenis asesmen

Kolom utama:

- `id` bigint unsigned
- `name` varchar(150)
- `slug` varchar(150)
- `description` text
- `status` enum(`active`,`inactive`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Index penting:

- unique index `slug`

Security note:

- soal aktif/nonaktif harus terkontrol

## `assessment_questions`

Fungsi:

- menyimpan pertanyaan asesmen

Kolom utama:

- `id` bigint unsigned
- `assessment_type_id` bigint unsigned
- `category` varchar(100)
- `question_text` text
- `options_json` longtext
- `recommendation_if_low` text
- `sort_order` int unsigned
- `status` enum(`active`,`inactive`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `assessment_type_id` -> `assessment_types.id`

Index penting:

- index `assessment_type_id`
- index `sort_order`

Security note:

- opsi jawaban harus divalidasi server-side

## `assessment_results`

Fungsi:

- menyimpan hasil asesmen user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `assessment_type_id` bigint unsigned
- `answers_json` longtext
- `score_percent` tinyint unsigned
- `risk_level` varchar(60)
- `strong_areas_json` longtext nullable
- `improvement_areas_json` longtext nullable
- `recommendations_json` longtext nullable
- `created_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`
- `assessment_type_id` -> `assessment_types.id`

Index penting:

- index `user_id`
- index `assessment_type_id`
- index `created_at`

Security note:

- jangan percaya hasil hitung penuh dari client

## `certificates`

Fungsi:

- menyimpan sertifikat user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `assessment_result_id` bigint unsigned nullable
- `title` varchar(180)
- `certificate_code` varchar(80)
- `status` enum(`eligible`,`issued`,`expired`,`revoked`,`not_eligible`)
- `user_score` tinyint unsigned
- `eligible_score` tinyint unsigned
- `issued_at` datetime nullable
- `valid_until` datetime nullable
- `file_path` varchar(255) nullable
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`
- `assessment_result_id` -> `assessment_results.id`

Index penting:

- unique index `certificate_code`
- index `user_id`
- index `status`

Security note:

- download authorization wajib

## `forum_threads`

Fungsi:

- menyimpan diskusi forum

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `category` varchar(80)
- `title` varchar(180)
- `content` longtext
- `summary` text nullable
- `tags_json` longtext nullable
- `status` enum(`open`,`closed`,`reported`,`archived`)
- `likes_count` int unsigned
- `views_count` int unsigned
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- index `user_id`
- index `category`
- index `status`
- fulltext candidate `title,content`

Security note:

- sanitization dan moderation wajib

## `forum_comments`

Fungsi:

- menyimpan komentar thread forum

Kolom utama:

- `id` bigint unsigned
- `thread_id` bigint unsigned
- `user_id` bigint unsigned
- `content` longtext
- `status` enum(`visible`,`hidden`,`reported`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `thread_id` -> `forum_threads.id`
- `user_id` -> `users.id`

Index penting:

- index `thread_id`
- index `user_id`

Security note:

- escaping output wajib

## `forum_reports`

Fungsi:

- menyimpan laporan abuse/moderation forum

Kolom utama:

- `id` bigint unsigned
- `thread_id` bigint unsigned
- `reported_by_user_id` bigint unsigned
- `reason` text
- `status` enum(`open`,`reviewed`,`dismissed`,`actioned`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `thread_id` -> `forum_threads.id`
- `reported_by_user_id` -> `users.id`

Index penting:

- index `thread_id`
- index `status`

Security note:

- abuse rate limit wajib

## `notifications`

Fungsi:

- menyimpan notifikasi user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `type` varchar(60)
- `priority` enum(`low`,`medium`,`high`)
- `status` enum(`unread`,`read`,`archived`)
- `title` varchar(180)
- `message` text
- `source_module` varchar(80)
- `related_entity_type` varchar(80) nullable
- `related_entity_id` bigint unsigned nullable
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- index `user_id`
- index `status`
- index `priority`
- index `created_at`

Security note:

- semua query harus scoped ke current user

## `user_settings`

Fungsi:

- menyimpan preferensi dan pengaturan user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `section` varchar(80)
- `setting_key` varchar(120)
- `setting_value` text
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- unique composite `user_id,section,setting_key`

Security note:

- enum/allowed key validation wajib

## `support_tickets`

Fungsi:

- menyimpan tiket bantuan user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned nullable
- `ticket_code` varchar(80)
- `category` varchar(80)
- `subject` varchar(180)
- `message` longtext
- `contact_email` varchar(190)
- `status` enum(`open`,`in_progress`,`resolved`,`closed`)
- `created_at` datetime
- `updated_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- unique index `ticket_code`
- index `status`
- index `created_at`

Security note:

- anti-spam dan sanitization wajib

## `timeline_events`

Fungsi:

- agregasi aktivitas lintas modul per user

Kolom utama:

- `id` bigint unsigned
- `user_id` bigint unsigned
- `type` varchar(60)
- `status` varchar(60)
- `priority` varchar(30)
- `title` varchar(180)
- `description` text
- `source_module` varchar(80)
- `related_route` varchar(180) nullable
- `action_label` varchar(120) nullable
- `reviewed` tinyint(1)
- `metadata_json` longtext nullable
- `event_at` datetime
- `created_at` datetime

Primary key:

- `id`

Foreign key:

- `user_id` -> `users.id`

Index penting:

- index `user_id`
- index `type`
- index `status`
- index `event_at`

Security note:

- event visibility harus scoped ke user pemilik
