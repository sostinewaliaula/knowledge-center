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
    const roleName = await question('Enter role name (admin/learner/instructor/auditor, default: learner): ') || 'learner';

    // Get role_id
    const [roles] = await pool.query('SELECT id, display_name FROM roles WHERE name = ?', [roleName]);
    if (roles.length === 0) {
      console.error(`❌ Error: Role "${roleName}" not found.`);
      console.log('Available roles:');
      const [allRoles] = await pool.query('SELECT name, display_name FROM roles');
      allRoles.forEach(r => console.log(`  - ${r.name} (${r.display_name})`));
      rl.close();
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

        console.log('✅ User created successfully!');
        console.log(`User ID: ${newUser[0].id}`);
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

