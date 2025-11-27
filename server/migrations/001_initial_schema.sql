-- Migration: 001_initial_schema.sql
-- Description: Initial database schema with roles, users, and authentication tables
-- Created: 2024

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  role_id CHAR(36) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_permission (role_id, permission),
  INDEX idx_role (role_id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
);

-- Create otp_codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_code (email, code),
  INDEX idx_expires (expires_at)
);

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_email (email)
);

-- Insert default roles
INSERT IGNORE INTO roles (name, display_name, description, is_system_role) VALUES
  ('admin', 'Administrator', 'Full system access and management', TRUE),
  ('learner', 'Learner', 'Access to learning content and courses', TRUE),
  ('instructor', 'Instructor', 'Can create and manage courses', TRUE),
  ('auditor', 'Auditor', 'Read-only access for auditing and reporting', TRUE);

