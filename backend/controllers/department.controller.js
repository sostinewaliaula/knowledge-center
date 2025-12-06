import { Department } from '../models/Department.js';

export const getDepartments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await Department.findAll(page, limit, search);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.update(req.params.id, req.body);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        await Department.delete(req.params.id);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDepartmentMembers = async (req, res) => {
    try {
        const members = await Department.getMembers(req.params.id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addDepartmentMember = async (req, res) => {
    try {
        const { userId, role } = req.body;
        await Department.addMember(req.params.id, userId, role);
        res.json({ message: 'Member added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeDepartmentMember = async (req, res) => {
    try {
        await Department.removeMember(req.params.id, req.params.userId);
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
