import { query, queryOne } from '../config/database.js';
import path from 'path';
import fs from 'fs/promises';

export class ContentLibrary {
  /**
   * Find content by ID
   */
  static async findById(id) {
    const sql = `
      SELECT cl.*, u.name as uploaded_by_name, u.email as uploaded_by_email,
             c.name as category_name
      FROM content_library cl
      LEFT JOIN users u ON cl.uploaded_by = u.id
      LEFT JOIN categories c ON cl.category_id = c.id
      WHERE cl.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Get all content with pagination
   */
  static async findAll(page = 1, limit = 20, search = '', filterType = 'all') {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT cl.*, u.name as uploaded_by_name, u.email as uploaded_by_email,
             c.name as category_name
      FROM content_library cl
      LEFT JOIN users u ON cl.uploaded_by = u.id
      LEFT JOIN categories c ON cl.category_id = c.id
    `;
    
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push('(cl.title LIKE ? OR cl.file_name LIKE ? OR cl.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (filterType && filterType !== 'all') {
      conditions.push('cl.file_type = ?');
      params.push(filterType);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ` ORDER BY cl.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    const contents = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM content_library cl';
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;
    
    return {
      contents,
      pagination: {
        page,
        limit,
        total: Number(total),
        pages: Math.ceil(Number(total) / limit)
      }
    };
  }

  /**
   * Create new content entry
   */
  static async create(contentData) {
    const {
      title,
      description,
      file_name,
      file_path,
      file_type,
      file_size,
      mime_type,
      uploaded_by,
      category_id,
      is_public = false
    } = contentData;
    
    const sql = `
      INSERT INTO content_library (
        title, description, file_name, file_path, file_type, 
        file_size, mime_type, uploaded_by, category_id, is_public
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      title,
      description || null,
      file_name,
      file_path,
      file_type || null,
      file_size || null,
      mime_type || null,
      uploaded_by,
      category_id || null,
      is_public
    ]);
    
    // UUID is auto-generated, so fetch by file_name and uploaded_by to get the created content
    const result = await query(
      'SELECT cl.*, u.name as uploaded_by_name, u.email as uploaded_by_email, c.name as category_name FROM content_library cl LEFT JOIN users u ON cl.uploaded_by = u.id LEFT JOIN categories c ON cl.category_id = c.id WHERE cl.file_name = ? AND cl.uploaded_by = ? ORDER BY cl.created_at DESC LIMIT 1',
      [file_name, uploaded_by]
    );
    
    return result[0] || null;
  }

  /**
   * Update content
   */
  static async update(id, contentData) {
    const updates = [];
    const values = [];
    
    if (contentData.title !== undefined) {
      updates.push('title = ?');
      values.push(contentData.title);
    }
    
    if (contentData.description !== undefined) {
      updates.push('description = ?');
      values.push(contentData.description);
    }
    
    if (contentData.category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(contentData.category_id);
    }
    
    if (contentData.is_public !== undefined) {
      updates.push('is_public = ?');
      values.push(contentData.is_public);
    }
    
    if (updates.length === 0) {
      return await this.findById(id);
    }
    
    values.push(id);
    const sql = `UPDATE content_library SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return await this.findById(id);
  }

  /**
   * Delete content and its file
   */
  static async delete(id) {
    const content = await this.findById(id);
    if (!content) {
      throw new Error('Content not found');
    }
    
    // Delete file from filesystem
    try {
      const filePath = content.file_path;
      if (filePath) {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.unlink(fullPath).catch(() => {
          // Ignore file deletion errors (file might not exist)
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with database deletion even if file deletion fails
    }
    
    // Delete from database
    const sql = 'DELETE FROM content_library WHERE id = ?';
    await query(sql, [id]);
    
    return true;
  }

  /**
   * Increment download count
   */
  static async incrementDownloadCount(id) {
    const sql = 'UPDATE content_library SET download_count = download_count + 1 WHERE id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}

