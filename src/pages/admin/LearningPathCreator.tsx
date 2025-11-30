import { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Trash2, 
  BookOpen,
  GraduationCap,
  ChevronRight,
  GripVertical,
  Search,
  Loader2,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Clock,
  Users
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  status: 'draft' | 'published' | 'archived';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  modules?: Module[];
  category_name?: string | null;
  instructor_name?: string | null;
}

interface PathCourse extends Course {
  order_index: number;
  is_required: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category_name?: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  estimated_duration_hours: number;
  created_by: string | null;
  created_by_name?: string | null;
  course_count?: number;
  courses?: PathCourse[];
  created_at?: string;
  updated_at?: string;
}

interface LearningPathCreatorProps {}

export function LearningPathCreator({}: LearningPathCreatorProps) {
  const { showSuccess, showError } = useToast();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreatingPath, setIsCreatingPath] = useState(false);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDescription, setNewPathDescription] = useState('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'date-newest' | 'date-oldest' | 'modified-newest' | 'modified-oldest' | 'status' | 'courses-asc' | 'courses-desc'>('title-asc');
  const [showDeletePathModal, setShowDeletePathModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<LearningPath | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<{ pathId: string; courseId: string; courseTitle: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalPath, setOriginalPath] = useState<LearningPath | null>(null);
  const [localCourses, setLocalCourses] = useState<PathCourse[]>([]);
  const [draggedCourse, setDraggedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchLearningPaths();
    fetchAvailableCourses();
  }, [statusFilter]);

  // Sort learning paths when sortBy changes
  useEffect(() => {
    if (learningPaths.length > 0) {
      const sorted = sortPaths([...learningPaths], sortBy);
      const currentIds = learningPaths.map(p => p.id).join(',');
      const sortedIds = sorted.map(p => p.id).join(',');
      if (currentIds !== sortedIds) {
        setLearningPaths(sorted);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const fetchLearningPaths = async (searchOverride?: string) => {
    try {
      setLoading(true);
      const activeSearchQuery = searchOverride !== undefined ? searchOverride : searchQuery;
      const data = await api.getLearningPaths(1, 100, activeSearchQuery, statusFilter !== 'all' ? statusFilter : 'all');
      let paths = data.paths || [];
      
      // Apply client-side sorting
      paths = sortPaths(paths, sortBy);
      
      setLearningPaths(paths);
    } catch (err: any) {
      showError(err.message || 'Failed to load learning paths');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const data = await api.getCourses(1, 100, '', 'all');
      setAvailableCourses(data.courses || []);
    } catch (err: any) {
      showError(err.message || 'Failed to load courses');
    }
  };

  const fetchLearningPath = async (id: string) => {
    try {
      setLoading(true);
      const path = await api.getLearningPath(id);
      setSelectedPath(path);
      setOriginalPath(JSON.parse(JSON.stringify(path))); // Deep copy
      setLocalCourses(path.courses || []);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      showError(err.message || 'Failed to load learning path');
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = async () => {
    if (!newPathTitle.trim()) {
      showError('Path title is required');
      return;
    }

    try {
      setSaving(true);
      const path = await api.createLearningPath({
        title: newPathTitle.trim(),
        description: newPathDescription.trim() || null,
        status: 'draft'
      });
      showSuccess('Learning path created successfully!');
      setNewPathTitle('');
      setNewPathDescription('');
      setIsCreatingPath(false);
      await fetchLearningPaths();
      await fetchLearningPath(path.id);
    } catch (err: any) {
      showError(err.message || 'Failed to create learning path');
    } finally {
      setSaving(false);
    }
  };

  const saveLearningPath = async () => {
    if (!selectedPath) return;

    try {
      setSaving(true);
      
      // Update path metadata
      await api.updateLearningPath(selectedPath.id, {
        title: selectedPath.title,
        description: selectedPath.description,
        category_id: selectedPath.category_id,
        thumbnail_url: selectedPath.thumbnail_url,
        status: selectedPath.status,
        is_featured: selectedPath.is_featured,
        estimated_duration_hours: selectedPath.estimated_duration_hours
      });

      // Get current courses from backend
      const currentPath = await api.getLearningPath(selectedPath.id);
      const currentCourseIds = (currentPath.courses || []).map(c => c.id);
      const localCourseIds = localCourses.map(c => c.id);

      // Add new courses
      for (const course of localCourses) {
        if (!currentCourseIds.includes(course.id)) {
          await api.addCourseToPath(selectedPath.id, course.id, course.order_index, course.is_required);
        } else {
          // Update requirement status if changed
          const currentCourse = currentPath.courses?.find(c => c.id === course.id);
          if (currentCourse && currentCourse.is_required !== course.is_required) {
            await api.updateCourseRequirement(selectedPath.id, course.id, course.is_required);
          }
        }
      }

      // Remove courses that are no longer in localCourses
      for (const courseId of currentCourseIds) {
        if (!localCourseIds.includes(courseId)) {
          await api.removeCourseFromPath(selectedPath.id, courseId);
        }
      }

      // Reorder courses if order changed
      const courseIds = localCourses.map(c => c.id);
      await api.reorderCoursesInPath(selectedPath.id, courseIds);

      showSuccess('Learning path saved successfully!');
      await fetchLearningPath(selectedPath.id);
      await fetchLearningPaths();
    } catch (err: any) {
      showError(err.message || 'Failed to save learning path');
    } finally {
      setSaving(false);
    }
  };

  const publishPath = async () => {
    if (!selectedPath || hasUnsavedChanges) return;

    try {
      setSaving(true);
      await api.updateLearningPath(selectedPath.id, { status: 'published' });
      showSuccess('Learning path published successfully!');
      await fetchLearningPath(selectedPath.id);
      await fetchLearningPaths();
    } catch (err: any) {
      showError(err.message || 'Failed to publish learning path');
    } finally {
      setSaving(false);
    }
  };

  const unpublishPath = async () => {
    if (!selectedPath || hasUnsavedChanges) return;

    try {
      setSaving(true);
      await api.updateLearningPath(selectedPath.id, { status: 'draft' });
      showSuccess('Learning path unpublished successfully!');
      await fetchLearningPath(selectedPath.id);
      await fetchLearningPaths();
    } catch (err: any) {
      showError(err.message || 'Failed to unpublish learning path');
    } finally {
      setSaving(false);
    }
  };

  const deleteLearningPath = async () => {
    if (!pathToDelete) return;

    try {
      await api.deleteLearningPath(pathToDelete.id);
      showSuccess('Learning path deleted successfully!');
      if (selectedPath?.id === pathToDelete.id) {
        setSelectedPath(null);
        setLocalCourses([]);
        setHasUnsavedChanges(false);
      }
      setShowDeletePathModal(false);
      setPathToDelete(null);
      await fetchLearningPaths();
    } catch (err: any) {
      showError(err.message || 'Failed to delete learning path');
    }
  };

  const handleDeletePathClick = (path: LearningPath) => {
    setPathToDelete(path);
    setShowDeletePathModal(true);
  };

  const addCourseToPath = (course: Course) => {
    if (!selectedPath) return;

    const newPathCourse: PathCourse = {
      ...course,
      order_index: localCourses.length,
      is_required: true
    };

    const updatedCourses = [...localCourses, newPathCourse];
    setLocalCourses(updatedCourses);
    setSelectedPath({
      ...selectedPath,
      courses: updatedCourses
    });
    setHasUnsavedChanges(true);
    setShowCourseSelector(false);
  };

  const removeCourseFromPath = (courseId: string) => {
    if (!selectedPath) return;

    const updatedCourses = localCourses.filter(c => c.id !== courseId);
    // Reorder remaining courses
    const reorderedCourses = updatedCourses.map((c, index) => ({
      ...c,
      order_index: index
    }));
    setLocalCourses(reorderedCourses);
    setSelectedPath({
      ...selectedPath,
      courses: reorderedCourses
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteCourseClick = (course: PathCourse) => {
    if (!selectedPath) return;
    setCourseToDelete({
      pathId: selectedPath.id,
      courseId: course.id,
      courseTitle: course.title
    });
    setShowDeleteCourseModal(true);
  };

  const deleteCourseFromPath = async () => {
    if (!courseToDelete || !selectedPath) return;

    try {
      await api.removeCourseFromPath(courseToDelete.pathId, courseToDelete.courseId);
      showSuccess('Course removed from learning path!');
      setShowDeleteCourseModal(false);
      setCourseToDelete(null);
      await fetchLearningPath(selectedPath.id);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      showError(err.message || 'Failed to remove course');
    }
  };

  const updatePathField = (field: keyof LearningPath, value: any) => {
    if (!selectedPath) return;
    const updated = { ...selectedPath, [field]: value };
    setSelectedPath(updated);
    setHasUnsavedChanges(true);
  };

  const updateCourseRequirement = (courseId: string, isRequired: boolean) => {
    if (!selectedPath) return;
    const updatedCourses = localCourses.map(c =>
      c.id === courseId ? { ...c, is_required: isRequired } : c
    );
    setLocalCourses(updatedCourses);
    setSelectedPath({
      ...selectedPath,
      courses: updatedCourses
    });
    setHasUnsavedChanges(true);
  };

  // Drag and drop handlers
  const handleCourseDragStart = (courseId: string) => {
    setDraggedCourse(courseId);
  };

  const handleCourseDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCourseDrop = (targetCourseId: string) => {
    if (!draggedCourse || draggedCourse === targetCourseId || !selectedPath) return;

    const draggedIndex = localCourses.findIndex(c => c.id === draggedCourse);
    const targetIndex = localCourses.findIndex(c => c.id === targetCourseId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCourses = [...localCourses];
    const [removed] = newCourses.splice(draggedIndex, 1);
    newCourses.splice(targetIndex, 0, removed);

    // Update order_index
    const reorderedCourses = newCourses.map((c, index) => ({
      ...c,
      order_index: index
    }));

    setLocalCourses(reorderedCourses);
    setSelectedPath({
      ...selectedPath,
      courses: reorderedCourses
    });
    setHasUnsavedChanges(true);
    setDraggedCourse(null);
  };

  const sortPaths = (paths: LearningPath[], sortOption: typeof sortBy): LearningPath[] => {
    const sorted = [...paths];
    
    switch (sortOption) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'date-newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      case 'date-oldest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateA - dateB;
        });
      case 'modified-newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
      case 'modified-oldest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
          return dateA - dateB;
        });
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case 'courses-asc':
        return sorted.sort((a, b) => (a.course_count || 0) - (b.course_count || 0));
      case 'courses-desc':
        return sorted.sort((a, b) => (b.course_count || 0) - (a.course_count || 0));
      default:
        return sorted;
    }
  };

  const filteredCourses = availableCourses.filter(course => {
    const isInPath = localCourses.some(c => c.id === course.id);
    const matchesSearch = course.title.toLowerCase().includes(searchInput.toLowerCase());
    return !isInPath && matchesSearch;
  });

  if (loading && learningPaths.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading learning paths...</p>
          </div>
        </div>
      </div>
    );
  }

  const isModalOpen = showCourseSelector || showDeletePathModal || showDeleteCourseModal;

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
              <h1 className="text-2xl font-bold text-gray-900">Learning Path Creator</h1>
              <p className="text-sm text-gray-500 mt-1">Create structured learning journeys for your learners</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingPath(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                New Path
              </button>
              {selectedPath && (
                <>
                  {hasUnsavedChanges && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
                    </div>
                  )}
                  <button
                    onClick={saveLearningPath}
                    disabled={saving || !hasUnsavedChanges}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      hasUnsavedChanges
                        ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:from-purple-700 hover:to-green-700'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                      </>
                    )}
                  </button>
                  {selectedPath.status === 'draft' && (
                    <button
                      onClick={publishPath}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before publishing' : 'Publish learning path'}
                    >
                      Publish
                    </button>
                  )}
                  {selectedPath.status === 'published' && (
                    <button
                      onClick={unpublishPath}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before unpublishing' : 'Unpublish learning path'}
                    >
                      Unpublish
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Learning Paths List */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Learning Paths</h2>
              
              {/* Search Bar */}
              <div className="mb-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSearchQuery(searchInput);
                          fetchLearningPaths(searchInput);
                        }
                      }}
                      placeholder="Search paths..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery(searchInput);
                      fetchLearningPaths(searchInput);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Search size={16} />
                    Search
                  </button>
                  {searchInput && (
                    <button
                      onClick={() => {
                        setSearchInput('');
                        setSearchQuery('');
                        fetchLearningPaths('');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="mb-3 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as typeof statusFilter);
                      fetchLearningPaths();
                    }}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {(statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      fetchLearningPaths();
                    }}
                    className="w-full px-2 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={12} />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="date-newest">Date (Newest)</option>
                  <option value="date-oldest">Date (Oldest)</option>
                  <option value="modified-newest">Modified (Newest)</option>
                  <option value="modified-oldest">Modified (Oldest)</option>
                  <option value="status">Status</option>
                  <option value="courses-asc">Courses (Fewest)</option>
                  <option value="courses-desc">Courses (Most)</option>
                </select>
              </div>

              {/* Create New Path Form */}
              {isCreatingPath ? (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Path Title"
                    value={newPathTitle}
                    onChange={(e) => setNewPathTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newPathDescription}
                    onChange={(e) => setNewPathDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createLearningPath}
                      disabled={saving || !newPathTitle.trim()}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                      {saving ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingPath(false);
                        setNewPathTitle('');
                        setNewPathDescription('');
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
              
              {/* Learning Paths List */}
              <div className="space-y-2">
                {learningPaths.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    {(searchQuery || statusFilter !== 'all')
                      ? `No learning paths match your ${searchQuery ? 'search' : ''}${searchQuery && statusFilter !== 'all' ? ' and ' : ''}${statusFilter !== 'all' ? 'filters' : ''}. Try adjusting your ${searchQuery ? 'search query' : 'filters'} or ${searchQuery ? 'clear the search' : 'clear the filters'}.`
                      : 'No learning paths yet. Create your first path!'}
                  </div>
                ) : (
                  learningPaths.map((path) => (
                    <div
                      key={path.id}
                      className={`relative group ${
                        selectedPath?.id === path.id
                          ? 'bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-300'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      } rounded-lg transition-all`}
                    >
                      <button
                        onClick={() => fetchLearningPath(path.id)}
                        className="w-full text-left p-3 rounded-lg"
                      >
                        <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{path.title}</div>
                        <div className="text-xs text-gray-500">
                          {path.course_count || 0} courses • {path.status}
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePathClick(path);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete path"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedPath ? (
              <div className="max-w-4xl mx-auto">
                {/* Path Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <input
                    type="text"
                    value={selectedPath.title}
                    onChange={(e) => updatePathField('title', e.target.value)}
                    className="text-xl font-bold text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                    placeholder="Learning path title"
                  />
                  <textarea
                    value={selectedPath.description || ''}
                    onChange={(e) => updatePathField('description', e.target.value)}
                    placeholder="Learning path description..."
                    className="w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    rows={3}
                  />
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>Status: <span className="font-medium capitalize">{selectedPath.status}</span></span>
                    {selectedPath.course_count !== undefined && (
                      <span>• {selectedPath.course_count} courses</span>
                    )}
                  </div>
                </div>

                {/* Courses in Path */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Courses in Path</h2>
                    <button
                      onClick={() => setShowCourseSelector(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Course
                    </button>
                  </div>
                  <div className="p-6">
                    {localCourses.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No courses in this path yet</p>
                        <button
                          onClick={() => setShowCourseSelector(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Add Your First Course
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {localCourses.map((course, index) => (
                          <div
                            key={course.id}
                            draggable
                            onDragStart={() => handleCourseDragStart(course.id)}
                            onDragOver={handleCourseDragOver}
                            onDrop={() => handleCourseDrop(course.id)}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-move"
                          >
                            <GripVertical size={20} className="text-gray-400 flex-shrink-0" />
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-700">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-gray-900 break-words">{course.title}</h3>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <BookOpen size={14} />
                                  {course.modules?.length || 0} modules
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {Math.round((course.duration_minutes || 0) / 60)} hours
                                </span>
                                <span>•</span>
                                <span className="capitalize">{course.difficulty_level}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={course.is_required}
                                  onChange={(e) => updateCourseRequirement(course.id, e.target.checked)}
                                  className="rounded"
                                />
                                Required
                              </label>
                              <button
                                onClick={() => handleDeleteCourseClick(course)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove course"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning path selected</h3>
                <p className="text-gray-500 mb-6">Select a path from the sidebar or create a new one</p>
                <button
                  onClick={() => setIsCreatingPath(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create New Path
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Course Selector Modal */}
      {showCourseSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Course to Add</h3>
                <button
                  onClick={() => {
                    setShowCourseSelector(false);
                    setSearchInput('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No available courses found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => addCourseToPath(course)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>{course.modules?.length || 0} modules</span>
                              <span>•</span>
                              <span>{Math.round((course.duration_minutes || 0) / 60)} hours</span>
                              <span>•</span>
                              <span className="capitalize">{course.difficulty_level}</span>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Delete Path Modal */}
      {showDeletePathModal && pathToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Delete Learning Path</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-semibold">"{pathToDelete.title}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeletePathModal(false);
                    setPathToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteLearningPath}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Delete Course Modal */}
      {showDeleteCourseModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Remove Course from Path</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to remove <span className="font-semibold">"{courseToDelete.courseTitle}"</span> from this learning path?
                </p>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteCourseModal(false);
                    setCourseToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCourseFromPath}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
