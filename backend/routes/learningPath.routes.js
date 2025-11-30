import express from 'express';
import * as learningPathController from '../controllers/learningPath.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All learning path routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Learning Path Routes
router.get('/', learningPathController.getLearningPaths);
router.get('/:id', learningPathController.getLearningPathById);
router.post('/', learningPathController.createLearningPath);
router.put('/:id', learningPathController.updateLearningPath);
router.delete('/:id', learningPathController.deleteLearningPath);

// Course Management in Learning Path
router.post('/:pathId/courses', learningPathController.addCourseToPath);
router.delete('/:pathId/courses/:courseId', learningPathController.removeCourseFromPath);
router.put('/:pathId/courses/reorder', learningPathController.reorderCoursesInPath);
router.put('/:pathId/courses/:courseId/requirement', learningPathController.updateCourseRequirement);

export default router;

