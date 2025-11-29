import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const resetMigrations = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🔄 Resetting migrations...\n');
    
    // Drop the migrations table to allow re-running
    await connection.query('DROP TABLE IF EXISTS migrations');
    console.log('✅ Deleted migrations tracking table');
    
    // Drop all existing tables (if any)
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log(`\n⚠️  Found ${tables.length} existing table(s). Dropping them...\n`);
      
      // Disable foreign key checks temporarily
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`  ✅ Dropped table: ${tableName}`);
      }
      
      // Re-enable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    
    connection.release();
    console.log('\n✅ Database reset complete. You can now run migrations.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

resetMigrations();

