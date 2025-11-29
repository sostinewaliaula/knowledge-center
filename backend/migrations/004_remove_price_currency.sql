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

-- Remove price column
-- Note: Will fail if column doesn't exist - check first or handle error
ALTER TABLE courses DROP COLUMN price;

-- Remove currency column  
-- Note: Will fail if column doesn't exist - check first or handle error
ALTER TABLE courses DROP COLUMN currency;
