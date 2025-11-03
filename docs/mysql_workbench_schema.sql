-- MySQL Workbench compatible CREATE script for the project's schema
-- You can import this script into MySQL Workbench via
--   File -> Import -> Reverse Engineer MySQL Create Script...
-- or run it directly against a MySQL server to create the tables.
-- Adjust the DATABASE name below if needed.

CREATE DATABASE IF NOT EXISTS `colegio_antibullying` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE `colegio_antibullying`;

-- Drop existing tables (safe to re-run while developing)
DROP TABLE IF EXISTS `core_evidence`;
DROP TABLE IF EXISTS `core_incidentreport`;
DROP TABLE IF EXISTS `core_colegio`;

-- Table: core_colegio
CREATE TABLE `core_colegio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `direccion` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: core_incidentreport
CREATE TABLE `core_incidentreport` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `colegio_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `anonimo` TINYINT(1) NOT NULL DEFAULT 1,
  `reportero_nombre` VARCHAR(255) NULL,
  `estado` VARCHAR(20) NOT NULL DEFAULT 'new',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_incidentreport_colegio` (`colegio_id`),
  CONSTRAINT `fk_incidentreport_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `core_colegio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: core_evidence
CREATE TABLE `core_evidence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reporte_id` INT NOT NULL,
  `archivo` VARCHAR(512) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_evidence_reporte` (`reporte_id`),
  CONSTRAINT `fk_evidence_reporte` FOREIGN KEY (`reporte_id`) REFERENCES `core_incidentreport` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: example data insert (uncomment to create sample rows)
-- INSERT INTO `core_colegio` (`nombre`, `direccion`) VALUES ('Colegio Ejemplo', 'Calle Falsa 123');

-- End of script
