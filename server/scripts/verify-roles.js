import pool from '../config/database.js';

async function verifyRoles() {
  try {
    const [roles] = await pool.query('SELECT * FROM roles ORDER BY id');
    console.log('\n✅ Roles in database:');
    console.log('─'.repeat(60));
    roles.forEach(r => {
      console.log(`  ${r.id}. ${r.name.padEnd(12)} | ${r.display_name.padEnd(20)} | System: ${r.is_system_role ? 'Yes' : 'No'}`);
    });
    console.log('─'.repeat(60));
    console.log(`Total: ${roles.length} roles\n`);
    
    const [users] = await pool.query(`
      SELECT u.id, u.email, u.name, r.name as role_name, r.display_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id
    `);
    
    if (users.length > 0) {
      console.log('✅ Users in database:');
      console.log('─'.repeat(60));
      users.forEach(u => {
        console.log(`  ${u.id}. ${u.email.padEnd(25)} | ${u.name || 'N/A'.padEnd(15)} | ${u.display_name}`);
      });
      console.log('─'.repeat(60));
      console.log(`Total: ${users.length} users\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyRoles();

