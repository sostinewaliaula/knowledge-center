-- Migration: Create templates table
-- Templates allow saving reusable structures for courses, assessments, assignments, and learning paths

CREATE TABLE IF NOT EXISTS templates (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('course', 'assessment', 'assignment', 'learning-path') NOT NULL,
  template_data JSON NOT NULL,
  thumbnail_url VARCHAR(500),
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  created_by CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_created_by (created_by),
  INDEX idx_is_public (is_public),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

