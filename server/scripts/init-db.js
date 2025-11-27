import pool from '../config/database.js';

async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database');

    // Check if roles table exists
    const [roleTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'roles'
    `);

    if (roleTables.length === 0) {
      // Create roles table with UUID
      await connection.query(`
        CREATE TABLE roles (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          name VARCHAR(50) UNIQUE NOT NULL,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          is_system_role BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_name (name)
        )
      `);
      console.log('✅ Created roles table');
    } else {
      console.log('ℹ️  Roles table already exists');
    }

    // Check if role_permissions table exists
    const [permTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'role_permissions'
    `);

    if (permTables.length === 0) {
      // Create role_permissions table for future permission management
      await connection.query(`
        CREATE TABLE role_permissions (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          role_id CHAR(36) NOT NULL,
          permission VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          UNIQUE KEY unique_role_permission (role_id, permission),
          INDEX idx_role (role_id)
        )
      `);
      console.log('✅ Created role_permissions table');
    } else {
      console.log('ℹ️  Role_permissions table already exists');
    }

    // Check if users table exists
    const [userTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);

    if (userTables.length === 0) {
      // Create users table with role_id reference
      await connection.query(`
        CREATE TABLE users (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role_id CHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id),
          INDEX idx_email (email),
          INDEX idx_role (role_id)
        )
      `);
      console.log('✅ Created users table');
    } else {
      // Check if users table needs migration
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('role', 'role_id')
      `);
      
      const hasRole = columns.some(c => c.COLUMN_NAME === 'role');
      const hasRoleId = columns.some(c => c.COLUMN_NAME === 'role_id');
      
      if (hasRole && !hasRoleId) {
        console.log('⚠️  Users table has old schema. Please run migrate-roles-safe.js to migrate.');
      } else {
        console.log('ℹ️  Users table already exists');
      }
    }

    // Create otp_codes table
    const [otpTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'otp_codes'
    `);
    
    if (otpTables.length === 0) {
      await connection.query(`
        CREATE TABLE otp_codes (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          email VARCHAR(255) NOT NULL,
          code VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_email_code (email, code),
          INDEX idx_expires (expires_at)
        )
      `);
      console.log('✅ Created otp_codes table');
    }

    // Create password_resets table
    const [resetTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'password_resets'
    `);
    
    if (resetTables.length === 0) {
      await connection.query(`
        CREATE TABLE password_resets (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_token (token),
          INDEX idx_email (email)
        )
      `);
      console.log('✅ Created password_resets table');
    }

    // Insert default roles
    const defaultRoles = [
      { name: 'admin', display_name: 'Administrator', description: 'Full system access and management', is_system_role: true },
      { name: 'learner', display_name: 'Learner', description: 'Access to learning content and courses', is_system_role: true },
      { name: 'instructor', display_name: 'Instructor', description: 'Can create and manage courses', is_system_role: true },
      { name: 'auditor', display_name: 'Auditor', description: 'Read-only access for auditing and reporting', is_system_role: true }
    ];

    for (const role of defaultRoles) {
      await connection.query(
        `INSERT IGNORE INTO roles (name, display_name, description, is_system_role) VALUES (?, ?, ?, ?)`,
        [role.name, role.display_name, role.description, role.is_system_role]
      );
    }

    console.log('✅ Default roles created');
    console.log('✅ Database tables initialized successfully');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

