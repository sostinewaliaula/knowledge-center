import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create migrations table to track which migrations have been run
async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_filename (filename)
    )
  `);
}

// Get list of migration files
function getMigrationFiles() {
  const migrationsDir = __dirname; // Migration files are in the same directory as this script
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && file.match(/^\d+_.+\.sql$/))
    .sort(); // Sort by filename (which includes number prefix)
  return files;
}

// Check if migration has been run
async function isMigrationRun(connection, filename) {
  const [rows] = await connection.query(
    'SELECT id FROM migrations WHERE filename = ?',
    [filename]
  );
  return rows.length > 0;
}

// Mark migration as run
async function markMigrationRun(connection, filename) {
  await connection.query(
    'INSERT INTO migrations (filename) VALUES (?)',
    [filename]
  );
}

// Execute SQL file
async function executeMigration(connection, filepath) {
  let sql = fs.readFileSync(filepath, 'utf8');
  
  // Remove block comments /* ... */
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Split by semicolon and execute each statement
  // Remove single-line comments and empty statements
  const statements = sql
    .split(';')
    .map(s => {
      // Remove single-line comments
      const lines = s.split('\n');
      const cleanedLines = lines.map(line => {
        const commentIndex = line.indexOf('--');
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      });
      return cleanedLines.join('\n').trim();
    })
    .filter(s => s.length > 0);
  
  if (statements.length === 0) {
    console.log('  ℹ️  Migration file is empty (all SQL is commented out)');
    return;
  }
  
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }
}

// Run only new/pending migrations
async function runMigrations() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Checking for new migrations...\n');
    
    // Ensure migrations table exists
    await ensureMigrationsTable(connection);
    
    // Get all migration files
    const files = getMigrationFiles();
    
    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      connection.release();
      process.exit(0);
    }
    
    // Get already executed migrations
    const [executed] = await connection.query('SELECT filename FROM migrations');
    const executedSet = new Set(executed.map(m => m.filename));
    
    // Filter to only pending migrations
    const pendingMigrations = files.filter(file => !executedSet.has(file));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are up to date');
      console.log(`   Total migrations: ${files.length}`);
      console.log(`   Executed: ${executed.length}`);
      console.log(`   Pending: 0\n`);
      connection.release();
      process.exit(0);
    }
    
    console.log(`Found ${pendingMigrations.length} new migration(s) to run\n`);
    console.log('Pending migrations:');
    pendingMigrations.forEach(file => console.log(`  - ${file}`));
    console.log();
    
    let executedCount = 0;
    
    for (const file of pendingMigrations) {
      const filepath = path.join(__dirname, file);
      
      try {
        console.log(`▶️  Running: ${file}...`);
        await executeMigration(connection, filepath);
        await markMigrationRun(connection, file);
        console.log(`✅ Completed: ${file}\n`);
        executedCount++;
      } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        throw error;
      }
    }
    
    // Get updated count
    const [updatedExecuted] = await connection.query('SELECT COUNT(*) as count FROM migrations');
    const totalExecuted = updatedExecuted[0].count;
    
    console.log('═'.repeat(60));
    console.log(`✅ Migration complete!`);
    console.log(`   New migrations executed: ${executedCount}`);
    console.log(`   Total migrations in database: ${totalExecuted}`);
    console.log('═'.repeat(60));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    connection.release();
    process.exit(1);
  } finally {
    connection.release();
  }
  
  process.exit(0);
}

// Rollback last migration (if needed)
async function rollbackLastMigration() {
  const connection = await pool.getConnection();
  
  try {
    const [migrations] = await connection.query(
      'SELECT filename FROM migrations ORDER BY executed_at DESC LIMIT 1'
    );
    
    if (migrations.length === 0) {
      console.log('ℹ️  No migrations to rollback');
      return;
    }
    
    const lastMigration = migrations[0].filename;
    console.log(`⚠️  Rollback functionality not implemented yet`);
    console.log(`   Last migration: ${lastMigration}`);
    console.log(`   Manual rollback required`);
    
  } catch (error) {
    console.error('❌ Rollback error:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
  
  process.exit(0);
}

// Main execution
const command = process.argv[2];

if (command === 'rollback') {
  rollbackLastMigration();
} else {
  runMigrations();
}
