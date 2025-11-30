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
  
  // Remove comments
  let cleanSql = sql.replace(/--.*$/gm, '');
  cleanSql = cleanSql.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Split by semicolons, but handle multi-line statements (triggers, functions)
  // For functions and triggers, we need to keep BEGIN...END together
  const statements = [];
  let currentStatement = '';
  let inBlock = false;
  let beginCount = 0;
  let endCount = 0;
  
  // Process line by line to better handle multi-line statements
  const lines = cleanSql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inBlock) {
        currentStatement += '\n';
      }
      continue;
    }
    
    // Check if this line starts a block
    if (trimmed.match(/^(CREATE|DROP)\s+(TRIGGER|FUNCTION|PROCEDURE)/i)) {
      inBlock = true;
      beginCount = 0;
      endCount = 0;
    }
    
    // Count BEGIN and END
    const lineBeginMatches = (trimmed.match(/\bBEGIN\b/gi) || []).length;
    const lineEndMatches = (trimmed.match(/\bEND\b/gi) || []).length;
    beginCount += lineBeginMatches;
    endCount += lineEndMatches;
    
    currentStatement += (currentStatement ? '\n' : '') + trimmed;
    
    // Check if statement is complete
    if (trimmed.endsWith(';')) {
      // If we're in a block, wait for matching END
      if (inBlock && endCount < beginCount) {
        // Still in block, continue
        continue;
      } else {
        // Statement complete
        if (currentStatement.trim()) {
          statements.push(currentStatement.trim());
        }
        currentStatement = '';
        inBlock = false;
        beginCount = 0;
        endCount = 0;
      }
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    let statementCount = 0;
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.match(/^\s*$/)) {
        try {
          await connection.query(trimmed);
          statementCount++;
        } catch (stmtError) {
          console.error(`\n❌ Error in statement ${statementCount + 1}:`);
          console.error(trimmed.substring(0, 200) + '...');
          console.error(`Error: ${stmtError.message}\n`);
          throw stmtError;
        }
      }
    }
    
    await markMigrationExecuted(fileName);
    await connection.commit();
    
    console.log(`✅ Executed: ${fileName} (${statementCount} statements)`);
  } catch (error) {
    await connection.rollback();
    console.error(`\n❌ Migration failed: ${fileName}`);
    console.error(`Error: ${error.message}`);
    if (error.sql) {
      console.error(`SQL: ${error.sql.substring(0, 200)}...`);
    }
    throw error;
  } finally {
    connection.release();
  }
};

// Main migration function
const migrate = async (specificMigration = null) => {
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
    
    // If specific migration is requested
    if (specificMigration) {
      // Find the migration file
      const migrationFile = files.find(file => 
        file === specificMigration || 
        file.includes(specificMigration) ||
        file.startsWith(specificMigration)
      );
      
      if (!migrationFile) {
        console.error(`\n❌ Migration not found: ${specificMigration}`);
        console.log('\nAvailable migrations:');
        files.forEach(file => console.log(`  - ${file}`));
        process.exit(1);
      }
      
      if (executed.includes(migrationFile)) {
        console.log(`⏭️  Migration already executed: ${migrationFile}`);
        console.log('   Use --force to re-run (not recommended)');
        process.exit(0);
      }
      
      const filePath = path.join(migrationsDir, migrationFile);
      await executeMigration(filePath, migrationFile);
      console.log(`\n✅ Successfully executed: ${migrationFile}`);
      process.exit(0);
    }
    
    // Execute all pending migrations
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

// Get migration name from command line arguments
const args = process.argv.slice(2);
const migrationName = args.find(arg => !arg.startsWith('--'));

migrate(migrationName);

