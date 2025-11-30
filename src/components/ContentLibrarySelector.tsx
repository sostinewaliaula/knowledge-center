import { useState, useEffect } from 'react';
import { X, Search, FileText, Video, Image, File, Check, Loader2, Youtube, HardDrive, Link as LinkIcon } from 'lucide-react';
import { api } from '../utils/api';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_type: string | null;
  source_type?: string | null;
  source_url?: string | null;
  thumbnail_url?: string | null;
}

interface ContentLibrarySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: ContentItem) => void;
  contentType?: 'video' | 'document' | 'all';
  title?: string;
}

export function ContentLibrarySelector({
  isOpen,
  onClose,
  onSelect,
  contentType = 'all',
  title = 'Select Content'
}: ContentLibrarySelectorProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchContents();
    }
  }, [isOpen, searchQuery, filterType]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.getContents(1, 50, searchQuery, filterType);
      let items = data.contents || [];

      // Filter by content type if specified
      if (contentType === 'video') {
        items = items.filter((item: ContentItem) => 
          item.file_type === 'video' || 
          (item.source_type && ['youtube', 'vimeo', 'dailymotion'].includes(item.source_type))
        );
      } else if (contentType === 'document') {
        items = items.filter((item: ContentItem) => 
          item.file_type !== 'video' && 
          !['youtube', 'vimeo', 'dailymotion'].includes(item.source_type || '')
        );
      }

      setContentItems(items);
    } catch (err: any) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (content: ContentItem) => {
    onSelect(content);
    onClose();
  };

  const getFileIcon = (type: string | null, sourceType?: string | null) => {
    if (sourceType === 'youtube') return <Youtube size={20} className="text-red-600" />;
    if (sourceType === 'vimeo' || sourceType === 'dailymotion') return <Video size={20} className="text-purple-600" />;
    if (sourceType === 'googledrive' || sourceType === 'microsoft') return <HardDrive size={20} className="text-blue-600" />;
    if (sourceType === 'url') return <LinkIcon size={20} className="text-purple-600" />;
    
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      case 'image':
        return <Image size={20} className="text-blue-600" />;
      case 'document':
        return <FileText size={20} className="text-green-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="pdf">PDF</option>
            <option value="document">Document</option>
          </select>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="text-purple-600 animate-spin" />
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(item.file_type, item.source_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600">
                        {item.title}
                      </h3>
                      {item.source_type && item.source_type !== 'local' && (
                        <span className="text-xs text-blue-600 mt-1 block">
                          {item.source_type === 'youtube' && 'YouTube'}
                          {item.source_type === 'vimeo' && 'Vimeo'}
                          {item.source_type === 'dailymotion' && 'Dailymotion'}
                          {item.source_type === 'googledrive' && 'Google Drive'}
                          {item.source_type === 'microsoft' && 'Microsoft Office'}
                          {item.source_type === 'url' && 'External URL'}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.file_name}</span>
                    <Check size={16} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

