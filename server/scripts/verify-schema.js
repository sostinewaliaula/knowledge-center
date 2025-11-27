import pool from '../config/database.js';

async function verifySchema() {
  try {
    const connection = await pool.getConnection();
    console.log('🔍 Verifying database schema for UUID compliance...\n');

    const tables = ['roles', 'users', 'role_permissions', 'otp_codes', 'password_resets'];
    let allValid = true;

    for (const tableName of tables) {
      console.log(`\n📋 Table: ${tableName}`);
      console.log('─'.repeat(60));
      
      // Get all columns for this table
      const [columns] = await connection.query(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);

      if (columns.length === 0) {
        console.log(`  ⚠️  Table ${tableName} does not exist`);
        allValid = false;
        continue;
      }

      // Check each column
      for (const col of columns) {
        const isIdColumn = col.COLUMN_NAME === 'id';
        const isForeignKey = col.COLUMN_NAME.includes('_id') && col.COLUMN_NAME !== 'id';
        const isUUID = col.DATA_TYPE === 'char' && col.CHARACTER_MAXIMUM_LENGTH === 36;
        const isInt = col.DATA_TYPE === 'int';
        
        let status = '✅';
        let issue = '';

        if (isIdColumn) {
          // Primary key should be UUID
          if (!isUUID) {
            status = '❌';
            issue = `Primary key should be CHAR(36) UUID, but is ${col.DATA_TYPE}`;
            allValid = false;
          } else {
            issue = 'Primary key (UUID)';
          }
        } else if (isForeignKey) {
          // Foreign keys should be UUID
          if (!isUUID && isInt) {
            status = '❌';
            issue = `Foreign key should be CHAR(36) UUID, but is ${col.DATA_TYPE}`;
            allValid = false;
          } else if (isUUID) {
            issue = 'Foreign key (UUID)';
          } else {
            issue = `Foreign key (${col.DATA_TYPE})`;
          }
        } else {
          issue = `${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''}`;
        }

        console.log(`  ${status} ${col.COLUMN_NAME.padEnd(25)} ${issue.padEnd(30)} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'}`);
      }

      // Check foreign key constraints
      const [foreignKeys] = await connection.query(`
        SELECT 
          CONSTRAINT_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [tableName]);

      if (foreignKeys.length > 0) {
        console.log(`\n  🔗 Foreign Key Constraints:`);
        for (const fk of foreignKeys) {
          console.log(`     ✓ ${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
        }
      }
    }

    // Summary
    console.log('\n' + '═'.repeat(60));
    if (allValid) {
      console.log('✅ ALL TABLES ARE PROPERLY CONFIGURED WITH UUIDs');
    } else {
      console.log('❌ SOME TABLES NEED ATTENTION');
      console.log('\nRun the following to fix issues:');
      console.log('  npm run migrate-uuid    - Full UUID migration');
      console.log('  npm run fix-role-ids    - Fix user role_id values');
    }
    console.log('═'.repeat(60));

    connection.release();
    process.exit(allValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySchema();

