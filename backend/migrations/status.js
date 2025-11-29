import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getExecutedMigrations = async () => {
  try {
    const [rows] = await pool.query('SELECT name, executed_at FROM migrations ORDER BY id');
    return rows;
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw error;
  }
};

const status = async () => {
  try {
    console.log('📊 Migration Status\n');
    console.log('═══════════════════════════════════════\n');
    
    // Get all migration files
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get executed migrations
    const executed = await getExecutedMigrations();
    const executedNames = executed.map(m => m.name);
    
    // Display status
    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    for (const file of files) {
      const executedMigration = executed.find(m => m.name === file);
      if (executedMigration) {
        console.log(`✅ ${file}`);
        console.log(`   Executed: ${executedMigration.executed_at}\n`);
      } else {
        console.log(`⏳ ${file} (Pending)\n`);
      }
    }
    
    const pending = files.filter(f => !executedNames.includes(f));
    console.log('═══════════════════════════════════════');
    console.log(`Total: ${files.length} | Executed: ${executed.length} | Pending: ${pending.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

status();

