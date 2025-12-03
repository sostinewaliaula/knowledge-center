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

// Quiz questions for assignments
router.get('/:assignmentId/questions', assignmentController.getQuestions);
router.post('/:assignmentId/questions', assignmentController.createQuestion);
router.put('/questions/:questionId', assignmentController.updateQuestion);
router.delete('/questions/:questionId', assignmentController.deleteQuestion);
router.put('/:assignmentId/questions/reorder', assignmentController.reorderQuestions);

export default router;

