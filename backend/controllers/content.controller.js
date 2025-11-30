import { ContentLibrary } from '../models/ContentLibrary.js';
import { getFileType, getRelativePath } from '../middleware/upload.js';
import {
  detectSourceType,
  validateUrl,
  validateYouTubeUrl,
  validateVimeoUrl,
  validateGoogleDriveUrl,
  validateMicrosoftOfficeUrl,
  generateEmbedCode,
  getFileTypeFromUrl
} from '../utils/contentSources.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all content with pagination
 */
export const getContents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const search = req.query.search || '';
    const filterType = req.query.filterType || 'all';

    const result = await ContentLibrary.findAll(page, limit, search, filterType);

    res.json({
      success: true,
      contents: result.contents,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.pages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const content = await ContentLibrary.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    res.json({
      success: true,
      content
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload content
 */
export const uploadContent = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { title, description, category_id, is_public } = req.body;
    const file = req.file;

    if (!title || !title.trim()) {
      // Use filename as title if not provided
      const filenameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
      var contentTitle = filenameWithoutExt.replace(/[_-]/g, ' ');
    } else {
      var contentTitle = title.trim();
    }

    const contentData = {
      title: contentTitle,
      description: description || null,
      file_name: file.originalname,
      file_path: getRelativePath(file.filename),
      file_type: getFileType(file.mimetype),
      file_size: file.size,
      mime_type: file.mimetype,
      uploaded_by: req.user.id,
      category_id: category_id || null,
      is_public: is_public === 'true' || is_public === true
    };

    const content = await ContentLibrary.create(contentData);

    res.status(201).json({
      success: true,
      content
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add content from URL
 */
export const addContentFromUrl = async (req, res, next) => {
  try {
    const { url, title, description, category_id, is_public } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    const sourceUrl = url.trim();
    const sourceType = detectSourceType(sourceUrl);
    let validatedUrl;
    let embedCode = null;
    let thumbnailUrl = null;
    let videoId = null;
    let fileId = null;

    // Validate based on source type
    switch (sourceType) {
      case 'youtube':
        validatedUrl = validateYouTubeUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid YouTube URL'
          });
        }
        embedCode = generateEmbedCode('youtube', sourceUrl);
        thumbnailUrl = validatedUrl.thumbnailUrl;
        videoId = validatedUrl.videoId;
        break;

      case 'vimeo':
        validatedUrl = validateVimeoUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid Vimeo URL'
          });
        }
        embedCode = generateEmbedCode('vimeo', sourceUrl);
        videoId = validatedUrl.videoId;
        break;

      case 'dailymotion':
        // Basic validation for Dailymotion
        if (!sourceUrl.includes('dailymotion.com')) {
          return res.status(400).json({
            success: false,
            error: 'Invalid Dailymotion URL'
          });
        }
        embedCode = generateEmbedCode('dailymotion', sourceUrl);
        break;

      case 'googledrive':
        validatedUrl = validateGoogleDriveUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid Google Drive/Docs URL. Make sure the file has "Anyone with the link can view" permission.'
          });
        }
        embedCode = generateEmbedCode('googledrive', sourceUrl);
        fileId = validatedUrl.fileId;
        break;

      case 'microsoft':
        validatedUrl = validateMicrosoftOfficeUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid Microsoft Office URL'
          });
        }
        embedCode = generateEmbedCode('microsoft', sourceUrl);
        fileId = validatedUrl.fileId;
        break;

      case 'url':
        validatedUrl = validateUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid URL'
          });
        }
        break;

      default:
        // For other types (onedrive, dropbox, etc.), just validate as URL
        validatedUrl = validateUrl(sourceUrl);
        if (!validatedUrl.valid) {
          return res.status(400).json({
            success: false,
            error: validatedUrl.error || 'Invalid URL'
          });
        }
        break;
    }

    // Generate title from URL if not provided
    let contentTitle = title?.trim();
    if (!contentTitle) {
      if (sourceType === 'youtube' && videoId) {
        // For YouTube, we could fetch the title via API, but for now use a default
        contentTitle = `YouTube Video - ${videoId}`;
      } else if (sourceType === 'googledrive' && fileId) {
        contentTitle = `Google Drive File - ${fileId.substring(0, 8)}...`;
      } else {
        // Extract from URL
        try {
          const urlObj = new URL(sourceUrl);
          contentTitle = urlObj.pathname.split('/').pop() || 'External Content';
          contentTitle = contentTitle.replace(/[_-]/g, ' ').replace(/\.[^/.]+$/, '');
        } catch {
          contentTitle = 'External Content';
        }
      }
    }

    const fileType = getFileTypeFromUrl(sourceUrl);

    const contentData = {
      title: contentTitle,
      description: description || null,
      file_name: sourceUrl,
      source_type: sourceType,
      source_url: sourceUrl,
      thumbnail_url: thumbnailUrl,
      embed_code: embedCode,
      file_path: sourceUrl, // Use URL as path for external sources
      file_type: fileType,
      file_size: null, // Cannot determine size for external URLs
      mime_type: null,
      uploaded_by: req.user.id,
      category_id: category_id || null,
      is_public: is_public === 'true' || is_public === true
    };

    const content = await ContentLibrary.create(contentData);

    res.status(201).json({
      success: true,
      content
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update content metadata
 */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if content exists
    const existingContent = await ContentLibrary.findById(id);
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Only allow updating metadata, not the file itself
    const allowedFields = ['title', 'description', 'category_id', 'is_public'];
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const content = await ContentLibrary.update(id, filteredData);

    res.json({
      success: true,
      content
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete content
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await ContentLibrary.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    await ContentLibrary.delete(id);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download content file
 */
export const downloadContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await ContentLibrary.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Increment download count
    await ContentLibrary.incrementDownloadCount(id);

    // Get full file path
    const filePath = path.join(process.cwd(), content.file_path);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    // Send file
    res.download(filePath, content.file_name, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Error downloading file'
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

