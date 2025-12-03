import express from 'express';
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
} from '../controllers/liveSession.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin', 'instructor'));

router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
