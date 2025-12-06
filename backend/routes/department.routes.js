import express from 'express';
import {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentMembers,
    addDepartmentMember,
    removeDepartmentMember
} from '../controllers/department.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes (if any) - none for departments usually

// Protected routes
router.use(authenticateToken);

router.get('/', getDepartments);
router.get('/:id', getDepartment);

// Admin only routes
router.post('/', requireRole('admin'), createDepartment);
router.put('/:id', requireRole('admin'), updateDepartment);
router.delete('/:id', requireRole('admin'), deleteDepartment);

// Member management
router.get('/:id/members', getDepartmentMembers);
router.post('/:id/members', requireRole('admin'), addDepartmentMember);
router.delete('/:id/members/:userId', requireRole('admin'), removeDepartmentMember);

export default router;
