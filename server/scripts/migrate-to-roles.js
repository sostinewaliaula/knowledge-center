import pool from '../config/database.js';

async function migrateToRoles() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database');
    console.log('Starting migration to role-based system...');

    // Drop old tables if they exist (in reverse order due to foreign keys)
    console.log('Dropping old tables...');
    await connection.query('DROP TABLE IF EXISTS password_resets');
    await connection.query('DROP TABLE IF EXISTS otp_codes');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS role_permissions');
    await connection.query('DROP TABLE IF EXISTS roles');

    // Create roles table
    console.log('Creating roles table...');
    await connection.query(`
      CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        is_system_role BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      )
    `);

    // Create role_permissions table
    console.log('Creating role_permissions table...');
    await connection.query(`
      CREATE TABLE role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE KEY unique_role_permission (role_id, permission),
        INDEX idx_role (role_id)
      )
    `);

    // Create users table with role_id
    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        INDEX idx_email (email),
        INDEX idx_role (role_id)
      )
    `);

    // Create otp_codes table
    console.log('Creating otp_codes table...');
    await connection.query(`
      CREATE TABLE otp_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email_code (email, code),
        INDEX idx_expires (expires_at)
      )
    `);

    // Create password_resets table
    console.log('Creating password_resets table...');
    await connection.query(`
      CREATE TABLE password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_email (email)
      )
    `);

    // Insert default roles
    console.log('Inserting default roles...');
    const defaultRoles = [
      { name: 'admin', display_name: 'Administrator', description: 'Full system access and management', is_system_role: true },
      { name: 'learner', display_name: 'Learner', description: 'Access to learning content and courses', is_system_role: true },
      { name: 'instructor', display_name: 'Instructor', description: 'Can create and manage courses', is_system_role: true },
      { name: 'auditor', display_name: 'Auditor', description: 'Read-only access for auditing and reporting', is_system_role: true }
    ];

    for (const role of defaultRoles) {
      await connection.query(
        `INSERT INTO roles (name, display_name, description, is_system_role) VALUES (?, ?, ?, ?)`,
        [role.name, role.display_name, role.description, role.is_system_role]
      );
      console.log(`  ✓ Created role: ${role.display_name}`);
    }

    console.log('✅ Migration completed successfully!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateToRoles();

