import { query, queryOne } from '../config/database.js';

export class Template {
  /**
   * Find all templates with pagination, search, and filter
   */
  static async findAll(page = 1, limit = 20, search = '', type = 'all', isPublic = null) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (t.name LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (type !== 'all') {
      whereClause += ' AND t.type = ?';
      params.push(type);
    }
    if (isPublic !== null) {
      whereClause += ' AND t.is_public = ?';
      params.push(isPublic);
    }

    const countSql = `SELECT COUNT(t.id) as total FROM templates t ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT t.*, 
             u.name as author_name,
             u.email as author_email
      FROM templates t
      LEFT JOIN users u ON t.created_by = u.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const templates = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      templates,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find template by ID
   */
  static async findById(id) {
    const sql = `
      SELECT t.*, 
             u.name as author_name,
             u.email as author_email
      FROM templates t
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `;
    const template = await queryOne(sql, [id]);
    
    if (template && template.template_data) {
      // Parse JSON if it's a string
      if (typeof template.template_data === 'string') {
        try {
          template.template_data = JSON.parse(template.template_data);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }
    }
    
    return template;
  }

  /**
   * Create a new template
   */
  static async create(templateData) {
    const {
      name,
      description,
      type,
      template_data,
      thumbnail_url,
      is_public,
      created_by
    } = templateData;

    // Ensure template_data is JSON string
    const templateDataJson = typeof template_data === 'string' 
      ? template_data 
      : JSON.stringify(template_data);

    const sql = `
      INSERT INTO templates (
        name, description, type, template_data, thumbnail_url, is_public, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      name,
      description || null,
      type,
      templateDataJson,
      thumbnail_url || null,
      is_public || false,
      created_by
    ]);
    
    // Fetch the newly created template by name and created_by
    return await queryOne(
      'SELECT t.*, u.name as author_name, u.email as author_email FROM templates t LEFT JOIN users u ON t.created_by = u.id WHERE t.name = ? AND t.created_by = ? ORDER BY t.created_at DESC LIMIT 1',
      [name, created_by]
    );
  }

  /**
   * Update template
   */
  static async update(id, templateData) {
    const updates = [];
    const values = [];

    const allowedFields = ['name', 'description', 'type', 'template_data', 'thumbnail_url', 'is_public'];

    for (const field of allowedFields) {
      if (templateData[field] !== undefined) {
        if (field === 'template_data') {
          // Ensure template_data is JSON string
          const templateDataJson = typeof templateData[field] === 'string' 
            ? templateData[field] 
            : JSON.stringify(templateData[field]);
          updates.push(`${field} = ?`);
          values.push(templateDataJson);
        } else {
          updates.push(`${field} = ?`);
          values.push(templateData[field]);
        }
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE templates SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete template
   */
  static async delete(id) {
    const sql = 'DELETE FROM templates WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Template deleted successfully' };
  }

  /**
   * Increment usage count
   */
  static async incrementUsageCount(id) {
    const sql = 'UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}

