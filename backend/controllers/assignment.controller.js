import { Assignment } from '../models/Assignment.js';

/**
 * Get all assignments
 */
export const getAssignments = async (req, res, next) => {
  try {
    const { page, limit, search, status, type } = req.query;
    const result = await Assignment.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      status || 'all',
      type || 'all'
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignment by ID
 */
export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    res.json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new assignment
 */
export const createAssignment = async (req, res, next) => {
  try {
    const {
      course_id,
      lesson_id,
      title,
      description,
      type,
      instructions,
      max_file_size_mb,
      allowed_file_types,
      due_date,
      max_score,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const assignment = await Assignment.create({
      course_id,
      lesson_id,
      title,
      description,
      type,
      instructions,
      max_file_size_mb,
      allowed_file_types,
      due_date,
      max_score,
      status,
      created_by: req.user?.id || null
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

/**
 * Update assignment
 */
export const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assignment = await Assignment.update(id, updates);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    res.json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete assignment
 */
export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Assignment.delete(id);
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignments by course ID
 */
export const getAssignmentsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.findByCourseId(courseId);
    res.json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignments by lesson ID
 */
export const getAssignmentsByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const assignments = await Assignment.findByLessonId(lessonId);
    res.json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};

