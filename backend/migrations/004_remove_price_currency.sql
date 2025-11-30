-- Migration: Remove price and currency columns from courses table
-- Reason: Internal LMS - no monetary transactions involved
-- Date: Created for future use as an example migration pattern
-- 
-- NOTE: This migration is for reference/documentation purposes.
-- The price and currency columns were already removed from the initial schema.
-- 
-- To use this pattern for removing columns in the future:
-- 1. Create a new migration file (e.g., 005_remove_field_name.sql)
-- 2. Use ALTER TABLE to drop columns
-- 3. Handle errors if columns don't exist (MySQL doesn't support IF EXISTS for DROP COLUMN)
--
-- Example for future migrations removing columns:
-- ALTER TABLE table_name DROP COLUMN column_name;

-- Remove price column (only if it exists)
-- This migration is for reference/documentation - columns were already removed in initial schema
DROP PROCEDURE IF EXISTS DropColumnIfExists;

DELIMITER //
CREATE PROCEDURE DropColumnIfExists(
    IN tableName VARCHAR(255),
    IN columnName VARCHAR(255)
)
BEGIN
    IF EXISTS(
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND COLUMN_NAME = columnName
    ) THEN
        SET @drop_sql = CONCAT('ALTER TABLE ', tableName, ' DROP COLUMN ', columnName);
        PREPARE stmt FROM @drop_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

CALL DropColumnIfExists('courses', 'price');
CALL DropColumnIfExists('courses', 'currency');

DROP PROCEDURE IF EXISTS DropColumnIfExists;
