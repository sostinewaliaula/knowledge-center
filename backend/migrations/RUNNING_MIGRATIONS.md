# Running Migrations

## Overview

The migration system supports running all pending migrations or a specific migration by name.

## Commands

### Run All Pending Migrations

```bash
npm run migrate
```

This will execute all migrations that haven't been run yet, in order.

### Run a Specific Migration

You can run a specific migration by providing its name (full filename, number, or partial name):

```bash
npm run migrate 005_add_content_sources.sql
```

Or just the number:
```bash
npm run migrate 005
```

Or a partial name match:
```bash
npm run migrate add_content_sources
npm run migrate content_sources
```

### Check Migration Status

```bash
npm run migrate:status
```

This shows which migrations have been executed and which are pending.

## Examples

### Run a specific migration by full filename:
```bash
npm run migrate 005_add_content_sources.sql
```

### Run a specific migration by number:
```bash
npm run migrate 004
```

### Run a specific migration by partial name:
```bash
npm run migrate remove_price
```

## Important Notes

1. **Migrations are tracked**: Once a migration is executed, it's marked in the database and won't run again automatically.

2. **Order matters**: Migrations run in filename order. Always use numbered prefixes (e.g., `001_`, `002_`, etc.).

3. **Idempotent migrations**: Design migrations to be safe to run multiple times when possible, or handle "already exists" errors gracefully.

4. **Manual migrations**: If you run a migration manually in the database, you should still mark it as executed in the migrations table or run it through the script (it will detect it's already applied and skip).

## Migration Naming Convention

- Use numbered prefixes: `001_`, `002_`, `003_`, etc.
- Use descriptive names: `001_complete_schema.sql`, `005_add_content_sources.sql`
- Use snake_case for names
- Be specific: describe what the migration does

## Future Migrations

When creating new migrations:

1. Create the SQL file with appropriate number and name
2. Test the migration by running it specifically:
   ```bash
   npm run migrate YOUR_MIGRATION_NAME.sql
   ```
3. Verify the migration worked correctly
4. Document any special instructions or notes

