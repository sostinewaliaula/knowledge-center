import pool from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
    try {
        const sqlPath = path.join(__dirname, 'migrations', '021_create_system_settings_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to handle multiple statements if needed, 
        // but the migration file has multiple statements (CREATE and INSERT).
        // The pool.query might not support multiple statements unless configured.
        // Let's try splitting.

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} statements to execute.`);

        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 50) + '...');
            await pool.query(statement);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        pool.end();
    }
};

runMigration();
