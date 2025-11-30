import { query, queryOne } from '../config/database.js';

export class Category {
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
   * Find all categories with pagination and search
   */
  static async findAll(page = 1, limit = 100, search = '', parentId = null) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (c.name LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        whereClause += ' AND c.parent_id IS NULL';
      } else {
        whereClause += ' AND c.parent_id = ?';
        params.push(parentId);
      }
    }

    const countSql = `SELECT COUNT(c.id) as total FROM categories c ${whereClause}`;
    const countResult = await queryOne(countSql, params);
    const total = countResult.total;

    const sql = `
      SELECT c.*,
             parent.name as parent_name,
             (SELECT COUNT(*) FROM courses WHERE category_id = c.id) as course_count,
             (SELECT COUNT(*) FROM content_library WHERE category_id = c.id) as content_count,
             (SELECT COUNT(*) FROM learning_paths WHERE category_id = c.id) as learning_path_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      ${whereClause}
      ORDER BY c.name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const categories = await query(sql, params);
    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Find category by ID
   */
  static async findById(id) {
    const sql = `
      SELECT c.*,
             parent.name as parent_name,
             (SELECT COUNT(*) FROM courses WHERE category_id = c.id) as course_count,
             (SELECT COUNT(*) FROM content_library WHERE category_id = c.id) as content_count,
             (SELECT COUNT(*) FROM learning_paths WHERE category_id = c.id) as learning_path_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE c.id = ?
    `;
    return await queryOne(sql, [id]);
  }

  /**
   * Find category by slug
   */
  static async findBySlug(slug) {
    const sql = `
      SELECT c.*,
             parent.name as parent_name
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE c.slug = ?
    `;
    return await queryOne(sql, [slug]);
  }

  /**
   * Get child categories
   */
  static async findChildren(parentId) {
    const sql = `
      SELECT c.*,
             (SELECT COUNT(*) FROM courses WHERE category_id = c.id) as course_count,
             (SELECT COUNT(*) FROM content_library WHERE category_id = c.id) as content_count
      FROM categories c
      WHERE c.parent_id = ?
      ORDER BY c.name ASC
    `;
    return await query(sql, [parentId]);
  }

  /**
   * Create a new category
   */
  static async create(categoryData) {
    const {
      name,
      slug,
      description,
      parent_id,
      icon,
      color
    } = categoryData;

    const categorySlug = slug || this.generateSlug(name);

    const sql = `
      INSERT INTO categories (name, slug, description, parent_id, icon, color)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      name,
      categorySlug,
      description || null,
      parent_id || null,
      icon || null,
      color || null
    ]);

    // Fetch the newly created category by slug
    return await this.findBySlug(categorySlug);
  }

  /**
   * Update category
   */
  static async update(id, categoryData) {
    const updates = [];
    const values = [];

    const allowedFields = ['name', 'slug', 'description', 'parent_id', 'icon', 'color'];

    for (const field of allowedFields) {
      if (categoryData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(categoryData[field]);
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete category
   */
  static async delete(id) {
    // Check if category has children
    const children = await this.findChildren(id);
    if (children.length > 0) {
      throw new Error('Cannot delete category with subcategories. Please delete or move subcategories first.');
    }

    // Check if category is used by courses, content, or learning paths
    const category = await this.findById(id);
    const totalUsage = (category.course_count || 0) + (category.content_count || 0) + (category.learning_path_count || 0);
    
    if (totalUsage > 0) {
      throw new Error(`Cannot delete category that is used by ${totalUsage} item(s). Please reassign items first.`);
    }

    const sql = 'DELETE FROM categories WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Category deleted successfully' };
  }
}

