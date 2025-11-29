import { query, queryOne } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

export class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT u.*, r.name as role_name, r.display_name as role_display_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;
    return await queryOne(sql, [email]);
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const sql = `
      SELECT u.*, r.name as role_name, r.display_name as role_display_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    const { email, password, name, role_id } = userData;
    
    const hashedPassword = await hashPassword(password);
    
    const sql = `
      INSERT INTO users (email, password, name, role_id)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email, hashedPassword, name || null, role_id || null]);
    return await this.findById(result.insertId);
  }

  /**
   * Update user
   */
  static async update(id, userData) {
    const updates = [];
    const values = [];

    if (userData.name !== undefined) {
      updates.push('name = ?');
      values.push(userData.name);
    }

    if (userData.role_id !== undefined) {
      updates.push('role_id = ?');
      values.push(userData.role_id);
    }

    if (userData.password) {
      updates.push('password = ?');
      values.push(await hashPassword(userData.password));
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return await this.findById(id);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  /**
   * Get all users with pagination
   */
  static async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT u.*, r.name as role_name, r.display_name as role_display_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    
    const params = [];
    
    if (search) {
      sql += ' WHERE u.name LIKE ? OR u.email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const users = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users u';
    if (search) {
      countSql += ' WHERE u.name LIKE ? OR u.email LIKE ?';
    }
    const [{ total }] = await query(countSql, search ? [`%${search}%`, `%${search}%`] : []);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Verify password
   */
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return false;
    }
    return await comparePassword(password, user.password);
  }
}

