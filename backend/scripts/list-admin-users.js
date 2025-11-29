import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const listAdminUsers = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n👤 Admin Users\n');
    console.log('═══════════════════════════════════════\n');
    
    const [users] = await connection.query(`
      SELECT u.email, u.name, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'admin'
      ORDER BY u.email
    `);
    
    if (users.length === 0) {
      console.log('❌ No admin users found in the database.\n');
      console.log('To create an admin user, run:');
      console.log('  node scripts/create-user.js\n');
    } else {
      console.log('Admin Users:\n');
      users.forEach((u, index) => {
        console.log(`${index + 1}. ${u.name}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role_name}\n`);
      });
      
      console.log('═══════════════════════════════════════\n');
      console.log('⚠️  Note: The password is hashed in the database.');
      console.log('To reset the password, you can:');
      console.log('  1. Use the forgot password feature');
      console.log('  2. Create a new admin user with known password');
      console.log('  3. Or use a script to reset the password\n');
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

listAdminUsers();

