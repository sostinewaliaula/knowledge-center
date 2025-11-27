import pool from '../config/database.js';

async function fixUserRoleIds() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database');
    console.log('Fixing user role_id values to use UUIDs...\n');

    // Check role_id column type
    const [roleIdCol] = await connection.query(`
      SELECT DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role_id'
    `);
    
    if (roleIdCol.length === 0) {
      console.log('❌ role_id column not found');
      process.exit(1);
    }
    
    const roleIdType = roleIdCol[0].DATA_TYPE;
    console.log(`Current role_id type: ${roleIdType}`);
    
    // Check if values are actually UUIDs or just strings
    const [sampleUsers] = await connection.query('SELECT role_id, LENGTH(role_id) as len FROM users LIMIT 1');
    const isUUID = sampleUsers.length > 0 && sampleUsers[0].len === 36;
    
    if (roleIdType === 'char' && isUUID) {
      console.log('✅ role_id already uses UUID (CHAR with 36-char values)');
      process.exit(0);
    }
    
    if (roleIdType === 'char' && !isUUID) {
      console.log('⚠️  role_id is CHAR but values are not UUIDs - will convert values');
    }
    
    // Get all roles with their UUIDs
    const [roles] = await connection.query('SELECT id, name FROM roles');
    const roleNameToId = new Map();
    roles.forEach(r => roleNameToId.set(r.name, r.id));
    
    console.log('Role mappings:');
    roles.forEach(r => console.log(`  ${r.name}: ${r.id}`));
    console.log();
    
    // Mapping from INT to role name (typical order)
    const intToRoleName = {
      '1': 'admin',
      '2': 'learner',
      '3': 'instructor',
      '4': 'auditor'
    };
    
    // Get all users
    const [users] = await connection.query('SELECT id, email, role_id FROM users');
    console.log(`Found ${users.length} users to update\n`);
    
    // Update each user's role_id
    let updated = 0;
    for (const user of users) {
      const roleIdStr = String(user.role_id);
      const roleName = intToRoleName[roleIdStr];
      
      if (roleName && roleNameToId.has(roleName)) {
        const newRoleId = roleNameToId.get(roleName);
        await connection.query(
          'UPDATE users SET role_id = ? WHERE id = ?',
          [newRoleId, user.id]
        );
        console.log(`✓ Updated ${user.email}: role_id ${user.role_id} -> ${newRoleId} (${roleName})`);
        updated++;
      } else {
        console.log(`⚠️  Could not map role_id ${user.role_id} for user ${user.email}`);
      }
    }
    
    // Now alter the column type to CHAR(36)
    console.log('\nAltering role_id column to CHAR(36)...');
    await connection.query('ALTER TABLE users MODIFY COLUMN role_id CHAR(36) NOT NULL');
    console.log('✅ Column type updated to CHAR(36)');
    
    // Re-add foreign key constraint
    console.log('Re-adding foreign key constraint...');
    try {
      await connection.query('ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id)');
      console.log('✅ Foreign key constraint added');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Foreign key constraint already exists');
      } else {
        throw e;
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated} users`);
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserRoleIds();

