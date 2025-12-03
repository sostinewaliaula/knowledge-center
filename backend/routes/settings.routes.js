import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/', getSettings);
router.put('/:category', updateSettings);

export default router;
