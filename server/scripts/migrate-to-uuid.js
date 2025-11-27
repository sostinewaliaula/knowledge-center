import pool from '../config/database.js';
import { randomUUID } from 'crypto';

async function migrateToUUID() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database');
    console.log('Starting migration to UUID-based IDs...');
    console.log('⚠️  WARNING: This will convert all INT IDs to UUIDs. Backup your data first!');

    // Check MariaDB/MySQL version for UUID() support
    const [version] = await connection.query('SELECT VERSION() as version');
    const versionStr = version[0].version;
    const majorVersion = parseInt(versionStr.split('.')[0]);
    const minorVersion = parseInt(versionStr.split('.')[1]);
    
    console.log(`Database version: ${versionStr}`);
    
    // MariaDB 10.7+ or MySQL 8.0+ supports UUID() as default
    const supportsUUIDDefault = (versionStr.includes('MariaDB') && majorVersion >= 10 && minorVersion >= 7) || 
                                (!versionStr.includes('MariaDB') && majorVersion >= 8);
    
    if (!supportsUUIDDefault) {
      console.log('⚠️  Your database version may not support UUID() as default.');
      console.log('   We will use application-generated UUIDs instead.');
    }

    // Helper function to generate UUID
    const generateUUID = () => randomUUID();

    // Migrate roles table
    console.log('\n1. Migrating roles table...');
    const [roleColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'roles' 
      AND COLUMN_NAME = 'id'
    `);

    if (roleColumns.length > 0 && roleColumns[0].DATA_TYPE === 'int') {
      // Clean up any leftover temporary tables
      await connection.query('DROP TABLE IF EXISTS roles_new');
      await connection.query('DROP TABLE IF EXISTS users_new');
      await connection.query('DROP TABLE IF EXISTS role_permissions_new');
      await connection.query('DROP TABLE IF EXISTS otp_codes_new');
      await connection.query('DROP TABLE IF EXISTS password_resets_new');
      
      // Create new table with UUID
      await connection.query(`
        CREATE TABLE roles_new (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          is_system_role BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_name (name)
        )
      `);

      // Migrate data
      const [roles] = await connection.query('SELECT * FROM roles');
      const roleIdMap = new Map();
      
      for (const role of roles) {
        const newId = generateUUID();
        roleIdMap.set(role.id, newId);
        await connection.query(
          `INSERT INTO roles_new (id, name, display_name, description, is_system_role, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newId, role.name, role.display_name, role.description, role.is_system_role, role.created_at, role.updated_at]
        );
      }

      // Drop foreign key constraints first
      try {
        await connection.query('ALTER TABLE role_permissions DROP FOREIGN KEY role_permissions_ibfk_1');
      } catch (e) {
        // Constraint might have different name, try to find it
        const [constraints] = await connection.query(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'role_permissions' 
          AND REFERENCED_TABLE_NAME = 'roles'
        `);
        if (constraints.length > 0) {
          await connection.query(`ALTER TABLE role_permissions DROP FOREIGN KEY ${constraints[0].CONSTRAINT_NAME}`);
        }
      }
      
      try {
        await connection.query('ALTER TABLE users DROP FOREIGN KEY users_ibfk_1');
      } catch (e) {
        const [constraints] = await connection.query(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'users' 
          AND REFERENCED_TABLE_NAME = 'roles'
        `);
        if (constraints.length > 0) {
          await connection.query(`ALTER TABLE users DROP FOREIGN KEY ${constraints[0].CONSTRAINT_NAME}`);
        }
      }
      
      // Drop old and rename new
      await connection.query('DROP TABLE roles');
      await connection.query('RENAME TABLE roles_new TO roles');
      
      console.log(`   ✓ Migrated ${roles.length} roles`);
      console.log('   ⚠️  Note: Foreign keys will be re-added after all tables are migrated');
    } else {
      console.log('   ℹ️  Roles table already uses UUID');
    }

    // Migrate users table
    console.log('\n2. Migrating users table...');
    const [userColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'id'
    `);

    if (userColumns.length > 0 && userColumns[0].DATA_TYPE === 'int') {
      // Get role_id type
      const [roleIdCol] = await connection.query(`
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'role_id'
      `);
      
      const roleIdType = roleIdCol.length > 0 && roleIdCol[0].DATA_TYPE === 'char' ? 'CHAR(36)' : 'INT';

      // Create new table
      await connection.query(`
        CREATE TABLE users_new (
          id CHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role_id CHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role_id)
        )
      `);

      // Get all roles to map old INT IDs to new UUIDs
      const [allRoles] = await connection.query('SELECT id, name FROM roles ORDER BY name');
      
      // Check if roles table uses UUID or INT (already checked above, reuse the result)
      const rolesUseUUID = true; // Roles already migrated to UUID
      
      // Create mapping: if roles use UUID, we need to map by name; if INT, map by ID
      const roleNameToId = new Map();
      allRoles.forEach(r => roleNameToId.set(r.name, r.id));

      // Create mapping from INT role_id to UUID role_id
      // Typical order: 1=admin, 2=learner, 3=instructor, 4=auditor
      const roleMapping = {
        '1': 'admin',
        '2': 'learner', 
        '3': 'instructor',
        '4': 'auditor'
      };
      
      // Migrate users
      const [users] = await connection.query('SELECT * FROM users');
      for (const user of users) {
        const newId = userIdIsInt ? generateUUID() : user.id;
        let newRoleId = user.role_id;
        
        // Check if role_id is a number (INT) or string that looks like an INT
        const roleIdStr = String(user.role_id);
        const isIntRoleId = /^\d+$/.test(roleIdStr);
        
        if (isIntRoleId && rolesUseUUID) {
          // User has INT role_id but roles table uses UUID
          // Map INT to role name, then find UUID
          const roleName = roleMapping[roleIdStr];
          if (roleName) {
            const [matchingRole] = await connection.query('SELECT id FROM roles WHERE name = ?', [roleName]);
            if (matchingRole.length > 0) {
              newRoleId = matchingRole[0].id;
            } else {
              // Fallback to learner if role not found
              const [learnerRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['learner']);
              newRoleId = learnerRole.length > 0 ? learnerRole[0].id : allRoles[0].id;
              console.log(`   ⚠️  Role ${roleName} not found for user ${user.email}, using learner`);
            }
          } else {
            // Unknown role_id, default to learner
            const [learnerRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['learner']);
            newRoleId = learnerRole.length > 0 ? learnerRole[0].id : allRoles[0].id;
            console.log(`   ⚠️  Unknown role_id ${roleIdStr} for user ${user.email}, using learner`);
          }
        } else if (typeof user.role_id === 'string' && user.role_id.length === 36) {
          // Already a UUID, keep it
          newRoleId = user.role_id;
        } else if (typeof user.role_id === 'number' && !rolesUseUUID) {
          // Both use INT - keep the same
          newRoleId = user.role_id;
        }
        
        await connection.query(
          `INSERT INTO users_new (id, email, password, name, role_id, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newId, user.email, user.password, user.name, newRoleId, user.created_at, user.updated_at]
        );
      }

      await connection.query('DROP TABLE users');
      await connection.query('RENAME TABLE users_new TO users');
      await connection.query('ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id)');
      console.log(`   ✓ Migrated ${users.length} users`);
    } else {
      console.log('   ℹ️  Users table already uses UUID');
    }

    // Migrate role_permissions table
    console.log('\n3. Migrating role_permissions table...');
    const [permColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'role_permissions' 
      AND COLUMN_NAME = 'id'
    `);

    if (permColumns.length > 0 && permColumns[0].DATA_TYPE === 'int') {
      await connection.query(`
        CREATE TABLE role_permissions_new (
          id CHAR(36) PRIMARY KEY,
          role_id CHAR(36) NOT NULL,
          permission VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_role_permission (role_id, permission),
          INDEX idx_role (role_id)
        )
      `);

      const [perms] = await connection.query('SELECT * FROM role_permissions');
      for (const perm of perms) {
        const newId = generateUUID();
        await connection.query(
          `INSERT INTO role_permissions_new (id, role_id, permission, created_at) 
           VALUES (?, ?, ?, ?)`,
          [newId, perm.role_id, perm.permission, perm.created_at]
        );
      }

      // Drop foreign key if exists
      try {
        await connection.query('ALTER TABLE role_permissions DROP FOREIGN KEY role_permissions_ibfk_1');
      } catch (e) {
        const [constraints] = await connection.query(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'role_permissions' 
          AND REFERENCED_TABLE_NAME = 'roles'
        `);
        if (constraints.length > 0) {
          await connection.query(`ALTER TABLE role_permissions DROP FOREIGN KEY ${constraints[0].CONSTRAINT_NAME}`);
        }
      }
      
      await connection.query('DROP TABLE role_permissions');
      await connection.query('RENAME TABLE role_permissions_new TO role_permissions');
      await connection.query('ALTER TABLE role_permissions ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE');
      console.log(`   ✓ Migrated ${perms.length} permissions`);
    } else {
      console.log('   ℹ️  Role_permissions table already uses UUID');
    }

    // Migrate otp_codes table
    console.log('\n4. Migrating otp_codes table...');
    const [otpColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'otp_codes' 
      AND COLUMN_NAME = 'id'
    `);

    if (otpColumns.length > 0 && otpColumns[0].DATA_TYPE === 'int') {
      await connection.query(`
        CREATE TABLE otp_codes_new (
          id CHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          code VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_email_code (email, code),
          INDEX idx_expires (expires_at)
        )
      `);

      const [otps] = await connection.query('SELECT * FROM otp_codes');
      for (const otp of otps) {
        const newId = generateUUID();
        await connection.query(
          `INSERT INTO otp_codes_new (id, email, code, expires_at, used, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newId, otp.email, otp.code, otp.expires_at, otp.used, otp.created_at]
        );
      }

      await connection.query('DROP TABLE otp_codes');
      await connection.query('RENAME TABLE otp_codes_new TO otp_codes');
      console.log(`   ✓ Migrated ${otps.length} OTP codes`);
    } else {
      console.log('   ℹ️  Otp_codes table already uses UUID');
    }

    // Migrate password_resets table
    console.log('\n5. Migrating password_resets table...');
    const [resetColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'password_resets' 
      AND COLUMN_NAME = 'id'
    `);

    if (resetColumns.length > 0 && resetColumns[0].DATA_TYPE === 'int') {
      await connection.query(`
        CREATE TABLE password_resets_new (
          id CHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_token (token),
          INDEX idx_email (email)
        )
      `);

      const [resets] = await connection.query('SELECT * FROM password_resets');
      for (const reset of resets) {
        const newId = generateUUID();
        await connection.query(
          `INSERT INTO password_resets_new (id, email, token, expires_at, used, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newId, reset.email, reset.token, reset.expires_at, reset.used, reset.created_at]
        );
      }

      await connection.query('DROP TABLE password_resets');
      await connection.query('RENAME TABLE password_resets_new TO password_resets');
      console.log(`   ✓ Migrated ${resets.length} password resets`);
    } else {
      console.log('   ℹ️  Password_resets table already uses UUID');
    }

    console.log('\n✅ UUID migration completed successfully!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateToUUID();

