import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const setDefaultAdminPassword = async () => {
  try {
    console.log('\n🔐 Setting Default Admin Password\n');
    console.log('═══════════════════════════════════════\n');
    
    const email = 'admin@caavagroup.com';
    const defaultPassword = 'admin123';
    
    // Check if admin exists
    const admin = await User.findByEmail(email);
    if (!admin) {
      console.log('❌ Admin user not found. Please run migrations first.');
      process.exit(1);
    }
    
    if (admin.role_name !== 'admin') {
      console.log(`❌ User ${email} is not an admin (role: ${admin.role_name})`);
      process.exit(1);
    }
    
    // Update password
    await User.update(admin.id, { password: defaultPassword });
    
    console.log('✅ Default admin password set successfully!');
    console.log('═══════════════════════════════════════\n');
    console.log('Admin Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${defaultPassword}\n`);
    console.log('⚠️  WARNING: This is a default password.');
    console.log('   Please change it for production use!\n');
    console.log('You can now login at: http://localhost:5173/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

setDefaultAdminPassword();

