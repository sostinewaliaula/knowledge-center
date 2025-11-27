import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all roles
router.get('/', async (req, res) => {
  try {
    const [roles] = await pool.query(
      'SELECT * FROM roles ORDER BY is_system_role DESC, display_name ASC'
    );
    res.json({ success: true, roles });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single role
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    
    if (roles.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json({ success: true, role: roles[0] });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new role (admin only - add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const { name, display_name, description } = req.body;

    if (!name || !display_name) {
      return res.status(400).json({ error: 'Name and display_name are required' });
    }

    // Check if role name already exists
    const [existing] = await pool.query('SELECT id FROM roles WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Role name already exists' });
    }

    await pool.query(
      'INSERT INTO roles (name, display_name, description, is_system_role) VALUES (?, ?, ?, FALSE)',
      [name, display_name, description || null]
    );

    const [newRole] = await pool.query('SELECT * FROM roles WHERE name = ? ORDER BY created_at DESC LIMIT 1', [name]);

    res.status(201).json({ success: true, role: newRole[0] });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update role (admin only - add auth middleware later)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, description } = req.body;

    // Check if role exists
    const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (roles.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const role = roles[0];

    // Prevent modifying system roles' name
    if (role.is_system_role) {
      return res.status(400).json({ error: 'Cannot modify system role name' });
    }

    await pool.query(
      'UPDATE roles SET display_name = ?, description = ? WHERE id = ?',
      [display_name || role.display_name, description !== undefined ? description : role.description, id]
    );

    const [updated] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    res.json({ success: true, role: updated[0] });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete role (admin only - add auth middleware later)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (roles.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const role = roles[0];

    // Prevent deleting system roles
    if (role.is_system_role) {
      return res.status(400).json({ error: 'Cannot delete system role' });
    }

    // Check if any users have this role
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role_id = ?', [id]);
    if (users[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete role that is assigned to users' });
    }

    await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

