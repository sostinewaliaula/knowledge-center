-- Migration: Add content_tags and learning_path_tags tables
-- This enables tag assignment to content items and learning paths

-- Content Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS content_tags (
  content_id CHAR(36),
  tag_id CHAR(36),
  PRIMARY KEY (content_id, tag_id),
  FOREIGN KEY (content_id) REFERENCES content_library(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_content (content_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Learning Path Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS learning_path_tags (
  learning_path_id CHAR(36),
  tag_id CHAR(36),
  PRIMARY KEY (learning_path_id, tag_id),
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_learning_path (learning_path_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

