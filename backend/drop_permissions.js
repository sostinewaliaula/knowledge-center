import pool from './config/database.js';

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
        await pool.query('DROP TABLE IF EXISTS role_permissions');
        await pool.query('DROP TABLE IF EXISTS permissions');
        console.log('Tables dropped.');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

dropTables();
