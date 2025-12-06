import { User } from '../models/User.js';
import { queryOne } from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        const email = 'verify_admin@test.com';
        const password = 'password123';
        const name = 'Verify Admin';

        console.log(`Creating/Updating admin ${email}...`);

        // Find admin role
        const role = await queryOne(`SELECT id FROM roles WHERE name = 'admin'`);
        if (!role) {
            console.error('Admin role not found!');
            process.exit(1);
        }

        let user = await User.findByEmail(email);
        if (user) {
            console.log('User exists, updating password...');
            await User.update(user.id, { password, role_id: role.id });
        } else {
            console.log('Creating new user...');
            await User.create({ email, password, name, role_id: role.id });
        }

        console.log(`Admin user ${email} ready with password '${password}'`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
