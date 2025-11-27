import pool from '../config/database.js';

async function checkUUIDDefaults() {
  try {
    const connection = await pool.getConnection();
    console.log('🔍 Checking UUID defaults in table definitions...\n');

    const tables = ['roles', 'users', 'role_permissions', 'otp_codes', 'password_resets'];
    
    for (const tableName of tables) {
      console.log(`📋 Table: ${tableName}`);
      console.log('─'.repeat(60));
      
      // Get CREATE TABLE statement
      const [result] = await connection.query(`SHOW CREATE TABLE ${tableName}`);
      const createTable = result[0]['Create Table'];
      
      // Check if DEFAULT (UUID()) is present
      const hasUUIDDefault = createTable.includes('DEFAULT (UUID())') || createTable.includes('DEFAULT(UUID())');
      
      // Extract id column definition
      const idMatch = createTable.match(/`id`\s+CHAR\(36\)[^,]+/);
      const idDefinition = idMatch ? idMatch[0] : 'Not found';
      
      console.log(`  ID Column Definition:`);
      console.log(`  ${idDefinition}`);
      
      if (hasUUIDDefault) {
        console.log(`  ✅ Has DEFAULT (UUID()) - Database will auto-generate UUIDs`);
      } else {
        console.log(`  ⚠️  No DEFAULT (UUID()) - UUIDs must be generated in application code`);
        console.log(`  ℹ️  Current code generates UUIDs using randomUUID() from 'crypto'`);
      }
      console.log();
    }

    // Check database version
    const [version] = await connection.query('SELECT VERSION() as version');
    const versionStr = version[0].version;
    console.log(`Database Version: ${versionStr}`);
    
    const majorVersion = parseInt(versionStr.split('.')[0]);
    const minorVersion = parseInt(versionStr.split('.')[1]);
    const isMariaDB = versionStr.includes('MariaDB');
    
    if (isMariaDB) {
      if (majorVersion >= 10 && minorVersion >= 7) {
        console.log('✅ MariaDB 10.7+ supports UUID() as default');
      } else {
        console.log('⚠️  MariaDB version may not support UUID() as default');
      }
    } else {
      if (majorVersion >= 8) {
        console.log('✅ MySQL 8.0+ supports UUID() as default');
      } else {
        console.log('⚠️  MySQL version may not support UUID() as default');
      }
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUUIDDefaults();

