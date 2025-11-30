-- Migration: Create assignments and assignment_submissions tables
-- This allows creating assignments that learners can submit files or text for grading

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  course_id CHAR(36),
  lesson_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('file-upload', 'text', 'quiz') DEFAULT 'file-upload',
  instructions TEXT,
  max_file_size_mb INT DEFAULT 10,
  allowed_file_types VARCHAR(255) DEFAULT 'pdf,doc,docx,txt',
  due_date DATETIME,
  max_score DECIMAL(5,2) DEFAULT 100.00,
  status ENUM('draft', 'active', 'closed') DEFAULT 'draft',
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course (course_id),
  INDEX idx_lesson (lesson_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_created_by (created_by),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  assignment_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  enrollment_id CHAR(36),
  submission_text TEXT,
  submission_file_url VARCHAR(500),
  submission_file_name VARCHAR(255),
  submission_file_size INT,
  score DECIMAL(5,2) NULL,
  feedback TEXT,
  graded_by CHAR(36),
  graded_at TIMESTAMP NULL,
  status ENUM('submitted', 'graded', 'returned') DEFAULT 'submitted',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assignment (assignment_id),
  INDEX idx_user (user_id),
  INDEX idx_enrollment (enrollment_id),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_assignment (assignment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

