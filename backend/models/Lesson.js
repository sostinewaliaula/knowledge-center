import { query, queryOne } from '../config/database.js';

export class Lesson {
  /**
   * Find lesson by ID
   */
  static async findById(id) {
    const sql = `
      SELECT l.*, m.title as module_title, m.course_id, c.title as course_title
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE l.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find all lessons for a module
   */
  static async findByModuleId(moduleId) {
    const sql = `
      SELECT l.*
      FROM lessons l
      WHERE l.module_id = ?
      ORDER BY l.order_index ASC, l.created_at ASC
    `;
    return await query(sql, [moduleId]);
  }

  /**
   * Find all lessons for a course (across all modules)
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT l.*, m.title as module_title, m.order_index as module_order
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE m.course_id = ?
      ORDER BY m.order_index ASC, l.order_index ASC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Create a new lesson
   */
  static async create(lessonData) {
    const {
      module_id,
      title,
      description,
      content_type,
      content_url,
      content_text,
      duration_minutes,
      order_index,
      is_required,
      is_preview
    } = lessonData;

    // If order_index not provided, get the next order
    let order = order_index;
    if (order === undefined || order === null) {
      const maxOrderSql = `SELECT MAX(order_index) as max_order FROM lessons WHERE module_id = ?`;
      const maxResult = await queryOne(maxOrderSql, [module_id]);
      order = (maxResult.max_order || 0) + 1;
    }

    const sql = `
      INSERT INTO lessons (
        module_id, title, description, content_type, content_url, content_text,
        duration_minutes, order_index, is_required, is_preview
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      module_id,
      title,
      description || null,
      content_type || 'text',
      content_url || null,
      content_text || null,
      duration_minutes || 0,
      order,
      is_required !== undefined ? is_required : true,
      is_preview !== undefined ? is_preview : false
    ]);

    // UUID is auto-generated, so fetch by module_id and title to get the created lesson
    const created = await queryOne(
      `SELECT * FROM lessons WHERE module_id = ? AND title = ? ORDER BY created_at DESC LIMIT 1`,
      [module_id, title]
    );
    
    return created;
  }

  /**
   * Update lesson
   */
  static async update(id, lessonData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'content_type', 'content_url', 'content_text',
      'duration_minutes', 'order_index', 'is_required', 'is_preview'
    ];

    for (const field of allowedFields) {
      if (lessonData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(lessonData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE lessons SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete lesson
   */
  static async delete(id) {
    const sql = `DELETE FROM lessons WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  /**
   * Reorder lessons
   */
  static async reorder(moduleId, lessonOrders) {
    // lessonOrders is an array of { id, order_index }
    const promises = lessonOrders.map(({ id, order_index }) => {
      return query(`UPDATE lessons SET order_index = ? WHERE id = ? AND module_id = ?`, 
        [order_index, id, moduleId]);
    });
    
    await Promise.all(promises);
    return await this.findByModuleId(moduleId);
  }
}

