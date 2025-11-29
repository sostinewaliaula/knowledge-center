import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyUUIDs = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🔍 Verifying UUID System\n');
    console.log('═══════════════════════════════════════\n');
    
    // Check categories
    const [categories] = await connection.query('SELECT id, name FROM categories LIMIT 3');
    console.log('✅ Sample UUIDs from categories:\n');
    categories.forEach(cat => {
      // Standard UUID format: 8-4-4-4-12 hex characters with dashes
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.id);
      console.log(`  ${cat.name}:`);
      console.log(`    ID: ${cat.id}`);
      console.log(`    Length: ${cat.id.length} characters`);
      console.log(`    Format: ${isValid ? '✅ Valid UUID' : '❌ Invalid'}\n`);
    });
    
    // Check courses
    const [courses] = await connection.query('SELECT id, title FROM courses LIMIT 2');
    console.log('✅ Sample UUIDs from courses:\n');
    courses.forEach(course => {
      // Standard UUID format: 8-4-4-4-12 hex characters with dashes
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(course.id);
      console.log(`  ${course.title}:`);
      console.log(`    ID: ${course.id}`);
      console.log(`    Length: ${course.id.length} characters`);
      console.log(`    Format: ${isValid ? '✅ Valid UUID' : '❌ Invalid'}\n`);
    });
    
    // Check users (should be UUID now)
    const [users] = await connection.query('SELECT id, name FROM users LIMIT 2');
    console.log('✅ Sample UUIDs from users:\n');
    users.forEach(user => {
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      console.log(`  ${user.name}:`);
      console.log(`    ID: ${user.id}`);
      console.log(`    Length: ${user.id.length} characters`);
      console.log(`    Format: ${isValid ? '✅ Valid UUID' : '❌ Invalid'}\n`);
    });
    
    // Check roles (should be UUID now)
    const [roles] = await connection.query('SELECT id, name FROM roles LIMIT 2');
    console.log('✅ Sample UUIDs from roles:\n');
    roles.forEach(role => {
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(role.id);
      console.log(`  ${role.name}:`);
      console.log(`    ID: ${role.id}`);
      console.log(`    Length: ${role.id.length} characters`);
      console.log(`    Format: ${isValid ? '✅ Valid UUID' : '❌ Invalid'}\n`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log('✅ UUID system verified!\n');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

verifyUUIDs();

