import express from 'express';
import * as assessmentController from '../controllers/assessment.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All assessment routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Assessment CRUD
router.get('/', assessmentController.getAssessments);
router.get('/:id', assessmentController.getAssessmentById);
router.post('/', assessmentController.createAssessment);
router.put('/:id', assessmentController.updateAssessment);
router.delete('/:id', assessmentController.deleteAssessment);

// Question management
router.get('/:assessmentId/questions', assessmentController.getQuestions);
router.post('/:assessmentId/questions', assessmentController.createQuestion);
router.put('/questions/:questionId', assessmentController.updateQuestion);
router.delete('/questions/:questionId', assessmentController.deleteQuestion);
router.put('/:assessmentId/questions/reorder', assessmentController.reorderQuestions);
router.put('/questions/:questionId/publish', assessmentController.publishQuestion);
router.put('/questions/:questionId/unpublish', assessmentController.unpublishQuestion);
router.get('/questions/:questionId/history', assessmentController.getQuestionHistory);

export default router;

