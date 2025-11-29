import { useState, useRef } from 'react';
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
  Download
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface ContentItem {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'image' | 'document' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'uploaded' | 'processing' | 'ready';
}

interface ContentLibraryProps {}

export function ContentLibrary({}: ContentLibraryProps) {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      name: 'UI_UX_Design_Guide.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      uploadedBy: 'Admin',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Introduction_to_React.mp4',
      type: 'video',
      size: '125.8 MB',
      uploadedAt: '2024-01-14',
      uploadedBy: 'Admin',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Course_Thumbnail.png',
      type: 'image',
      size: '856 KB',
      uploadedAt: '2024-01-13',
      uploadedBy: 'Admin',
      status: 'ready'
    }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles: ContentItem[] = Array.from(files).map((file, index) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || 'other';
        let type: ContentItem['type'] = 'other';
        if (['pdf'].includes(extension)) type = 'pdf';
        else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) type = 'video';
        else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
        else if (['doc', 'docx', 'txt'].includes(extension)) type = 'document';

        return {
          id: Date.now().toString() + index,
          name: file.name,
          type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString().split('T')[0],
          uploadedBy: 'Admin',
          status: 'ready' as const
        };
      });

      setContentItems([...newFiles, ...contentItems]);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  const getFileIcon = (type: ContentItem['type']) => {
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

  const getFileBgColor = (type: ContentItem['type']) => {
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

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
              <p className="text-sm text-gray-500 mt-1">Upload and manage your learning content files</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload size={16} className={uploading ? 'animate-spin' : ''} />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </label>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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
          {filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-500 mb-6">Upload your first file to get started</p>
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Upload Files
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 ${getFileBgColor(item.type)} rounded-lg flex items-center justify-center`}>
                      {getFileIcon(item.type)}
                    </div>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{item.size}</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Drop Zone */}
          <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Upload size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here to upload</h3>
              <p className="text-gray-500 mb-4">or click to browse</p>
              <label
                htmlFor="file-upload"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg cursor-pointer inline-block"
              >
                Select Files
              </label>
              <p className="text-xs text-gray-400 mt-3">Supports: PDF, Video, Images, Documents</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

