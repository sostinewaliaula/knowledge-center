import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Send
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  type: 'file-upload' | 'text' | 'quiz';
  instructions: string | null;
  max_file_size_mb: number;
  allowed_file_types: string;
  due_date: string | null;
  max_score: number;
  status: 'draft' | 'active' | 'closed';
  course_id: string | null;
  lesson_id: string | null;
  course_title?: string | null;
  lesson_title?: string | null;
  created_by_name?: string | null;
  assigned_to?: number;
  submitted?: number;
  pending?: number;
  graded?: number;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  module_title: string;
}

interface AssignmentsProps {}

export function Assignments({}: AssignmentsProps) {
  const { showSuccess, showError } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalAssignment, setOriginalAssignment] = useState<any>(null);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  
  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  
  // Form states
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    type: 'file-upload' as Assignment['type'],
    instructions: '',
    max_file_size_mb: 10,
    allowed_file_types: 'pdf,doc,docx,txt',
    due_date: '',
    max_score: 100,
    status: 'draft' as Assignment['status'],
    course_id: '',
    lesson_id: ''
  });

  // Edit states
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [editAssignmentForm, setEditAssignmentForm] = useState({
    title: '',
    description: '',
    type: 'file-upload' as Assignment['type'],
    instructions: '',
    max_file_size_mb: 10,
    allowed_file_types: 'pdf,doc,docx,txt',
    due_date: '',
    max_score: 100,
    status: 'draft' as Assignment['status'],
    course_id: '',
    lesson_id: ''
  });

  // Available courses and lessons
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const result = await api.getAssignments(1, 100, searchQuery, filterStatus, filterType);
      setAssignments(result.assignments || []);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignment by ID
  const fetchAssignment = async (id: string) => {
    try {
      setLoading(true);
      const assignment = await api.getAssignment(id);
      setSelectedAssignment(assignment);
      
      // Set form values
      const formData = {
        title: assignment.title,
        description: assignment.description || '',
        type: assignment.type,
        instructions: assignment.instructions || '',
        max_file_size_mb: assignment.max_file_size_mb,
        allowed_file_types: assignment.allowed_file_types,
        due_date: assignment.due_date ? (() => {
          const date = new Date(assignment.due_date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        })() : '',
        max_score: assignment.max_score,
        status: assignment.status,
        course_id: assignment.course_id || '',
        lesson_id: assignment.lesson_id || ''
      };
      
      setAssignmentForm(formData);
      setOriginalAssignment(JSON.parse(JSON.stringify(formData))); // Deep copy
      setHasUnsavedChanges(false);
      
      // Fetch lessons if course is assigned
      if (assignment.course_id) {
        await fetchAvailableLessons(assignment.course_id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available courses
  const fetchAvailableCourses = async () => {
    try {
      const data = await api.getCourses();
      setAvailableCourses(data.courses || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch available lessons for a course
  const fetchAvailableLessons = async (courseId: string) => {
    try {
      const course = await api.getCourse(courseId);
      const lessons: Lesson[] = [];
      if (course.modules) {
        course.modules.forEach((module: any) => {
          if (module.lessons) {
            module.lessons.forEach((lesson: any) => {
              lessons.push({
                id: lesson.id,
                title: lesson.title,
                module_title: module.title
              });
            });
          }
        });
      }
      setAvailableLessons(lessons);
    } catch (err: any) {
      console.error('Error fetching lessons:', err);
      setAvailableLessons([]);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchAvailableCourses();
  }, [searchQuery, filterStatus, filterType]);

  // Resize title textarea when selectedAssignment changes
  useEffect(() => {
    if (titleTextareaRef.current && selectedAssignment?.title) {
      setTimeout(() => {
        if (titleTextareaRef.current) {
          titleTextareaRef.current.style.height = 'auto';
          titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [selectedAssignment?.title, selectedAssignment?.id]);

  // Track changes
  useEffect(() => {
    if (selectedAssignment && originalAssignment) {
      const hasChanges = JSON.stringify(assignmentForm) !== JSON.stringify(originalAssignment);
      setHasUnsavedChanges(hasChanges);
    }
  }, [assignmentForm, originalAssignment, selectedAssignment]);

  // Save assignment
  const handleSaveAssignment = async () => {
    if (!selectedAssignment || !assignmentForm.title.trim()) {
      showError('Assignment title is required');
      return;
    }

    try {
      setSaving(true);
      const updated = await api.updateAssignment(selectedAssignment.id, {
        title: assignmentForm.title.trim(),
        description: assignmentForm.description.trim() || null,
        type: assignmentForm.type,
        instructions: assignmentForm.instructions.trim() || null,
        max_file_size_mb: assignmentForm.max_file_size_mb,
        allowed_file_types: assignmentForm.allowed_file_types,
        due_date: assignmentForm.due_date || null,
        max_score: assignmentForm.max_score,
        status: assignmentForm.status,
        course_id: assignmentForm.course_id || null,
        lesson_id: assignmentForm.lesson_id || null
      });

      showSuccess('Assignment saved successfully!');
      setSelectedAssignment(updated);
      setOriginalAssignment(JSON.parse(JSON.stringify(assignmentForm)));
      setHasUnsavedChanges(false);
      await fetchAssignments();
    } catch (err: any) {
      showError(err.message || 'Failed to save assignment');
    } finally {
      setSaving(false);
    }
  };

  // Create assignment
  const handleCreateAssignment = async () => {
    if (!assignmentForm.title.trim()) {
      showError('Assignment title is required');
      return;
    }

    try {
      setSaving(true);
      const assignment = await api.createAssignment({
        title: assignmentForm.title.trim(),
        description: assignmentForm.description.trim() || null,
        type: assignmentForm.type,
        instructions: assignmentForm.instructions.trim() || null,
        max_file_size_mb: assignmentForm.max_file_size_mb,
        allowed_file_types: assignmentForm.allowed_file_types,
        due_date: assignmentForm.due_date || null,
        max_score: assignmentForm.max_score,
        status: assignmentForm.status,
        course_id: assignmentForm.course_id || null,
        lesson_id: assignmentForm.lesson_id || null
      });

      showSuccess('Assignment created successfully!');
      setCreatingAssignment(false);
      resetForm();
      await fetchAssignments();
      // Select the newly created assignment
      await fetchAssignment(assignment.id);
    } catch (err: any) {
      showError(err.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      await api.deleteAssignment(assignmentToDelete.id);
      showSuccess('Assignment deleted successfully!');
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
      if (selectedAssignment?.id === assignmentToDelete.id) {
        setSelectedAssignment(null);
      }
      await fetchAssignments();
    } catch (err: any) {
      showError(err.message || 'Failed to delete assignment');
    }
  };

  // Reset form
  const resetForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      type: 'file-upload',
      instructions: '',
      max_file_size_mb: 10,
      allowed_file_types: 'pdf,doc,docx,txt',
      due_date: '',
      max_score: 100,
      status: 'draft',
      course_id: '',
      lesson_id: ''
    });
    setAvailableLessons([]);
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (assignment.course_title && assignment.course_title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesType = filterType === 'all' || assignment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isModalOpen = showDeleteModal;

  if (loading && !selectedAssignment && assignments.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <div className={`transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
          <AdminSidebar />
        </div>
        
        <div className={`flex-1 flex overflow-hidden min-w-0 transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
          {/* Sidebar */}
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Assignments</h2>
                <button
                  onClick={() => {
                    setCreatingAssignment(true);
                    resetForm();
                    fetchAvailableCourses();
                  }}
                  className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Create assignment"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assignments..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mb-3 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="file-upload">File Upload</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Create Assignment Form (inline) */}
              {creatingAssignment && (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Assignment Title *"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                    disabled={saving}
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    disabled={saving}
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={assignmentForm.type}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value as Assignment['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving}
                      >
                        <option value="file-upload">File Upload</option>
                        <option value="text">Text</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={assignmentForm.status}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value as Assignment['status'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="datetime-local"
                        value={assignmentForm.due_date}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Max Score</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={assignmentForm.max_score}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, max_score: parseFloat(e.target.value) || 100 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Course (Optional)</label>
                      <select
                        value={assignmentForm.course_id}
                        onChange={async (e) => {
                          const courseId = e.target.value;
                          setAssignmentForm({ ...assignmentForm, course_id: courseId, lesson_id: '' });
                          if (courseId) {
                            await fetchAvailableLessons(courseId);
                          } else {
                            setAvailableLessons([]);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving}
                      >
                        <option value="">No Course</option>
                        {availableCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Lesson (Optional)</label>
                      <select
                        value={assignmentForm.lesson_id}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, lesson_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={saving || !assignmentForm.course_id}
                      >
                        <option value="">No Lesson</option>
                        {availableLessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.module_title}: {lesson.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {assignmentForm.type === 'file-upload' && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                        <input
                          type="number"
                          min="1"
                          value={assignmentForm.max_file_size_mb}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, max_file_size_mb: parseInt(e.target.value) || 10 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Allowed File Types</label>
                        <input
                          type="text"
                          value={assignmentForm.allowed_file_types}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, allowed_file_types: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="pdf,doc,docx"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 mt-2">
                    <button
                      onClick={() => {
                        setCreatingAssignment(false);
                        resetForm();
                      }}
                      disabled={saving}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateAssignment}
                      disabled={saving || !assignmentForm.title.trim()}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-xs font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Create Assignment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Assignment Form */}
              {editingAssignmentId && (() => {
                const assignmentToEdit = assignments.find(a => a.id === editingAssignmentId);
                if (!assignmentToEdit) return null;
                return (
                  <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                    <input
                      type="text"
                      placeholder="Assignment Title *"
                      value={editAssignmentForm.title}
                      onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={editAssignmentForm.description}
                      onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={editAssignmentForm.type}
                          onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, type: e.target.value as Assignment['type'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="file-upload">File Upload</option>
                          <option value="text">Text</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editAssignmentForm.status}
                          onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, status: e.target.value as Assignment['status'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                        <input
                          type="number"
                          min="1"
                          value={editAssignmentForm.max_file_size_mb}
                          onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, max_file_size_mb: parseInt(e.target.value) || 10 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={editAssignmentForm.type !== 'file-upload'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Max Score</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editAssignmentForm.max_score}
                          onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, max_score: parseFloat(e.target.value) || 100 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="datetime-local"
                        value={editAssignmentForm.due_date}
                        onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, due_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Course (Optional)</label>
                        <select
                          value={editAssignmentForm.course_id}
                          onChange={async (e) => {
                            const courseId = e.target.value;
                            setEditAssignmentForm({ ...editAssignmentForm, course_id: courseId, lesson_id: '' });
                            if (courseId) {
                              await fetchAvailableLessons(courseId);
                            } else {
                              setAvailableLessons([]);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">No Course</option>
                          {availableCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Lesson (Optional)</label>
                        <select
                          value={editAssignmentForm.lesson_id}
                          onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, lesson_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={!editAssignmentForm.course_id}
                        >
                          <option value="">No Lesson</option>
                          {availableLessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.module_title}: {lesson.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Instructions</label>
                      <textarea
                        value={editAssignmentForm.instructions}
                        onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, instructions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                        placeholder="Assignment instructions"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Allowed File Types</label>
                      <input
                        type="text"
                        value={editAssignmentForm.allowed_file_types}
                        onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, allowed_file_types: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="pdf,doc,docx"
                        disabled={editAssignmentForm.type !== 'file-upload'}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!editAssignmentForm.title.trim()) {
                            showError('Assignment title is required');
                            return;
                          }

                          try {
                            setSaving(true);
                            
                            await api.updateAssignment(editingAssignmentId, {
                              title: editAssignmentForm.title.trim(),
                              description: editAssignmentForm.description.trim() || null,
                              type: editAssignmentForm.type,
                              instructions: editAssignmentForm.instructions.trim() || null,
                              max_file_size_mb: editAssignmentForm.max_file_size_mb,
                              allowed_file_types: editAssignmentForm.allowed_file_types,
                              due_date: editAssignmentForm.due_date || null,
                              max_score: editAssignmentForm.max_score,
                              status: editAssignmentForm.status,
                              course_id: editAssignmentForm.course_id || null,
                              lesson_id: editAssignmentForm.lesson_id || null
                            });

                            if (selectedAssignment?.id === editingAssignmentId) {
                              await fetchAssignment(editingAssignmentId);
                            }
                            
                            showSuccess('Assignment details updated successfully!');
                            setEditingAssignmentId(null);
                            
                            await fetchAssignments();
                          } catch (err: any) {
                            showError(err.message || 'Failed to update assignment details');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving || !editAssignmentForm.title.trim()}
                        className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAssignmentId(null);
                          setEditAssignmentForm({
                            title: '',
                            description: '',
                            type: 'file-upload',
                            instructions: '',
                            max_file_size_mb: 10,
                            allowed_file_types: 'pdf,doc,docx,txt',
                            due_date: '',
                            max_score: 100,
                            status: 'draft',
                            course_id: '',
                            lesson_id: ''
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2">
                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                      ? 'No assignments match your filters'
                      : 'No assignments yet. Create your first assignment!'}
                  </div>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedAssignment?.id === assignment.id
                          ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                      onClick={() => fetchAssignment(assignment.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{assignment.title}</div>
                          <div className="text-xs text-gray-500">
                            {assignment.type} • {assignment.course_title || 'No Course'}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </span>
                            {assignment.due_date && isOverdue(assignment.due_date) && assignment.status === 'active' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (selectedAssignment?.id !== assignment.id) {
                                await fetchAssignment(assignment.id);
                              }
                              const currentAssignment = selectedAssignment?.id === assignment.id ? selectedAssignment : assignment;
                              setEditAssignmentForm({
                                title: currentAssignment.title,
                                description: currentAssignment.description || '',
                                type: currentAssignment.type,
                                instructions: currentAssignment.instructions || '',
                                max_file_size_mb: currentAssignment.max_file_size_mb,
                                allowed_file_types: currentAssignment.allowed_file_types,
                                due_date: currentAssignment.due_date ? (() => {
                                  const date = new Date(currentAssignment.due_date);
                                  const year = date.getFullYear();
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const hours = String(date.getHours()).padStart(2, '0');
                                  const minutes = String(date.getMinutes()).padStart(2, '0');
                                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                                })() : '',
                                max_score: currentAssignment.max_score,
                                status: currentAssignment.status,
                                course_id: currentAssignment.course_id || '',
                                lesson_id: currentAssignment.lesson_id || ''
                              });
                              if (currentAssignment.course_id) {
                                await fetchAvailableLessons(currentAssignment.course_id);
                              }
                              setEditingAssignmentId(assignment.id);
                            }}
                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-purple-100 transition-colors group"
                            title="Edit Assignment Details"
                          >
                            <Edit size={14} className="text-gray-400 group-hover:text-purple-700 transition-colors" strokeWidth={2} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignmentToDelete(assignment);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete assignment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Header */}
            {selectedAssignment && (
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assignment Builder</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and manage your assignments</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle size={16} className="text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
                      </div>
                    )}
                    <button
                      onClick={handleSaveAssignment}
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
                    {selectedAssignment.status === 'draft' && (
                      <button
                        onClick={async () => {
                          if (hasUnsavedChanges) {
                            await handleSaveAssignment();
                          }
                          try {
                            setSaving(true);
                            const updated = await api.updateAssignment(selectedAssignment.id, { status: 'active' });
                            setSelectedAssignment(updated);
                            setAssignmentForm({ ...assignmentForm, status: 'active' });
                            setOriginalAssignment(JSON.parse(JSON.stringify({ ...assignmentForm, status: 'active' })));
                            setHasUnsavedChanges(false);
                            showSuccess('Assignment activated successfully!');
                            await fetchAssignments();
                          } catch (err: any) {
                            showError(err.message || 'Failed to activate assignment');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Activate assignment"
                      >
                        <Send size={16} />
                        Activate
                      </button>
                    )}
                    {selectedAssignment.status === 'active' && (
                      <button
                        onClick={async () => {
                          if (hasUnsavedChanges) {
                            await handleSaveAssignment();
                          }
                          try {
                            setSaving(true);
                            const updated = await api.updateAssignment(selectedAssignment.id, { status: 'closed' });
                            setSelectedAssignment(updated);
                            setAssignmentForm({ ...assignmentForm, status: 'closed' });
                            setOriginalAssignment(JSON.parse(JSON.stringify({ ...assignmentForm, status: 'closed' })));
                            setHasUnsavedChanges(false);
                            showSuccess('Assignment closed successfully!');
                            await fetchAssignments();
                          } catch (err: any) {
                            showError(err.message || 'Failed to close assignment');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Close assignment"
                      >
                        <XCircle size={16} />
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </header>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
              {selectedAssignment ? (
                <div className="max-w-4xl mx-auto">
                  {/* Assignment Info */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-6 bg-gradient-to-br from-white to-gray-50/50">
                    <textarea
                      ref={titleTextareaRef}
                      value={assignmentForm.title}
                      onChange={(e) => {
                        setAssignmentForm({ ...assignmentForm, title: e.target.value });
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.max(target.scrollHeight, 48) + 'px';
                      }}
                      className="text-2xl font-bold bg-transparent text-gray-900 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 resize-none transition-all"
                      placeholder="Assignment Title"
                      style={{ 
                        minHeight: '3rem',
                        lineHeight: '1.6',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        height: 'auto',
                        letterSpacing: '-0.02em'
                      }}
                    />
                    <textarea
                      value={assignmentForm.description}
                      onChange={(e) => {
                        setAssignmentForm({ ...assignmentForm, description: e.target.value });
                      }}
                      placeholder="Assignment description..."
                      className="w-full text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 resize-none transition-all leading-relaxed"
                      rows={3}
                    />
                    <div className="mt-4 grid grid-cols-3 gap-x-8 gap-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-lg text-sm font-semibold capitalize shadow-sm">
                          {assignmentForm.type.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize shadow-sm ${
                          selectedAssignment.status === 'active'
                            ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                            : selectedAssignment.status === 'closed'
                            ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700'
                            : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700'
                        }`}>
                          {selectedAssignment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Score</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                          {assignmentForm.max_score}
                        </span>
                      </div>
                      {assignmentForm.due_date && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</span>
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                            isOverdue(assignmentForm.due_date) && selectedAssignment.status === 'active'
                              ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700'
                              : 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700'
                          }`}>
                            {new Date(assignmentForm.due_date).toLocaleDateString()} {new Date(assignmentForm.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      {assignmentForm.course_id && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-lg text-sm font-medium shadow-sm max-w-xs truncate">
                            {(() => {
                              const course = availableCourses.find(c => c.id === assignmentForm.course_id);
                              return course?.title || 'Unknown Course';
                            })()}
                          </span>
                        </div>
                      )}
                      {assignmentForm.lesson_id && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 rounded-lg text-sm font-medium shadow-sm max-w-xs truncate">
                            {(() => {
                              const lesson = availableLessons.find(l => l.id === assignmentForm.lesson_id);
                              return lesson ? `${lesson.module_title}: ${lesson.title}` : 'Unknown Lesson';
                            })()}
                          </span>
                        </div>
                      )}
                      {assignmentForm.type === 'file-upload' && (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max File Size</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 rounded-lg text-sm font-semibold shadow-sm">
                              {assignmentForm.max_file_size_mb} MB
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Allowed Types</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 rounded-lg text-sm font-medium shadow-sm">
                              {assignmentForm.allowed_file_types}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {assignmentForm.instructions && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{assignmentForm.instructions}</div>
                      </div>
                    )}
                  </div>

                  {/* Submission Stats */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900">Submission Statistics</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{selectedAssignment.assigned_to || 0}</div>
                          <div className="text-sm text-gray-500 mt-1">Assigned To</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedAssignment.submitted || 0}</div>
                          <div className="text-sm text-gray-500 mt-1">Submitted</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{selectedAssignment.pending || 0}</div>
                          <div className="text-sm text-gray-500 mt-1">Pending Grading</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{selectedAssignment.graded || 0}</div>
                          <div className="text-sm text-gray-500 mt-1">Graded</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignment selected</h3>
                  <p className="text-gray-500 mb-6">Select an assignment from the sidebar or create a new one</p>
                  <button 
                    onClick={() => {
                      setShowCreateModal(true);
                      fetchAvailableCourses();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Create Assignment
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Assignment</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Assignment title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Assignment description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={assignmentForm.type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value as Assignment['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="file-upload">File Upload</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={assignmentForm.status}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value as Assignment['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Assignment instructions for learners"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                  <input
                    type="number"
                    min="1"
                    value={assignmentForm.max_file_size_mb}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, max_file_size_mb: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={assignmentForm.type !== 'file-upload'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                  <input
                    type="text"
                    value={assignmentForm.allowed_file_types}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, allowed_file_types: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="pdf,doc,docx"
                    disabled={assignmentForm.type !== 'file-upload'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assignmentForm.max_score}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, max_score: parseFloat(e.target.value) || 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course (Optional)</label>
                  <select
                    value={assignmentForm.course_id}
                    onChange={async (e) => {
                      const courseId = e.target.value;
                      setAssignmentForm({ ...assignmentForm, course_id: courseId, lesson_id: '' });
                      if (courseId) {
                        await fetchAvailableLessons(courseId);
                      } else {
                        setAvailableLessons([]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">No Course</option>
                    {availableCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson (Optional)</label>
                  <select
                    value={assignmentForm.lesson_id}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, lesson_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!assignmentForm.course_id}
                  >
                    <option value="">No Lesson</option>
                    {availableLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.module_title}: {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                disabled={saving || !assignmentForm.title.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Modal */}
      {showDeleteModal && assignmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{assignmentToDelete.title}"</span>?
              </p>
              {assignmentToDelete.submitted && assignmentToDelete.submitted > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This assignment has <span className="font-semibold">{assignmentToDelete.submitted} submission{assignmentToDelete.submitted !== 1 ? 's' : ''}</span>.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The assignment and all its submissions will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAssignmentToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
