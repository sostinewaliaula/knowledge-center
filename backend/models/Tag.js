import { query, queryOne } from '../config/database.js';

export class Tag {
  /**
   * Generate slug from name
   */
  static generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
  }

  /**
   * Find all tags with pagination and search
   */
  static async findAll(page = 1, limit = 100, search = '') {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND t.name LIKE ?';
      params.push(`%${search}%`);
    }

    const countSql = `SELECT COUNT(t.id) as total FROM tags t ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    // Use simpler query that handles missing tables gracefully
    const sql = `
      SELECT t.*,
             0 as course_count,
             0 as content_count,
             0 as learning_path_count
      FROM tags t
      ${whereClause}
      ORDER BY t.name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const tags = await query(sql, params);
    
    // Try to get actual counts if tables exist (optional enhancement)
    for (let tag of tags) {
      try {
        const courseCount = await queryOne('SELECT COUNT(*) as count FROM course_tags WHERE tag_id = ?', [tag.id]);
        tag.course_count = courseCount.count || 0;
      } catch (error) {
        tag.course_count = 0;
      }
      
      try {
        const contentCount = await queryOne('SELECT COUNT(*) as count FROM content_tags WHERE tag_id = ?', [tag.id]);
        tag.content_count = contentCount.count || 0;
      } catch (error) {
        tag.content_count = 0;
      }
      
      try {
        const learningPathCount = await queryOne('SELECT COUNT(*) as count FROM learning_path_tags WHERE tag_id = ?', [tag.id]);
        tag.learning_path_count = learningPathCount.count || 0;
      } catch (error) {
        tag.learning_path_count = 0;
      }
    }
    
    const totalPages = Math.ceil(total / limit);

    return {
      tags,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find tag by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM tags WHERE id = ?';
    const tag = await queryOne(sql, [id]);
    
    if (!tag) return null;
    
    // Try to get actual counts if tables exist
    try {
      const courseCount = await queryOne('SELECT COUNT(*) as count FROM course_tags WHERE tag_id = ?', [id]);
      tag.course_count = courseCount.count || 0;
    } catch (error) {
      tag.course_count = 0;
    }
    
    try {
      const contentCount = await queryOne('SELECT COUNT(*) as count FROM content_tags WHERE tag_id = ?', [id]);
      tag.content_count = contentCount.count || 0;
    } catch (error) {
      tag.content_count = 0;
    }
    
    try {
      const learningPathCount = await queryOne('SELECT COUNT(*) as count FROM learning_path_tags WHERE tag_id = ?', [id]);
      tag.learning_path_count = learningPathCount.count || 0;
    } catch (error) {
      tag.learning_path_count = 0;
    }
    
    return tag;
  }

  /**
   * Find tag by slug
   */
  static async findBySlug(slug) {
    const sql = 'SELECT * FROM tags WHERE slug = ?';
    return await queryOne(sql, [slug]);
  }

  /**
   * Create a new tag
   */
  static async create(tagData) {
    const { name, slug } = tagData;

    const tagSlug = slug || this.generateSlug(name);

    const sql = `
      INSERT INTO tags (name, slug)
      VALUES (?, ?)
    `;

    await query(sql, [name, tagSlug]);

    // Fetch the newly created tag by slug
    return await this.findBySlug(tagSlug);
  }

  /**
   * Update tag
   */
  static async update(id, tagData) {
    const updates = [];
    const values = [];

    const allowedFields = ['name', 'slug'];

    for (const field of allowedFields) {
      if (tagData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(tagData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE tags SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete tag
   * Automatically disassociates the tag from all items before deletion
   */
  static async delete(id) {
    // Get tag info for return value
    const tag = await this.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    const totalUsage = (tag.course_count || 0) + (tag.content_count || 0) + (tag.learning_path_count || 0);
    
    // Disassociate tag from all items before deletion
    if (totalUsage > 0) {
      // Remove tag from courses (via course_tags table)
      try {
        await query('DELETE FROM course_tags WHERE tag_id = ?', [id]);
      } catch (error) {
        // Table might not exist, ignore
      }
      
      // Remove tag from content (via content_tags table)
      try {
        await query('DELETE FROM content_tags WHERE tag_id = ?', [id]);
      } catch (error) {
        // Table might not exist, ignore
      }
      
      // Remove tag from learning paths (via learning_path_tags table)
      try {
        await query('DELETE FROM learning_path_tags WHERE tag_id = ?', [id]);
      } catch (error) {
        // Table might not exist, ignore
      }
    }

    // Delete the tag
    const sql = 'DELETE FROM tags WHERE id = ?';
    await query(sql, [id]);
    
    return { 
      message: 'Tag deleted successfully',
      disassociatedItems: totalUsage
    };
  }
}

