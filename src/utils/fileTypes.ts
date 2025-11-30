/**
 * Comprehensive file type detection and categorization
 */

export interface FileTypeInfo {
  category: 'pdf' | 'image' | 'video' | 'word' | 'excel' | 'powerpoint' | 'text' | 'other';
  viewer: 'pdf' | 'image' | 'office' | 'text' | 'iframe' | 'download';
  extensions: string[];
  mimeTypes: string[];
}

export const FILE_TYPES: Record<string, FileTypeInfo> = {
  pdf: {
    category: 'pdf',
    viewer: 'pdf',
    extensions: ['pdf'],
    mimeTypes: ['application/pdf']
  },
  image: {
    category: 'image',
    viewer: 'image',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/x-icon', 'image/tiff']
  },
  word: {
    category: 'word',
    viewer: 'office',
    extensions: ['doc', 'docx', 'odt', 'rtf', 'wps', 'pages'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'application/rtf',
      'application/vnd.wps-office.writer'
    ]
  },
  excel: {
    category: 'excel',
    viewer: 'office',
    extensions: ['xls', 'xlsx', 'ods', 'csv', 'tsv', 'numbers'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet',
      'text/csv',
      'text/tab-separated-values'
    ]
  },
  powerpoint: {
    category: 'powerpoint',
    viewer: 'office',
    extensions: ['ppt', 'pptx', 'odp', 'key'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.presentation'
    ]
  },
  text: {
    category: 'text',
    viewer: 'text',
    extensions: ['txt', 'md', 'markdown', 'log', 'json', 'xml', 'html', 'htm', 'css', 'js', 'ts', 'py', 'java', 'cpp', 'c', 'h'],
    mimeTypes: [
      'text/plain',
      'text/markdown',
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'application/xml',
      'text/xml'
    ]
  }
};

/**
 * Get file extension from filename or URL
 */
export const getFileExtension = (filename: string | null | undefined): string => {
  if (!filename) return '';
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
};

/**
 * Detect file type from filename or URL
 */
export const detectFileType = (filename: string | null | undefined, mimeType?: string | null): FileTypeInfo => {
  const extension = getFileExtension(filename);
  
  // Check by extension first
  for (const [key, info] of Object.entries(FILE_TYPES)) {
    if (info.extensions.includes(extension)) {
      return info;
    }
  }
  
  // Check by MIME type if extension not found
  if (mimeType) {
    for (const [key, info] of Object.entries(FILE_TYPES)) {
      if (info.mimeTypes.includes(mimeType.toLowerCase())) {
        return info;
      }
    }
  }
  
  // Default to 'other'
  return {
    category: 'other',
    viewer: 'download',
    extensions: [],
    mimeTypes: []
  };
};

/**
 * Check if file can be viewed inline
 */
export const canViewInline = (fileType: FileTypeInfo): boolean => {
  return ['pdf', 'image', 'office', 'text'].includes(fileType.viewer);
};

/**
 * Get Office Online viewer URL
 */
export const getOfficeViewerUrl = (fileUrl: string, fileType: FileTypeInfo, apiBaseUrl?: string): string => {
  // Microsoft Office Online Viewer
  // This works for .docx, .xlsx, .pptx files
  // Office Online needs a publicly accessible URL, so we use the view endpoint with token
  if (['word', 'excel', 'powerpoint'].includes(fileType.category)) {
    // Extract content ID from the fileUrl if it's our API URL
    // Format: /api/content/{id}/download?token=...
    const match = fileUrl.match(/\/content\/([^/]+)\//);
    if (match && apiBaseUrl) {
      const contentId = match[1];
      const token = new URL(fileUrl).searchParams.get('token');
      // Use the public view endpoint instead
      return `${apiBaseUrl}/content/${contentId}/view?token=${token}`;
    }
    // Fallback to direct URL embedding
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
  }
  return fileUrl;
};

/**
 * Get Google Docs Viewer URL (fallback)
 */
export const getGoogleDocsViewerUrl = (fileUrl: string): string => {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};

