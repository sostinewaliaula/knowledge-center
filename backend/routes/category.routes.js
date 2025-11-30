import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All category routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Category Routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/children', categoryController.getCategoryChildren);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;

