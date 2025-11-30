import { query, queryOne } from '../config/database.js';

export class Course {
  /**
   * Find course by ID
   */
  static async findById(id) {
    const sql = `
      SELECT c.*, 
             cat.name as category_name,
             u.name as instructor_name,
             u.email as instructor_email
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find course by slug
   */
  static async findBySlug(slug) {
    const sql = `
      SELECT c.*, 
             cat.name as category_name,
             u.name as instructor_name,
             u.email as instructor_email
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.slug = ?
    `;
    return await queryOne(sql, [slug]);
  }

  /**
   * Get all courses with pagination
   */
  static async findAll(page = 1, limit = 20, search = '', status = 'all', categoryId = null) {
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(c.title LIKE ? OR c.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      whereConditions.push('c.status = ?');
      params.push(status);
    }

    if (categoryId) {
      whereConditions.push('c.category_id = ?');
      params.push(categoryId);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const countSql = `
      SELECT COUNT(*) as total
      FROM courses c
      ${whereClause}
    `;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT c.*, 
             cat.name as category_name,
             u.name as instructor_name
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const courses = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      courses,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Create a new course
   */
  static async create(courseData) {
    const {
      title,
      slug,
      description,
      short_description,
      category_id,
      instructor_id,
      thumbnail_url,
      status,
      difficulty_level,
      duration_minutes,
      language,
      is_featured
    } = courseData;

    const sql = `
      INSERT INTO courses (
        title, slug, description, short_description, category_id, instructor_id,
        thumbnail_url, status, difficulty_level, duration_minutes, language, is_featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      title,
      slug || this.generateSlug(title),
      description || null,
      short_description || null,
      category_id || null,
      instructor_id || null,
      thumbnail_url || null,
      status || 'draft',
      difficulty_level || 'beginner',
      duration_minutes || 0,
      language || 'en',
      is_featured || false
    ]);

    // UUID is auto-generated, so fetch by slug to get the created course
    return await this.findBySlug(slug || this.generateSlug(title));
  }

  /**
   * Update course
   */
  static async update(id, courseData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'title', 'slug', 'description', 'short_description', 'category_id',
      'instructor_id', 'thumbnail_url', 'status', 'difficulty_level',
      'duration_minutes', 'language', 'is_featured'
    ];

    for (const field of allowedFields) {
      if (courseData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(courseData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete course
   */
  static async delete(id) {
    const sql = `DELETE FROM courses WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get tags for a course
   */
  static async getTags(courseId) {
    const sql = `
      SELECT t.id, t.name, t.slug
      FROM tags t
      INNER JOIN course_tags ct ON t.id = ct.tag_id
      WHERE ct.course_id = ?
      ORDER BY t.name ASC
    `;
    return await query(sql, [courseId]);
  }

  /**
   * Set tags for a course (replaces existing tags)
   */
  static async setTags(courseId, tagIds) {
    // First, delete all existing tags
    await query('DELETE FROM course_tags WHERE course_id = ?', [courseId]);
    
    // Then, insert new tags one by one
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await query('INSERT INTO course_tags (course_id, tag_id) VALUES (?, ?)', [courseId, tagId]);
      }
    }
    
    return await this.getTags(courseId);
  }
}

