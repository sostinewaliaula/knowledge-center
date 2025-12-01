-- Migration: Add 'assessment' content type to lessons
-- This allows linking assessments as lesson content in the course builder

ALTER TABLE lessons
MODIFY COLUMN content_type ENUM('video', 'text', 'document', 'quiz', 'assignment', 'assessment', 'live_session') DEFAULT 'text';


