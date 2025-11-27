-- Migration: 002_example_new_table.sql
-- Description: Example migration - demonstrates how to add a new table
-- Created: 2024
-- NOTE: This is just an example - you can delete this file if not needed

-- Example: Create a courses table (commented out - uncomment to use)
/*
CREATE TABLE IF NOT EXISTS courses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id),
  INDEX idx_instructor (instructor_id),
  INDEX idx_title (title)
);
*/

-- This migration file is empty by default (all SQL is commented)
-- Uncomment and modify the SQL above when you need to create this table

