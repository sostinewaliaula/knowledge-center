import express from 'express';
import * as assignmentController from '../controllers/assignment.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All assignment routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Assignment CRUD
router.get('/', assignmentController.getAssignments);
router.get('/course/:courseId', assignmentController.getAssignmentsByCourse);
router.get('/lesson/:lessonId', assignmentController.getAssignmentsByLesson);
router.get('/:id', assignmentController.getAssignmentById);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

export default router;

