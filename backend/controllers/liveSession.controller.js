import { LiveSession } from '../models/LiveSession.js';

export const getAllSessions = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        const sessions = await LiveSession.findAll({ status, search });
        res.json(sessions);
    } catch (error) {
        next(error);
    }
};

export const getSessionById = async (req, res, next) => {
    try {
        const session = await LiveSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Live session not found' });
        }
        res.json(session);
    } catch (error) {
        next(error);
    }
};

export const createSession = async (req, res, next) => {
    try {
        // TODO: Validate required fields
        const session = await LiveSession.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
};

export const updateSession = async (req, res, next) => {
    try {
        const session = await LiveSession.update(req.params.id, req.body);
        if (!session) {
            return res.status(404).json({ message: 'Live session not found' });
        }
        res.json(session);
    } catch (error) {
        next(error);
    }
};

export const deleteSession = async (req, res, next) => {
    try {
        const success = await LiveSession.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Live session not found' });
        }
        res.json({ message: 'Live session deleted successfully' });
    } catch (error) {
        next(error);
    }
};
