-- Update Live Sessions Table
-- Adds category column and ensures platform enum is correct

-- Add category column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "live_sessions";
SET @columnname = "category";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE live_sessions ADD COLUMN category VARCHAR(100) AFTER description"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Modify platform enum to ensure it supports all required values
ALTER TABLE live_sessions MODIFY COLUMN platform ENUM('zoom', 'teams', 'google_meet', 'custom') DEFAULT 'zoom';
