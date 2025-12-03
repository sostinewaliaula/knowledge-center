import { Settings } from '../models/Settings.js';
import { sendTestEmail } from '../utils/email.js';

export const getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.findAll();
        // Convert array to object keyed by category
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.category] = curr.settings; // MySQL driver might auto-parse JSON, if not we need JSON.parse
            if (typeof acc[curr.category] === 'string') {
                try {
                    acc[curr.category] = JSON.parse(acc[curr.category]);
                } catch (e) {
                    // ignore
                }
            }
            return acc;
        }, {});
        res.json(settingsMap);
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const { category } = req.params;
        const settings = req.body;

        const updated = await Settings.update(category, settings);

        let result = updated.settings;
        if (typeof result === 'string') {
            try {
                result = JSON.parse(result);
            } catch (e) {
                // ignore
            }
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const testEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Use provided email or fallback to user's email
        const targetEmail = email || req.user.email;

        if (!targetEmail) {
            return res.status(400).json({
                success: false,
                error: 'Target email is required'
            });
        }

        await sendTestEmail(targetEmail);

        res.json({
            success: true,
            message: `Test email sent to ${targetEmail}`
        });
    } catch (error) {
        next(error);
    }
};
