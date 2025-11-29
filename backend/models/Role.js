import { query, queryOne } from '../config/database.js';

export class Role {
  /**
   * Find role by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM roles WHERE id = ?';
    return await queryOne(sql, [id]);
  }

  /**
   * Find role by name
   */
  static async findByName(name) {
    const sql = 'SELECT * FROM roles WHERE name = ?';
    return await queryOne(sql, [name]);
  }

  /**
   * Get all roles
   */
  static async findAll() {
    const sql = 'SELECT * FROM roles ORDER BY name ASC';
    return await query(sql);
  }

  /**
   * Create a new role
   */
  static async create(roleData) {
    const { name, display_name, description, is_system_role = false } = roleData;
    
    const sql = `
      INSERT INTO roles (name, display_name, description, is_system_role)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await query(sql, [name, display_name, description || null, is_system_role]);
    return await this.findById(result.insertId);
  }

  /**
   * Update role
   */
  static async update(id, roleData) {
    const updates = [];
    const values = [];

    if (roleData.display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(roleData.display_name);
    }

    if (roleData.description !== undefined) {
      updates.push('description = ?');
      values.push(roleData.description);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE roles SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return await this.findById(id);
  }

  /**
   * Delete role (only if not system role)
   */
  static async delete(id) {
    const role = await this.findById(id);
    
    if (role && role.is_system_role) {
      throw new Error('Cannot delete system role');
    }
    
    // Check if role is assigned to any users
    const [users] = await query('SELECT COUNT(*) as count FROM users WHERE role_id = ?', [id]);
    if (users.count > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }
    
    const sql = 'DELETE FROM roles WHERE id = ?';
    await query(sql, [id]);
    return true;
  }
}

