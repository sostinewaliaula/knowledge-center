import { useState, useRef } from 'react';
import { 
  X, Upload, Link as LinkIcon, Youtube, HardDrive, Globe, FileText, 
  AlertCircle, CheckCircle2, Video, FileSpreadsheet, File as FileIcon,
  PlayCircle
} from 'lucide-react';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], title: string, description: string, categoryId: string | null, tags: Set<string>) => Promise<void>;
  onAddFromUrl: (url: string, title: string, description: string, categoryId: string | null, tags: Set<string>) => Promise<void>;
  uploading?: boolean;
  categories?: Array<{ id: string; name: string; parent_id: string | null }>;
  tags?: Array<{ id: string; name: string }>;
}

type UploadMode = 'local' | 'url' | 'videos' | 'documents';

export function ContentUploadModal({
  isOpen,
  onClose,
  onUpload,
  onAddFromUrl,
  uploading = false,
  categories = [],
  tags = []
}: ContentUploadModalProps) {
  const [mode, setMode] = useState<UploadMode>('local');
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [urlError, setUrlError] = useState('');
  const [detectedSource, setDetectedSource] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const detectSourceFromUrl = (urlValue: string): { type: string; name: string; icon: any; color: string } | null => {
    if (!urlValue) return null;
    
    const urlLower = urlValue.toLowerCase();
    
    // Video platforms
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return { type: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' };
    }
    if (urlLower.includes('vimeo.com')) {
      return { type: 'vimeo', name: 'Vimeo', icon: PlayCircle, color: 'text-blue-600' };
    }
    if (urlLower.includes('dailymotion.com')) {
      return { type: 'dailymotion', name: 'Dailymotion', icon: Video, color: 'text-purple-600' };
    }
    
    // Google services
    if (urlLower.includes('docs.google.com/document')) {
      return { type: 'googledocs', name: 'Google Docs', icon: FileText, color: 'text-blue-600' };
    }
    if (urlLower.includes('docs.google.com/spreadsheets')) {
      return { type: 'googlesheets', name: 'Google Sheets', icon: FileSpreadsheet, color: 'text-green-600' };
    }
    if (urlLower.includes('docs.google.com/presentation')) {
      return { type: 'googleslides', name: 'Google Slides', icon: FileIcon, color: 'text-yellow-600' };
    }
    if (urlLower.includes('drive.google.com')) {
      return { type: 'googledrive', name: 'Google Drive', icon: HardDrive, color: 'text-blue-600' };
    }
    
    // Microsoft services
    if (urlLower.includes('onedrive.live.com') || urlLower.includes('1drv.ms')) {
      return { type: 'onedrive', name: 'OneDrive', icon: HardDrive, color: 'text-blue-600' };
    }
    if (urlLower.includes('sharepoint.com') || urlLower.includes('office.com') || urlLower.includes('office365.com')) {
      return { type: 'microsoft', name: 'Microsoft Office', icon: FileText, color: 'text-orange-600' };
    }
    
    // Other
    if (urlLower.includes('dropbox.com')) {
      return { type: 'dropbox', name: 'Dropbox', icon: HardDrive, color: 'text-blue-600' };
    }
    
    return null;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUrlError('');
    
    const detected = detectSourceFromUrl(value);
    if (detected) {
      setDetectedSource(detected.type);
      
      // Auto-switch to appropriate mode
      if (['youtube', 'vimeo', 'dailymotion'].includes(detected.type)) {
        setMode('videos');
      } else if (['googledocs', 'googlesheets', 'googleslides', 'googledrive', 'microsoft', 'onedrive', 'dropbox'].includes(detected.type)) {
        setMode('documents');
      } else {
        setMode('url');
      }
    } else {
      setDetectedSource('');
      if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
        setMode('url');
      }
    }
  };

  const validateAndSubmitUrl = async () => {
    if (!url.trim()) {
      setUrlError('URL is required');
      return;
    }

    try {
      const urlObj = new URL(url.trim());
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must use HTTP or HTTPS protocol');
        return;
      }
    } catch {
      setUrlError('Invalid URL format');
      return;
    }

    await onAddFromUrl(url.trim(), title.trim() || '', description.trim() || '', categoryId || null, selectedTags);
    handleClose();
  };

  const handleSubmit = async () => {
    if (mode === 'local') {
      if (files.length === 0) {
        setUrlError('Please select at least one file');
        return;
      }
      await onUpload(files, title.trim() || '', description.trim() || '', categoryId || null, selectedTags);
      handleClose();
    } else {
      await validateAndSubmitUrl();
    }
  };

  const handleClose = () => {
    setFiles([]);
    setUrl('');
    setTitle('');
    setDescription('');
    setCategoryId('');
    setSelectedTags(new Set());
    setUrlError('');
    setDetectedSource('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getUrlPlaceholder = () => {
    if (mode === 'videos') {
      return 'Paste YouTube, Vimeo, or Dailymotion video URL...';
    }
    if (mode === 'documents') {
      return 'Paste Google Docs/Sheets/Slides, Microsoft Office, or Drive URL...';
    }
    return 'Paste any content URL...';
  };

  const getHelpMessage = () => {
    const detected = detectSourceFromUrl(url);
    if (!detected || !url) return null;

    const messages: Record<string, string> = {
      youtube: 'YouTube video detected. The video will be embedded and playable directly in the LMS.',
      vimeo: 'Vimeo video detected. The video will be embedded and playable directly in the LMS.',
      dailymotion: 'Dailymotion video detected. The video will be embedded and playable directly in the LMS.',
      googledocs: 'Google Docs detected. Make sure the document has "Anyone with the link can view" permission.',
      googlesheets: 'Google Sheets detected. Make sure the spreadsheet has "Anyone with the link can view" permission.',
      googleslides: 'Google Slides detected. Make sure the presentation has "Anyone with the link can view" permission.',
      googledrive: 'Google Drive file detected. Make sure the file has "Anyone with the link can view" permission.',
      microsoft: 'Microsoft Office file detected. Make sure the file is shared and accessible.',
      onedrive: 'OneDrive file detected. Make sure the file is shared and accessible.',
      dropbox: 'Dropbox file detected. Make sure the file is shared and accessible.',
    };

    return messages[detected.type] || null;
  };

  const detected = detectSourceFromUrl(url);
  const helpMessage = getHelpMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Add Content</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMode('local')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'local'
                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={uploading}
            >
              <Upload size={16} />
              Local Upload
            </button>
            <button
              onClick={() => setMode('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'videos'
                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={uploading}
            >
              <Video size={16} />
              Videos
            </button>
            <button
              onClick={() => setMode('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'documents'
                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={uploading}
            >
              <FileText size={16} />
              Documents
            </button>
            <button
              onClick={() => setMode('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'url'
                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={uploading}
            >
              <LinkIcon size={16} />
              Other URL
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'local' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Files</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                />
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <FileText size={16} />
                        <span className="flex-1">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Content title (filename will be used if not provided)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {files.length > 0 && files.length === 1 
                    ? `Default: ${files[0].name.replace(/\.[^/.]+$/, '')}`
                    : files.length > 1 
                      ? 'Title will be applied to all files (you can edit individual titles later)'
                      : 'Enter a title to help identify this content'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Content description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                >
                  <option value="">No Category</option>
                  {categories.filter(cat => !cat.parent_id).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
                  {tags.length === 0 ? (
                    <span className="text-xs text-gray-500">No tags available. Create tags in Categories & Tags page.</span>
                  ) : (
                    tags.map((tag) => {
                      const isSelected = selectedTags.has(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const newTags = new Set(selectedTags);
                            if (isSelected) {
                              newTags.delete(tag.id);
                            } else {
                              newTags.add(tag.id);
                            }
                            setSelectedTags(newTags);
                          }}
                          disabled={uploading}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-md hover:from-purple-700 hover:to-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          } disabled:opacity-50`}
                        >
                          {tag.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'videos' ? 'Video URL' : mode === 'documents' ? 'Document URL' : 'Content URL'}
                </label>
                <div className="relative">
                  {detected && (
                    <detected.icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${detected.color}`} size={20} />
                  )}
                  {!detected && mode === 'videos' && (
                    <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  )}
                  {!detected && mode === 'documents' && (
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  )}
                  {!detected && mode === 'url' && (
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  )}
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={getUrlPlaceholder()}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      urlError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    disabled={uploading}
                  />
                </div>
                {urlError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {urlError}
                  </p>
                )}
                {detected && !urlError && (
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-green-600" />
                    {detected.name} detected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Content title (auto-detected if not provided)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Content description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploading}
                >
                  <option value="">No Category</option>
                  {categories.filter(cat => !cat.parent_id).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
                  {tags.length === 0 ? (
                    <span className="text-xs text-gray-500">No tags available. Create tags in Categories & Tags page.</span>
                  ) : (
                    tags.map((tag) => {
                      const isSelected = selectedTags.has(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const newTags = new Set(selectedTags);
                            if (isSelected) {
                              newTags.delete(tag.id);
                            } else {
                              newTags.add(tag.id);
                            }
                            setSelectedTags(newTags);
                          }}
                          disabled={uploading}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-md hover:from-purple-700 hover:to-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          } disabled:opacity-50`}
                        >
                          {tag.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {helpMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">{helpMessage}</p>
                </div>
              )}

              {/* Supported sources info */}
              {mode === 'videos' && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Supported video platforms:</p>
                  <p className="text-xs text-gray-600">YouTube, Vimeo, Dailymotion</p>
                </div>
              )}

              {mode === 'documents' && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Supported document sources:</p>
                  <p className="text-xs text-gray-600">Google Docs, Sheets, Slides, Drive • Microsoft Office (OneDrive, SharePoint, Office 365) • Dropbox</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || (mode === 'local' && files.length === 0) || (mode !== 'local' && !url.trim())}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'local' ? 'Uploading...' : 'Adding...'}
              </>
            ) : (
              <>
                <Upload size={16} />
                {mode === 'local' ? 'Upload Files' : 'Add Content'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
