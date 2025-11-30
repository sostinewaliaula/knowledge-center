# Database Migrations Guide

## Quick Reference

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Run a specific migration by name
npm run migrate 005_add_content_sources.sql
npm run migrate 005
npm run migrate add_content_sources

# Check which migrations have been executed
npm run migrate:status
```

### Creating New Migrations

**For schema changes (adding/removing columns, tables, etc.):**

1. Create a new file: `00X_description.sql`
2. Use `ALTER TABLE` for modifying existing tables
3. Use `CREATE TABLE` for new tables
4. Always use `IF EXISTS` or `IF NOT EXISTS` where possible
5. Document the reason in comments

**Example:**
```sql
-- 004_remove_price_currency.sql
-- Reason: Internal LMS - no pricing needed

ALTER TABLE courses DROP COLUMN price;
ALTER TABLE courses DROP COLUMN currency;
```

### Best Practices

✅ **DO:**
- Create new migration files for each change
- Use `ALTER TABLE` for modifying existing tables
- Test migrations on a copy first
- Document the reason for each migration

❌ **DON'T:**
- Modify existing migration files
- Drop all tables for small changes
- Skip migration tracking

### Current Migrations

- `001_complete_schema.sql` - Initial database schema
- `003_sample_data.sql` - Sample data (Oracle products, onboarding, etc.)
- `004_remove_price_currency.sql` - Reference migration (already removed in schema)

See `docs/MIGRATION_BEST_PRACTICES.md` for detailed guidelines.

