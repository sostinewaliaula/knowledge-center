import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    const email = 'test@caavagroup.com';
    const password = 'Test1234';
    const name = 'Test User';
    const role = 'learner';

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );

    console.log('✅ Test user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${result.insertId}`);
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

