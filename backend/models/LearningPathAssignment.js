import { query, queryOne } from '../config/database.js';

export class LearningPathAssignment {
    /**
     * Assign learning path to user or group
     */
    static async create(assignmentData) {
        const { learning_path_id, group_id, user_id, assigned_by, due_date } = assignmentData;

        // Validate that either group_id or user_id is provided
        if (!group_id && !user_id) {
            throw new Error('Either group_id or user_id must be provided');
        }

        const sql = `
      INSERT INTO learning_path_assignments (learning_path_id, group_id, user_id, assigned_by, due_date)
      VALUES (?, ?, ?, ?, ?)
    `;

        await query(sql, [learning_path_id, group_id || null, user_id || null, assigned_by, due_date || null]);

        return { success: true, message: 'Learning path assignment created successfully' };
    }

    /**
     * Get assignments for a user (direct + group)
     */
    static async getForUser(userId) {
        const sql = `
      SELECT lpa.*, lp.title as path_title, lp.thumbnail_url
      FROM learning_path_assignments lpa
      JOIN learning_paths lp ON lpa.learning_path_id = lp.id
      LEFT JOIN user_group_members ugm ON lpa.group_id = ugm.group_id
      WHERE lpa.user_id = ? OR ugm.user_id = ?
      GROUP BY lpa.learning_path_id -- Deduplicate if assigned both directly and via group
    `;
        return await query(sql, [userId, userId]);
    }

    /**
     * Get assignments by learning path
     */
    static async getByPath(pathId) {
        const sql = `
      SELECT lpa.*, 
             u.name as user_name, u.email as user_email,
             g.name as group_name
      FROM learning_path_assignments lpa
      LEFT JOIN users u ON lpa.user_id = u.id
      LEFT JOIN user_groups g ON lpa.group_id = g.id
      WHERE lpa.learning_path_id = ?
    `;
        return await query(sql, [pathId]);
    }

    /**
     * Delete assignment
     */
    static async delete(id) {
        const sql = `DELETE FROM learning_path_assignments WHERE id = ?`;
        await query(sql, [id]);
        return true;
    }
}
