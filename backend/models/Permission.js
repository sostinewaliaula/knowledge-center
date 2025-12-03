import { query } from '../config/database.js';

export class Permission {
  static async findAll() {
    const sql = `
      SELECT *
      FROM permissions
      ORDER BY category ASC, name ASC
    `;
    return await query(sql);
  }

  static async findKeysByRole(roleId) {
    const sql = `
      SELECT p.key
      FROM permissions p
      INNER JOIN role_permissions rp ON rp.permission_id = p.id
      WHERE rp.role_id = ?
      ORDER BY p.key ASC
    `;
    const rows = await query(sql, [roleId]);
    return rows.map((row) => row.key);
  }

  static async setRolePermissions(roleId, permissionKeys = []) {
    // Clear existing permissions
    await query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

    if (!permissionKeys.length) {
      return [];
    }

    // Fetch permission IDs for the provided keys
    const placeholders = permissionKeys.map(() => '?').join(',');
    const permissions = await query(
      `SELECT id, key FROM permissions WHERE \`key\` IN (${placeholders})`,
      permissionKeys
    );

    if (!permissions.length) {
      return [];
    }

    // Insert new role-permission pairs
    for (const permission of permissions) {
      await query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [roleId, permission.id]
      );
    }

    return permissions.map((perm) => perm.key);
  }
}


