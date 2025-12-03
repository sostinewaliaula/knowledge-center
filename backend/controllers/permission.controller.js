import { Permission } from '../models/Permission.js';

export const getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.findAll();

    const grouped = permissions.reduce((acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = [];
      }
      acc[perm.category].push({
        id: perm.id,
        key: perm.key,
        name: perm.name,
        description: perm.description
      });
      return acc;
    }, {});

    const categories = Object.keys(grouped).map((category) => ({
      category,
      permissions: grouped[category]
    }));

    res.json({
      success: true,
      permissions: categories
    });
  } catch (error) {
    next(error);
  }
};


