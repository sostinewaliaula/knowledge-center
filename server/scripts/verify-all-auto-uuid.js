import pool from '../config/database.js';

async function verifyAllAutoUUID() {
  try {
    const connection = await pool.getConnection();
    console.log('🔍 Verifying automatic UUID generation for ALL tables...\n');

    const tables = [
      { name: 'roles', testData: { name: 'test-role-verify', display_name: 'Test Role', description: 'Verification test', is_system_role: false } },
      { name: 'users', testData: { email: 'test-verify@example.com', password: 'hashed', name: 'Test User', role_id: null } },
      { name: 'role_permissions', testData: { role_id: null, permission: `test.permission.${Date.now()}` } },
      { name: 'otp_codes', testData: { email: 'test@example.com', code: '123456', expires_at: new Date() } },
      { name: 'password_resets', testData: { email: 'test@example.com', token: 'test-token', expires_at: new Date() } }
    ];

    // Get a role_id for testing users and role_permissions
    const [roles] = await connection.query('SELECT id FROM roles LIMIT 1');
    const testRoleId = roles.length > 0 ? roles[0].id : null;

    let allPassed = true;

    for (const table of tables) {
      console.log(`📋 Testing ${table.name}...`);
      console.log('─'.repeat(60));

      try {
        // Check if table has DEFAULT (UUID()) on id column
        const [columns] = await connection.query(`
          SELECT COLUMN_DEFAULT, COLUMN_TYPE
          FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND COLUMN_NAME = 'id'
        `, [table.name]);

        if (columns.length === 0) {
          console.log(`  ❌ Table ${table.name} does not have an 'id' column`);
          allPassed = false;
          continue;
        }

        const hasUUIDDefault = columns[0].COLUMN_DEFAULT && 
                               (columns[0].COLUMN_DEFAULT.includes('UUID()') || 
                                columns[0].COLUMN_DEFAULT.includes('uuid()'));
        
        if (hasUUIDDefault) {
          console.log(`  ✅ Table has DEFAULT (UUID()) configured`);
        } else {
          console.log(`  ❌ Table does NOT have DEFAULT (UUID())`);
          console.log(`     Current default: ${columns[0].COLUMN_DEFAULT || 'NULL'}`);
          allPassed = false;
          continue;
        }

        // Test inserting without id
        let insertQuery = '';
        let insertValues = [];

        if (table.name === 'roles') {
          insertQuery = 'INSERT INTO roles (name, display_name, description, is_system_role) VALUES (?, ?, ?, ?)';
          insertValues = [table.testData.name, table.testData.display_name, table.testData.description, table.testData.is_system_role];
        } else if (table.name === 'users') {
          if (!testRoleId) {
            console.log(`  ⚠️  Skipping test - no roles available`);
            continue;
          }
          insertQuery = 'INSERT INTO users (email, password, name, role_id) VALUES (?, ?, ?, ?)';
          insertValues = [table.testData.email, table.testData.password, table.testData.name, testRoleId];
        } else if (table.name === 'role_permissions') {
          if (!testRoleId) {
            console.log(`  ⚠️  Skipping test - no roles available`);
            continue;
          }
          insertQuery = 'INSERT INTO role_permissions (role_id, permission) VALUES (?, ?)';
          insertValues = [testRoleId, table.testData.permission];
        } else if (table.name === 'otp_codes') {
          insertQuery = 'INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)';
          insertValues = [table.testData.email, table.testData.code, table.testData.expires_at];
        } else if (table.name === 'password_resets') {
          insertQuery = 'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)';
          insertValues = [table.testData.email, table.testData.token, table.testData.expires_at];
        }

        // Insert without id
        await connection.query(insertQuery, insertValues);

        // Get the inserted record
        let selectQuery = '';
        if (table.name === 'roles') {
          selectQuery = 'SELECT id FROM roles WHERE name = ? ORDER BY created_at DESC LIMIT 1';
        } else if (table.name === 'users') {
          selectQuery = 'SELECT id FROM users WHERE email = ? ORDER BY created_at DESC LIMIT 1';
        } else if (table.name === 'role_permissions') {
          selectQuery = 'SELECT id FROM role_permissions WHERE role_id = ? AND permission = ? ORDER BY created_at DESC LIMIT 1';
        } else if (table.name === 'otp_codes') {
          selectQuery = 'SELECT id FROM otp_codes WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1';
        } else if (table.name === 'password_resets') {
          selectQuery = 'SELECT id FROM password_resets WHERE email = ? AND token = ? ORDER BY created_at DESC LIMIT 1';
        }

        let selectParams = [];
        if (table.name === 'roles') {
          selectParams = [table.testData.name];
        } else if (table.name === 'users') {
          selectParams = [table.testData.email];
        } else if (table.name === 'role_permissions') {
          selectParams = [testRoleId, table.testData.permission];
        } else if (table.name === 'otp_codes') {
          selectParams = [table.testData.email, table.testData.code];
        } else if (table.name === 'password_resets') {
          selectParams = [table.testData.email, table.testData.token];
        }

        const [inserted] = await connection.query(selectQuery, selectParams);

        if (inserted.length > 0) {
          const generatedId = inserted[0].id;
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(generatedId);
          
          if (isUUID) {
            console.log(`  ✅ Auto-generated UUID: ${generatedId}`);
            console.log(`  ✅ UUID format is valid`);
          } else {
            console.log(`  ❌ Generated ID is not a valid UUID: ${generatedId}`);
            allPassed = false;
          }

          // Clean up test data
          await connection.query(`DELETE FROM ${table.name} WHERE id = ?`, [generatedId]);
        } else {
          console.log(`  ❌ Could not retrieve inserted record`);
          allPassed = false;
        }

      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        if (error.message.includes("Field 'id' doesn't have a default value")) {
          console.log(`     ⚠️  Table does not have DEFAULT (UUID()) configured`);
        }
        allPassed = false;
      }

      console.log();
    }

    console.log('═'.repeat(60));
    if (allPassed) {
      console.log('✅ ALL TABLES SUCCESSFULLY AUTO-GENERATE UUIDs');
      console.log('\n📝 Summary:');
      console.log('   • All tables have DEFAULT (UUID()) configured');
      console.log('   • All INSERT statements can omit the id field');
      console.log('   • Database automatically generates UUIDs for new rows');
    } else {
      console.log('❌ SOME TABLES NEED ATTENTION');
      console.log('\nRun: npm run add-uuid-defaults to fix missing defaults');
    }
    console.log('═'.repeat(60));

    connection.release();
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAllAutoUUID();

