import readline from 'readline';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { sendWelcomeEmail } from '../utils/email.js';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createUser = async () => {
  try {
    console.log('\n👤 Create New User\n');
    console.log('═══════════════════════════════════════\n');

    const email = await question('Email: ');
    if (!email) {
      console.log('❌ Email is required');
      rl.close();
      return;
    }

    // Check if user already exists
    const existing = await User.findByEmail(email);
    if (existing) {
      console.log('❌ User with this email already exists');
      rl.close();
      return;
    }

    const name = await question('Name (optional): ');
    const password = await question('Password: ');
    
    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      rl.close();
      return;
    }

    // Get available roles
    const roles = await Role.findAll();
    console.log('\nAvailable roles:');
    roles.forEach((role, index) => {
      console.log(`${index + 1}. ${role.display_name} (${role.name})`);
    });

    const roleChoice = await question('\nSelect role number (default: learner): ');
    let roleId = null;

    if (roleChoice) {
      const selectedRole = roles[parseInt(roleChoice) - 1];
      if (selectedRole) {
        roleId = selectedRole.id;
      }
    }

    // Default to learner role if no selection
    if (!roleId) {
      const learnerRole = await Role.findByName('learner');
      roleId = learnerRole ? learnerRole.id : null;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name: name || null,
      role_id: roleId
    });

    console.log('\n✅ User created successfully!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Role: ${user.role_display_name || 'N/A'}\n`);

    // Send welcome email (optional, won't fail if email not configured)
    try {
      await sendWelcomeEmail(email, name || email);
    } catch (error) {
      // Ignore email errors
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    rl.close();
    process.exit(1);
  }
};

createUser();

