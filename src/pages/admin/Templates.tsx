import { useState, useEffect } from 'react';
import { 
  FileText,
  Plus,
  Search,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FileQuestion,
  Copy,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: 'course' | 'assessment' | 'assignment' | 'learning-path';
  thumbnail_url: string | null;
  template_data: any;
  is_public: boolean;
  usage_count: number;
  created_by: string;
  author_name?: string;
  author_email?: string;
  created_at: string;
  updated_at: string;
}

interface TemplatesProps {}

export function Templates({}: TemplatesProps) {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Form states
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'course' as Template['type'],
    is_public: false,
    source_id: '',
    source_type: 'new' as 'new' | 'course' | 'learning-path'
  });
  
  const [useTemplateForm, setUseTemplateForm] = useState({
    title: '',
    description: ''
  });
  
  // Source selection (for creating from existing)
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [availableLearningPaths, setAvailableLearningPaths] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, [filterType]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await api.getTemplates(1, 100, searchQuery, filterType !== 'all' ? filterType : 'all');
      setTemplates(data.templates || []);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchQuery]);

  const fetchAvailableCourses = async () => {
    try {
      const data = await api.getCourses(1, 100, '', 'all');
      setAvailableCourses(data.courses || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAvailableLearningPaths = async () => {
    try {
      const data = await api.getLearningPaths(1, 100, '', 'all');
      setAvailableLearningPaths(data.paths || []);
    } catch (err: any) {
      console.error('Error fetching learning paths:', err);
      showError(err.message || 'Failed to fetch learning paths');
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.name.trim()) {
      showError('Template name is required');
      return;
    }

    try {
      setSubmitting(true);
      const templateData: any = {
        name: templateForm.name.trim(),
        description: templateForm.description.trim() || null,
        type: templateForm.type,
        is_public: templateForm.is_public,
      };

      // If creating from existing source
      if (templateForm.source_type !== 'new' && templateForm.source_id) {
        templateData.source_id = templateForm.source_id;
      } else {
        // For new templates, provide empty structure
        switch (templateForm.type) {
          case 'course':
            templateData.template_data = {
              course: {
                title: '',
                description: '',
                difficulty_level: 'beginner',
                language: 'en'
              },
              modules: []
            };
            break;
          case 'learning-path':
            templateData.template_data = {
              learning_path: {
                title: '',
                description: '',
                estimated_duration_hours: 0
              },
              courses: []
            };
            break;
          default:
            templateData.template_data = {};
        }
      }

      await api.createTemplate(templateData);
      showSuccess('Template created successfully!');
      setShowCreateModal(false);
      resetTemplateForm();
      await fetchTemplates();
    } catch (err: any) {
      showError(err.message || 'Failed to create template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate || !templateForm.name.trim()) {
      showError('Template name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.updateTemplate(selectedTemplate.id, {
        name: templateForm.name.trim(),
        description: templateForm.description.trim() || null,
        is_public: templateForm.is_public
      });
      showSuccess('Template updated successfully!');
      setShowEditModal(false);
      setSelectedTemplate(null);
      resetTemplateForm();
      await fetchTemplates();
    } catch (err: any) {
      showError(err.message || 'Failed to update template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setSubmitting(true);
      await api.deleteTemplate(selectedTemplate.id);
      showSuccess('Template deleted successfully!');
      setShowDeleteModal(false);
      setSelectedTemplate(null);
      await fetchTemplates();
    } catch (err: any) {
      showError(err.message || 'Failed to delete template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setSubmitting(true);
      const result = await api.useTemplate(
        selectedTemplate.id,
        useTemplateForm.title || null,
        useTemplateForm.description || null
      );
      
      showSuccess(`${selectedTemplate.type} created from template successfully!`);
      setShowUseModal(false);
      setSelectedTemplate(null);
      setUseTemplateForm({ title: '', description: '' });
      
      // Navigate to the created item
      if (result.course) {
        navigate(`/admin/course-builder?courseId=${result.course.id}`);
      } else if (result.learningPath) {
        navigate(`/admin/learning-paths?pathId=${result.learningPath.id}`);
      }
      
      await fetchTemplates();
    } catch (err: any) {
      showError(err.message || 'Failed to use template');
    } finally {
      setSubmitting(false);
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      type: 'course',
      is_public: false,
      source_id: '',
      source_type: 'new'
    });
  };

  const openEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description || '',
      type: template.type,
      is_public: template.is_public,
      source_id: '',
      source_type: 'new'
    });
    setShowEditModal(true);
  };

  const openDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const openViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowViewModal(true);
  };

  const openUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setUseTemplateForm({
      title: '',
      description: ''
    });
    setShowUseModal(true);
  };

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

  const getModuleCount = (template: Template) => {
    if (template.type === 'course' && template.template_data?.modules) {
      return template.template_data.modules.length;
    }
    if (template.type === 'learning-path' && template.template_data?.courses) {
      return template.template_data.courses.length;
    }
    return 0;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const isModalOpen = showCreateModal || showEditModal || showDeleteModal || showViewModal || showUseModal;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading templates...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage reusable content templates</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  fetchAvailableCourses();
                  fetchAvailableLearningPaths();
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
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
              <p className="text-gray-500 mb-6">
                {searchQuery || filterType !== 'all' 
                  ? 'No templates match your search or filters'
                  : 'Create your first template to get started'}
              </p>
              {!searchQuery && filterType === 'all' && (
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    fetchAvailableCourses();
                    fetchAvailableLearningPaths();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create Template
                </button>
              )}
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
                    <div className="flex items-center gap-2">
                      {template.is_public && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          Public
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(template.type)}`}>
                        {template.type.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description || 'No description'}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium text-gray-900">{getModuleCount(template)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used</span>
                      <span className="font-medium text-gray-900">{template.usage_count} times</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Author</span>
                      <span className="font-medium text-gray-900">{template.author_name || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openUseTemplate(template)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Copy size={14} />
                      Use
                    </button>
                    <button
                      onClick={() => openViewTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View template"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      title="Edit template"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteTemplate(template)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete template"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Template</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetTemplateForm();
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
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Template name"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Template description"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={templateForm.type}
                  onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as Template['type'], source_type: 'new', source_id: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={submitting}
                >
                  <option value="course">Course</option>
                  <option value="learning-path">Learning Path</option>
                  <option value="assessment">Assessment</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              {(templateForm.type === 'course' || templateForm.type === 'learning-path') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Create From</label>
                  <select
                    value={templateForm.source_type}
                    onChange={(e) => setTemplateForm({ ...templateForm, source_type: e.target.value as 'new' | 'course' | 'learning-path', source_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    disabled={submitting}
                  >
                    <option value="new">New Empty Template</option>
                    {templateForm.type === 'course' && <option value="course">From Existing Course</option>}
                    {templateForm.type === 'learning-path' && <option value="learning-path">From Existing Learning Path</option>}
                  </select>
                  
                  {templateForm.source_type === 'course' && templateForm.type === 'course' && (
                    <select
                      value={templateForm.source_id}
                      onChange={(e) => setTemplateForm({ ...templateForm, source_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={submitting}
                    >
                      <option value="">Select a course...</option>
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {templateForm.source_type === 'learning-path' && templateForm.type === 'learning-path' && (
                    <select
                      value={templateForm.source_id}
                      onChange={(e) => setTemplateForm({ ...templateForm, source_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={submitting}
                    >
                      <option value="">Select a learning path...</option>
                      {availableLearningPaths.map((path) => (
                        <option key={path.id} value={path.id}>
                          {path.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={templateForm.is_public}
                  onChange={(e) => setTemplateForm({ ...templateForm, is_public: e.target.checked })}
                  className="rounded"
                  disabled={submitting}
                />
                <label htmlFor="is_public" className="text-sm text-gray-700">
                  Make this template public (visible to all admins)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetTemplateForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={submitting || !templateForm.name.trim() || (templateForm.source_type !== 'new' && !templateForm.source_id)}
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
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Template</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTemplate(null);
                  resetTemplateForm();
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
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Template name"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Template description"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_is_public"
                  checked={templateForm.is_public}
                  onChange={(e) => setTemplateForm({ ...templateForm, is_public: e.target.checked })}
                  className="rounded"
                  disabled={submitting}
                />
                <label htmlFor="edit_is_public" className="text-sm text-gray-700">
                  Make this template public
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTemplate(null);
                    resetTemplateForm();
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTemplate}
                  disabled={submitting || !templateForm.name.trim()}
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

      {/* Delete Template Modal */}
      {showDeleteModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Template</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedTemplate.name}"</span>?
              </p>
              {selectedTemplate.usage_count > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This template has been used <span className="font-semibold">{selectedTemplate.usage_count} time{selectedTemplate.usage_count !== 1 ? 's' : ''}</span>.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The template will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTemplate(null);
                }}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTemplate}
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
                    Delete Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Template Modal */}
      {showViewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(selectedTemplate.type).replace('text-', 'bg-').replace('-700', '-50')}`}>
                  {getTypeIcon(selectedTemplate.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-sm text-gray-500">{selectedTemplate.type.replace('-', ' ')} template</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTemplate(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedTemplate.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Count</label>
                  <p className="text-sm text-gray-900">{selectedTemplate.usage_count} times</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <p className="text-sm text-gray-900">{selectedTemplate.is_public ? 'Public' : 'Private'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <p className="text-sm text-gray-900">{selectedTemplate.author_name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">{new Date(selectedTemplate.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Structure</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedTemplate.template_data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(selectedTemplate.type).replace('text-', 'bg-').replace('-700', '-50')}`}>
                  {getTypeIcon(selectedTemplate.type)}
                </div>
                <h2 className="text-xl font-bold text-gray-900">Use Template</h2>
              </div>
              <button
                onClick={() => {
                  setShowUseModal(false);
                  setSelectedTemplate(null);
                  setUseTemplateForm({ title: '', description: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Create a new {selectedTemplate.type.replace('-', ' ')} from the template <span className="font-semibold">"{selectedTemplate.name}"</span>
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedTemplate.type === 'course' ? 'Course' : selectedTemplate.type === 'learning-path' ? 'Learning Path' : 'Item'} Title
                </label>
                <input
                  type="text"
                  value={useTemplateForm.title}
                  onChange={(e) => setUseTemplateForm({ ...useTemplateForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter ${selectedTemplate.type.replace('-', ' ')} title (optional)`}
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use template default</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={useTemplateForm.description}
                  onChange={(e) => setUseTemplateForm({ ...useTemplateForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Enter description (optional)"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowUseModal(false);
                    setSelectedTemplate(null);
                    setUseTemplateForm({ title: '', description: '' });
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUseTemplate}
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Create {selectedTemplate.type.replace('-', ' ')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
