-- Migration: Create permissions and role_permissions tables

CREATE TABLE IF NOT EXISTS permissions (
  id CHAR(36) NOT NULL DEFAULT (uuid()) PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default permissions
INSERT INTO permissions (`key`, name, description, category)
VALUES
  ('courses.view', 'View Courses', 'View course content', 'Course Management'),
  ('courses.create', 'Create Courses', 'Create new courses', 'Course Management'),
  ('courses.edit', 'Edit Courses', 'Edit existing courses', 'Course Management'),
  ('courses.delete', 'Delete Courses', 'Delete courses', 'Course Management'),
  ('users.view', 'View Users', 'View user list', 'User Management'),
  ('users.create', 'Create Users', 'Invite or add users', 'User Management'),
  ('users.edit', 'Edit Users', 'Modify user profiles', 'User Management'),
  ('users.delete', 'Delete Users', 'Remove users', 'User Management'),
  ('analytics.view', 'View Analytics', 'Access dashboards and analytics', 'Analytics'),
  ('analytics.export', 'Export Reports', 'Export analytics reports', 'Analytics');

-- Assign default permissions to existing roles if they exist
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.name = 'admin';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.name = 'instructor'
  AND p.`key` IN ('courses.view', 'courses.create', 'courses.edit');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.name = 'learner'
  AND p.`key` IN ('courses.view', 'analytics.view');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.name = 'content_manager'
  AND p.`key` IN ('courses.view', 'courses.edit', 'analytics.view');


