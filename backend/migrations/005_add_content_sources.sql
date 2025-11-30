-- Migration: Add support for multiple content sources
-- This allows content to be uploaded from local files, URLs, YouTube, Google Drive, etc.

ALTER TABLE content_library 
ADD COLUMN source_type ENUM('local', 'url', 'youtube', 'vimeo', 'dailymotion', 'googledrive', 'microsoft', 'onedrive', 'dropbox', 'other') DEFAULT 'local' AFTER file_name,
ADD COLUMN source_url VARCHAR(500) NULL AFTER source_type,
ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER source_url,
ADD COLUMN embed_code TEXT NULL AFTER thumbnail_url;

-- Update existing records to have source_type = 'local'
UPDATE content_library SET source_type = 'local' WHERE source_type IS NULL;

-- Add index for source_type for faster filtering
CREATE INDEX idx_source_type ON content_library(source_type);

