import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkMigrations = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n📊 Migration Status\n');
    console.log('═══════════════════════════════════════\n');
    
    const [migrations] = await connection.query('SELECT * FROM migrations ORDER BY id');
    
    if (migrations.length === 0) {
      console.log('No migrations have been executed yet.\n');
    } else {
      console.log('Executed migrations:\n');
      migrations.forEach((m, i) => {
        console.log(`  ${i + 1}. ${m.name}`);
        console.log(`     Executed: ${m.executed_at}\n`);
      });
    }
    
    // Check for key tables
    console.log('Checking key tables:\n');
    const keyTables = ['roles', 'users', 'categories', 'courses', 'enrollments'];
    
    for (const tableName of keyTables) {
      try {
        const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName} LIMIT 1`);
        console.log(`  ✅ ${tableName} - EXISTS`);
      } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
          console.log(`  ❌ ${tableName} - NOT FOUND`);
        } else {
          console.log(`  ⚠️  ${tableName} - ERROR: ${error.message}`);
        }
      }
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkMigrations();

