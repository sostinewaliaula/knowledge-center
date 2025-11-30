import { query, queryOne } from '../config/database.js';

export class LearningPath {
  /**
   * Find all learning paths with pagination, search, and filter
   */
  static async findAll(page = 1, limit = 20, search = '', status = 'all') {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (lp.title LIKE ? OR lp.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
      whereClause += ' AND lp.status = ?';
      params.push(status);
    }

    const countSql = `SELECT COUNT(lp.id) as total FROM learning_paths lp ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT lp.*, 
             cat.name as category_name,
             u.name as created_by_name,
             COUNT(DISTINCT lpc.course_id) as course_count
      FROM learning_paths lp
      LEFT JOIN categories cat ON lp.category_id = cat.id
      LEFT JOIN users u ON lp.created_by = u.id
      LEFT JOIN learning_path_courses lpc ON lp.id = lpc.learning_path_id
      ${whereClause}
      GROUP BY lp.id
      ORDER BY lp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const paths = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      paths,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find learning path by ID
   */
  static async findById(id) {
    const sql = `
      SELECT lp.*, 
             cat.name as category_name,
             u.name as created_by_name
      FROM learning_paths lp
      LEFT JOIN categories cat ON lp.category_id = cat.id
      LEFT JOIN users u ON lp.created_by = u.id
      WHERE lp.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Get courses in a learning path
   */
  static async getCourses(pathId) {
    const sql = `
      SELECT c.*, 
             lpc.order_index,
             lpc.is_required,
             cat.name as category_name
      FROM learning_path_courses lpc
      JOIN courses c ON lpc.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE lpc.learning_path_id = ?
      ORDER BY lpc.order_index ASC
    `;
    return await query(sql, [pathId]);
  }

  /**
   * Create a new learning path
   */
  static async create(pathData) {
    const {
      title,
      description,
      category_id,
      thumbnail_url,
      status,
      is_featured,
      estimated_duration_hours,
      created_by
    } = pathData;

    const sql = `
      INSERT INTO learning_paths (
        title, description, category_id, thumbnail_url, status, 
        is_featured, estimated_duration_hours, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      title,
      description || null,
      category_id || null,
      thumbnail_url || null,
      status || 'draft',
      is_featured || false,
      estimated_duration_hours || 0,
      created_by || null
    ]);

    // Fetch the newly created path by title and created_by
    return await queryOne(
      'SELECT * FROM learning_paths WHERE title = ? AND created_by = ? ORDER BY created_at DESC LIMIT 1',
      [title, created_by]
    );
  }

  /**
   * Update learning path
   */
  static async update(id, pathData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'category_id', 'thumbnail_url', 'status',
      'is_featured', 'estimated_duration_hours'
    ];

    for (const field of allowedFields) {
      if (pathData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(pathData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE learning_paths SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete learning path
   */
  static async delete(id) {
    const sql = 'DELETE FROM learning_paths WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Learning path deleted successfully' };
  }

  /**
   * Add course to learning path
   */
  static async addCourse(pathId, courseId, orderIndex = null, isRequired = true) {
    // If orderIndex is not provided, get the max order_index and add 1
    if (orderIndex === null) {
      const orderResult = await queryOne(
        'SELECT MAX(order_index) as max_order FROM learning_path_courses WHERE learning_path_id = ?',
        [pathId]
      );
      orderIndex = (orderResult.max_order || 0) + 1;
    }

    const sql = `
      INSERT INTO learning_path_courses (learning_path_id, course_id, order_index, is_required)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE order_index = ?, is_required = ?
    `;
    await query(sql, [pathId, courseId, orderIndex, isRequired, orderIndex, isRequired]);
    
    return { message: 'Course added to learning path successfully' };
  }

  /**
   * Remove course from learning path
   */
  static async removeCourse(pathId, courseId) {
    const sql = 'DELETE FROM learning_path_courses WHERE learning_path_id = ? AND course_id = ?';
    await query(sql, [pathId, courseId]);
    return { message: 'Course removed from learning path successfully' };
  }

  /**
   * Reorder courses in learning path
   */
  static async reorderCourses(pathId, courseIds) {
    // Update order_index for each course
    for (let i = 0; i < courseIds.length; i++) {
      const courseId = courseIds[i];
      const orderIndex = i + 1;
      await query(
        'UPDATE learning_path_courses SET order_index = ? WHERE learning_path_id = ? AND course_id = ?',
        [orderIndex, pathId, courseId]
      );
    }
    return { message: 'Courses reordered successfully' };
  }

  /**
   * Update course requirement status
   */
  static async updateCourseRequirement(pathId, courseId, isRequired) {
    const sql = `
      UPDATE learning_path_courses 
      SET is_required = ? 
      WHERE learning_path_id = ? AND course_id = ?
    `;
    await query(sql, [isRequired, pathId, courseId]);
    return { message: 'Course requirement updated successfully' };
  }

  /**
   * Get tags for a learning path
   */
  static async getTags(pathId) {
    const sql = `
      SELECT t.id, t.name, t.slug
      FROM tags t
      INNER JOIN learning_path_tags lpt ON t.id = lpt.tag_id
      WHERE lpt.learning_path_id = ?
      ORDER BY t.name ASC
    `;
    return await query(sql, [pathId]);
  }

  /**
   * Set tags for a learning path (replaces existing tags)
   */
  static async setTags(pathId, tagIds) {
    // First, delete all existing tags
    await query('DELETE FROM learning_path_tags WHERE learning_path_id = ?', [pathId]);
    
    // Then, insert new tags one by one
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await query('INSERT INTO learning_path_tags (learning_path_id, tag_id) VALUES (?, ?)', [pathId, tagId]);
      }
    }
    
    return await this.getTags(pathId);
  }
}

