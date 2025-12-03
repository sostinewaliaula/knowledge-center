import express from 'express';
import { getSettings, updateSettings, testEmail } from '../controllers/settings.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/', getSettings);
router.put('/:category', updateSettings);
router.post('/test-email', testEmail);

export default router;
