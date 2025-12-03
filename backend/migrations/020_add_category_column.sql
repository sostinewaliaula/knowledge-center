-- Add category column to live_sessions
-- Using simple syntax to avoid parsing issues in migrate.js

ALTER TABLE live_sessions ADD COLUMN category VARCHAR(100) AFTER description;
