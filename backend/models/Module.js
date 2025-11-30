import { query, queryOne } from '../config/database.js';

export class Module {
  /**
   * Find module by ID
   */
  static async findById(id) {
    const sql = `
      SELECT m.*, c.title as course_title
      FROM modules m
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE m.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find all modules for a course
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT m.*
      FROM modules m
      WHERE m.course_id = ?
      ORDER BY m.order_index ASC, m.created_at ASC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Create a new module
   */
  static async create(moduleData) {
    const {
      course_id,
      title,
      description,
      order_index,
      is_required
    } = moduleData;

    // If order_index not provided, get the next order
    let order = order_index;
    if (order === undefined || order === null) {
      const maxOrderSql = `SELECT MAX(order_index) as max_order FROM modules WHERE course_id = ?`;
      const maxResult = await queryOne(maxOrderSql, [course_id]);
      order = (maxResult.max_order || 0) + 1;
    }

    const sql = `
      INSERT INTO modules (course_id, title, description, order_index, is_required)
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [
      course_id,
      title,
      description || null,
      order,
      is_required !== undefined ? is_required : true
    ]);

    // UUID is auto-generated, so fetch by course_id and title to get the created module
    const created = await queryOne(
      `SELECT * FROM modules WHERE course_id = ? AND title = ? ORDER BY created_at DESC LIMIT 1`,
      [course_id, title]
    );
    
    return created;
  }

  /**
   * Update module
   */
  static async update(id, moduleData) {
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'description', 'order_index', 'is_required'];

    for (const field of allowedFields) {
      if (moduleData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(moduleData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE modules SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete module
   */
  static async delete(id) {
    const sql = `DELETE FROM modules WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  /**
   * Reorder modules
   */
  static async reorder(courseId, moduleOrders) {
    // moduleOrders is an array of { id, order_index }
    const promises = moduleOrders.map(({ id, order_index }) => {
      return query(`UPDATE modules SET order_index = ? WHERE id = ? AND course_id = ?`, 
        [order_index, id, courseId]);
    });
    
    await Promise.all(promises);
    return await this.findByCourseId(courseId);
  }
}

