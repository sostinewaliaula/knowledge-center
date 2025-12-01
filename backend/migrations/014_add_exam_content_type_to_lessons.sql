-- Migration: Add 'exam' content type to lessons
-- This allows linking exams as lesson content in the course builder

ALTER TABLE lessons
MODIFY COLUMN content_type ENUM('video', 'text', 'document', 'quiz', 'assignment', 'assessment', 'exam', 'live_session') DEFAULT 'text';


