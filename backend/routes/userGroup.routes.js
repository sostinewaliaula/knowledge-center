import express from 'express';
import {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupMembers,
    addGroupMember,
    removeGroupMember
} from '../controllers/userGroup.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.route('/')
    .get(getGroups)
    .post(createGroup);

router.route('/:id')
    .put(updateGroup)
    .delete(deleteGroup);

router.route('/:id/members')
    .get(getGroupMembers)
    .post(addGroupMember);

router.route('/:id/members/:userId')
    .delete(removeGroupMember);

export default router;
