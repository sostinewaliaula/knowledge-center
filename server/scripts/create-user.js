import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    const name = await question('Enter name (optional): ') || null;
    const role = await question('Enter role (learner/admin, default: learner): ') || 'learner';

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );

    console.log('✅ User created successfully!');
    console.log(`User ID: ${result.insertId}`);
    rl.close();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('❌ Error: Email already exists');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
    rl.close();
    process.exit(1);
  }
}

createUser();

