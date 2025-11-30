import { useState, useEffect } from 'react';
import { 
  FolderOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  X,
  Save,
  AlertCircle,
  Loader2,
  DollarSign,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Shield,
  Target,
  TrendingUp,
  Settings,
  FileText,
  Video,
  Image as ImageIcon,
  Music,
  Code,
  Globe,
  Heart,
  Star,
  Zap,
  Award,
  Lightbulb,
  Rocket,
  Palette,
  ShoppingBag,
  Car,
  Home,
  Plane,
  Gamepad2,
  Camera,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Bell,
  Gift,
  Coffee,
  Utensils,
  Smile,
  ThumbsUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  parent_name?: string | null;
  icon: string | null;
  color: string | null;
  course_count?: number;
  content_count?: number;
  learning_path_count?: number;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  course_count?: number;
  content_count?: number;
  learning_path_count?: number;
  created_at: string;
}

interface CategoriesProps {}

// Generate color from string (for tags that don't have color in DB)
const generateColor = (str: string): string => {
  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#6B7280', // Gray
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Icon mapping function to convert icon names/emojis to Lucide React icons
const getCategoryIcon = (iconName: string | null, color: string | null) => {
  if (!iconName) {
    return <FolderOpen size={24} style={{ color: color || '#3B82F6' }} />;
  }

  // Map common icon names to Lucide React icons
  const iconMap: { [key: string]: any } = {
    'DollarSign': DollarSign,
    'Users': Users,
    'Building2': Building2,
    'GraduationCap': GraduationCap,
    'BookOpen': BookOpen,
    'Briefcase': Briefcase,
    'Shield': Shield,
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Settings': Settings,
    'FileText': FileText,
    'Video': Video,
    'Image': ImageIcon,
    'Music': Music,
    'Code': Code,
    'Globe': Globe,
    'Heart': Heart,
    'Star': Star,
    'Zap': Zap,
    'Award': Award,
    'Lightbulb': Lightbulb,
    'Rocket': Rocket,
    'Palette': Palette,
    'ShoppingBag': ShoppingBag,
    'Car': Car,
    'Home': Home,
    'Plane': Plane,
    'Gamepad2': Gamepad2,
    'Camera': Camera,
    'Phone': Phone,
    'Mail': Mail,
    'MessageSquare': MessageSquare,
    'Calendar': Calendar,
    'Clock': Clock,
    'Bell': Bell,
    'Gift': Gift,
    'Coffee': Coffee,
    'Utensils': Utensils,
    'Smile': Smile,
    'ThumbsUp': ThumbsUp,
    'FolderOpen': FolderOpen,
    'Tag': Tag
  };

  // Check if it's a known icon name
  const IconComponent = iconMap[iconName];
  if (IconComponent) {
    return <IconComponent size={24} style={{ color: color || '#3B82F6' }} />;
  }

  // If it's an emoji, display it as text
  if (iconName.length <= 2 && /[\u{1F300}-\u{1F9FF}]/u.test(iconName)) {
    return <span className="text-2xl leading-none">{iconName}</span>;
  }

  // Default fallback
  return <FolderOpen size={24} style={{ color: color || '#3B82F6' }} />;
};

export function Categories({}: CategoriesProps) {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Category modals
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Tag modals
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [showEditTagModal, setShowEditTagModal] = useState(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parent_id: '',
    icon: '',
    color: '#3B82F6'
  });
  
  const [tagForm, setTagForm] = useState({
    name: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories(1, 100, '');
      setCategories(data.categories || []);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await api.getTags(1, 100, '');
      setTags(data.tags || []);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch tags');
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      showError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || null,
        parent_id: categoryForm.parent_id || null,
        icon: categoryForm.icon.trim() || null,
        color: categoryForm.color || null
      });
      showSuccess('Category created successfully!');
      setShowCreateCategoryModal(false);
      resetCategoryForm();
      await fetchCategories();
    } catch (err: any) {
      showError(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !categoryForm.name.trim()) {
      showError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.updateCategory(selectedCategory.id, {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || null,
        parent_id: categoryForm.parent_id || null,
        icon: categoryForm.icon.trim() || null,
        color: categoryForm.color || null
      });
      showSuccess('Category updated successfully!');
      setShowEditCategoryModal(false);
      setSelectedCategory(null);
      resetCategoryForm();
      await fetchCategories();
    } catch (err: any) {
      showError(err.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await api.deleteCategory(selectedCategory.id);
      showSuccess('Category deleted successfully!');
      setShowDeleteCategoryModal(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (err: any) {
      showError(err.message || 'Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTag = async () => {
    if (!tagForm.name.trim()) {
      showError('Tag name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.createTag({
        name: tagForm.name.trim()
      });
      showSuccess('Tag created successfully!');
      setShowCreateTagModal(false);
      resetTagForm();
      await fetchTags();
    } catch (err: any) {
      showError(err.message || 'Failed to create tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTag = async () => {
    if (!selectedTag || !tagForm.name.trim()) {
      showError('Tag name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.updateTag(selectedTag.id, {
        name: tagForm.name.trim()
      });
      showSuccess('Tag updated successfully!');
      setShowEditTagModal(false);
      setSelectedTag(null);
      resetTagForm();
      await fetchTags();
    } catch (err: any) {
      showError(err.message || 'Failed to update tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    try {
      setSubmitting(true);
      await api.deleteTag(selectedTag.id);
      showSuccess('Tag deleted successfully!');
      setShowDeleteTagModal(false);
      setSelectedTag(null);
      await fetchTags();
    } catch (err: any) {
      showError(err.message || 'Failed to delete tag');
    } finally {
      setSubmitting(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      parent_id: '',
      icon: '',
      color: '#3B82F6'
    });
  };

  const resetTagForm = () => {
    setTagForm({ name: '' });
  };

  const openEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6'
    });
    setShowEditCategoryModal(true);
  };

  const openEditTag = (tag: Tag) => {
    setSelectedTag(tag);
    setTagForm({ name: tag.name });
    setShowEditTagModal(true);
  };

  const openDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteCategoryModal(true);
  };

  const openDeleteTag = (tag: Tag) => {
    setSelectedTag(tag);
    setShowDeleteTagModal(true);
  };

  const getParentCategory = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(cat => cat.id === parentId);
  };

  const getTotalItemCount = (category: Category) => {
    return (category.course_count || 0) + (category.content_count || 0) + (category.learning_path_count || 0);
  };

  // Organize categories hierarchically
  const organizeCategories = (cats: Category[]) => {
    const parentCategories = cats.filter(c => !c.parent_id);
    const subcategories = cats.filter(c => c.parent_id);
    
    // Group subcategories by parent_id
    const subcategoriesByParent: { [key: string]: Category[] } = {};
    subcategories.forEach(sub => {
      if (!subcategoriesByParent[sub.parent_id!]) {
        subcategoriesByParent[sub.parent_id!] = [];
      }
      subcategoriesByParent[sub.parent_id!].push(sub);
    });
    
    // Build hierarchical structure
    const organized: Array<{ category: Category; subcategories: Category[] }> = [];
    
    parentCategories.forEach(parent => {
      organized.push({
        category: parent,
        subcategories: subcategoriesByParent[parent.id] || []
      });
    });
    
    // Add orphaned subcategories (parent doesn't exist)
    subcategories.forEach(sub => {
      const parentExists = parentCategories.find(p => p.id === sub.parent_id);
      if (!parentExists) {
        organized.push({
          category: sub,
          subcategories: []
        });
      }
    });
    
    return organized;
  };

  const getTotalUsageCount = (tag: Tag) => {
    return (tag.course_count || 0) + (tag.content_count || 0) + (tag.learning_path_count || 0);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parentCategories = categories.filter(cat => !cat.parent_id);

  const isModalOpen = showCreateCategoryModal || showEditCategoryModal || showDeleteCategoryModal ||
                     showCreateTagModal || showEditTagModal || showDeleteTagModal;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading categories and tags...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Categories & Tags</h1>
              <p className="text-sm text-gray-500 mt-1">Organize your content with categories and tags</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => activeTab === 'categories' ? setShowCreateCategoryModal(true) : setShowCreateTagModal(true)}
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
              {organizeCategories(filteredCategories).map(({ category, subcategories }) => {
                const itemCount = getTotalItemCount(category);
                const isParent = !category.parent_id;
                const hasSubcategories = subcategories.length > 0;
                const isExpanded = expandedCategories.has(category.id);
                
                const toggleExpand = () => {
                  const newExpanded = new Set(expandedCategories);
                  if (isExpanded) {
                    newExpanded.delete(category.id);
                  } else {
                    newExpanded.add(category.id);
                  }
                  setExpandedCategories(newExpanded);
                };
                
                return (
                  <div key={category.id} className="space-y-2">
                    {/* Parent Category */}
                    <div
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {hasSubcategories && (
                            <button
                              onClick={toggleExpand}
                              className="mt-1 p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors flex-shrink-0"
                              title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                            >
                              {isExpanded ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronRight size={20} />
                              )}
                            </button>
                          )}
                          {!hasSubcategories && <div className="w-5" />}
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: (category.color || '#3B82F6') + '20' }}
                          >
                            {getCategoryIcon(category.icon, category.color)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900 break-words">{category.name}</h3>
                              {!isParent && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  Subcategory
                                </span>
                              )}
                            </div>
                            {category.description && (
                              <p className="text-sm text-gray-600 mb-3 break-words">{category.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{itemCount} items</span>
                              {hasSubcategories && (
                                <>
                                  <span>•</span>
                                  <span>{subcategories.length} subcategor{subcategories.length === 1 ? 'y' : 'ies'}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>Created {new Date(category.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditCategory(category)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Edit category"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteCategory(category)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subcategories */}
                    {hasSubcategories && (
                      <div
                        className={`ml-8 space-y-2 border-l-2 border-gray-200 pl-6 transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="space-y-2">
                          {subcategories.map((subcategory) => {
                          const subItemCount = getTotalItemCount(subcategory);
                          return (
                            <div
                              key={subcategory.id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: (subcategory.color || category.color || '#3B82F6') + '20' }}
                                  >
                                    {getCategoryIcon(subcategory.icon, subcategory.color || category.color)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-sm font-medium text-gray-900 break-words">{subcategory.name}</h4>
                                    </div>
                                    {subcategory.description && (
                                      <p className="text-xs text-gray-600 mb-2 break-words line-clamp-2">{subcategory.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span>{subItemCount} items</span>
                                      <span>•</span>
                                      <span>Created {new Date(subcategory.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openEditCategory(subcategory)}
                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Edit subcategory"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteCategory(subcategory)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete subcategory"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tags Header Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Tags</h2>
                    <p className="text-sm text-gray-600">
                      Tags are flexible labels that can be applied to multiple courses and content items. 
                      Use tags to organize and filter your learning materials.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCreateTagModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <Plus size={16} />
                      New Tag
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <span>Total Tags: <span className="font-semibold text-gray-900">{filteredTags.length}</span></span>
                  {filteredTags.length > 0 && (
                    <span>• Used in: <span className="font-semibold text-gray-900">
                      {filteredTags.reduce((sum, tag) => sum + getTotalUsageCount(tag), 0)} items
                    </span></span>
                  )}
                </div>
              </div>

              {/* Tags as Cards */}
              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {filteredTags.map((tag) => {
                    const tagColor = generateColor(tag.name);
                    const usageCount = getTotalUsageCount(tag);
                    return (
                      <div
                        key={tag.id}
                        className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all min-w-[120px]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: tagColor + '20', color: tagColor }}
                          >
                            {tag.name}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditTag(tag)}
                              className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Edit tag"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => openDeleteTag(tag)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete tag"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {usageCount} {usageCount === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Tag size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? 'No tags match your search. Try a different query.' : 'Create your first tag to label content'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreateTagModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Create Tag
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty States */}
          {activeTab === 'categories' && filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FolderOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'No categories match your search. Try a different query.' : 'Create your first category to organize content'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateCategoryModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create Category
                </button>
              )}
            </div>
          )}

          {activeTab === 'tags' && filteredTags.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Tag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'No tags match your search. Try a different query.' : 'Create your first tag to label content'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateTagModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create Tag
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Category Modal */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Category</h2>
              <button
                onClick={() => {
                  setShowCreateCategoryModal(false);
                  resetCategoryForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Category name"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Category description"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  value={categoryForm.parent_id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={submitting}
                >
                  <option value="">None (Top-level category)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="📁"
                  maxLength={2}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="#3B82F6"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateCategoryModal(false);
                    resetCategoryForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={submitting || !categoryForm.name.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
              <button
                onClick={() => {
                  setShowEditCategoryModal(false);
                  setSelectedCategory(null);
                  resetCategoryForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Category name"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Category description"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  value={categoryForm.parent_id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={submitting}
                >
                  <option value="">None (Top-level category)</option>
                  {parentCategories.filter(cat => cat.id !== selectedCategory.id).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="📁"
                  maxLength={2}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="#3B82F6"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setSelectedCategory(null);
                    resetCategoryForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  disabled={submitting || !categoryForm.name.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedCategory.name}"</span>?
              </p>
              {getTotalItemCount(selectedCategory) > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Warning: This category is currently in use</p>
                      <p className="text-sm text-yellow-700">
                        This category will be automatically removed from:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-yellow-700 list-disc list-inside">
                        {selectedCategory.course_count > 0 && (
                          <li>{selectedCategory.course_count} course{selectedCategory.course_count !== 1 ? 's' : ''}</li>
                        )}
                        {selectedCategory.content_count > 0 && (
                          <li>{selectedCategory.content_count} content item{selectedCategory.content_count !== 1 ? 's' : ''}</li>
                        )}
                        {selectedCategory.learning_path_count > 0 && (
                          <li>{selectedCategory.learning_path_count} learning path{selectedCategory.learning_path_count !== 1 ? 's' : ''}</li>
                        )}
                      </ul>
                      <p className="mt-2 text-sm font-medium text-yellow-800">
                        Total: {getTotalItemCount(selectedCategory)} item{getTotalItemCount(selectedCategory) !== 1 ? 's' : ''} will be affected
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The category will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setSelectedCategory(null);
                }}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Tag</h2>
              <button
                onClick={() => {
                  setShowCreateTagModal(false);
                  resetTagForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tagForm.name}
                  onChange={(e) => setTagForm({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tag name"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateTagModal(false);
                    resetTagForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTag}
                  disabled={submitting || !tagForm.name.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {showEditTagModal && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Tag</h2>
              <button
                onClick={() => {
                  setShowEditTagModal(false);
                  setSelectedTag(null);
                  resetTagForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tagForm.name}
                  onChange={(e) => setTagForm({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tag name"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditTagModal(false);
                    setSelectedTag(null);
                    resetTagForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTag}
                  disabled={submitting || !tagForm.name.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Modal */}
      {showDeleteTagModal && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Tag</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedTag.name}"</span>?
              </p>
              {getTotalUsageCount(selectedTag) > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Warning: This tag is currently in use</p>
                      <p className="text-sm text-yellow-700">
                        This tag will be automatically removed from:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-yellow-700 list-disc list-inside">
                        {selectedTag.course_count > 0 && (
                          <li>{selectedTag.course_count} course{selectedTag.course_count !== 1 ? 's' : ''}</li>
                        )}
                        {selectedTag.content_count > 0 && (
                          <li>{selectedTag.content_count} content item{selectedTag.content_count !== 1 ? 's' : ''}</li>
                        )}
                        {selectedTag.learning_path_count > 0 && (
                          <li>{selectedTag.learning_path_count} learning path{selectedTag.learning_path_count !== 1 ? 's' : ''}</li>
                        )}
                      </ul>
                      <p className="mt-2 text-sm font-medium text-yellow-800">
                        Total: {getTotalUsageCount(selectedTag)} item{getTotalUsageCount(selectedTag) !== 1 ? 's' : ''} will be affected
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The tag will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteTagModal(false);
                  setSelectedTag(null);
                }}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTag}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Tag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
