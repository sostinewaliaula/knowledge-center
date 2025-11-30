import express from 'express';
import * as templateController from '../controllers/template.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All template routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Template CRUD
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

// Use template to create new item
router.post('/:id/use', templateController.useTemplate);

export default router;

