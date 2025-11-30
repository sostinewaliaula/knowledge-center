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

    // Get tags for this content
    const tags = await ContentLibrary.getTags(id);
    content.tags = tags;

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

    const { title, description, category_id, is_public, tags: tagsParam } = req.body;
    const file = req.file;
    
    // Parse tags if provided as JSON string (from FormData)
    let tags = null;
    if (tagsParam) {
      try {
        tags = typeof tagsParam === 'string' ? JSON.parse(tagsParam) : tagsParam;
      } catch (e) {
        tags = tagsParam; // If parsing fails, use as-is
      }
    }

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

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await ContentLibrary.setTags(content.id, tags);
    }

    // Fetch content with tags
    const contentWithTags = await ContentLibrary.findById(content.id);
    const contentTags = await ContentLibrary.getTags(content.id);
    contentWithTags.tags = contentTags;

    res.status(201).json({
      success: true,
      content: contentWithTags
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
    const { url, title, description, category_id, is_public, tags } = req.body;

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

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await ContentLibrary.setTags(content.id, tags);
    }

    // Fetch content with tags
    const contentWithTags = await ContentLibrary.findById(content.id);
    const contentTags = await ContentLibrary.getTags(content.id);
    contentWithTags.tags = contentTags;

    res.status(201).json({
      success: true,
      content: contentWithTags
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

    // Handle tags if provided
    if (updateData.tags !== undefined) {
      let tagIds = [];
      if (Array.isArray(updateData.tags)) {
        tagIds = updateData.tags;
      } else if (typeof updateData.tags === 'string') {
        try {
          tagIds = JSON.parse(updateData.tags);
        } catch (e) {
          tagIds = [];
        }
      }
      if (Array.isArray(tagIds)) {
        await ContentLibrary.setTags(id, tagIds);
      }
    }

    // Fetch content with tags
    const contentWithTags = await ContentLibrary.findById(id);
    const contentTags = await ContentLibrary.getTags(id);
    contentWithTags.tags = contentTags;

    res.json({
      success: true,
      content: contentWithTags
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
 * Public view endpoint for Office Online viewer
 * Validates token from query parameter but doesn't require auth header
 */
export const viewContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    // Verify token if provided
    if (token) {
      try {
        const { verifyToken } = await import('../utils/jwt.js');
        verifyToken(token);
      } catch (error) {
        return res.status(403).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        error: 'Token required'
      });
    }

    const content = await ContentLibrary.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Only serve local files (external files should use their own URLs)
    if (content.source_type && content.source_type !== 'local') {
      return res.status(400).json({
        success: false,
        error: 'Cannot view external content through this endpoint'
      });
    }

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

    // Detect file type from extension for proper Content-Type
    const fileExt = path.extname(content.file_name || '').toLowerCase();
    let contentType = content.mime_type;
    
    // Ensure proper Content-Type for common file types
    if (!contentType) {
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.html': 'text/html',
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      };
      contentType = mimeTypes[fileExt] || 'application/octet-stream';
    }
    
    // Set headers for viewing (not downloading)
    // For PDFs, ensure we set Content-Type BEFORE any other headers
    if (fileExt === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      // Don't set Content-Disposition for PDFs to prevent download
      // Some browsers force download if Content-Disposition is present
    } else {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(content.file_name || 'file')}"`);
    }
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Add CORS headers for viewing (allows iframe/img/fetch to work)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // For PDFs, also set Cache-Control to prevent caching issues
    if (fileExt === '.pdf') {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Error viewing file'
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download or view content file
 */
export const downloadContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { view } = req.query; // Check if viewing (true) or downloading (false/undefined)

    const content = await ContentLibrary.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Handle external content (Google Drive, OneDrive, etc.)
    if (content.source_type && content.source_type !== 'local' && content.source_url) {
      return await downloadExternalContent(req, res, content, view === 'true');
    }

    // Only increment download count if actually downloading
    if (!view || view !== 'true') {
      await ContentLibrary.incrementDownloadCount(id);
    }

    // Get full file path for local files
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

    // Detect file type from extension for proper Content-Type
    const fileExt = path.extname(content.file_name || '').toLowerCase();
    let contentType = content.mime_type;
    
    // Ensure proper Content-Type for common file types
    if (!contentType) {
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.html': 'text/html',
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript'
      };
      contentType = mimeTypes[fileExt] || 'application/octet-stream';
    }
    
    // Set appropriate headers based on whether viewing or downloading
    if (view === 'true') {
      // For PDFs, do NOT set Content-Disposition - it causes downloads
      if (fileExt === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        // Don't set Content-Disposition for PDFs
      } else {
        // For other files, set Content-Disposition inline
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(content.file_name || 'file')}"`);
      }
      res.setHeader('X-Content-Type-Options', 'nosniff');
      // Add CORS headers for viewing
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: 'Error viewing file'
            });
          }
        }
      });
    } else {
      // For downloading: force download
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
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Download external content (Google Drive, OneDrive, etc.)
 */
const downloadExternalContent = async (req, res, content, isView = false) => {
  try {
    const https = await import('https');
    const http = await import('http');
    const { URL } = await import('url');

    let downloadUrl = content.source_url;
    const sourceUrl = content.source_url;

    // Convert Google Drive view URL to download URL
    if (content.source_type === 'googledrive') {
      // Try multiple patterns to extract file ID
      let fileId = null;
      
      // Pattern 1: /file/d/FILE_ID/view
      const driveIdMatch1 = sourceUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveIdMatch1) {
        fileId = driveIdMatch1[1];
      }
      
      // Pattern 2: /document/d/FILE_ID/edit (Google Docs)
      if (!fileId) {
        const docsIdMatch = sourceUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
        if (docsIdMatch) {
          fileId = docsIdMatch[1];
        }
      }
      
      // Pattern 3: /spreadsheets/d/FILE_ID/edit (Google Sheets)
      if (!fileId) {
        const sheetsIdMatch = sourceUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
        if (sheetsIdMatch) {
          fileId = sheetsIdMatch[1];
        }
      }
      
      // Pattern 4: /presentation/d/FILE_ID/edit (Google Slides)
      if (!fileId) {
        const slidesIdMatch = sourceUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
        if (slidesIdMatch) {
          fileId = slidesIdMatch[1];
        }
      }
      
      if (fileId) {
        // Use Google Drive direct download URL with confirm parameter to bypass virus scan
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
      }
    }

    // Convert OneDrive view URL to download URL
    if (content.source_type === 'microsoft' || content.source_type === 'onedrive') {
      // OneDrive URLs can be converted by replacing /view with /download
      if (sourceUrl.includes('/view')) {
        downloadUrl = sourceUrl.replace('/view', '/download');
      } else if (sourceUrl.includes('onedrive.live.com')) {
        // For OneDrive sharing links, try to get download link
        downloadUrl = sourceUrl.replace('redir?', 'download?');
      }
    }

    // Parse URL
    const urlObj = new URL(downloadUrl);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    // Only increment download count if actually downloading
    if (!isView) {
      await ContentLibrary.incrementDownloadCount(content.id);
    }

    // Make request to external URL
    const request = protocol.get(downloadUrl, (externalRes) => {
      // Handle redirects (especially for Google Drive)
      if (externalRes.statusCode === 302 || externalRes.statusCode === 301 || externalRes.statusCode === 303) {
        const redirectUrl = externalRes.headers.location;
        if (redirectUrl) {
          return downloadExternalContent(req, res, { ...content, source_url: redirectUrl }, isView);
        }
      }

      // Check if request was successful
      if (externalRes.statusCode !== 200) {
        return res.status(externalRes.statusCode || 500).json({
          success: false,
          error: `Failed to download from external source: ${externalRes.statusMessage || 'Unknown error'}`
        });
      }

      // Set headers
      const contentType = externalRes.headers['content-type'] || content.mime_type || 'application/octet-stream';
      const contentDisposition = externalRes.headers['content-disposition'] || 
        (isView 
          ? `inline; filename="${content.file_name || 'document'}"`
          : `attachment; filename="${content.file_name || 'document'}"`);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', contentDisposition);
      
      // Copy content length if available
      if (externalRes.headers['content-length']) {
        res.setHeader('Content-Length', externalRes.headers['content-length']);
      }

      // Pipe the response
      externalRes.pipe(res);
    });

    request.on('error', (error) => {
      console.error('Error downloading external content:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to download from external source'
        });
      }
    });

    request.setTimeout(30000, () => {
      request.destroy();
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'Download timeout'
        });
      }
    });

  } catch (error) {
    console.error('Error in downloadExternalContent:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to process external download'
      });
    }
  }
};

