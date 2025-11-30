# Migration System - Important Notes

## Running Migrations

### Always Use Migration Names

**For future migrations, always run them by name:**

```bash
# Run all pending migrations
npm run migrate

# Run a specific migration by name (PREFERRED for targeted changes)
npm run migrate 005_add_content_sources.sql

# Alternative: by number or partial name
npm run migrate 005
npm run migrate add_content_sources
```

### Why Run by Name?

1. **Targeted execution**: Run only the migration you need
2. **Testing**: Test specific migrations before running all
3. **Debugging**: Isolate issues to specific migrations
4. **Flexibility**: Skip problematic migrations temporarily

### Migration Workflow

1. **Create** a new migration file: `00X_description.sql`
2. **Test** by running it specifically:
   ```bash
   npm run migrate 00X_description.sql
   ```
3. **Verify** with status check:
   ```bash
   npm run migrate:status
   ```
4. **Deploy** by running all pending or specific migrations

## Key Points to Remember

✅ **DO:**
- Run migrations by name when testing or making targeted changes
- Check migration status before and after running migrations
- Test migrations on a copy of production data first
- Create new migration files for schema changes (never modify existing ones)

❌ **DON'T:**
- Modify existing migration files
- Skip migration tracking
- Run untested migrations on production

## Quick Reference

- **Status**: `npm run migrate:status`
- **All migrations**: `npm run migrate`
- **Specific migration**: `npm run migrate MIGRATION_NAME.sql`
- **Help**: See `migrations/RUNNING_MIGRATIONS.md` for detailed guide

