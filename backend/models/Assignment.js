import { query, queryOne } from '../config/database.js';

export class Assignment {
  /**
   * Find all assignments with pagination, search, and filter
   */
  static async findAll(page = 1, limit = 20, search = '', status = 'all', type = 'all') {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    if (type !== 'all') {
      whereClause += ' AND a.type = ?';
      params.push(type);
    }

    const countSql = `SELECT COUNT(a.id) as total FROM assignments a ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             u.name as created_by_name,
             (SELECT COUNT(DISTINCT e.user_id) 
              FROM enrollments e 
              WHERE e.course_id = a.course_id) as assigned_to,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id) as submitted,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id AND s.status = 'submitted') as pending,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id AND s.status = 'graded') as graded
      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      LEFT JOIN users u ON a.created_by = u.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const assignments = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      assignments,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find assignment by ID
   */
  static async findById(id) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             u.name as created_by_name,
             (SELECT COUNT(DISTINCT e.user_id) 
              FROM enrollments e 
              WHERE e.course_id = a.course_id) as assigned_to,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id) as submitted,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id AND s.status = 'submitted') as pending,
             (SELECT COUNT(*) 
              FROM assignment_submissions s 
              WHERE s.assignment_id = a.id AND s.status = 'graded') as graded
      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Create a new assignment
   */
  static async create(assignmentData) {
    const {
      course_id,
      lesson_id,
      title,
      description,
      type,
      instructions,
      max_file_size_mb,
      allowed_file_types,
      due_date,
      max_score,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status,
      created_by
    } = assignmentData;

    const sql = `
      INSERT INTO assignments (
        course_id, lesson_id, title, description, type, instructions,
        max_file_size_mb, allowed_file_types, due_date, max_score,
        passing_score, time_limit_minutes, max_attempts, is_required,
        randomize_questions, show_results, status, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      course_id || null,
      lesson_id || null,
      title,
      description || null,
      type || 'file-upload',
      instructions || null,
      max_file_size_mb || 10,
      allowed_file_types || 'pdf,doc,docx,txt',
      due_date || null,
      max_score || 100.00,
      passing_score || null,
      time_limit_minutes || null,
      max_attempts || null,
      typeof is_required === 'boolean' ? (is_required ? 1 : 0) : null,
      typeof randomize_questions === 'boolean' ? (randomize_questions ? 1 : 0) : null,
      typeof show_results === 'boolean' ? (show_results ? 1 : 0) : null,
      status || 'draft',
      created_by || null
    ]);
    
    // Fetch the newly created assignment
    return await queryOne(
      'SELECT a.*, c.title as course_title, l.title as lesson_title, u.name as created_by_name FROM assignments a LEFT JOIN courses c ON a.course_id = c.id LEFT JOIN lessons l ON a.lesson_id = l.id LEFT JOIN users u ON a.created_by = u.id WHERE a.title = ? AND (a.course_id = ? OR (? IS NULL AND a.course_id IS NULL)) AND (a.lesson_id = ? OR (? IS NULL AND a.lesson_id IS NULL)) ORDER BY a.created_at DESC LIMIT 1',
      [title, course_id || null, course_id || null, lesson_id || null, lesson_id || null]
    );
  }

  /**
   * Update assignment
   */
  static async update(id, assignmentData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'course_id',
      'lesson_id',
      'title',
      'description',
      'type',
      'instructions',
      'max_file_size_mb',
      'allowed_file_types',
      'due_date',
      'max_score',
      'passing_score',
      'time_limit_minutes',
      'max_attempts',
      'is_required',
      'randomize_questions',
      'show_results',
      'status'
    ];

    for (const field of allowedFields) {
      if (assignmentData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(assignmentData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE assignments SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete assignment
   */
  static async delete(id) {
    const sql = 'DELETE FROM assignments WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Assignment deleted successfully' };
  }

  /**
   * Find assignments by course ID
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             u.name as created_by_name
      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.course_id = ?
      ORDER BY a.created_at DESC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Find assignments by lesson ID
   */
  static async findByLessonId(lessonId) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             u.name as created_by_name
      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.lesson_id = ?
      ORDER BY a.created_at DESC
    `;
    return await query(sql, [lessonId]);
  }
}

