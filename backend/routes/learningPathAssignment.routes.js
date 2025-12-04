import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createAssignment,
    getAssignmentsByPath,
    deleteAssignment
} from '../controllers/learningPathAssignment.controller.js';

const router = express.Router();

// All routes require authentication and admin/instructor role
router.use(authenticateToken);
router.use(requireRole('admin', 'instructor'));

router.post('/', createAssignment);
router.get('/path/:pathId', getAssignmentsByPath);
router.delete('/:id', deleteAssignment);

export default router;
