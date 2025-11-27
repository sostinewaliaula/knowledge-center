import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createAllRoleUsers() {
  try {
    const connection = await pool.getConnection();
    
    // Get all roles
    const [roles] = await connection.query('SELECT * FROM roles ORDER BY id');
    
    if (roles.length === 0) {
      console.error('❌ No roles found. Please run init-db.js first.');
      process.exit(1);
    }

    const users = [
      { email: 'admin@caavagroup.com', password: 'Admin1234', name: 'Admin User', roleName: 'admin' },
      { email: 'learner@caavagroup.com', password: 'Learner1234', name: 'Learner User', roleName: 'learner' },
      { email: 'instructor@caavagroup.com', password: 'Instructor1234', name: 'Instructor User', roleName: 'instructor' },
      { email: 'auditor@caavagroup.com', password: 'Auditor1234', name: 'Auditor User', roleName: 'auditor' }
    ];

    console.log('Creating users for all roles...\n');

    for (const userData of users) {
      try {
        // Find role
        const role = roles.find(r => r.name === userData.roleName);
        if (!role) {
          console.log(`⚠️  Role "${userData.roleName}" not found, skipping user: ${userData.email}`);
          continue;
        }

        // Check if user already exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [userData.email]);
        if (existing.length > 0) {
          console.log(`ℹ️  User already exists: ${userData.email} (${role.display_name})`);
          continue;
        }

        // Create user (id will be auto-generated)
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await connection.query(
          'INSERT INTO users (email, password, name, role_id) VALUES (?, ?, ?, ?)',
          [userData.email, hashedPassword, userData.name, role.id]
        );

        console.log(`✅ Created: ${userData.email} | Password: ${userData.password} | Role: ${role.display_name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    console.log('\n✅ User creation completed!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAllRoleUsers();

