-- Create learning_path_assignments table
CREATE TABLE IF NOT EXISTS learning_path_assignments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  learning_path_id CHAR(36) NOT NULL,
  group_id CHAR(36),
  user_id CHAR(36),
  assigned_by CHAR(36) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NULL,
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
