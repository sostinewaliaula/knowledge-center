import pool from '../config/database.js';

async function migrateToRolesSafe() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database');
    console.log('Starting safe migration to role-based system...');

    // Check if roles table exists
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'roles'
    `);

    // Create roles table if it doesn't exist
    if (tables.length === 0) {
      console.log('Creating roles table...');
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
    } else {
      console.log('Roles table already exists, checking if migration needed...');
      // Check if roles table uses INT id
      const [roleColumns] = await connection.query(`
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'roles' 
        AND COLUMN_NAME = 'id'
      `);
      
      if (roleColumns.length > 0 && roleColumns[0].DATA_TYPE === 'int') {
        console.log('⚠️  Roles table uses INT id. Migration to UUID needed.');
        console.log('   This requires data migration. Please backup your data first.');
        // For now, we'll skip auto-migration and let user handle it
      }
    }

    // Check if role_permissions table exists
    const [permTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'role_permissions'
    `);

    if (permTables.length === 0) {
      console.log('Creating role_permissions table...');
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
    } else {
      console.log('Role_permissions table already exists, skipping creation...');
    }

    // Check if users table exists and has old schema
    const [userTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);

    if (userTables.length > 0) {
      // Check if users table has old 'role' column
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'role'
      `);

      if (columns.length > 0) {
        console.log('Migrating users table from old schema...');
        
        // Get learner role_id (default)
        const [learnerRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['learner']);
        const defaultRoleId = learnerRole.length > 0 ? learnerRole[0].id : null;

        if (!defaultRoleId) {
          throw new Error('Learner role not found. Please create default roles first.');
        }

        // Add role_id column if it doesn't exist
        const [roleIdColumn] = await connection.query(`
          SELECT COLUMN_NAME 
          FROM information_schema.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'users' 
          AND COLUMN_NAME = 'role_id'
        `);

        if (roleIdColumn.length === 0) {
          console.log('Adding role_id column to users table...');
          // Check roles table id type to match
          const [roleIdType] = await connection.query(`
            SELECT DATA_TYPE 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'roles' 
            AND COLUMN_NAME = 'id'
          `);
          const idType = roleIdType.length > 0 && roleIdType[0].DATA_TYPE === 'char' ? 'CHAR(36)' : 'INT';
          
          await connection.query(`ALTER TABLE users ADD COLUMN role_id ${idType}`);
          
          // Migrate existing role data to role_id
          console.log('Migrating existing role data...');
          const [users] = await connection.query('SELECT id, role FROM users');
          
          for (const user of users) {
            const [role] = await connection.query('SELECT id FROM roles WHERE name = ?', [user.role || 'learner']);
            const roleId = role.length > 0 ? role[0].id : defaultRoleId;
            await connection.query('UPDATE users SET role_id = ? WHERE id = ?', [roleId, user.id]);
          }
          
          // Make role_id NOT NULL and add foreign key
          console.log('Setting up role_id constraints...');
          await connection.query(`ALTER TABLE users MODIFY COLUMN role_id ${idType} NOT NULL`);
          await connection.query('ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id)');
          await connection.query('ALTER TABLE users ADD INDEX idx_role (role_id)');
          
          // Remove old role column
          console.log('Removing old role column...');
          await connection.query('ALTER TABLE users DROP COLUMN role');
        } else {
          console.log('Users table already migrated, skipping...');
        }
      } else {
        console.log('Users table already has role_id, skipping migration...');
      }
    } else {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
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
    }

    // Create otp_codes table if it doesn't exist
    const [otpTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'otp_codes'
    `);

    if (otpTables.length === 0) {
      console.log('Creating otp_codes table...');
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
    } else {
      console.log('Otp_codes table already exists, skipping creation...');
    }

    // Create password_resets table if it doesn't exist
    const [resetTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'password_resets'
    `);

    if (resetTables.length === 0) {
      console.log('Creating password_resets table...');
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
    } else {
      console.log('Password_resets table already exists, skipping creation...');
    }

    // Insert default roles (only if they don't exist)
    console.log('Ensuring default roles exist...');
    const defaultRoles = [
      { name: 'admin', display_name: 'Administrator', description: 'Full system access and management', is_system_role: true },
      { name: 'learner', display_name: 'Learner', description: 'Access to learning content and courses', is_system_role: true },
      { name: 'instructor', display_name: 'Instructor', description: 'Can create and manage courses', is_system_role: true },
      { name: 'auditor', display_name: 'Auditor', description: 'Read-only access for auditing and reporting', is_system_role: true }
    ];

    for (const role of defaultRoles) {
      const [existing] = await connection.query('SELECT id FROM roles WHERE name = ?', [role.name]);
      if (existing.length === 0) {
        await connection.query(
          `INSERT INTO roles (name, display_name, description, is_system_role) VALUES (?, ?, ?, ?)`,
          [role.name, role.display_name, role.description, role.is_system_role]
        );
        console.log(`  ✓ Created role: ${role.display_name}`);
      } else {
        console.log(`  ℹ️  Role already exists: ${role.display_name}`);
      }
    }

    console.log('✅ Safe migration completed successfully!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateToRolesSafe();

