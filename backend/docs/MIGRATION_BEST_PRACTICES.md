# Database Migration Best Practices

## Overview

When making changes to the database schema, **always create new migration files** instead of modifying existing ones or dropping/recreating entire databases. This allows for incremental updates without losing data.

## Migration Strategy

### ✅ DO: Create New Migrations for Schema Changes

**Example: Removing columns**

Instead of:
- ❌ Modifying `001_complete_schema.sql`
- ❌ Dropping all tables and recreating

Do this:
- ✅ Create `004_remove_price_currency.sql` with ALTER TABLE statements

```sql
-- Migration: Remove price and currency columns
ALTER TABLE courses DROP COLUMN IF EXISTS price;
ALTER TABLE courses DROP COLUMN IF EXISTS currency;
```

### ✅ DO: Create New Migrations for Adding Columns

**Example: Adding a new field**

```sql
-- Migration: Add priority field to courses
ALTER TABLE courses 
ADD COLUMN priority INT DEFAULT 0 AFTER is_featured;
```

### ✅ DO: Create New Migrations for Modifying Columns

**Example: Changing column type or constraints**

```sql
-- Migration: Change duration from INT to BIGINT
ALTER TABLE courses 
MODIFY COLUMN duration_minutes BIGINT DEFAULT 0;
```

### ✅ DO: Create New Migrations for Adding Tables

**Example: Adding a new table**

```sql
-- Migration: Add course_reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  course_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  rating INT NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Migration File Naming

Use sequential numbers with descriptive names:

- `001_complete_schema.sql` - Initial schema
- `002_add_feature_x.sql` - Add new feature
- `003_sample_data.sql` - Sample data (can be re-run)
- `004_remove_price_currency.sql` - Remove columns
- `005_add_course_reviews.sql` - Add new table

## Migration Execution

Migrations are executed in order by the migration runner. The `migrations` table tracks which migrations have been executed.

### Run All Pending Migrations

```bash
# Run all pending migrations
npm run migrate

# Or directly:
node migrations/migrate.js
```

### Run a Specific Migration by Name

You can run a specific migration by providing its name:

```bash
# By full filename
npm run migrate 005_add_content_sources.sql

# By number
npm run migrate 005

# By partial name match
npm run migrate add_content_sources
npm run migrate content_sources
```

### Check Migration Status

```bash
npm run migrate:status

# Or directly:
node migrations/status.js
```

## Guidelines

### ✅ DO:
1. **Create new migration files** for schema changes
2. **Use ALTER TABLE** for modifying existing tables
3. **Use IF EXISTS/IF NOT EXISTS** to make migrations idempotent
4. **Test migrations** on a copy of production data first
5. **Document the reason** for each migration in comments

### ❌ DON'T:
1. **Don't modify existing migration files** (creates inconsistency)
2. **Don't drop all tables** for small changes
3. **Don't skip migration tracking** - always update `migrations` table
4. **Don't write destructive migrations** without backups

## Examples

### Example 1: Removing Columns

```sql
-- 004_remove_price_currency.sql
-- Note: MySQL doesn't support IF EXISTS for DROP COLUMN
-- These will fail if columns don't exist - handle errors appropriately
ALTER TABLE courses DROP COLUMN price;
ALTER TABLE courses DROP COLUMN currency;
```

**Alternative:** Check column existence first using information_schema, or handle the error gracefully in your migration runner.

### Example 2: Adding Columns

```sql
-- 005_add_priority_to_courses.sql
ALTER TABLE courses 
ADD COLUMN priority INT DEFAULT 0 AFTER is_featured;

CREATE INDEX idx_priority ON courses(priority);
```

### Example 3: Modifying Columns

```sql
-- 006_increase_title_length.sql
ALTER TABLE courses 
MODIFY COLUMN title VARCHAR(500) NOT NULL;
```

### Example 4: Adding Indexes

```sql
-- 007_add_performance_indexes.sql
CREATE INDEX idx_difficulty ON courses(difficulty_level);
CREATE INDEX idx_duration ON courses(duration_minutes);
```

## Rollback Strategy

For complex migrations, consider creating rollback scripts:

```sql
-- 004_remove_price_currency_rollback.sql
ALTER TABLE courses 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN currency VARCHAR(3) DEFAULT 'KES';
```

## Summary

- ✅ **Always create new migration files** for schema changes
- ✅ **Use ALTER TABLE** statements instead of recreating tables
- ✅ **Test migrations** before running on production
- ✅ **Document changes** in migration file comments
- ✅ **Track migrations** using the migrations table

This approach ensures:
- No data loss
- Incremental updates
- Easy rollback if needed
- Clear history of changes

