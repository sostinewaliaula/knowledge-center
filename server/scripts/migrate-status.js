import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function showMigrationStatus() {
  try {
    const connection = await pool.getConnection();
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file.match(/^\d+_.+\.sql$/))
      .sort();
    
    // Get executed migrations
    const [executed] = await connection.query(
      'SELECT filename, executed_at FROM migrations ORDER BY executed_at'
    );
    const executedFilenames = new Set(executed.map(m => m.filename));
    
    console.log('📊 Migration Status\n');
    console.log('═'.repeat(60));
    
    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      connection.release();
      process.exit(0);
    }
    
    let pending = 0;
    let completed = 0;
    
    for (const file of files) {
      const isExecuted = executedFilenames.has(file);
      const status = isExecuted ? '✅ Executed' : '⏳ Pending';
      
      if (isExecuted) {
        const migration = executed.find(m => m.filename === file);
        console.log(`${status.padEnd(15)} ${file}`);
        console.log(`                Executed: ${migration.executed_at}`);
        completed++;
      } else {
        console.log(`${status.padEnd(15)} ${file}`);
        pending++;
      }
      console.log();
    }
    
    console.log('═'.repeat(60));
    console.log(`Total: ${files.length} migrations`);
    console.log(`✅ Completed: ${completed}`);
    console.log(`⏳ Pending: ${pending}`);
    
    if (pending > 0) {
      console.log(`\nRun 'npm run migrate' to execute pending migrations`);
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('ℹ️  Migrations table does not exist yet');
      console.log('   Run migrations first: npm run migrate');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

showMigrationStatus();

