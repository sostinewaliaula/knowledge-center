import express from 'express';
import * as examController from '../controllers/exam.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All exam routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Exam CRUD
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

// Question management
router.get('/:examId/questions', examController.getQuestions);
router.post('/:examId/questions', examController.createQuestion);
router.put('/questions/:questionId', examController.updateQuestion);
router.delete('/questions/:questionId', examController.deleteQuestion);
router.put('/:examId/questions/reorder', examController.reorderQuestions);
router.put('/questions/:questionId/publish', examController.publishQuestion);
router.put('/questions/:questionId/unpublish', examController.unpublishQuestion);
router.get('/questions/:questionId/history', examController.getQuestionHistory);

export default router;

