-- Migration: Add quiz-like settings to assignments for quiz-type assignments

ALTER TABLE assignments
ADD COLUMN passing_score DECIMAL(5,2) NULL AFTER max_score,
ADD COLUMN time_limit_minutes INT NULL AFTER passing_score,
ADD COLUMN max_attempts INT NULL AFTER time_limit_minutes,
ADD COLUMN is_required TINYINT(1) DEFAULT 1 AFTER max_attempts,
ADD COLUMN randomize_questions TINYINT(1) DEFAULT 0 AFTER is_required,
ADD COLUMN show_results TINYINT(1) DEFAULT 1 AFTER randomize_questions;


