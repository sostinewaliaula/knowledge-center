import { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Trash2, 
  Edit, 
  FileText, 
  Video, 
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  BookOpen,
  Clock,
  Users
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { ContentLibrarySelector } from '../../components/ContentLibrarySelector';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'text' | 'document' | 'quiz' | 'assignment' | 'live_session';
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number;
  order_index: number;
  is_required: boolean;
  is_preview: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_required: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  status: 'draft' | 'published' | 'archived';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  modules: Module[];
}

interface CourseBuilderProps {}

export function CourseBuilder({}: CourseBuilderProps) {
  const { showSuccess, showError } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [showContentSelector, setShowContentSelector] = useState(false);
  const [selectedLessonForContent, setSelectedLessonForContent] = useState<{ lessonId: string; contentType: 'video' | 'document' | 'all' } | null>(null);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses(1, 100);
      const coursesWithModules = await Promise.all(
        (data.courses || []).map(async (course: any) => {
          try {
            const fullCourse = await api.getCourse(course.id);
            return fullCourse;
          } catch {
            return { ...course, modules: [] };
          }
        })
      );
      setCourses(coursesWithModules);
      if (coursesWithModules.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesWithModules[0]);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async (courseId: string) => {
    try {
      const course = await api.getCourse(courseId);
      setSelectedCourse(course);
      setCourses(courses.map(c => c.id === courseId ? course : c));
    } catch (err: any) {
      showError(err.message || 'Failed to fetch course');
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const createCourse = async () => {
    if (!newCourseTitle.trim()) {
      showError('Course title is required');
      return;
    }

    try {
      setSaving(true);
      const course = await api.createCourse({
        title: newCourseTitle,
        description: newCourseDescription || null,
        status: 'draft'
      });
      showSuccess('Course created successfully!');
      setNewCourseTitle('');
      setNewCourseDescription('');
      setIsCreatingCourse(false);
      await fetchCourses();
      setSelectedCourse(course);
    } catch (err: any) {
      showError(err.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const saveCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      await api.updateCourse(selectedCourse.id, {
        title: selectedCourse.title,
        description: selectedCourse.description,
        status: selectedCourse.status
      });
      showSuccess('Course saved successfully!');
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteCourse(courseId);
      showSuccess('Course deleted successfully!');
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
      await fetchCourses();
    } catch (err: any) {
      showError(err.message || 'Failed to delete course');
    }
  };

  const addModule = async () => {
    if (!selectedCourse) return;

    try {
      const module = await api.createModule(selectedCourse.id, {
        title: 'New Module',
        description: null,
        is_required: true
      });
      showSuccess('Module added successfully!');
      await fetchCourse(selectedCourse.id);
      setExpandedModules(new Set([...expandedModules, module.id]));
    } catch (err: any) {
      showError(err.message || 'Failed to add module');
    }
  };

  const updateModule = async (moduleId: string, updates: Partial<Module>) => {
    if (!selectedCourse) return;

    try {
      await api.updateModule(moduleId, updates);
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to update module');
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      return;
    }

    try {
      await api.deleteModule(moduleId);
      showSuccess('Module deleted successfully!');
      if (selectedCourse) {
        await fetchCourse(selectedCourse.id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete module');
    }
  };

  const addLesson = async (moduleId: string) => {
    try {
      const lesson = await api.createLesson(moduleId, {
        title: 'New Lesson',
        description: null,
        content_type: 'text',
        content_text: null,
        content_url: null,
        duration_minutes: 0,
        is_required: true,
        is_preview: false
      });
      showSuccess('Lesson added successfully!');
      if (selectedCourse) {
        await fetchCourse(selectedCourse.id);
        setExpandedLessons(new Set([...expandedLessons, lesson.id]));
      }
    } catch (err: any) {
      showError(err.message || 'Failed to add lesson');
    }
  };

  const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    if (!selectedCourse) return;

    try {
      await api.updateLesson(lessonId, updates);
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to update lesson');
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await api.deleteLesson(lessonId);
      showSuccess('Lesson deleted successfully!');
      if (selectedCourse) {
        await fetchCourse(selectedCourse.id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete lesson');
    }
  };

  const getContentTypeIcon = (type: Lesson['content_type']) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-purple-600" />;
      case 'document':
        return <FileText size={16} className="text-blue-600" />;
      case 'quiz':
        return <FileText size={16} className="text-green-600" />;
      case 'assignment':
        return <FileText size={16} className="text-orange-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const handleContentSelect = (content: any) => {
    if (!selectedLessonForContent || !selectedCourse) return;

    const contentUrl = `content-library:${content.id}`;
    updateLesson(selectedLessonForContent.lessonId, { content_url: contentUrl });
    setShowContentSelector(false);
    setSelectedLessonForContent(null);
  };

  const openContentSelector = (lessonId: string, contentType: 'video' | 'document' | 'all') => {
    setSelectedLessonForContent({ lessonId, contentType });
    setShowContentSelector(true);
  };

  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleModuleDrop = async (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    if (!draggedModule || !selectedCourse || draggedModule === targetModuleId) {
      setDraggedModule(null);
      return;
    }

    try {
      const modules = selectedCourse.modules || [];
      const draggedIndex = modules.findIndex(m => m.id === draggedModule);
      const targetIndex = modules.findIndex(m => m.id === targetModuleId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedModule(null);
        return;
      }

      // Reorder modules
      const moduleOrders = modules.map((module, index) => {
        if (index === draggedIndex) {
          return { id: module.id, order_index: targetIndex };
        } else if (draggedIndex < targetIndex && index > draggedIndex && index <= targetIndex) {
          return { id: module.id, order_index: index - 1 };
        } else if (draggedIndex > targetIndex && index >= targetIndex && index < draggedIndex) {
          return { id: module.id, order_index: index + 1 };
        }
        return { id: module.id, order_index: index };
      });

      await api.reorderModules(selectedCourse.id, moduleOrders);
      await fetchCourse(selectedCourse.id);
      showSuccess('Modules reordered successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to reorder modules');
    } finally {
      setDraggedModule(null);
    }
  };

  const handleLessonDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    setDraggedLesson({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleLessonDrop = async (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!draggedLesson || !selectedCourse || 
        (draggedLesson.moduleId === targetModuleId && draggedLesson.lessonId === targetLessonId)) {
      setDraggedLesson(null);
      return;
    }

    try {
      const module = selectedCourse.modules?.find(m => m.id === targetModuleId);
      if (!module) {
        setDraggedLesson(null);
        return;
      }

      const lessons = module.lessons || [];
      const draggedIndex = lessons.findIndex(l => l.id === draggedLesson.lessonId);
      const targetIndex = lessons.findIndex(l => l.id === targetLessonId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedLesson(null);
        return;
      }

      // Reorder lessons
      const lessonOrders = lessons.map((lesson, index) => {
        if (index === draggedIndex) {
          return { id: lesson.id, order_index: targetIndex };
        } else if (draggedIndex < targetIndex && index > draggedIndex && index <= targetIndex) {
          return { id: lesson.id, order_index: index - 1 };
        } else if (draggedIndex > targetIndex && index >= targetIndex && index < draggedIndex) {
          return { id: lesson.id, order_index: index + 1 };
        }
        return { id: lesson.id, order_index: index };
      });

      await api.reorderLessons(targetModuleId, lessonOrders);
      await fetchCourse(selectedCourse.id);
      showSuccess('Lessons reordered successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to reorder lessons');
    } finally {
      setDraggedLesson(null);
    }
  };

  const getContentDisplayUrl = (contentUrl: string | null): string => {
    if (!contentUrl) return '';
    if (contentUrl.startsWith('content-library:')) {
      const id = contentUrl.replace('content-library:', '');
      return `Content Library: ${id.substring(0, 8)}...`;
    }
    return contentUrl;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Builder</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage your courses</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingCourse(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                New Course
              </button>
              {selectedCourse && (
                <button
                  onClick={saveCourse}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Course
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Course List */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">My Courses</h2>
              {isCreatingCourse ? (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Course Title *"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createCourse}
                      disabled={saving || !newCourseTitle.trim()}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingCourse(false);
                        setNewCourseTitle('');
                        setNewCourseDescription('');
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
              
              <div className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg transition-colors cursor-pointer border-2 ${
                      selectedCourse?.id === course.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1 truncate">{course.title}</div>
                        <div className="text-xs text-gray-500">
                          {course.modules?.length || 0} modules • {course.status}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCourse(course.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && !isCreatingCourse && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No courses yet. Create your first course!
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedCourse ? (
              <div className="max-w-4xl mx-auto">
                {/* Course Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) => {
                      setSelectedCourse({ ...selectedCourse, title: e.target.value });
                    }}
                    className="text-2xl font-bold text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                    placeholder="Course Title"
                  />
                  <textarea
                    value={selectedCourse.description || ''}
                    onChange={(e) => {
                      setSelectedCourse({ ...selectedCourse, description: e.target.value });
                    }}
                    placeholder="Course description..."
                    className="w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    rows={3}
                  />
                  <div className="mt-4 flex items-center gap-4">
                    <select
                      value={selectedCourse.status}
                      onChange={(e) => {
                        setSelectedCourse({ ...selectedCourse, status: e.target.value as Course['status'] });
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <select
                      value={selectedCourse.difficulty_level}
                      onChange={(e) => {
                        setSelectedCourse({ ...selectedCourse, difficulty_level: e.target.value as Course['difficulty_level'] });
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Modules */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
                    <button
                      onClick={addModule}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Module
                    </button>
                  </div>
                  <div className="p-6">
                    {selectedCourse.modules?.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No modules yet</p>
                        <button
                          onClick={addModule}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Add Your First Module
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCourse.modules?.map((module) => (
                          <div
                            key={module.id}
                            className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
                              draggedModule === module.id ? 'opacity-50' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleModuleDragStart(e, module.id)}
                            onDragOver={handleModuleDragOver}
                            onDrop={(e) => handleModuleDrop(e, module.id)}
                          >
                            <div className="flex items-center gap-2 p-3 bg-gray-50">
                              <GripVertical size={16} className="text-gray-400 cursor-move" />
                              <button
                                onClick={() => toggleModule(module.id)}
                                className="flex-1 flex items-center gap-2 text-left"
                              >
                                {expandedModules.has(module.id) ? (
                                  <ChevronDown size={16} className="text-gray-400" />
                                ) : (
                                  <ChevronRight size={16} className="text-gray-400" />
                                )}
                                <BookOpen size={16} className="text-purple-600" />
                                <input
                                  type="text"
                                  value={module.title}
                                  onChange={(e) => updateModule(module.id, { title: e.target.value })}
                                  className="flex-1 font-medium text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </button>
                              <button
                                onClick={() => addLesson(module.id)}
                                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                                title="Add Lesson"
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {expandedModules.has(module.id) && (
                              <div className="p-4 bg-white border-t border-gray-100">
                                <textarea
                                  placeholder="Module description..."
                                  value={module.description || ''}
                                  onChange={(e) => updateModule(module.id, { description: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                  rows={2}
                                />
                                
                                {/* Lessons */}
                                <div className="mt-4 space-y-2">
                                  <div className="text-xs font-semibold text-gray-600 mb-2">Lessons:</div>
                                  {module.lessons?.length === 0 ? (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                      No lessons yet. Click the + button to add one.
                                    </div>
                                  ) : (
                                    module.lessons?.map((lesson) => (
                                      <div
                                        key={lesson.id}
                                        className={`border border-gray-200 rounded-lg overflow-hidden bg-gray-50 transition-all ${
                                          draggedLesson?.lessonId === lesson.id ? 'opacity-50' : ''
                                        }`}
                                        draggable
                                        onDragStart={(e) => handleLessonDragStart(e, module.id, lesson.id)}
                                        onDragOver={handleLessonDragOver}
                                        onDrop={(e) => handleLessonDrop(e, module.id, lesson.id)}
                                      >
                                        <div className="flex items-center gap-2 p-2">
                                          <GripVertical size={12} className="text-gray-400 cursor-move" />
                                          <button
                                            onClick={() => toggleLesson(lesson.id)}
                                            className="flex-1 flex items-center gap-2 text-left text-sm"
                                          >
                                            {expandedLessons.has(lesson.id) ? (
                                              <ChevronDown size={14} className="text-gray-400" />
                                            ) : (
                                              <ChevronRight size={14} className="text-gray-400" />
                                            )}
                                            {getContentTypeIcon(lesson.content_type)}
                                            <span className="font-medium text-gray-700">{lesson.title}</span>
                                            {lesson.duration_minutes > 0 && (
                                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {lesson.duration_minutes} min
                                              </span>
                                            )}
                                          </button>
                                          <button
                                            onClick={() => deleteLesson(lesson.id)}
                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                        {expandedLessons.has(lesson.id) && (
                                          <div className="p-3 bg-white border-t border-gray-100 space-y-2">
                                            <input
                                              type="text"
                                              value={lesson.title}
                                              onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                              placeholder="Lesson title"
                                            />
                                            <textarea
                                              value={lesson.description || ''}
                                              onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                              rows={2}
                                              placeholder="Lesson description"
                                            />
                                            <select
                                              value={lesson.content_type}
                                              onChange={(e) => updateLesson(lesson.id, { content_type: e.target.value as Lesson['content_type'] })}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                              <option value="text">Text</option>
                                              <option value="video">Video</option>
                                              <option value="document">Document</option>
                                              <option value="quiz">Quiz</option>
                                              <option value="assignment">Assignment</option>
                                              <option value="live_session">Live Session</option>
                                            </select>
                                            {(lesson.content_type === 'text') && (
                                              <textarea
                                                value={lesson.content_text || ''}
                                                onChange={(e) => updateLesson(lesson.id, { content_text: e.target.value })}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                                rows={4}
                                                placeholder="Lesson content (text)"
                                              />
                                            )}
                                            {(lesson.content_type === 'video' || lesson.content_type === 'document') && (
                                              <div className="flex gap-2">
                                                <input
                                                  type="text"
                                                  value={getContentDisplayUrl(lesson.content_url)}
                                                  onChange={(e) => {
                                                    // Only allow manual URL entry if not from content library
                                                    if (!lesson.content_url?.startsWith('content-library:')) {
                                                      updateLesson(lesson.id, { content_url: e.target.value });
                                                    }
                                                  }}
                                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                  placeholder="Content URL or select from library"
                                                  readOnly={lesson.content_url?.startsWith('content-library:')}
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => openContentSelector(lesson.id, lesson.content_type === 'video' ? 'video' : 'document')}
                                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors whitespace-nowrap"
                                                >
                                                  Select from Library
                                                </button>
                                                {lesson.content_url?.startsWith('content-library:') && (
                                                  <button
                                                    type="button"
                                                    onClick={() => updateLesson(lesson.id, { content_url: null })}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                                                    title="Clear content library selection"
                                                  >
                                                    <X size={14} />
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                            <div className="flex items-center gap-4">
                                              <input
                                                type="number"
                                                value={lesson.duration_minutes}
                                                onChange={(e) => updateLesson(lesson.id, { duration_minutes: parseInt(e.target.value) || 0 })}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Duration (min)"
                                              />
                                              <label className="flex items-center gap-2 text-xs text-gray-600">
                                                <input
                                                  type="checkbox"
                                                  checked={lesson.is_preview}
                                                  onChange={(e) => updateLesson(lesson.id, { is_preview: e.target.checked })}
                                                />
                                                Preview
                                              </label>
                                              <label className="flex items-center gap-2 text-xs text-gray-600">
                                                <input
                                                  type="checkbox"
                                                  checked={lesson.is_required}
                                                  onChange={(e) => updateLesson(lesson.id, { is_required: e.target.checked })}
                                                />
                                                Required
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
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
                  <BookOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No course selected</h3>
                <p className="text-gray-500 mb-6">Select a course from the sidebar or create a new one</p>
                <button
                  onClick={() => setIsCreatingCourse(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create New Course
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Content Library Selector Modal */}
      {showContentSelector && selectedLessonForContent && (
        <ContentLibrarySelector
          isOpen={showContentSelector}
          onClose={() => {
            setShowContentSelector(false);
            setSelectedLessonForContent(null);
          }}
          onSelect={handleContentSelect}
          contentType={selectedLessonForContent.contentType}
          title={`Select ${selectedLessonForContent.contentType === 'video' ? 'Video' : 'Document'} Content`}
        />
      )}
    </div>
  );
}
