import { Category } from '../models/Category.js';

/**
 * Category Controllers
 */
export const getCategories = async (req, res, next) => {
  try {
    const { page, limit, search, parent_id } = req.query;
    const result = await Category.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 100,
      search || '',
      parent_id !== undefined ? parent_id : null
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const getCategoryChildren = async (req, res, next) => {
  try {
    const { id } = req.params;
    const children = await Category.findChildren(id);
    res.json({ success: true, categories: children });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, parent_id, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const category = await Category.create({
      name,
      slug,
      description,
      parent_id,
      icon,
      color
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await Category.update(id, updates);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

