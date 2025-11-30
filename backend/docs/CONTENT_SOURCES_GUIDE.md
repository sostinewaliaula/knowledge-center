# Content Sources Implementation Guide

## Overview

The Content Management system now supports multiple upload sources:
- **Local Upload**: Traditional file upload from your computer
- **URL**: Direct links to external content
- **YouTube**: YouTube video URLs with automatic embedding
- **Google Drive**: Google Drive file links with embedding support

## Database Migration

Run the migration to add support for multiple content sources:

```bash
cd backend
npm run migrate
```

This will run `005_add_content_sources.sql` which adds:
- `source_type` ENUM field (local, url, youtube, googledrive, onedrive, dropbox, other)
- `source_url` VARCHAR field for external URLs
- `thumbnail_url` VARCHAR for video/thumbnail URLs
- `embed_code` TEXT for iframe embed codes

## Features

### 1. Local File Upload
- Upload files directly from your computer
- Supports PDF, Video, Images, Documents
- Max file size: 500MB per file
- Files stored in `backend/uploads/content/`

### 2. URL Upload
- Add content from any HTTP/HTTPS URL
- Automatically detects file type from URL
- Supports direct links to documents, images, videos, etc.

### 3. YouTube Integration
- Paste YouTube video URLs
- Automatically extracts video ID
- Generates embed code for playback
- Shows thumbnail preview
- Supports formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`

### 4. Google Drive Integration
- Paste Google Drive file URLs
- Automatically extracts file ID
- Generates embed code for preview
- **Important**: Files must have "Anyone with the link can view" permission
- Supports format: `https://drive.google.com/file/d/FILE_ID/view`

## Usage

### Upload Content Modal

The upload modal has 4 tabs:

1. **Local Upload**
   - Click "Select Files" or drag and drop
   - Multiple file selection supported
   - Shows file list with sizes

2. **URL**
   - Paste any HTTP/HTTPS URL
   - Optional: Add title and description
   - Auto-detects file type from URL

3. **YouTube**
   - Paste YouTube video URL
   - System auto-detects it's a YouTube link
   - Shows confirmation message
   - Video will be embedded and playable

4. **Google Drive**
   - Paste Google Drive share link
   - System auto-detects Google Drive link
   - Shows permission reminder
   - File will be embedded for preview

## Content Display

Content cards show:
- **Source indicator**: Small icon showing source type (YouTube, Drive, URL)
- **Source badge**: Blue badge showing source type
- **View/Download button**: 
  - Local files: "Download" button
  - External sources: "View" button (opens in new tab)

## API Endpoints

### Upload Local File
```
POST /api/content/upload
Content-Type: multipart/form-data
Body: file, title, description, category_id, is_public
```

### Add from URL
```
POST /api/content/url
Content-Type: application/json
Body: { url, title, description, category_id, is_public }
```

## Supported Source Types

- `local`: Uploaded files stored on server
- `url`: External HTTP/HTTPS URLs
- `youtube`: YouTube videos
- `googledrive`: Google Drive files
- `onedrive`: OneDrive files (future)
- `dropbox`: Dropbox links (future)
- `other`: Other external sources

## Notes

- YouTube videos are embedded using iframes
- Google Drive files require public sharing permissions
- External URLs are validated before saving
- File type is automatically detected from URL patterns
- Thumbnails are generated for YouTube videos automatically

