import { LearningPath } from '../models/LearningPath.js';
import { Course } from '../models/Course.js';

/**
 * Learning Path Controllers
 */
export const getLearningPaths = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await LearningPath.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      status || 'all'
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getLearningPathById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const path = await LearningPath.findById(id);
    if (!path) {
      return res.status(404).json({ success: false, error: 'Learning path not found' });
    }

    // Fetch courses in the path
    const courses = await LearningPath.getCourses(id);

    res.json({ success: true, path: { ...path, courses } });
  } catch (error) {
    next(error);
  }
};

export const createLearningPath = async (req, res, next) => {
  try {
    const { title, description, category_id, thumbnail_url, status, is_featured, estimated_duration_hours } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    const path = await LearningPath.create({
      title,
      description,
      category_id,
      thumbnail_url,
      status,
      is_featured,
      estimated_duration_hours,
      created_by: req.user.id
    });
    res.status(201).json({ success: true, path });
  } catch (error) {
    next(error);
  }
};

export const updateLearningPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const path = await LearningPath.update(id, updates);
    if (!path) {
      return res.status(404).json({ success: false, error: 'Learning path not found' });
    }
    res.json({ success: true, path });
  } catch (error) {
    next(error);
  }
};

export const deleteLearningPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LearningPath.delete(id);
    res.json({ success: true, message: 'Learning path deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Course Management in Learning Path
 */
export const addCourseToPath = async (req, res, next) => {
  try {
    const { pathId } = req.params;
    const { course_id, order_index, is_required } = req.body;
    
    if (!course_id) {
      return res.status(400).json({ success: false, error: 'Course ID is required' });
    }

    // Verify course exists
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    await LearningPath.addCourse(pathId, course_id, order_index, is_required);
    const courses = await LearningPath.getCourses(pathId);
    
    res.json({ success: true, courses, message: 'Course added to learning path successfully' });
  } catch (error) {
    next(error);
  }
};

export const removeCourseFromPath = async (req, res, next) => {
  try {
    const { pathId, courseId } = req.params;
    await LearningPath.removeCourse(pathId, courseId);
    const courses = await LearningPath.getCourses(pathId);
    res.json({ success: true, courses, message: 'Course removed from learning path successfully' });
  } catch (error) {
    next(error);
  }
};

export const reorderCoursesInPath = async (req, res, next) => {
  try {
    const { pathId } = req.params;
    const { courseIds } = req.body;
    
    if (!Array.isArray(courseIds)) {
      return res.status(400).json({ success: false, error: 'courseIds must be an array' });
    }

    await LearningPath.reorderCourses(pathId, courseIds);
    const courses = await LearningPath.getCourses(pathId);
    res.json({ success: true, courses, message: 'Courses reordered successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateCourseRequirement = async (req, res, next) => {
  try {
    const { pathId, courseId } = req.params;
    const { is_required } = req.body;
    
    if (typeof is_required !== 'boolean') {
      return res.status(400).json({ success: false, error: 'is_required must be a boolean' });
    }

    await LearningPath.updateCourseRequirement(pathId, courseId, is_required);
    const courses = await LearningPath.getCourses(pathId);
    res.json({ success: true, courses, message: 'Course requirement updated successfully' });
  } catch (error) {
    next(error);
  }
};

