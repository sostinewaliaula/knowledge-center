import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🧹 Cleaning Database...\n');
    console.log('═══════════════════════════════════════\n');
    
    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Disabled foreign key checks\n');
    
    // Drop all triggers first
    console.log('Dropping triggers...\n');
    const [triggers] = await connection.query('SHOW TRIGGERS');
    
    for (const trigger of triggers) {
      try {
        await connection.query(`DROP TRIGGER IF EXISTS \`${trigger.Trigger}\``);
        console.log(`  ✅ Dropped trigger: ${trigger.Trigger}`);
      } catch (error) {
        console.log(`  ⚠️  Could not drop trigger ${trigger.Trigger}: ${error.message}`);
      }
    }
    
    // Drop all functions
    console.log('\nDropping functions...\n');
    try {
      await connection.query('DROP FUNCTION IF EXISTS generate_uuid');
      console.log('  ✅ Dropped function: generate_uuid');
    } catch (error) {
      console.log(`  ⚠️  Could not drop function: ${error.message}`);
    }
    
    // Get all tables
    console.log('\nDropping tables...\n');
    const [tables] = await connection.query('SHOW TABLES');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`  ✅ Dropped table: ${tableName}`);
      } catch (error) {
        console.log(`  ⚠️  Could not drop table ${tableName}: ${error.message}`);
      }
    }
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✅ Re-enabled foreign key checks');
    
    connection.release();
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Database cleaned successfully!');
    console.log('You can now run migrations from scratch.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

cleanDatabase();

