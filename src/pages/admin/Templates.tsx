import { useState } from 'react';
import { 
  FileText,
  Plus,
  Search,
  Filter,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FileQuestion,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'assessment' | 'assignment' | 'learning-path';
  thumbnail?: string;
  modules: number;
  usedCount: number;
  createdAt: string;
  author: string;
}

interface TemplatesProps {}

export function Templates({}: TemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Introduction Course Template',
      description: 'Standard template for introductory courses',
      type: 'course',
      modules: 5,
      usedCount: 23,
      createdAt: '2024-01-15',
      author: 'Admin'
    },
    {
      id: '2',
      name: 'Technical Assessment Template',
      description: 'Template for technical skill assessments',
      type: 'assessment',
      modules: 10,
      usedCount: 15,
      createdAt: '2024-01-14',
      author: 'Admin'
    },
    {
      id: '3',
      name: 'Project Assignment Template',
      description: 'Template for project-based assignments',
      type: 'assignment',
      modules: 3,
      usedCount: 8,
      createdAt: '2024-01-13',
      author: 'Admin'
    },
    {
      id: '4',
      name: 'Full Stack Developer Path',
      description: 'Complete learning path template for full stack development',
      type: 'learning-path',
      modules: 12,
      usedCount: 5,
      createdAt: '2024-01-12',
      author: 'Admin'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: Template['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'assessment':
        return <FileQuestion size={20} className="text-green-600" />;
      case 'assignment':
        return <ClipboardList size={20} className="text-orange-600" />;
      case 'learning-path':
        return <GraduationCap size={20} className="text-purple-600" />;
    }
  };

  const getTypeColor = (type: Template['type']) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-700';
      case 'assessment':
        return 'bg-green-100 text-green-700';
      case 'assignment':
        return 'bg-orange-100 text-orange-700';
      case 'learning-path':
        return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage reusable content templates</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Upload size={16} />
                Import Template
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Create Template
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
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="course">Course</option>
              <option value="assessment">Assessment</option>
              <option value="assignment">Assignment</option>
              <option value="learning-path">Learning Path</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-6">Create your first template to get started</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                Create Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(template.type).replace('text-', 'bg-').replace('-700', '-50')}`}>
                      {getTypeIcon(template.type)}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Modules</span>
                      <span className="font-medium text-gray-900">{template.modules}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used</span>
                      <span className="font-medium text-gray-900">{template.usedCount} times</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Author</span>
                      <span className="font-medium text-gray-900">{template.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1">
                      <Copy size={14} />
                      Use Template
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

