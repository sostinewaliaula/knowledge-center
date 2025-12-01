import { query, queryOne } from '../config/database.js';

export class Exam {
  /**
   * Find all exams with pagination, search, and filter
   */
  static async findAll(page = 1, limit = 20, search = '', status = 'all') {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
      whereClause += ' AND e.status = ?';
      params.push(status);
    }

    const countSql = `SELECT COUNT(e.id) as total FROM exams e ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT e.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM exam_questions WHERE exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id) as attempt_count
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON e.lesson_id = l.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const exams = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      exams,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find exam by ID
   */
  static async findById(id) {
    const sql = `
      SELECT e.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM exam_questions WHERE exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id) as attempt_count
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON e.lesson_id = l.id
      WHERE e.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find exams by course ID
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT e.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM exam_questions WHERE exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id) as attempt_count
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON e.lesson_id = l.id
      WHERE e.course_id = ?
      ORDER BY e.created_at DESC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Find exams by lesson ID
   */
  static async findByLessonId(lessonId) {
    const sql = `
      SELECT e.*,
             c.title as course_title,
             l.title as lesson_title,
             (SELECT COUNT(*) FROM exam_questions WHERE exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id) as attempt_count
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON e.lesson_id = l.id
      WHERE e.lesson_id = ?
      ORDER BY e.created_at DESC
    `;
    return await query(sql, [lessonId]);
  }

  /**
   * Create a new exam
   */
  static async create(examData) {
    const {
      course_id,
      lesson_id,
      title,
      description,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status
    } = examData;

    const sql = `
      INSERT INTO exams (
        course_id, lesson_id, title, description, passing_score,
        time_limit_minutes, max_attempts, is_required, randomize_questions,
        show_results, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      course_id || null,
      lesson_id || null,
      title,
      description || null,
      passing_score || 70.00,
      time_limit_minutes || null,
      max_attempts || 1,
      is_required !== undefined ? is_required : true,
      randomize_questions || false,
      show_results !== undefined ? show_results : true,
      status || 'draft'
    ]);
    
    // Fetch the newly created exam by title and course_id/lesson_id
    return await queryOne(
      'SELECT e.*, c.title as course_title, l.title as lesson_title FROM exams e LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN lessons l ON e.lesson_id = l.id WHERE e.title = ? AND (e.course_id = ? OR (? IS NULL AND e.course_id IS NULL)) AND (e.lesson_id = ? OR (? IS NULL AND e.lesson_id IS NULL)) ORDER BY e.created_at DESC LIMIT 1',
      [title, course_id || null, course_id || null, lesson_id || null, lesson_id || null]
    );
  }

  /**
   * Update exam
   */
  static async update(id, examData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'course_id', 'lesson_id', 'title', 'description', 'passing_score',
      'time_limit_minutes', 'max_attempts', 'is_required', 'randomize_questions',
      'show_results', 'status'
    ];

    for (const field of allowedFields) {
      if (examData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(examData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE exams SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete exam
   */
  static async delete(id) {
    const sql = 'DELETE FROM exams WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Exam deleted successfully' };
  }
}

