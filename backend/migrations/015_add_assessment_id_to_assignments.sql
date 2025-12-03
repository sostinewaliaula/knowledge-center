-- Migration: Add assessment_id to assignments for quiz-type linkage

ALTER TABLE assignments
ADD COLUMN assessment_id CHAR(36) NULL AFTER lesson_id,
ADD INDEX idx_assessment (assessment_id),
ADD CONSTRAINT fk_assignments_assessment
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
  ON DELETE SET NULL;


