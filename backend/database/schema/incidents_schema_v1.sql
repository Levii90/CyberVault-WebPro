USE `cybervault_db`;

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
