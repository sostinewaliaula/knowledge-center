import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all users with role information
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        u.updated_at,
        r.name as role_name,
        r.display_name as role_display_name,
        'Active' as status
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC`
    );

    // Format users data
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role_display_name || user.role_name || 'Learner',
      roleName: user.role_name || 'learner',
      status: user.status || 'Active',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastActive: user.updated_at ? formatLastActive(user.updated_at) : 'Never'
    }));

    res.json({
      success: true,
      users: formattedUsers,
      count: formattedUsers.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        u.updated_at,
        r.name as role_name,
        r.display_name as role_display_name,
        'Active' as status
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        role: user.role_display_name || user.role_name || 'Learner',
        roleName: user.role_name || 'learner',
        status: user.status || 'Active',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastActive: user.updated_at ? formatLastActive(user.updated_at) : 'Never'
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Helper function to format last active time
function formatLastActive(date) {
  const now = new Date();
  const lastActive = new Date(date);
  const diffMs = now - lastActive;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return lastActive.toLocaleDateString();
}

export default router;

