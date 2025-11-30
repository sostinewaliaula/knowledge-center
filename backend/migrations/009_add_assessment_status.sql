-- Migration: Add status field to assessments table
-- This allows assessments to have draft, published, and archived states

ALTER TABLE assessments
ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' AFTER show_results;

-- Update existing assessments to have status = 'published' if they were created before this migration
-- (Optional - only if you want to set a default for existing records)
-- UPDATE assessments SET status = 'published' WHERE status IS NULL;

