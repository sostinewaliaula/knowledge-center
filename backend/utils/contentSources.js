/**
 * Utility functions for handling different content sources
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Validate and normalize YouTube URL
 */
export const validateYouTubeUrl = (url) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { valid: false, error: 'Invalid YouTube URL' };
  }

  return {
    valid: true,
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
};

/**
 * Extract Google Drive/Docs file ID from various Google URL formats
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url) return null;

  // Google Docs/Sheets/Slides format: https://docs.google.com/document/d/FILE_ID/edit
  const docsPattern = /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/;
  const docsMatch = url.match(docsPattern);
  if (docsMatch && docsMatch[2]) {
    return { fileId: docsMatch[2], type: docsMatch[1] };
  }

  // Google Drive file format: https://drive.google.com/file/d/FILE_ID/view
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch && fileMatch[1]) {
    return { fileId: fileMatch[1], type: 'file' };
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  const openPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openPattern);
  if (openMatch && openMatch[1]) {
    return { fileId: openMatch[1], type: 'file' };
  }

  return null;
};

/**
 * Validate and normalize Google Drive/Docs URL
 */
export const validateGoogleDriveUrl = (url) => {
  const result = extractGoogleDriveFileId(url);
  if (!result) {
    return { valid: false, error: 'Invalid Google Drive/Docs URL. Supported: Google Drive files, Google Docs, Sheets, Slides' };
  }

  const { fileId, type } = result;
  let embedUrl, viewUrl;

  if (type === 'document') {
    // Google Docs
    embedUrl = `https://docs.google.com/document/d/${fileId}/preview`;
    viewUrl = `https://docs.google.com/document/d/${fileId}/edit`;
  } else if (type === 'spreadsheets') {
    // Google Sheets
    embedUrl = `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
    viewUrl = `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
  } else if (type === 'presentation') {
    // Google Slides
    embedUrl = `https://docs.google.com/presentation/d/${fileId}/preview`;
    viewUrl = `https://docs.google.com/presentation/d/${fileId}/edit`;
  } else {
    // Google Drive file
    embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  }

  return {
    valid: true,
    fileId,
    type,
    embedUrl,
    viewUrl
  };
};

/**
 * Validate general URL
 */
export const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    return { valid: true, normalizedUrl: urlObj.href };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
};

/**
 * Extract Vimeo video ID
 */
export const extractVimeoVideoId = (url) => {
  if (!url) return null;
  
  // Format: https://vimeo.com/VIDEO_ID
  const pattern = /vimeo\.com\/(?:.*\/)?(\d+)/;
  const match = url.match(pattern);
  return match && match[1] ? match[1] : null;
};

/**
 * Validate and normalize Vimeo URL
 */
export const validateVimeoUrl = (url) => {
  const videoId = extractVimeoVideoId(url);
  if (!videoId) {
    return { valid: false, error: 'Invalid Vimeo URL' };
  }

  return {
    valid: true,
    videoId,
    embedUrl: `https://player.vimeo.com/video/${videoId}`,
    watchUrl: `https://vimeo.com/${videoId}`
  };
};

/**
 * Extract Microsoft Office Online file ID
 */
export const extractMicrosoftOfficeFileId = (url) => {
  if (!url) return null;
  
  // Format: https://onedrive.live.com/view.aspx?id=FILE_ID or /embed?resid=FILE_ID
  const onedrivePattern = /(?:onedrive\.live\.com|1drv\.ms).*[?&](?:id|resid)=([^&\s]+)/;
  const onedriveMatch = url.match(onedrivePattern);
  if (onedriveMatch && onedriveMatch[1]) {
    return { fileId: onedriveMatch[1], type: 'onedrive' };
  }
  
  // Format: https://*.sharepoint.com/... or office.com/...
  if (url.includes('sharepoint.com') || url.includes('office.com') || url.includes('office365.com')) {
    return { fileId: url, type: 'office365' };
  }
  
  return null;
};

/**
 * Validate and normalize Microsoft Office URL
 */
export const validateMicrosoftOfficeUrl = (url) => {
  const result = extractMicrosoftOfficeFileId(url);
  if (!result) {
    return { valid: false, error: 'Invalid Microsoft Office URL. Supported: OneDrive, SharePoint, Office 365' };
  }

  const { fileId, type } = result;
  
  if (type === 'onedrive') {
    return {
      valid: true,
      fileId,
      embedUrl: url.includes('embed') ? url : url.replace(/view\.aspx/, 'embed'),
      viewUrl: url
    };
  } else {
    // Office 365 / SharePoint
    return {
      valid: true,
      fileId,
      embedUrl: url,
      viewUrl: url
    };
  }
};

/**
 * Detect content source type from URL
 */
export const detectSourceType = (url) => {
  if (!url) return 'local';

  const urlLower = url.toLowerCase();

  // Video platforms
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (urlLower.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  if (urlLower.includes('dailymotion.com')) {
    return 'dailymotion';
  }

  // Google services
  if (urlLower.includes('drive.google.com') || urlLower.includes('docs.google.com')) {
    return 'googledrive';
  }

  // Microsoft services
  if (urlLower.includes('onedrive.live.com') || urlLower.includes('1drv.ms') || 
      urlLower.includes('sharepoint.com') || urlLower.includes('office.com') || 
      urlLower.includes('office365.com')) {
    return 'microsoft';
  }

  // Other cloud storage
  if (urlLower.includes('dropbox.com')) {
    return 'dropbox';
  }

  // Generic URL
  if (urlLower.startsWith('http://') || urlLower.startsWith('https://')) {
    return 'url';
  }

  return 'local';
};

/**
 * Get embed code based on source type
 */
export const generateEmbedCode = (sourceType, sourceUrl, options = {}) => {
  const width = options.width || '100%';
  const height = options.height || '400';
  
  switch (sourceType) {
    case 'youtube': {
      const youtube = validateYouTubeUrl(sourceUrl);
      if (!youtube.valid) return null;
      
      return `<iframe width="${width}" height="${height}" src="${youtube.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    case 'vimeo': {
      const vimeo = validateVimeoUrl(sourceUrl);
      if (!vimeo.valid) return null;
      
      return `<iframe src="${vimeo.embedUrl}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }

    case 'dailymotion': {
      // Extract Dailymotion video ID
      const dmMatch = sourceUrl.match(/dailymotion\.com\/(?:embed\/)?video\/([a-zA-Z0-9]+)/);
      if (!dmMatch) return null;
      
      return `<iframe frameborder="0" width="${width}" height="${height}" src="https://www.dailymotion.com/embed/video/${dmMatch[1]}" allowfullscreen allow="autoplay"></iframe>`;
    }

    case 'googledrive': {
      const drive = validateGoogleDriveUrl(sourceUrl);
      if (!drive.valid) return null;
      
      return `<iframe src="${drive.embedUrl}" width="${width}" height="${height}" frameborder="0"></iframe>`;
    }

    case 'microsoft': {
      const office = validateMicrosoftOfficeUrl(sourceUrl);
      if (!office.valid) return null;
      
      return `<iframe src="${office.embedUrl}" width="${width}" height="${height}" frameborder="0"></iframe>`;
    }

    case 'url': {
      // For direct URL, return the URL itself (can be used in <a> tag or iframe depending on content)
      return sourceUrl;
    }

    default:
      return null;
  }
};

/**
 * Get file type from URL or source
 */
export const getFileTypeFromUrl = (url) => {
  if (!url) return 'other';

  const urlLower = url.toLowerCase();
  const extension = url.split('.').pop()?.toLowerCase() || '';

  // Check by extension
  if (['pdf'].includes(extension)) return 'pdf';
  if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(extension)) return 'video';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
  if (['doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) return 'document';

  // Check by URL patterns - Video platforms
  if (urlLower.includes('youtube') || urlLower.includes('youtu.be') || 
      urlLower.includes('vimeo.com') || urlLower.includes('dailymotion.com')) {
    return 'video';
  }
  
  // Check by URL patterns - Document platforms
  if (urlLower.includes('docs.google.com') || urlLower.includes('drive.google.com') ||
      urlLower.includes('onedrive') || urlLower.includes('sharepoint') || 
      urlLower.includes('office.com') || urlLower.includes('office365') ||
      urlLower.includes('dropbox.com')) {
    return 'document';
  }
  
  // Check by file extension in URL
  if (urlLower.includes('.pdf')) return 'pdf';
  if (urlLower.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
  if (urlLower.match(/\.(mp4|avi|mov|webm|mkv)$/i)) return 'video';
  if (urlLower.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i)) return 'document';

  return 'other';
};

