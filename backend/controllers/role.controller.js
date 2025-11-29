import { Role } from '../models/Role.js';

/**
 * Get all roles
 */
export const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    
    res.json({
      success: true,
      roles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get role by ID
 */
export const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    res.json({
      success: true,
      role
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create role
 */
export const createRole = async (req, res, next) => {
  try {
    const { name, display_name, description } = req.body;

    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        error: 'Name and display_name are required'
      });
    }

    // Check if role already exists
    const existingRole = await Role.findByName(name);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role with this name already exists'
      });
    }

    const role = await Role.create({ name, display_name, description });

    res.status(201).json({
      success: true,
      role
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update role
 */
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if role exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    // Don't allow updating system role name
    if (updateData.name && existingRole.is_system_role) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify system role name'
      });
    }

    const role = await Role.update(id, updateData);

    res.json({
      success: true,
      role
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete role
 */
export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Role.delete(id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

