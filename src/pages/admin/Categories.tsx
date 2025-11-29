import { useState } from 'react';
import { 
  FolderOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Folder,
  MoreVertical,
  X,
  Save
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  itemCount: number;
  createdAt: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: string;
}

interface CategoriesProps {}

export function Categories({}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Technical',
      description: 'Technical courses and content',
      parentId: null,
      color: '#3B82F6',
      icon: '💻',
      itemCount: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Design',
      description: 'Design-related content',
      parentId: null,
      color: '#8B5CF6',
      icon: '🎨',
      itemCount: 32,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Business',
      description: 'Business and management content',
      parentId: null,
      color: '#10B981',
      icon: '💼',
      itemCount: 28,
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      name: 'React',
      description: 'React framework content',
      parentId: '1',
      color: '#3B82F6',
      icon: '⚛️',
      itemCount: 15,
      createdAt: '2024-01-12'
    }
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Beginner', color: '#10B981', usageCount: 124, createdAt: '2024-01-15' },
    { id: '2', name: 'Advanced', color: '#F59E0B', usageCount: 89, createdAt: '2024-01-14' },
    { id: '3', name: 'Mandatory', color: '#EF4444', usageCount: 67, createdAt: '2024-01-13' },
    { id: '4', name: 'Optional', color: '#6B7280', usageCount: 156, createdAt: '2024-01-12' },
    { id: '5', name: 'Certification', color: '#8B5CF6', usageCount: 45, createdAt: '2024-01-11' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParentCategory = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(cat => cat.id === parentId);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories & Tags</h1>
              <p className="text-sm text-gray-500 mt-1">Organize your content with categories and tags</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => activeTab === 'categories' ? setIsCreatingCategory(true) : setIsCreatingTag(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                New {activeTab === 'categories' ? 'Category' : 'Tag'}
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tags'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tags
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'categories' ? (
            <div className="space-y-4">
              {filteredCategories.map((category) => {
                const parent = getParentCategory(category.parentId);
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            {parent && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                Subcategory of {parent.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{category.itemCount} items</span>
                            <span>•</span>
                            <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {tag.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Used in {tag.usageCount} items
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty States */}
          {activeTab === 'categories' && filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FolderOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">Create your first category to organize content</p>
              <button
                onClick={() => setIsCreatingCategory(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Create Category
              </button>
            </div>
          )}

          {activeTab === 'tags' && filteredTags.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Tag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
              <p className="text-gray-500 mb-6">Create your first tag to label content</p>
              <button
                onClick={() => setIsCreatingTag(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Create Tag
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

