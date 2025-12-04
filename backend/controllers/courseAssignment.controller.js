import { CourseAssignment } from '../models/CourseAssignment.js';

export const createAssignment = async (req, res) => {
    try {
        const assignmentData = {
            ...req.body,
            assigned_by: req.user.id
        };
        const result = await CourseAssignment.create(assignmentData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserAssignments = async (req, res) => {
    try {
        // If admin, can fetch for any user, otherwise only for self
        const targetUserId = req.query.userId || req.user.id;

        // Simple check: if requesting for another user, must be admin/instructor
        if (targetUserId !== req.user.id && !['admin', 'instructor'].includes(req.user.role_name)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const assignments = await CourseAssignment.getForUser(targetUserId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseAssignments = async (req, res) => {
    try {
        const assignments = await CourseAssignment.getByCourse(req.params.courseId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        await CourseAssignment.delete(req.params.id);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
