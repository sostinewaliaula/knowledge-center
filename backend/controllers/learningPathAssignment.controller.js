import { LearningPathAssignment } from '../models/LearningPathAssignment.js';

export const createAssignment = async (req, res) => {
    try {
        const { learning_path_id, group_id, user_id, due_date } = req.body;
        const assigned_by = req.user.id;

        if (!learning_path_id) {
            return res.status(400).json({ message: 'Learning Path ID is required' });
        }

        const result = await LearningPathAssignment.create({
            learning_path_id,
            group_id,
            user_id,
            assigned_by,
            due_date
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating learning path assignment:', error);
        res.status(500).json({ message: 'Error creating assignment' });
    }
};

export const getAssignmentsByPath = async (req, res) => {
    try {
        const { pathId } = req.params;
        const assignments = await LearningPathAssignment.getByPath(pathId);
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await LearningPathAssignment.delete(id);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Error deleting assignment' });
    }
};
