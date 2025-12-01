import { query, queryOne } from '../config/database.js';

export class Assessment {
  /**
   * Find all assessments with pagination, search, and filter
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

    const countSql = `SELECT COUNT(a.id) as total FROM assessments a ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = a.id) as question_count,
             (SELECT COUNT(*) FROM assessment_attempts WHERE assessment_id = a.id) as attempt_count
      FROM assessments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const assessments = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      assessments,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find assessment by ID
   */
  static async findById(id) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = a.id) as question_count,
             (SELECT COUNT(*) FROM assessment_attempts WHERE assessment_id = a.id) as attempt_count
      FROM assessments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      WHERE a.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find assessments by course ID
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = a.id) as question_count,
             (SELECT COUNT(*) FROM assessment_attempts WHERE assessment_id = a.id) as attempt_count
      FROM assessments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      WHERE a.course_id = ?
      ORDER BY a.created_at DESC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Find assessments by lesson ID
   */
  static async findByLessonId(lessonId) {
    const sql = `
      SELECT a.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = a.id) as question_count,
             (SELECT COUNT(*) FROM assessment_attempts WHERE assessment_id = a.id) as attempt_count
      FROM assessments a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      WHERE a.lesson_id = ?
      ORDER BY a.created_at DESC
    `;
    return await query(sql, [lessonId]);
  }

  /**
   * Create a new assessment
   */
  static async create(assessmentData) {
    const {
      course_id,
      lesson_id,
      title,
      description,
      type,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status
    } = assessmentData;

    const sql = `
      INSERT INTO assessments (
        course_id, lesson_id, title, description, type, passing_score,
        time_limit_minutes, max_attempts, is_required, randomize_questions,
        show_results, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      course_id || null,
      lesson_id || null,
      title,
      description || null,
      type || 'quiz',
      passing_score || 70.00,
      time_limit_minutes || null,
      max_attempts || 1,
      is_required !== undefined ? is_required : true,
      randomize_questions || false,
      show_results !== undefined ? show_results : true,
      status || 'draft'
    ]);
    
    // Fetch the newly created assessment by title and course_id/lesson_id
    return await queryOne(
      'SELECT a.*, c.title as course_title, l.title as lesson_title FROM assessments a LEFT JOIN courses c ON a.course_id = c.id LEFT JOIN lessons l ON a.lesson_id = l.id WHERE a.title = ? AND (a.course_id = ? OR (? IS NULL AND a.course_id IS NULL)) AND (a.lesson_id = ? OR (? IS NULL AND a.lesson_id IS NULL)) ORDER BY a.created_at DESC LIMIT 1',
      [title, course_id || null, course_id || null, lesson_id || null, lesson_id || null]
    );
  }

  /**
   * Update assessment
   */
  static async update(id, assessmentData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'course_id', 'lesson_id', 'title', 'description', 'type', 'passing_score',
      'time_limit_minutes', 'max_attempts', 'is_required', 'randomize_questions',
      'show_results', 'status'
    ];

    for (const field of allowedFields) {
      if (assessmentData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(assessmentData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE assessments SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete assessment
   */
  static async delete(id) {
    const sql = 'DELETE FROM assessments WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Assessment deleted successfully' };
  }
}

