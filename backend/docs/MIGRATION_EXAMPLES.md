# Migration Examples

## Real-World Migration Patterns

### Example 1: Removing Columns (Current Use Case)

**Scenario:** Remove `price` and `currency` columns from courses table

**Wrong Approach:**
- ❌ Modify `001_complete_schema.sql`
- ❌ Drop all tables and recreate

**Correct Approach:**
```sql
-- 004_remove_price_currency.sql
ALTER TABLE courses DROP COLUMN price;
ALTER TABLE courses DROP COLUMN currency;
```

**Note:** MySQL doesn't support `DROP COLUMN IF EXISTS`. If you need to check existence first:
```sql
-- Check if column exists before dropping (requires stored procedure or application code check)
-- Or handle the error gracefully in your migration runner
```

### Example 2: Adding New Columns

```sql
-- 005_add_course_subtitle.sql
ALTER TABLE courses 
ADD COLUMN subtitle VARCHAR(255) NULL AFTER title,
ADD COLUMN prerequisites TEXT NULL AFTER description;
```

### Example 3: Modifying Column Types

```sql
-- 006_increase_description_length.sql
ALTER TABLE courses 
MODIFY COLUMN description LONGTEXT NULL;
```

### Example 4: Adding New Tables

```sql
-- 007_add_course_reviews.sql
CREATE TABLE IF NOT EXISTS course_reviews (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  course_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course (course_id),
  INDEX idx_user (user_id),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Example 5: Adding Indexes

```sql
-- 008_add_performance_indexes.sql
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX idx_courses_featured ON courses(is_featured);
```

### Example 6: Renaming Columns

```sql
-- 009_rename_column.sql
ALTER TABLE courses 
CHANGE COLUMN short_description summary VARCHAR(500);
```

## Migration Checklist

Before creating a new migration:

- [ ] Is this a schema change? → Create new migration file
- [ ] Is this just data changes? → Can add to sample data file or create separate data migration
- [ ] Will this affect existing data? → Plan data migration if needed
- [ ] Is this reversible? → Consider creating rollback migration
- [ ] Have I tested on a copy? → Always test first

## Key Principles

1. **Never modify existing migrations** once they've been executed
2. **Always create new migrations** for schema changes
3. **Use ALTER TABLE** for modifying existing tables
4. **Test migrations** before running on production
5. **Document the reason** for each migration

See `MIGRATION_BEST_PRACTICES.md` for detailed guidelines.

