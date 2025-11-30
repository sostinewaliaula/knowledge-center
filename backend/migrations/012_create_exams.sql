-- Migration: Create exams table and related tables
-- This creates a separate exams system independent from assessments

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  course_id CHAR(36),
  lesson_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score DECIMAL(5,2) DEFAULT 70.00,
  time_limit_minutes INT NULL,
  max_attempts INT DEFAULT 1,
  is_required BOOLEAN DEFAULT TRUE,
  randomize_questions BOOLEAN DEFAULT FALSE,
  show_results BOOLEAN DEFAULT TRUE,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course (course_id),
  INDEX idx_lesson (lesson_id),
  INDEX idx_status (status),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Questions
CREATE TABLE IF NOT EXISTS exam_questions (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  exam_id CHAR(36) NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') DEFAULT 'multiple_choice',
  options JSON,
  correct_answer TEXT,
  points DECIMAL(5,2) DEFAULT 1.00,
  order_index INT DEFAULT 0,
  explanation TEXT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_exam (exam_id),
  INDEX idx_order (exam_id, order_index),
  INDEX idx_status (status),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Attempts
CREATE TABLE IF NOT EXISTS exam_attempts (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  enrollment_id CHAR(36) NOT NULL,
  exam_id CHAR(36) NOT NULL,
  score DECIMAL(5,2) DEFAULT 0.00,
  percentage DECIMAL(5,2) DEFAULT 0.00,
  passed BOOLEAN DEFAULT FALSE,
  time_taken_minutes INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  INDEX idx_enrollment (enrollment_id),
  INDEX idx_exam (exam_id),
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Answers
CREATE TABLE IF NOT EXISTS exam_answers (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  attempt_id CHAR(36) NOT NULL,
  question_id CHAR(36) NOT NULL,
  answer_text TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attempt (attempt_id),
  INDEX idx_question (question_id),
  FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Question History
CREATE TABLE IF NOT EXISTS exam_question_history (
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
  FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

