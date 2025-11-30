import express from 'express';
import * as tagController from '../controllers/tag.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All tag routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Tag Routes
router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);
router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

export default router;

