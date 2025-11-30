-- Migration: Add status and change tracking to assessment questions
-- This allows questions to be published/drafted and tracks all changes

-- Add status and updated_at to assessment_questions
ALTER TABLE assessment_questions
ADD COLUMN status ENUM('draft', 'published') DEFAULT 'draft' AFTER explanation,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Create question history table for tracking changes
CREATE TABLE IF NOT EXISTS assessment_question_history (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  question_id CHAR(36) NOT NULL,
  changed_by CHAR(36),
  change_type ENUM('created', 'updated', 'published', 'unpublished', 'deleted') NOT NULL,
  old_data JSON,
  new_data JSON,
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_question (question_id),
  INDEX idx_changed_by (changed_by),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

