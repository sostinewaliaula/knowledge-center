import { query, queryOne } from '../config/database.js';

export class Settings {
    static async findAll() {
        const sql = 'SELECT * FROM system_settings';
        return await query(sql);
    }

    static async findByCategory(category) {
        const sql = 'SELECT * FROM system_settings WHERE category = ?';
        return await queryOne(sql, [category]);
    }

    static async update(category, settings) {
        // Check if exists
        const existing = await this.findByCategory(category);

        if (existing) {
            const sql = 'UPDATE system_settings SET settings = ? WHERE category = ?';
            await query(sql, [JSON.stringify(settings), category]);
        } else {
            const sql = 'INSERT INTO system_settings (category, settings) VALUES (?, ?)';
            await query(sql, [category, JSON.stringify(settings)]);
        }

        return await this.findByCategory(category);
    }
}
