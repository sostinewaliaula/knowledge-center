import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireAdmin, userController.getUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create user (admin only)
router.post('/', requireAdmin, userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireAdmin, userController.deleteUser);

export default router;

