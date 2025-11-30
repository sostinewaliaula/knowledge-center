import express from 'express';
import * as contentController from '../controllers/content.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all content (admin only)
router.get('/', requireAdmin, contentController.getContents);

// Get content by ID
router.get('/:id', contentController.getContentById);

// Upload content from file (admin only, single file)
router.post('/upload', requireAdmin, upload.single('file'), contentController.uploadContent);

// Add content from URL (admin only)
router.post('/url', requireAdmin, contentController.addContentFromUrl);

// Update content metadata (admin only)
router.put('/:id', requireAdmin, contentController.updateContent);

// Delete content (admin only)
router.delete('/:id', requireAdmin, contentController.deleteContent);

// Download content file
router.get('/:id/download', contentController.downloadContent);

export default router;

