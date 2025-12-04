import express from 'express';
import {
    createAssignment,
    getUserAssignments,
    getCourseAssignments,
    deleteAssignment
} from '../controllers/courseAssignment.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Create assignment (Admin/Instructor only)
router.post('/', requireRole('admin', 'instructor'), createAssignment);

// Get assignments for a user (Self or Admin/Instructor)
router.get('/user', getUserAssignments);

// Get assignments for a course (Admin/Instructor only)
router.get('/course/:courseId', requireRole('admin', 'instructor'), getCourseAssignments);

// Delete assignment (Admin/Instructor only)
router.delete('/:id', requireRole('admin', 'instructor'), deleteAssignment);

export default router;
