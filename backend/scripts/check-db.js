import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🔍 Database Connection Check\n');
    console.log('═══════════════════════════════════════\n');
    
    // Get database name
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log('Current Database:', dbResult[0].db);
    console.log('');
    
    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database!\n');
      console.log('The database is empty. You need to run migrations first.');
    } else {
      console.log(`✅ Found ${tables.length} table(s):\n`);
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    }
    
    console.log('\n═══════════════════════════════════════\n');
    
    // Check specific tables
    const expectedTables = ['roles', 'users', 'categories', 'courses'];
    console.log('Checking for expected tables:\n');
    
    for (const tableName of expectedTables) {
      const [result] = await connection.query(
        `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
        [dbResult[0].db, tableName]
      );
      
      if (result[0].count > 0) {
        console.log(`  ✅ ${tableName} - EXISTS`);
      } else {
        console.log(`  ❌ ${tableName} - NOT FOUND`);
      }
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('  1. Database exists and is accessible');
    console.error('  2. .env file has correct DB_NAME');
    console.error('  3. Database credentials are correct\n');
    process.exit(1);
  }
};

checkDatabase();

