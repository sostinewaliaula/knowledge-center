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
  passing_score?: number | null;
  time_limit_minutes?: number | null;
  max_attempts?: number | null;
  is_required?: boolean | null;
  randomize_questions?: boolean | null;
  show_results?: boolean | null;
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

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer';
  options?: string[] | null;
  correct_answer: string | null;
  points: number;
  order_index: number;
  explanation?: string | null;
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

interface AssignmentsProps { }

export function Assignments({ }: AssignmentsProps) {
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
    passing_score: 70,
    time_limit_minutes: null as number | null,
    max_attempts: 1,
    is_required: true,
    randomize_questions: false,
    show_results: true,
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
    passing_score: 70,
    time_limit_minutes: null as number | null,
    max_attempts: 1,
    is_required: true,
    randomize_questions: false,
    show_results: true,
    status: 'draft' as Assignment['status'],
    course_id: '',
    lesson_id: ''
  });

  // Available courses and lessons
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Quiz questions (for type === 'quiz')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuizQuestionForm, setShowQuizQuestionForm] = useState(false);
  const [editingQuizQuestionId, setEditingQuizQuestionId] = useState<string | null>(null);
  const [draggedQuizQuestion, setDraggedQuizQuestion] = useState<string | null>(null);
  const [quizQuestionForm, setQuizQuestionForm] = useState({
    question_text: '',
    question_type: 'multiple_choice' as QuizQuestion['question_type'],
    options: ['', '', '', ''] as string[],
    correct_answer: '',
    points: 1,
    explanation: ''
  });

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
        passing_score: assignment.passing_score ?? 70,
        time_limit_minutes: assignment.time_limit_minutes ?? null,
        max_attempts: assignment.max_attempts ?? 1,
        is_required: assignment.is_required ?? true,
        randomize_questions: assignment.randomize_questions ?? false,
        show_results: assignment.show_results ?? true,
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

      // Load quiz questions if this is a quiz assignment
      if (assignment.type === 'quiz') {
        try {
          const questions = await api.getAssignmentQuestions(assignment.id);
          setQuizQuestions(questions || []);
        } catch (err: any) {
          console.error('Error fetching assignment questions:', err);
          setQuizQuestions([]);
        }
      } else {
        setQuizQuestions([]);
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
        passing_score: assignmentForm.type === 'quiz' ? assignmentForm.passing_score : null,
        time_limit_minutes: assignmentForm.type === 'quiz' ? assignmentForm.time_limit_minutes : null,
        max_attempts: assignmentForm.type === 'quiz' ? assignmentForm.max_attempts : null,
        is_required: assignmentForm.type === 'quiz' ? assignmentForm.is_required : null,
        randomize_questions: assignmentForm.type === 'quiz' ? assignmentForm.randomize_questions : null,
        show_results: assignmentForm.type === 'quiz' ? assignmentForm.show_results : null,
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
        passing_score: assignmentForm.type === 'quiz' ? assignmentForm.passing_score : null,
        time_limit_minutes: assignmentForm.type === 'quiz' ? assignmentForm.time_limit_minutes : null,
        max_attempts: assignmentForm.type === 'quiz' ? assignmentForm.max_attempts : null,
        is_required: assignmentForm.type === 'quiz' ? assignmentForm.is_required : null,
        randomize_questions: assignmentForm.type === 'quiz' ? assignmentForm.randomize_questions : null,
        show_results: assignmentForm.type === 'quiz' ? assignmentForm.show_results : null,
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
        setQuizQuestions([]);
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
      passing_score: 70,
      time_limit_minutes: null,
      max_attempts: 1,
      is_required: true,
      randomize_questions: false,
      show_results: true,
      status: 'draft',
      course_id: '',
      lesson_id: ''
    });
    setAvailableLessons([]);
    setQuizQuestions([]);
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

        <div className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>

          {/* Global Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-sm text-gray-500 mt-1">Create and manage your assignments</p>
              </div>
              <div className="flex items-center gap-3">
                {selectedAssignment && (
                  <>
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle size={16} className="text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
                      </div>
                    )}
                    <button
                      onClick={handleSaveAssignment}
                      disabled={saving || !hasUnsavedChanges}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${hasUnsavedChanges
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
                  </>
                )}
                <button
                  onClick={() => {
                    setCreatingAssignment(true);
                    resetForm();
                    fetchAvailableCourses();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Assignment
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-200">

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

                    {/* Quiz settings for new quiz assignments */}
                    {assignmentForm.type === 'quiz' && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Passing Score (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={assignmentForm.passing_score}
                            onChange={(e) =>
                              setAssignmentForm({
                                ...assignmentForm,
                                passing_score: Math.max(0, Math.min(100, Number(e.target.value) || 0))
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                          <input
                            type="number"
                            min="0"
                            value={assignmentForm.time_limit_minutes ?? ''}
                            onChange={(e) =>
                              setAssignmentForm({
                                ...assignmentForm,
                                time_limit_minutes: e.target.value ? Number(e.target.value) : null
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max Attempts</label>
                          <input
                            type="number"
                            min="1"
                            value={assignmentForm.max_attempts ?? 1}
                            onChange={(e) =>
                              setAssignmentForm({
                                ...assignmentForm,
                                max_attempts: Math.max(1, Number(e.target.value) || 1)
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={saving}
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-5">
                          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!assignmentForm.is_required}
                              onChange={(e) =>
                                setAssignmentForm({ ...assignmentForm, is_required: e.target.checked })
                              }
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              disabled={saving}
                            />
                            <span>Required</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!assignmentForm.randomize_questions}
                              onChange={(e) =>
                                setAssignmentForm({ ...assignmentForm, randomize_questions: e.target.checked })
                              }
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              disabled={saving}
                            />
                            <span>Randomize Questions</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!assignmentForm.show_results}
                              onChange={(e) =>
                                setAssignmentForm({ ...assignmentForm, show_results: e.target.checked })
                              }
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              disabled={saving}
                            />
                            <span>Show Results</span>
                          </label>
                        </div>
                      </div>
                    )}
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

                      {/* Quiz settings for editing quiz assignments */}
                      {editAssignmentForm.type === 'quiz' && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Passing Score (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editAssignmentForm.passing_score}
                              onChange={(e) =>
                                setEditAssignmentForm({
                                  ...editAssignmentForm,
                                  passing_score: Math.max(0, Math.min(100, Number(e.target.value) || 0))
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                            <input
                              type="number"
                              min="0"
                              value={editAssignmentForm.time_limit_minutes ?? ''}
                              onChange={(e) =>
                                setEditAssignmentForm({
                                  ...editAssignmentForm,
                                  time_limit_minutes: e.target.value ? Number(e.target.value) : null
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Max Attempts</label>
                            <input
                              type="number"
                              min="1"
                              value={editAssignmentForm.max_attempts ?? 1}
                              onChange={(e) =>
                                setEditAssignmentForm({
                                  ...editAssignmentForm,
                                  max_attempts: Math.max(1, Number(e.target.value) || 1)
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-5">
                            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                checked={!!editAssignmentForm.is_required}
                                onChange={(e) =>
                                  setEditAssignmentForm({ ...editAssignmentForm, is_required: e.target.checked })
                                }
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span>Required</span>
                            </label>
                            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                checked={!!editAssignmentForm.randomize_questions}
                                onChange={(e) =>
                                  setEditAssignmentForm({
                                    ...editAssignmentForm,
                                    randomize_questions: e.target.checked
                                  })
                                }
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span>Randomize Questions</span>
                            </label>
                            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                checked={!!editAssignmentForm.show_results}
                                onChange={(e) =>
                                  setEditAssignmentForm({ ...editAssignmentForm, show_results: e.target.checked })
                                }
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span>Show Results</span>
                            </label>
                          </div>
                        </div>
                      )}
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
                                lesson_id: editAssignmentForm.lesson_id || null,
                                passing_score: editAssignmentForm.type === 'quiz' ? editAssignmentForm.passing_score : null,
                                time_limit_minutes: editAssignmentForm.type === 'quiz' ? editAssignmentForm.time_limit_minutes : null,
                                max_attempts: editAssignmentForm.type === 'quiz' ? editAssignmentForm.max_attempts : null,
                                is_required: editAssignmentForm.type === 'quiz' ? editAssignmentForm.is_required : null,
                                randomize_questions: editAssignmentForm.type === 'quiz' ? editAssignmentForm.randomize_questions : null,
                                show_results: editAssignmentForm.type === 'quiz' ? editAssignmentForm.show_results : null
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
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedAssignment?.id === assignment.id
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
                                  passing_score: currentAssignment.passing_score ?? 70,
                                  time_limit_minutes: currentAssignment.time_limit_minutes ?? null,
                                  max_attempts: currentAssignment.max_attempts ?? 1,
                                  is_required: currentAssignment.is_required ?? true,
                                  randomize_questions: currentAssignment.randomize_questions ?? false,
                                  show_results: currentAssignment.show_results ?? true,
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
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize shadow-sm ${selectedAssignment.status === 'active'
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
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${isOverdue(assignmentForm.due_date) && selectedAssignment.status === 'active'
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

                      {/* Quiz-only settings display */}
                      {assignmentForm.type === 'quiz' && (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Passing Score</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                              {assignmentForm.passing_score ?? 0}%
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Limit</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold shadow-sm">
                              {assignmentForm.time_limit_minutes ? `${assignmentForm.time_limit_minutes} min` : 'No limit'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Attempts</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 rounded-lg text-sm font-semibold shadow-sm">
                              {assignmentForm.max_attempts ?? 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</span>
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${assignmentForm.is_required
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                              }`}>
                              {assignmentForm.is_required ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Randomize</span>
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${assignmentForm.randomize_questions
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                              }`}>
                              {assignmentForm.randomize_questions ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Show Results</span>
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${assignmentForm.show_results
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                              }`}>
                              {assignmentForm.show_results ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </>
                      )}
                      {assignmentForm.instructions && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">{assignmentForm.instructions}</div>
                        </div>
                      )}
                    </div>

                    {/* Quiz Questions Builder */}
                    {selectedAssignment.type === 'quiz' && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <h2 className="text-base font-semibold text-gray-900">Quiz Questions</h2>
                            <p className="text-sm text-gray-500 mt-1">
                              {quizQuestions.length} question{quizQuestions.length !== 1 ? 's' : ''} •{' '}
                              {quizQuestions.reduce((sum, q) => sum + (q.points || 0), 0)} total points
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setEditingQuizQuestionId(null);
                              setShowQuizQuestionForm(true);
                              setQuizQuestionForm({
                                question_text: '',
                                question_type: 'multiple_choice',
                                options: ['', '', '', ''],
                                correct_answer: '',
                                points: 1,
                                explanation: ''
                              });
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add Question
                          </button>
                        </div>

                        <div className="p-6">
                          {/* Inline Question Form */}
                          {showQuizQuestionForm && (
                            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg border-2 border-purple-200">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {editingQuizQuestionId ? 'Edit Question' : 'Add New Question'}
                                </h3>
                                <button
                                  onClick={() => {
                                    setEditingQuizQuestionId(null);
                                    setShowQuizQuestionForm(false);
                                    setQuizQuestionForm({
                                      question_text: '',
                                      question_type: 'multiple_choice',
                                      options: ['', '', '', ''],
                                      correct_answer: '',
                                      points: 1,
                                      explanation: ''
                                    });
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
                                  disabled={saving}
                                >
                                  <X size={18} />
                                </button>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Text <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    value={quizQuestionForm.question_text}
                                    onChange={(e) =>
                                      setQuizQuestionForm({ ...quizQuestionForm, question_text: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                                    rows={3}
                                    placeholder="Enter your question"
                                    disabled={saving}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                                    <select
                                      value={quizQuestionForm.question_type}
                                      onChange={(e) => {
                                        const newType = e.target.value as QuizQuestion['question_type'];
                                        setQuizQuestionForm({
                                          ...quizQuestionForm,
                                          question_type: newType,
                                          options: newType === 'multiple_choice' ? ['', '', '', ''] : [],
                                          correct_answer: ''
                                        });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                      disabled={saving}
                                    >
                                      <option value="multiple_choice">Multiple Choice</option>
                                      <option value="true_false">True/False</option>
                                      <option value="short_answer">Short Answer</option>
                                      <option value="long_answer">Long Answer</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={quizQuestionForm.points}
                                      onChange={(e) =>
                                        setQuizQuestionForm({
                                          ...quizQuestionForm,
                                          points: parseFloat(e.target.value) || 1
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                      disabled={saving}
                                    />
                                  </div>
                                </div>

                                {/* Multiple Choice Options */}
                                {quizQuestionForm.question_type === 'multiple_choice' && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                    <div className="space-y-2">
                                      {quizQuestionForm.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            name="quiz_correct_answer"
                                            checked={quizQuestionForm.correct_answer === String(index)}
                                            onChange={() =>
                                              setQuizQuestionForm({
                                                ...quizQuestionForm,
                                                correct_answer: String(index)
                                              })
                                            }
                                            className="text-purple-600"
                                            disabled={saving}
                                          />
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...quizQuestionForm.options];
                                              newOptions[index] = e.target.value;
                                              setQuizQuestionForm({ ...quizQuestionForm, options: newOptions });
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                            disabled={saving}
                                          />
                                          <button
                                            onClick={() => {
                                              const newOptions = quizQuestionForm.options.filter((_, i) => i !== index);
                                              setQuizQuestionForm({ ...quizQuestionForm, options: newOptions });
                                            }}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            disabled={saving || quizQuestionForm.options.length <= 2}
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                      ))}
                                      {quizQuestionForm.options.length < 6 && (
                                        <button
                                          onClick={() => {
                                            setQuizQuestionForm({
                                              ...quizQuestionForm,
                                              options: [...quizQuestionForm.options, '']
                                            });
                                          }}
                                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                          disabled={saving}
                                        >
                                          <Plus size={14} />
                                          Add Option
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* True/False Options */}
                                {quizQuestionForm.question_type === 'true_false' && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                                    <div className="flex gap-4">
                                      <label className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name="quiz_correct_answer_tf"
                                          checked={quizQuestionForm.correct_answer === 'true'}
                                          onChange={() =>
                                            setQuizQuestionForm({ ...quizQuestionForm, correct_answer: 'true' })
                                          }
                                          className="text-purple-600"
                                          disabled={saving}
                                        />
                                        <span>True</span>
                                      </label>
                                      <label className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name="quiz_correct_answer_tf"
                                          checked={quizQuestionForm.correct_answer === 'false'}
                                          onChange={() =>
                                            setQuizQuestionForm({ ...quizQuestionForm, correct_answer: 'false' })
                                          }
                                          className="text-purple-600"
                                          disabled={saving}
                                        />
                                        <span>False</span>
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {/* Short / Long Answer */}
                                {(quizQuestionForm.question_type === 'short_answer' ||
                                  quizQuestionForm.question_type === 'long_answer') && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expected Answer (for grading reference)
                                      </label>
                                      <textarea
                                        value={quizQuestionForm.correct_answer}
                                        onChange={(e) =>
                                          setQuizQuestionForm({ ...quizQuestionForm, correct_answer: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                                        rows={3}
                                        placeholder="Enter expected answer or key points (optional)"
                                        disabled={saving}
                                      />
                                    </div>
                                  )}

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                                  <textarea
                                    value={quizQuestionForm.explanation}
                                    onChange={(e) =>
                                      setQuizQuestionForm({ ...quizQuestionForm, explanation: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                                    rows={2}
                                    placeholder="Explanation shown after answering"
                                    disabled={saving}
                                  />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                  <button
                                    onClick={() => {
                                      setEditingQuizQuestionId(null);
                                      setShowQuizQuestionForm(false);
                                      setQuizQuestionForm({
                                        question_text: '',
                                        question_type: 'multiple_choice',
                                        options: ['', '', '', ''],
                                        correct_answer: '',
                                        points: 1,
                                        explanation: ''
                                      });
                                    }}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                                    disabled={saving}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!selectedAssignment) return;
                                      if (!quizQuestionForm.question_text.trim()) {
                                        showError('Question text is required');
                                        return;
                                      }

                                      // Basic validation for MCQ
                                      if (quizQuestionForm.question_type === 'multiple_choice') {
                                        const validOptions = quizQuestionForm.options.filter((opt) => opt.trim());
                                        if (validOptions.length < 2) {
                                          showError('Multiple choice questions need at least 2 options');
                                          return;
                                        }
                                        if (!quizQuestionForm.correct_answer.trim()) {
                                          showError('Please select a correct answer');
                                          return;
                                        }
                                      }

                                      try {
                                        setSaving(true);
                                        if (editingQuizQuestionId) {
                                          const updated = await api.updateAssignmentQuestion(editingQuizQuestionId, {
                                            question_text: quizQuestionForm.question_text.trim(),
                                            question_type: quizQuestionForm.question_type,
                                            options:
                                              quizQuestionForm.question_type === 'multiple_choice'
                                                ? quizQuestionForm.options.filter((opt) => opt.trim())
                                                : null,
                                            correct_answer: quizQuestionForm.correct_answer.trim() || null,
                                            points: quizQuestionForm.points,
                                            explanation: quizQuestionForm.explanation.trim() || null
                                          });
                                          setQuizQuestions((prev) =>
                                            prev.map((q) => (q.id === editingQuizQuestionId ? updated : q))
                                          );
                                        } else {
                                          const created = await api.createAssignmentQuestion(selectedAssignment.id, {
                                            question_text: quizQuestionForm.question_text.trim(),
                                            question_type: quizQuestionForm.question_type,
                                            options:
                                              quizQuestionForm.question_type === 'multiple_choice'
                                                ? quizQuestionForm.options.filter((opt) => opt.trim())
                                                : null,
                                            correct_answer: quizQuestionForm.correct_answer.trim() || null,
                                            points: quizQuestionForm.points,
                                            explanation: quizQuestionForm.explanation.trim() || null
                                          });
                                          setQuizQuestions((prev) => [...prev, created]);
                                        }

                                        showSuccess(
                                          editingQuizQuestionId
                                            ? 'Question updated successfully!'
                                            : 'Question added successfully!'
                                        );
                                        setEditingQuizQuestionId(null);
                                        setShowQuizQuestionForm(false);
                                        setQuizQuestionForm({
                                          question_text: '',
                                          question_type: 'multiple_choice',
                                          options: ['', '', '', ''],
                                          correct_answer: '',
                                          points: 1,
                                          explanation: ''
                                        });
                                      } catch (err: any) {
                                        showError(err.message || 'Failed to save question');
                                      } finally {
                                        setSaving(false);
                                      }
                                    }}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                                    disabled={saving}
                                  >
                                    {saving ? (
                                      <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      'Save Question'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Questions list */}
                          {quizQuestions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              {showQuizQuestionForm
                                ? 'Fill in the form above to add your first question.'
                                : 'No questions yet. Click "Add Question" to create one.'}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {quizQuestions.map((question, index) => (
                                <div
                                  key={question.id}
                                  draggable
                                  onDragStart={() => setDraggedQuizQuestion(question.id)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => {
                                    if (!draggedQuizQuestion || draggedQuizQuestion === question.id) return;
                                    const draggedIndex = quizQuestions.findIndex((q) => q.id === draggedQuizQuestion);
                                    const targetIndex = quizQuestions.findIndex((q) => q.id === question.id);
                                    if (draggedIndex === -1 || targetIndex === -1) return;

                                    const newQuestions = [...quizQuestions];
                                    const [moved] = newQuestions.splice(draggedIndex, 1);
                                    newQuestions.splice(targetIndex, 0, moved);

                                    setQuizQuestions(newQuestions);

                                    // Persist new order
                                    api
                                      .reorderAssignmentQuestions(
                                        selectedAssignment.id,
                                        newQuestions.map((q, i) => ({
                                          id: q.id,
                                          order_index: i + 1
                                        }))
                                      )
                                      .catch((err: any) => {
                                        console.error('Failed to reorder questions', err);
                                      });
                                  }}
                                  className="p-4 border border-gray-200 rounded-lg bg-white hover:border-purple-300 hover:shadow-sm cursor-move transition-all"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-gray-400 uppercase">
                                          Q{index + 1}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium uppercase tracking-wide">
                                          {question.question_type.replace('_', ' ')}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                                          {question.points} pts
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-900 font-medium mb-1">
                                        {question.question_text}
                                      </div>
                                      {question.question_type === 'multiple_choice' && question.options && (
                                        <ul className="mt-1 space-y-1 text-sm text-gray-700">
                                          {question.options.map((opt, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-[11px] text-gray-600">
                                                {String.fromCharCode(65 + i)}
                                              </span>
                                              <span>{opt}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                      {question.question_type === 'true_false' && (
                                        <div className="mt-1 text-sm text-gray-700">
                                          Correct answer:{' '}
                                          <span className="font-semibold">
                                            {question.correct_answer === 'true' ? 'True' : 'False'}
                                          </span>
                                        </div>
                                      )}
                                      {(question.question_type === 'short_answer' ||
                                        question.question_type === 'long_answer') &&
                                        question.correct_answer && (
                                          <div className="mt-1 text-sm text-gray-700">
                                            Expected answer:{' '}
                                            <span className="font-medium">{question.correct_answer}</span>
                                          </div>
                                        )}
                                      {question.explanation && (
                                        <div className="mt-2 text-xs text-gray-500">
                                          <span className="font-semibold text-gray-600">Explanation:</span>{' '}
                                          {question.explanation}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingQuizQuestionId(question.id);
                                          setShowQuizQuestionForm(true);
                                          setQuizQuestionForm({
                                            question_text: question.question_text,
                                            question_type: question.question_type,
                                            options:
                                              question.question_type === 'multiple_choice' && question.options
                                                ? (question.options as string[])
                                                : ['', '', '', ''],
                                            correct_answer: question.correct_answer || '',
                                            points: question.points,
                                            explanation: question.explanation || ''
                                          });
                                        }}
                                        className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            await api.deleteAssignmentQuestion(question.id);
                                            setQuizQuestions((prev) => prev.filter((q) => q.id !== question.id));
                                            showSuccess('Question deleted');
                                          } catch (err: any) {
                                            showError(err.message || 'Failed to delete question');
                                          }
                                        }}
                                        className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                        setCreatingAssignment(true);
                        resetForm();
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
      </div>





      {/* Delete Assignment Modal */}
      {
        showDeleteModal && assignmentToDelete && (
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
        )
      }

    </>
  );
}
