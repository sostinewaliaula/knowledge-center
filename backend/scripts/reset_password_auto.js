import { User } from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetPassword = async () => {
    try {
        const email = 'admin@knowledgecenter.com';
        const password = 'password123';

        console.log(`Attempting to reset password for ${email}...`);
        let user = await User.findByEmail(email);

        if (!user) {
            console.log(`User ${email} not found. Trying admin@caavagroup.com...`);
            user = await User.findByEmail('admin@caavagroup.com');
        }

        if (!user) {
            console.error('No admin user found!');
            process.exit(1);
        }

        await User.update(user.id, { password });
        console.log(`Password reset successfully for ${user.email} to '${password}'`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
