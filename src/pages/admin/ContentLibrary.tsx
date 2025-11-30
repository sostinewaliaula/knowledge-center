import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Video, 
  Image, 
  File, 
  X, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  Youtube,
  HardDrive,
  Link as LinkIcon,
  FileSpreadsheet,
  PlayCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { ContentUploadModal } from '../../components/ContentUploadModal';
import { EditContentModal } from '../../components/EditContentModal';
import { VideoPlayerModal } from '../../components/VideoPlayerModal';
import { DocumentViewerModal } from '../../components/DocumentViewerModal';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  mime_type: string | null;
  source_type?: string;
  source_url?: string | null;
  thumbnail_url?: string | null;
  embed_code?: string | null;
  uploaded_by: string;
  uploaded_by_name: string | null;
  category_id: string | null;
  category_name: string | null;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

interface ContentLibraryProps {}

export function ContentLibrary({}: ContentLibraryProps) {
  const { showSuccess, showError } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContent, setTotalContent] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedVideoContent, setSelectedVideoContent] = useState<ContentItem | null>(null);
  const [selectedDocumentContent, setSelectedDocumentContent] = useState<ContentItem | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [contentTags, setContentTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchContents();
    fetchCategories();
    fetchTags();
  }, [currentPage, searchQuery, filterType]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data.tags || []);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.getContents(currentPage, 20, searchQuery, filterType);
      setContentItems(data.contents || []);
      setTotalContent(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: File[], title: string, description: string, categoryId: string | null, tags: Set<string>) => {
    setUploading(true);
    
    try {
      // Upload files one by one
      for (const file of files) {
        try {
          // Use provided title, or generate from filename if not provided
          const fileTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '');
          await api.uploadContent(file, fileTitle, description || null, categoryId, false, tags);
        } catch (err: any) {
          showError(`Failed to upload ${file.name}: ${err.message}`);
        }
      }
      
      showSuccess(`${files.length} file(s) uploaded successfully!`);
      fetchContents();
    } catch (err: any) {
      showError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleAddFromUrl = async (url: string, title: string, description: string, categoryId: string | null, tags: Set<string>) => {
    setUploading(true);
    
    try {
      await api.addContentFromUrl(url, title, description, categoryId, false, tags);
      showSuccess('Content added successfully!');
      fetchContents();
    } catch (err: any) {
      showError(err.message || 'Failed to add content from URL');
      throw err; // Re-throw to let modal handle it
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContent) return;

    try {
      await api.deleteContent(selectedContent.id);
      showSuccess('Content deleted successfully!');
      setShowDeleteModal(false);
      setSelectedContent(null);
      fetchContents();
    } catch (err: any) {
      showError(err.message || 'Failed to delete content');
    }
  };

  const handleEdit = async (id: string, title: string, description: string, categoryId: string | null, tags: Set<string>, newFile?: File, newUrl?: string) => {
    setUploading(true);
    try {
      // Update metadata (title, description, category, tags)
      await api.updateContent(id, {
        title: title,
        description: description || null,
        category_id: categoryId,
        tags: Array.from(tags)
      });

      // For external content, if URL changed, we need to re-add it (delete old and create new)
      if (newUrl && selectedContent && selectedContent.source_type && selectedContent.source_type !== 'local') {
        const oldUrl = selectedContent.source_url;
        if (newUrl !== oldUrl) {
          // Delete the old content and re-add with new URL
          await api.deleteContent(id);
          await api.addContentFromUrl(newUrl, title, description, selectedContent.category_id || null, selectedContent.is_public, tags);
          showSuccess('Content URL updated successfully!');
          fetchContents();
          setShowEditModal(false);
          setSelectedContent(null);
          setUploading(false);
          return;
        }
      }

      // For local files, if a new file is provided, delete old and upload new
      if (newFile && selectedContent && (!selectedContent.source_type || selectedContent.source_type === 'local')) {
        // Delete the old content first
        await api.deleteContent(id);
        // Upload the new file with updated metadata
        await api.uploadContent(newFile, title, description || null, selectedContent.category_id || null, selectedContent.is_public);
        showSuccess('Content file replaced and metadata updated successfully!');
        fetchContents();
        setShowEditModal(false);
        setSelectedContent(null);
        setUploading(false);
        return;
      }

      showSuccess('Content updated successfully!');

      fetchContents();
      setShowEditModal(false);
      setSelectedContent(null);
    } catch (err: any) {
      showError(err.message || 'Failed to update content');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (content: ContentItem) => {
    try {
      // Check if it's a video (local or external)
      const isVideo = content.file_type === 'video' || 
        (content.source_type && ['youtube', 'vimeo', 'dailymotion'].includes(content.source_type));

      if (isVideo) {
        // Open video player modal
        setSelectedVideoContent(content);
        setShowVideoPlayer(true);
      } else {
        // Open document viewer modal for all other file types (PDFs, images, documents, text files, etc.)
        // The document viewer will handle all file types appropriately
        setSelectedDocumentContent(content);
        setShowDocumentViewer(true);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to view content');
    }
  };

  const handleDownload = async (content: ContentItem) => {
    try {
      // Only for local files - trigger download
      if (!content.source_type || content.source_type === 'local') {
        const url = api.getContentDownloadUrl(content.id);
        const link = document.createElement('a');
        link.href = url;
        link.download = content.file_name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For external content, viewing is the same as downloading
        handleView(content);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to download content');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type: string | null) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      case 'image':
        return <Image size={20} className="text-blue-600" />;
      case 'document':
        return <File size={20} className="text-green-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  const getFileBgColor = (type: string | null) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50';
      case 'video':
        return 'bg-purple-50';
      case 'image':
        return 'bg-blue-50';
      case 'document':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const filteredContent = contentItems;

  const isModalOpen = showDeleteModal || showEditModal || showUploadModal || showVideoPlayer || showDocumentViewer;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className={`transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
        <AdminSidebar />
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
              <p className="text-sm text-gray-500 mt-1">Upload and manage your learning content files</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                disabled={uploading}
                className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 ${
                  uploading ? 'cursor-not-allowed' : ''
                }`}
              >
                <Upload size={16} className={uploading ? 'animate-spin' : ''} />
                {uploading ? 'Uploading...' : 'Add Content'}
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div 
              onClick={() => setShowUploadModal(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors bg-gray-50 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add more content</h3>
                <p className="text-gray-500 mb-4">Click to upload files or add from URL</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(true);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Add Content
                </button>
                <p className="text-xs text-gray-400 mt-3">Supports: Local files, URLs, YouTube, Google Drive</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 ${getFileBgColor(item.file_type)} rounded-lg flex items-center justify-center relative`}>
                        {getFileIcon(item.file_type)}
                        {item.source_type && item.source_type !== 'local' && (
                          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                            {item.source_type === 'youtube' && <Youtube size={12} className="text-red-600" />}
                            {item.source_type === 'vimeo' && <PlayCircle size={12} className="text-blue-600" />}
                            {item.source_type === 'dailymotion' && <Video size={12} className="text-purple-600" />}
                            {item.source_type === 'googledrive' && <HardDrive size={12} className="text-blue-600" />}
                            {item.source_type === 'microsoft' && <FileSpreadsheet size={12} className="text-orange-600" />}
                            {item.source_type === 'url' && <LinkIcon size={12} className="text-purple-600" />}
                          </div>
                        )}
                      </div>
                      <div className="relative flex items-center gap-1">
                        <button
                          onClick={async () => {
                            setSelectedContent(item);
                            // Fetch tags for this content
                            try {
                              const contentData = await api.getContentById(item.id);
                              if (contentData.tags && Array.isArray(contentData.tags)) {
                                setContentTags(new Set(contentData.tags.map((tag: any) => tag.id)));
                              } else {
                                setContentTags(new Set());
                              }
                            } catch (err) {
                              setContentTags(new Set());
                            }
                            setShowEditModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit content"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedContent(item);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete content"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{item.title || item.file_name}</h3>
                    {item.source_type && item.source_type !== 'local' && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          {item.source_type === 'youtube' && 'YouTube'}
                          {item.source_type === 'vimeo' && 'Vimeo'}
                          {item.source_type === 'dailymotion' && 'Dailymotion'}
                          {item.source_type === 'googledrive' && 'Google Drive'}
                          {item.source_type === 'microsoft' && 'Microsoft Office'}
                          {item.source_type === 'onedrive' && 'OneDrive'}
                          {item.source_type === 'dropbox' && 'Dropbox'}
                          {item.source_type === 'url' && 'External URL'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{item.file_size ? formatFileSize(item.file_size) : 'External'}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.source_type && item.source_type !== 'local' ? (
                        <button 
                          onClick={() => handleView(item)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleView(item)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button 
                            onClick={() => handleDownload(item)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages} ({totalContent} total files)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedContent && (
        <EditContentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedContent(null);
            setContentTags(new Set());
          }}
          content={selectedContent}
          onSave={handleEdit}
          updating={uploading}
          categories={categories}
          tags={tags}
          contentTags={contentTags}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600">Delete Content</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedContent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to delete this content? This action cannot be undone.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{selectedContent.title || selectedContent.file_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedContent.file_size)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedContent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <ContentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        onAddFromUrl={handleAddFromUrl}
        uploading={uploading}
        categories={categories}
        tags={tags}
      />

      {/* Video Player Modal */}
      {selectedVideoContent && (
        <VideoPlayerModal
          isOpen={showVideoPlayer}
          onClose={() => {
            setShowVideoPlayer(false);
            setSelectedVideoContent(null);
          }}
          content={selectedVideoContent}
          videoUrl={
            selectedVideoContent.source_type === 'local' || !selectedVideoContent.source_type
              ? api.getContentDownloadUrl(selectedVideoContent.id, true)
              : undefined
          }
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocumentContent && (
        <DocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedDocumentContent(null);
          }}
          content={selectedDocumentContent}
          documentUrl={
            selectedDocumentContent.source_type === 'local' || !selectedDocumentContent.source_type
              ? api.getContentDownloadUrl(selectedDocumentContent.id, true)
              : undefined
          }
        />
      )}
    </div>
  );
}
