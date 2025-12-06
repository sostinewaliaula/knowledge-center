import { query, queryOne } from '../config/database.js';

export class UserGroup {
    /**
     * Find group by ID
     */
    static async findById(id) {
        const sql = `SELECT * FROM user_groups WHERE id = ?`;
        return await queryOne(sql, [id]);
    }

    /**
     * Create a new group
     */
    static async create(groupData) {
        const { name, description } = groupData;
        const sql = `INSERT INTO user_groups (name, description) VALUES (?, ?)`;
        const result = await query(sql, [name, description]);
        // Since UUID is auto-generated, we need to fetch the last inserted or find by name/desc if possible.
        // However, MySQL UUID() in default value makes it tricky to get ID back without a select.
        // A better approach for UUIDs is often to generate them in app, but schema uses DEFAULT (UUID()).
        // We'll select by name and created_at desc to get the latest one.
        const fetchSql = `SELECT * FROM user_groups WHERE name = ? ORDER BY created_at DESC LIMIT 1`;
        return await queryOne(fetchSql, [name]);
    }

    /**
     * Update group
     */
    static async update(id, groupData) {
        const { name, description } = groupData;
        const sql = `UPDATE user_groups SET name = ?, description = ? WHERE id = ?`;
        await query(sql, [name, description, id]);
        return await this.findById(id);
    }

    /**
     * Delete group
     */
    static async delete(id) {
        const sql = `DELETE FROM user_groups WHERE id = ?`;
        await query(sql, [id]);
        return true;
    }

    /**
     * Get all groups
     */
    static async findAll(page = 1, limit = 10, search = '') {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT ug.*, COUNT(ugm.user_id) as member_count 
            FROM user_groups ug
            LEFT JOIN user_group_members ugm ON ug.id = ugm.group_id
        `;
        const params = [];

        if (search) {
            sql += ` WHERE ug.name LIKE ?`;
            params.push(`%${search}%`);
        }

        sql += ` GROUP BY ug.id ORDER BY ug.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        const groups = await query(sql, params);

        // Count total
        let countSql = `SELECT COUNT(*) as total FROM user_groups`;
        const countParams = [];
        if (search) {
            countSql += ` WHERE name LIKE ?`;
            countParams.push(`%${search}%`);
        }
        const countResult = await queryOne(countSql, countParams);

        return {
            groups,
            page,
            limit,
            totalPages: Math.ceil(countResult.total / limit)
        };
    }

    /**
     * Add member to group (and remove from any other groups)
     */
    static async addMember(groupId, userId) {
        // First remove from any existing groups to enforce 1-group-per-user
        const deleteSql = `DELETE FROM user_group_members WHERE user_id = ?`;
        await query(deleteSql, [userId]);

        // Then add to new group
        const sql = `INSERT INTO user_group_members (group_id, user_id) VALUES (?, ?)`;
        await query(sql, [groupId, userId]);
        return true;
    }

    /**
     * Get group members
     */
    static async getMembers(groupId) {
        const sql = `
      SELECT u.id, u.name, u.email, ugm.joined_at
      FROM users u
      JOIN user_group_members ugm ON u.id = ugm.user_id
      WHERE ugm.group_id = ?
    `;
        return await query(sql, [groupId]);
    }
}
