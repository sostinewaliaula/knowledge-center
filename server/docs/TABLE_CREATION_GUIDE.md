# Table Creation Guide

## UUID Primary Keys - Required for All Tables

When creating new tables in the Knowledge Center database, **you MUST use UUID for primary keys**.

## Standard Table Template

```sql
CREATE TABLE your_table_name (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  -- Add your columns here
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Add indexes as needed
  INDEX idx_your_index (your_column),
  
  -- Add foreign keys if needed (must reference UUID columns)
  FOREIGN KEY (foreign_key_column) REFERENCES other_table(id)
);
```

## Rules

### ✅ DO:
- Use `CHAR(36) PRIMARY KEY DEFAULT (UUID())` for all `id` columns
- Omit `id` field in INSERT statements (database auto-generates)
- Use `CHAR(36)` for foreign key columns that reference UUID primary keys
- Add `DEFAULT (UUID())` to all primary key columns

### ❌ DON'T:
- Use `INT AUTO_INCREMENT` for primary keys
- Manually generate UUIDs in application code using `randomUUID()`
- Include `id` in INSERT statements
- Use `INT` for foreign keys that reference UUID primary keys

## Examples

### Creating a New Table

```sql
CREATE TABLE courses (
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

### Inserting Data (Correct Way)

```javascript
// ✅ Correct - database auto-generates UUID
await pool.query(
  'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
  [title, description, instructorId]
);

// Get the auto-generated ID if needed
const [newCourse] = await pool.query(
  'SELECT id FROM courses WHERE title = ? ORDER BY created_at DESC LIMIT 1',
  [title]
);
const courseId = newCourse[0].id;
```

### Inserting Data (Wrong Way)

```javascript
// ❌ Wrong - don't generate UUID in code
import { randomUUID } from 'crypto';
const id = randomUUID();
await pool.query(
  'INSERT INTO courses (id, title, description, instructor_id) VALUES (?, ?, ?, ?)',
  [id, title, description, instructorId]
);
```

## Verification

After creating a new table:

1. **Verify UUID default is set:**
   ```bash
   npm run verify-all-auto-uuid
   ```

2. **Test auto-generation:**
   ```sql
   INSERT INTO your_table (column1, column2) VALUES ('test', 'value');
   SELECT id FROM your_table WHERE column1 = 'test';
   -- Should return a valid UUID
   ```

## Migration Scripts

If you need to add UUID defaults to existing tables:

```bash
npm run add-uuid-defaults
```

## Current Tables Using UUID

All existing tables use UUID:
- ✅ `roles`
- ✅ `users`
- ✅ `role_permissions`
- ✅ `otp_codes`
- ✅ `password_resets`

**Remember: All future tables must follow this pattern!**

