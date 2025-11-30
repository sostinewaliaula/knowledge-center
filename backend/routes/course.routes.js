import express from 'express';
import * as courseController from '../controllers/course.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Course routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Module routes
router.post('/:course_id/modules', courseController.createModule);
router.put('/modules/:id', courseController.updateModule);
router.delete('/modules/:id', courseController.deleteModule);
router.post('/:course_id/modules/reorder', courseController.reorderModules);

// Lesson routes
router.post('/modules/:module_id/lessons', courseController.createLesson);
router.put('/lessons/:id', courseController.updateLesson);
router.delete('/lessons/:id', courseController.deleteLesson);
router.post('/modules/:module_id/lessons/reorder', courseController.reorderLessons);

export default router;

