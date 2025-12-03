import { query, queryOne } from '../config/database.js';
import { randomUUID } from 'crypto';

export class LiveSession {
    static async findAll(filters = {}) {
        let sql = `
      SELECT ls.*, 
             u.name as instructor_name,
             (SELECT COUNT(*) FROM live_session_attendees WHERE session_id = ls.id) as attendees_count
      FROM live_sessions ls
      LEFT JOIN users u ON ls.instructor_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (filters.status) {
            sql += ' AND ls.status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            sql += ' AND (ls.title LIKE ? OR ls.description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        sql += ' ORDER BY ls.scheduled_at ASC';

        return await query(sql, params);
    }

    static async findById(id) {
        const sql = `
      SELECT ls.*, 
             u.name as instructor_name,
             (SELECT COUNT(*) FROM live_session_attendees WHERE session_id = ls.id) as attendees_count
      FROM live_sessions ls
      LEFT JOIN users u ON ls.instructor_id = u.id
      WHERE ls.id = ?
    `;
        return await queryOne(sql, [id]);
    }

    static async create(data) {
        const {
            title,
            description,
            instructor_id,
            platform,
            meeting_url,
            meeting_id,
            meeting_password,
            scheduled_at,
            duration_minutes,
            max_attendees,
            status,
            category
        } = data;

        const id = randomUUID();

        const sql = `
      INSERT INTO live_sessions (
        id, title, description, instructor_id, platform, meeting_url, 
        meeting_id, meeting_password, scheduled_at, duration_minutes, 
        max_attendees, status, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await query(sql, [
            id,
            title,
            description || null,
            instructor_id,
            platform || 'zoom',
            meeting_url || null,
            meeting_id || null,
            meeting_password || null,
            scheduled_at,
            duration_minutes || 60,
            max_attendees || null,
            status || 'scheduled',
            category || null
        ]);

        return await this.findById(id);
    }

    static async update(id, data) {
        const allowedFields = [
            'title', 'description', 'instructor_id', 'platform', 'meeting_url',
            'meeting_id', 'meeting_password', 'scheduled_at', 'duration_minutes',
            'max_attendees', 'status', 'category'
        ];

        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(data[field]);
            }
        }

        if (updates.length === 0) return await this.findById(id);

        params.push(id);
        const sql = `UPDATE live_sessions SET ${updates.join(', ')} WHERE id = ?`;

        await query(sql, params);
        return await this.findById(id);
    }

    static async delete(id) {
        const sql = 'DELETE FROM live_sessions WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}
