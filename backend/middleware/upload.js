import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'content');
(async () => {
  await fs.mkdir(uploadsDir, { recursive: true }).catch(() => { });
})();

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

import { Settings } from '../models/Settings.js';

// File filter
const fileFilter = async (req, file, cb) => {
  try {
    // Fetch content settings
    const settingsRow = await Settings.findByCategory('content');
    let contentSettings = {};

    if (settingsRow && settingsRow.settings) {
      try {
        contentSettings = typeof settingsRow.settings === 'string'
          ? JSON.parse(settingsRow.settings)
          : settingsRow.settings;
      } catch (e) {
        console.error('Failed to parse content settings:', e);
      }
    }

    // If no settings or no restrictions, allow all
    if (!contentSettings.allowedFileTypes && !contentSettings.allowedImageTypes && !contentSettings.allowedVideoTypes && !contentSettings.allowedAudioTypes) {
      return cb(null, true);
    }

    const ext = path.extname(file.originalname).toLowerCase().substring(1); // remove dot

    // Combine all allowed extensions
    const allowedExtensions = [
      ...(contentSettings.allowedFileTypes || []),
      ...(contentSettings.allowedImageTypes || []),
      ...(contentSettings.allowedVideoTypes || []),
      ...(contentSettings.allowedAudioTypes || [])
    ];

    if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
      return cb(new Error(`File type .${ext} is not allowed`), false);
    }

    cb(null, true);
  } catch (error) {
    console.error('Error in file filter:', error);
    cb(new Error('Failed to validate file type'), false);
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size
  }
});

// Helper function to get file type from mimetype
export const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
  if (mimetype.includes('text')) return 'document';
  if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) return 'document';
  return 'other';
};

// Get relative path for database storage
export const getRelativePath = (filename) => {
  return path.join('uploads', 'content', filename).replace(/\\/g, '/');
};

