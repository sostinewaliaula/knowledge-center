import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getPermissions } from '../controllers/permission.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', getPermissions);

export default router;


