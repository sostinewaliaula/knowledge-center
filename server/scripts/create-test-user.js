import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    const email = 'test@caavagroup.com';
    const password = 'Test1234';
    const name = 'Test User';
    const roleName = 'learner';

    // Get role_id for learner
    const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
    if (roles.length === 0) {
      console.error('❌ Error: Role "learner" not found. Please run init-db.js first.');
      process.exit(1);
    }
    const roleId = roles[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
          'INSERT INTO users (email, password, name, role_id) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, name, roleId]
        );

        // Get the auto-generated ID
        const [newUser] = await pool.query('SELECT id FROM users WHERE email = ? ORDER BY created_at DESC LIMIT 1', [email]);

        console.log('✅ Test user created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`User ID: ${newUser[0].id}`);
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Test user already exists');
      console.log('Email: test@caavagroup.com');
      console.log('Password: Test1234');
    } else {
      console.error('❌ Error creating test user:', error.message);
    }
    process.exit(1);
  }
}

createTestUser();

