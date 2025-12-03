-- Migration: Create assignment_questions table for quiz-type assignments

CREATE TABLE IF NOT EXISTS assignment_questions (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  assignment_id CHAR(36) NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'long_answer') DEFAULT 'multiple_choice',
  options JSON NULL,
  correct_answer VARCHAR(1000),
  points DECIMAL(5,2) DEFAULT 1.00,
  order_index INT DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assignment (assignment_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


