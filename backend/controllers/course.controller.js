import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';

/**
 * Get all courses
 */
export const getCourses = async (req, res, next) => {
  try {
    const { page, limit, search, status, category_id } = req.query;
    const result = await Course.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      status || 'all',
      category_id || null
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
 * Get course by ID with modules and lessons
 */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Get modules for this course
    const modules = await Module.findByCourseId(id);
    
    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.findByModuleId(module.id);
        return {
          ...module,
          lessons
        };
      })
    );

    res.json({
      success: true,
      course: {
        ...course,
        modules: modulesWithLessons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new course
 */
export const createCourse = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      instructor_id: req.user.id // Set instructor to current user
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update course
 */
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Only allow updating if user is the instructor or admin
    if (existingCourse.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this course'
      });
    }

    const course = await Course.update(id, req.body);

    res.json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Only allow deleting if user is the instructor or admin
    if (existingCourse.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this course'
      });
    }

    await Course.delete(id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create module for a course
 */
export const createModule = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    
    // Verify course exists and user has permission
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to add modules to this course'
      });
    }

    const moduleData = {
      ...req.body,
      course_id
    };

    const module = await Module.create(moduleData);

    res.status(201).json({
      success: true,
      module
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update module
 */
export const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Verify course ownership
    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this module'
      });
    }

    const updatedModule = await Module.update(id, req.body);

    res.json({
      success: true,
      module: updatedModule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete module
 */
export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Verify course ownership
    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this module'
      });
    }

    await Module.delete(id);

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder modules
 */
export const reorderModules = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const { moduleOrders } = req.body; // Array of { id, order_index }

    // Verify course ownership
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to reorder modules'
      });
    }

    const modules = await Module.reorder(course_id, moduleOrders);

    res.json({
      success: true,
      modules
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create lesson for a module
 */
export const createLesson = async (req, res, next) => {
  try {
    const { module_id } = req.params;
    
    // Verify module exists and user has permission
    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to add lessons to this module'
      });
    }

    const lessonData = {
      ...req.body,
      module_id
    };

    const lesson = await Lesson.create(lessonData);

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lesson
 */
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Verify course ownership
    const course = await Course.findById(lesson.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this lesson'
      });
    }

    const updatedLesson = await Lesson.update(id, req.body);

    res.json({
      success: true,
      lesson: updatedLesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lesson
 */
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Verify course ownership
    const course = await Course.findById(lesson.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this lesson'
      });
    }

    await Lesson.delete(id);

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder lessons
 */
export const reorderLessons = async (req, res, next) => {
  try {
    const { module_id } = req.params;
    const { lessonOrders } = req.body; // Array of { id, order_index }

    // Verify module and course ownership
    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to reorder lessons'
      });
    }

    const lessons = await Lesson.reorder(module_id, lessonOrders);

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    next(error);
  }
};

