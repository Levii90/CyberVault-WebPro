-- CyberVault combined schema for CyberPanel deployment
-- Local development database default: cybervault_db
-- On CyberPanel hosting, database name can be different.
-- After creating the hosting database, update:
-- backend/application/config/database.php
-- This file contains schema only. No user data, no session data, and no token data.

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin','moderator') NOT NULL DEFAULT 'user',
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `email_verified_at` DATETIME NULL,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  UNIQUE KEY `uk_users_username` (`username`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `bio` TEXT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `phone` VARCHAR(30) NULL,
  `institution` VARCHAR(150) NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_profiles_user_id` (`user_id`),
  CONSTRAINT `fk_user_profiles_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `session_token_hash` VARCHAR(255) NOT NULL,
  `user_agent` VARCHAR(255) NULL,
  `ip_address` VARCHAR(45) NULL,
  `expires_at` DATETIME NOT NULL,
  `revoked_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_sessions_user_id` (`user_id`),
  KEY `idx_user_sessions_session_token_hash` (`session_token_hash`),
  KEY `idx_user_sessions_expires_at` (`expires_at`),
  KEY `idx_user_sessions_revoked_at` (`revoked_at`),
  CONSTRAINT `fk_user_sessions_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `incident_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_code` VARCHAR(40) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `incident_type` VARCHAR(80) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `platform` VARCHAR(120) NULL,
  `city` VARCHAR(120) NULL,
  `suspicious_url` VARCHAR(500) NULL,
  `evidence_summary` TEXT NULL,
  `incident_date` DATETIME NULL,
  `severity` ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `status` ENUM('submitted','in_review','need_more_info','resolved','rejected') NOT NULL DEFAULT 'submitted',
  `contact_preference` ENUM('email','in_app','none') NOT NULL DEFAULT 'in_app',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_incident_reports_report_code` (`report_code`),
  KEY `idx_incident_reports_user_id` (`user_id`),
  KEY `idx_incident_reports_incident_type` (`incident_type`),
  KEY `idx_incident_reports_severity` (`severity`),
  KEY `idx_incident_reports_status` (`status`),
  KEY `idx_incident_reports_city` (`city`),
  KEY `idx_incident_reports_created_at` (`created_at`),
  KEY `idx_incident_reports_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_incident_reports_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `incident_report_status_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `incident_report_id` BIGINT UNSIGNED NOT NULL,
  `actor_user_id` BIGINT UNSIGNED NULL,
  `old_status` VARCHAR(50) NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `note` TEXT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_incident_status_logs_report_id` (`incident_report_id`),
  KEY `idx_incident_status_logs_actor_user_id` (`actor_user_id`),
  KEY `idx_incident_status_logs_created_at` (`created_at`),
  CONSTRAINT `fk_incident_status_logs_report_id`
    FOREIGN KEY (`incident_report_id`) REFERENCES `incident_reports` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_incident_status_logs_actor_user_id`
    FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
