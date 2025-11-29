import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration tracking table
const createMigrationTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  await pool.query(sql);
};

// Get executed migrations
const getExecutedMigrations = async () => {
  const [rows] = await pool.query('SELECT name FROM migrations ORDER BY id');
  return rows.map(row => row.name);
};

// Mark migration as executed
const markMigrationExecuted = async (name) => {
  await pool.query('INSERT INTO migrations (name) VALUES (?)', [name]);
};

// Execute a migration file
const executeMigration = async (filePath, fileName) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Split SQL by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    await markMigrationExecuted(fileName);
    await connection.commit();
    
    console.log(`✅ Executed: ${fileName}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Main migration function
const migrate = async () => {
  try {
    console.log('🔄 Starting database migrations...\n');
    
    // Create migrations table
    await createMigrationTable();
    
    // Get all SQL files in migrations directory
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get already executed migrations
    const executed = await getExecutedMigrations();
    
    // Execute pending migrations
    let executedCount = 0;
    for (const file of files) {
      if (!executed.includes(file)) {
        const filePath = path.join(migrationsDir, file);
        await executeMigration(filePath, file);
        executedCount++;
      } else {
        console.log(`⏭️  Skipped (already executed): ${file}`);
      }
    }
    
    if (executedCount === 0) {
      console.log('\n✅ All migrations are up to date!');
    } else {
      console.log(`\n✅ Successfully executed ${executedCount} migration(s)!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

migrate();

