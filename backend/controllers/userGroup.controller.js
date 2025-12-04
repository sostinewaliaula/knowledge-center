import { UserGroup } from '../models/UserGroup.js';

export const getGroups = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await UserGroup.findAll(page, limit, search);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGroup = async (req, res) => {
    try {
        const group = await UserGroup.create(req.body);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const group = await UserGroup.update(req.params.id, req.body);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        await UserGroup.delete(req.params.id);
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGroupMembers = async (req, res) => {
    try {
        const members = await UserGroup.getMembers(req.params.id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addGroupMember = async (req, res) => {
    try {
        const { userId } = req.body;
        await UserGroup.addMember(req.params.id, userId);
        res.json({ message: 'Member added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeGroupMember = async (req, res) => {
    try {
        await UserGroup.removeMember(req.params.id, req.params.userId);
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
