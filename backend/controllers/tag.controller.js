import { Tag } from '../models/Tag.js';

/**
 * Tag Controllers
 */
export const getTags = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await Tag.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 100,
      search || ''
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    res.json({ success: true, tag });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Tag name is required' });
    }
    const tag = await Tag.create({ name, slug });
    res.status(201).json({ success: true, tag });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tag = await Tag.update(id, updates);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    res.json({ success: true, tag });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Tag.delete(id);
    res.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    next(error);
  }
};

