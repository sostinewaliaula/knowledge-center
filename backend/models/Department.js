import { query, queryOne } from '../config/database.js';

export class Department {
    /**
     * Find department by ID
     */
    static async findById(id) {
        const sql = `
            SELECT d.*, u.name as manager_name, u.email as manager_email
            FROM departments d
            LEFT JOIN users u ON d.manager_id = u.id
            WHERE d.id = ?
        `;
        return await queryOne(sql, [id]);
    }

    /**
     * Create a new department
     */
    static async create(data) {
        const { name, description, manager_id, parent_id } = data;
        const sql = `INSERT INTO departments (name, description, manager_id, parent_id) VALUES (?, ?, ?, ?)`;
        await query(sql, [name, description, manager_id || null, parent_id || null]);

        // Fetch the created department
        const fetchSql = `SELECT * FROM departments WHERE name = ? ORDER BY created_at DESC LIMIT 1`;
        return await queryOne(fetchSql, [name]);
    }

    /**
     * Update department
     */
    static async update(id, data) {
        const { name, description, manager_id, parent_id } = data;
        const sql = `UPDATE departments SET name = ?, description = ?, manager_id = ?, parent_id = ? WHERE id = ?`;
        await query(sql, [name, description, manager_id || null, parent_id || null, id]);
        return await this.findById(id);
    }

    /**
     * Delete department
     */
    static async delete(id) {
        const sql = `DELETE FROM departments WHERE id = ?`;
        await query(sql, [id]);
        return true;
    }

    /**
     * Get all departments with stats
     */
    static async findAll(page = 1, limit = 10, search = '') {
        const offset = (page - 1) * limit;

        // Base query for departments with manager info
        let sql = `
            SELECT 
                d.*, 
                u.name as manager_name,
                (SELECT COUNT(*) FROM user_departments ud WHERE ud.department_id = d.id) as employee_count,
                (SELECT COUNT(DISTINCT course_id) FROM compliance_requirements cr WHERE cr.department_id = d.id) as course_count
            FROM departments d
            LEFT JOIN users u ON d.manager_id = u.id
        `;

        const params = [];

        if (search) {
            sql += ` WHERE d.name LIKE ? OR d.description LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY d.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const departments = await query(sql, params);

        // Count total
        let countSql = `SELECT COUNT(*) as total FROM departments d`;
        const countParams = [];
        if (search) {
            countSql += ` WHERE d.name LIKE ? OR d.description LIKE ?`;
            countParams.push(`%${search}%`, `%${search}%`);
        }
        const countResult = await queryOne(countSql, countParams);

        // Calculate completion rate (mock logic or real if possible)
        // For now, let's mock completion rate or calculate it if we have data.
        // Real calculation would be complex: Avg progress of all users in the dept for all assigned courses.
        // We'll leave it as 0 or mock for now, or try a simple query if feasible.
        // Let's just return 0 for completion_rate to avoid performance hit, frontend can handle it.
        const departmentsWithStats = departments.map(dept => ({
            ...dept,
            completionRate: 0 // Placeholder
        }));

        return {
            departments: departmentsWithStats,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: Number(countResult.total),
                pages: Math.ceil(countResult.total / limit)
            }
        };
    }

    /**
     * Get department members
     */
    static async getMembers(departmentId) {
        const sql = `
            SELECT u.id, u.name, u.email, ud.role, ud.joined_at
            FROM users u
            JOIN user_departments ud ON u.id = ud.user_id
            WHERE ud.department_id = ?
        `;
        return await query(sql, [departmentId]);
    }

    /**
     * Add member to department
     */
    static async addMember(departmentId, userId, role = 'member') {
        const sql = `INSERT INTO user_departments (department_id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = ?`;
        await query(sql, [departmentId, userId, role, role]);
        return true;
    }

    /**
     * Remove member from department
     */
    static async removeMember(departmentId, userId) {
        const sql = `DELETE FROM user_departments WHERE department_id = ? AND user_id = ?`;
        await query(sql, [departmentId, userId]);
        return true;
    }
}
