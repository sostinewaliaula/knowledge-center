import express from 'express';
import * as roleController from '../controllers/role.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all roles (public for getting list, but authenticated)
router.get('/', authenticateToken, roleController.getRoles);

// Get role by ID
router.get('/:id', authenticateToken, roleController.getRoleById);

// All other routes require admin
router.use(requireAdmin);

// Create role
router.post('/', roleController.createRole);

// Update role
router.put('/:id', roleController.updateRole);

// Update role permissions
router.put('/:id/permissions', roleController.updateRolePermissions);

// Delete role
router.delete('/:id', roleController.deleteRole);

export default router;

