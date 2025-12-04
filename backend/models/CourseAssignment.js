import { query, queryOne } from '../config/database.js';

export class CourseAssignment {
    /**
     * Assign course to user or group
     */
    static async create(assignmentData) {
        const { course_id, group_id, user_id, assigned_by, due_date } = assignmentData;

        // Validate that either group_id or user_id is provided
        if (!group_id && !user_id) {
            throw new Error('Either group_id or user_id must be provided');
        }

        const sql = `
      INSERT INTO course_assignments (course_id, group_id, user_id, assigned_by, due_date)
      VALUES (?, ?, ?, ?, ?)
    `;

        await query(sql, [course_id, group_id || null, user_id || null, assigned_by, due_date || null]);

        // Return the created assignment(s) - simplified to return success for now
        return { success: true, message: 'Assignment created successfully' };
    }

    /**
     * Get assignments for a user (direct + group)
     */
    static async getForUser(userId) {
        const sql = `
      SELECT ca.*, c.title as course_title, c.thumbnail_url
      FROM course_assignments ca
      JOIN courses c ON ca.course_id = c.id
      LEFT JOIN user_group_members ugm ON ca.group_id = ugm.group_id
      WHERE ca.user_id = ? OR ugm.user_id = ?
      GROUP BY ca.course_id -- Deduplicate if assigned both directly and via group
    `;
        return await query(sql, [userId, userId]);
    }

    /**
     * Get assignments by course
     */
    static async getByCourse(courseId) {
        const sql = `
      SELECT ca.*, 
             u.name as user_name, u.email as user_email,
             g.name as group_name
      FROM course_assignments ca
      LEFT JOIN users u ON ca.user_id = u.id
      LEFT JOIN user_groups g ON ca.group_id = g.id
      WHERE ca.course_id = ?
    `;
        return await query(sql, [courseId]);
    }

    /**
     * Delete assignment
     */
    static async delete(id) {
        const sql = `DELETE FROM course_assignments WHERE id = ?`;
        await query(sql, [id]);
        return true;
    }
}
