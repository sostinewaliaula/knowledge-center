-- Migration: Add more content source types
-- Adds support for Vimeo, Dailymotion, Microsoft Office Online, and better Google Docs/Sheets support

-- Modify the ENUM to include new source types
ALTER TABLE content_library 
MODIFY COLUMN source_type ENUM(
  'local', 
  'url', 
  'youtube', 
  'vimeo',
  'dailymotion',
  'googledrive', 
  'microsoft',
  'onedrive', 
  'dropbox', 
  'other'
) DEFAULT 'local';

