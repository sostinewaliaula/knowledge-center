import { User } from '../models/User.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const resetAdminPassword = async () => {
  try {
    console.log('\n🔐 Reset Admin Password\n');
    console.log('═══════════════════════════════════════\n');
    
    const email = await question('Enter admin email (default: admin@caavagroup.com): ') || 'admin@caavagroup.com';
    
    // Check if admin exists
    const admin = await User.findByEmail(email);
    if (!admin) {
      console.log('❌ Admin user not found');
      rl.close();
      process.exit(1);
    }
    
    if (admin.role_name !== 'admin') {
      console.log(`❌ User ${email} is not an admin (role: ${admin.role_name})`);
      rl.close();
      process.exit(1);
    }
    
    const newPassword = await question('Enter new password (min 8 characters): ');
    if (!newPassword || newPassword.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      rl.close();
      process.exit(1);
    }
    
    // Update password
    await User.update(admin.id, { password: newPassword });
    
    console.log('\n✅ Password reset successfully!');
    console.log('═══════════════════════════════════════\n');
    console.log('Admin Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${newPassword}\n`);
    console.log('You can now login with these credentials.\n');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

resetAdminPassword();
