# Database Migrations

This directory contains SQL migration files for the Knowledge Center database.

## Migration System

We use a **SQL-based migration system** for better:
- ✅ Version control (migrations are tracked in git)
- ✅ Reproducibility (same migrations run on all environments)
- ✅ **Only runs NEW migrations** (already-executed migrations are skipped)
- ✅ Team collaboration (everyone runs the same migrations)
- ✅ Documentation (SQL files serve as schema documentation)
- ✅ Automatic tracking (database tracks which migrations have run)

## Migration Files

Migration files follow this naming convention:
```
001_description.sql
002_another_change.sql
003_add_new_table.sql
```

**Rules:**
- Start with a number (001, 002, etc.) for ordering
- Use descriptive names with underscores
- End with `.sql` extension
- Each file should be idempotent (use `IF NOT EXISTS` where possible)

## Running Migrations

### Run only NEW pending migrations:
```bash
npm run migrate
```
**Note:** This only runs migrations that haven't been executed yet. Already-run migrations are automatically skipped.

### Check migration status:
```bash
npm run migrate-status
```
Shows which migrations have been executed and which are pending.

## Creating New Migrations

### 1. Create a new SQL file:
```bash
# Create: migrations/004_add_courses_table.sql
```

### 2. Follow the UUID pattern:
```sql
-- Migration: 004_add_courses_table.sql
-- Description: Add courses table for learning content
-- Created: 2024

CREATE TABLE IF NOT EXISTS courses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id),
  INDEX idx_instructor (instructor_id)
);
```

### 3. Run migrations:
```bash
npm run migrate
```

## Migration Tracking

The system automatically tracks which migrations have been run in the `migrations` table:
- Each migration is recorded with filename and execution timestamp
- Already-run migrations are automatically skipped
- Safe to run migrations multiple times

## Best Practices

1. **Always use UUID for primary keys:**
   ```sql
   id CHAR(36) PRIMARY KEY DEFAULT (UUID())
   ```

2. **Make migrations idempotent:**
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   INSERT IGNORE INTO ...
   ```

3. **Use descriptive names:**
   - ✅ `004_add_courses_table.sql`
   - ❌ `004_update.sql`

4. **One logical change per migration:**
   - ✅ One migration = one feature/change
   - ❌ Don't bundle unrelated changes

5. **Test migrations:**
   - Test on development database first
   - Verify with `npm run verify-schema` after migration

## Migration vs Scripts

**Use Migrations For:**
- ✅ Schema changes (CREATE TABLE, ALTER TABLE)
- ✅ Data structure changes
- ✅ Index additions/removals
- ✅ Foreign key constraints

**Use Scripts For:**
- ✅ One-time data seeding
- ✅ Data migrations (moving data between tables)
- ✅ Utility operations (create test users, etc.)
- ✅ Administrative tasks

## Example: Adding a New Table

1. Create migration file: `migrations/004_add_courses_table.sql`
2. Write SQL following UUID pattern
3. Run: `npm run migrate`
4. Verify: `npm run verify-schema`

## Current Migrations

- `001_initial_schema.sql` - Initial database schema (roles, users, auth tables)

