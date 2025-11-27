import pool from '../config/database.js';

async function addUUIDDefaults() {
  try {
    const connection = await pool.getConnection();
    console.log('🔧 Adding DEFAULT (UUID()) to all ID columns...\n');

    const tables = [
      { name: 'roles', idCol: 'id' },
      { name: 'users', idCol: 'id' },
      { name: 'role_permissions', idCol: 'id' },
      { name: 'otp_codes', idCol: 'id' },
      { name: 'password_resets', idCol: 'id' }
    ];

    for (const table of tables) {
      console.log(`📋 Updating ${table.name}...`);
      
      try {
        // Modify the id column to add DEFAULT (UUID())
        await connection.query(`
          ALTER TABLE ${table.name} 
          MODIFY COLUMN ${table.idCol} CHAR(36) NOT NULL DEFAULT (UUID())
        `);
        console.log(`  ✅ Added DEFAULT (UUID()) to ${table.name}.${table.idCol}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('already exists')) {
          console.log(`  ℹ️  ${table.name}.${table.idCol} already has default`);
        } else {
          console.log(`  ⚠️  Error: ${error.message}`);
        }
      }
    }

    console.log('\n✅ UUID defaults added successfully!');
    console.log('\n📝 Note: You can now:');
    console.log('   1. Omit id in INSERT statements (database will auto-generate)');
    console.log('   2. Still explicitly provide id if needed (will override default)');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUUIDDefaults();

