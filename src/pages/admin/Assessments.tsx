import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileQuestion,
  CheckCircle2,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Copy,
  X,
  Save,
  Loader2,
  AlertCircle,
  GripVertical,
  ArrowUpDown,
  Filter,
  Send,
  History,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[] | null;
  correct_answer: string | null;
  points: number;
  order_index: number;
  explanation?: string | null;
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string | null;
  type: 'quiz' | 'exam' | 'assignment';
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  is_required: boolean;
  randomize_questions: boolean;
  show_results: boolean;
  status: 'draft' | 'published' | 'archived';
  course_id: string | null;
  lesson_id: string | null;
  course_title?: string | null;
  lesson_title?: string | null;
  question_count?: number;
  attempt_count?: number;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

interface AssessmentsProps {}

export function Assessments({}: AssessmentsProps) {
  const { showSuccess, showError } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-newest');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null);
  
  // Form states
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    type: 'quiz' as Assessment['type'],
    passing_score: 70,
    time_limit_minutes: null as number | null,
    max_attempts: 1,
    is_required: true,
    randomize_questions: false,
    show_results: true,
    status: 'draft' as Assessment['status'],
    course_id: '',
    lesson_id: ''
  });
  
  // Question management
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [viewingHistoryQuestionId, setViewingHistoryQuestionId] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'multiple_choice' as Question['question_type'],
    options: ['', '', '', ''] as string[],
    correct_answer: '',
    points: 1,
    explanation: '',
    status: 'draft' as 'draft' | 'published'
  });
  
  // Drag and drop
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  
  // Available courses and lessons for assignment
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);

  useEffect(() => {
    fetchAssessments();
    fetchAvailableCourses();
  }, [filterStatus, filterType]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await api.getAssessments(1, 100, searchQuery, filterStatus !== 'all' ? filterStatus : 'all', filterType !== 'all' ? filterType : 'all');
      let assessmentsList = data.assessments || [];
      
      // Apply sorting
      assessmentsList = sortAssessments(assessmentsList, sortBy);
      
      setAssessments(assessmentsList);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [searchQuery, sortBy]);

  const fetchAvailableCourses = async () => {
    try {
      const data = await api.getCourses(1, 100, '', 'all');
      setAvailableCourses(data.courses || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAvailableLessons = async (courseId: string) => {
    try {
      const course = await api.getCourse(courseId);
      const lessons: any[] = [];
      if (course.modules) {
        course.modules.forEach((module: any) => {
          if (module.lessons) {
            module.lessons.forEach((lesson: any) => {
              lessons.push({
                ...lesson,
                module_title: module.title
              });
            });
          }
        });
      }
      setAvailableLessons(lessons);
    } catch (err: any) {
      console.error('Error fetching lessons:', err);
    }
  };

  const fetchAssessment = async (id: string) => {
    try {
      setLoading(true);
      const assessment = await api.getAssessment(id);
      setSelectedAssessment(assessment);
      setLocalQuestions(assessment.questions || []);
      
      // Set form values
      setAssessmentForm({
        title: assessment.title,
        description: assessment.description || '',
        type: assessment.type,
        passing_score: assessment.passing_score,
        time_limit_minutes: assessment.time_limit_minutes,
        max_attempts: assessment.max_attempts,
        is_required: assessment.is_required,
        randomize_questions: assessment.randomize_questions,
        show_results: assessment.show_results,
        status: assessment.status,
        course_id: assessment.course_id || '',
        lesson_id: assessment.lesson_id || ''
      });
      
      // Fetch lessons if course is assigned
      if (assessment.course_id) {
        await fetchAvailableLessons(assessment.course_id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const sortAssessments = (assessments: Assessment[], sortBy: string): Assessment[] => {
    const sorted = [...assessments];
    switch (sortBy) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'date-newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'date-oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'modified-newest':
        return sorted.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
      case 'modified-oldest':
        return sorted.sort((a, b) => new Date(a.updated_at || a.created_at).getTime() - new Date(b.updated_at || b.created_at).getTime());
      case 'questions-asc':
        return sorted.sort((a, b) => (a.question_count || 0) - (b.question_count || 0));
      case 'questions-desc':
        return sorted.sort((a, b) => (b.question_count || 0) - (a.question_count || 0));
      default:
        return sorted;
    }
  };

  const handleCreateAssessment = async () => {
    if (!assessmentForm.title.trim()) {
      showError('Assessment title is required');
      return;
    }

    try {
      setSaving(true);
      const assessment = await api.createAssessment({
        title: assessmentForm.title.trim(),
        description: assessmentForm.description.trim() || null,
        type: assessmentForm.type,
        passing_score: assessmentForm.passing_score,
        time_limit_minutes: assessmentForm.time_limit_minutes,
        max_attempts: assessmentForm.max_attempts,
        is_required: assessmentForm.is_required,
        randomize_questions: assessmentForm.randomize_questions,
        show_results: assessmentForm.show_results,
        status: assessmentForm.status,
        course_id: assessmentForm.course_id || null,
        lesson_id: assessmentForm.lesson_id || null
      });
      
      showSuccess('Assessment created successfully!');
      setShowCreateModal(false);
      resetAssessmentForm();
      await fetchAssessments();
      await fetchAssessment(assessment.id);
    } catch (err: any) {
      showError(err.message || 'Failed to create assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!selectedAssessment) return;

    try {
      setSaving(true);
      await api.updateAssessment(selectedAssessment.id, {
        title: assessmentForm.title.trim(),
        description: assessmentForm.description.trim() || null,
        type: assessmentForm.type,
        passing_score: assessmentForm.passing_score,
        time_limit_minutes: assessmentForm.time_limit_minutes,
        max_attempts: assessmentForm.max_attempts,
        is_required: assessmentForm.is_required,
        randomize_questions: assessmentForm.randomize_questions,
        show_results: assessmentForm.show_results,
        status: assessmentForm.status,
        course_id: assessmentForm.course_id || null,
        lesson_id: assessmentForm.lesson_id || null
      });
      
      showSuccess('Assessment saved successfully!');
      await fetchAssessment(selectedAssessment.id);
      await fetchAssessments();
    } catch (err: any) {
      showError(err.message || 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!assessmentToDelete) return;

    try {
      await api.deleteAssessment(assessmentToDelete.id);
      showSuccess('Assessment deleted successfully!');
      if (selectedAssessment?.id === assessmentToDelete.id) {
        setSelectedAssessment(null);
        setLocalQuestions([]);
      }
      setShowDeleteModal(false);
      setAssessmentToDelete(null);
      await fetchAssessments();
    } catch (err: any) {
      showError(err.message || 'Failed to delete assessment');
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestionId(null);
    setShowQuestionModal(true);
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: ''
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setShowQuestionModal(true);
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options && Array.isArray(question.options) ? question.options : ['', '', '', ''],
      correct_answer: question.correct_answer || '',
      points: question.points,
      explanation: question.explanation || '',
      status: question.status || 'draft'
    });
  };

  const handlePublishQuestion = async (questionId: string) => {
    try {
      const updatedQuestion = await api.publishQuestion(questionId);
      setLocalQuestions(localQuestions.map(q => q.id === questionId ? updatedQuestion : q));
      showSuccess('Question published successfully!');
      await fetchAssessment(selectedAssessment!.id);
    } catch (err: any) {
      showError(err.message || 'Failed to publish question');
    }
  };

  const handleUnpublishQuestion = async (questionId: string) => {
    try {
      const updatedQuestion = await api.unpublishQuestion(questionId);
      setLocalQuestions(localQuestions.map(q => q.id === questionId ? updatedQuestion : q));
      showSuccess('Question unpublished successfully!');
      await fetchAssessment(selectedAssessment!.id);
    } catch (err: any) {
      showError(err.message || 'Failed to unpublish question');
    }
  };

  const handleViewHistory = async (questionId: string) => {
    try {
      const history = await api.getQuestionHistory(questionId);
      setQuestionHistory(history);
      setViewingHistoryQuestionId(questionId);
    } catch (err: any) {
      showError(err.message || 'Failed to load question history');
    }
  };

  const handleSaveQuestion = async () => {
    if (!selectedAssessment || !questionForm.question_text.trim()) {
      showError('Question text is required');
      return;
    }

    try {
      setSaving(true);
      
      // Validate question based on type
      if (questionForm.question_type === 'multiple_choice') {
        const validOptions = questionForm.options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
          showError('Multiple choice questions need at least 2 options');
          setSaving(false);
          return;
        }
        if (!questionForm.correct_answer.trim()) {
          showError('Please select a correct answer');
          setSaving(false);
          return;
        }
      }

      if (editingQuestionId) {
        // Update existing question
        const updatedQuestion = await api.updateQuestion(editingQuestionId, {
          question_text: questionForm.question_text.trim(),
          question_type: questionForm.question_type,
          options: questionForm.question_type === 'multiple_choice' ? questionForm.options.filter(opt => opt.trim()) : null,
          correct_answer: questionForm.correct_answer.trim() || null,
          points: questionForm.points,
          explanation: questionForm.explanation.trim() || null,
          status: questionForm.status
        });
        
        // Update local state
        setLocalQuestions(localQuestions.map(q => q.id === editingQuestionId ? updatedQuestion : q));
      } else {
        // Create new question
        const newQuestion = await api.createQuestion(selectedAssessment.id, {
          question_text: questionForm.question_text.trim(),
          question_type: questionForm.question_type,
          options: questionForm.question_type === 'multiple_choice' ? questionForm.options.filter(opt => opt.trim()) : null,
          correct_answer: questionForm.correct_answer.trim() || null,
          points: questionForm.points,
          explanation: questionForm.explanation.trim() || null,
          status: questionForm.status
        });
        
        // Add to local state
        setLocalQuestions([...localQuestions, newQuestion]);
      }
      
      showSuccess(editingQuestionId ? 'Question updated successfully!' : 'Question added successfully!');
      setEditingQuestionId(null);
      setShowQuestionModal(false);
      setQuestionForm({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        points: 1,
        explanation: '',
        status: 'draft'
      });
      
      // Refresh assessment to get updated question count
      await fetchAssessment(selectedAssessment.id);
    } catch (err: any) {
      showError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete || !selectedAssessment) return;

    try {
      await api.deleteQuestion(questionToDelete.id);
      showSuccess('Question deleted successfully!');
      setLocalQuestions(localQuestions.filter(q => q.id !== questionToDelete.id));
      setShowDeleteQuestionModal(false);
      setQuestionToDelete(null);
      await fetchAssessment(selectedAssessment.id);
    } catch (err: any) {
      showError(err.message || 'Failed to delete question');
    }
  };

  const handleQuestionDragStart = (questionId: string) => {
    setDraggedQuestion(questionId);
  };

  const handleQuestionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleQuestionDrop = async (targetQuestionId: string) => {
    if (!draggedQuestion || !selectedAssessment || draggedQuestion === targetQuestionId) {
      setDraggedQuestion(null);
      return;
    }

    const draggedIndex = localQuestions.findIndex(q => q.id === draggedQuestion);
    const targetIndex = localQuestions.findIndex(q => q.id === targetQuestionId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedQuestion(null);
      return;
    }

    // Reorder locally
    const newQuestions = [...localQuestions];
    const [removed] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, removed);
    setLocalQuestions(newQuestions);

    // Update order indices
    const questionOrders = newQuestions.map((q, index) => ({
      id: q.id,
      order_index: index
    }));

    try {
      await api.reorderQuestions(selectedAssessment.id, questionOrders);
      showSuccess('Questions reordered successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to reorder questions');
      // Revert on error
      await fetchAssessment(selectedAssessment.id);
    }

    setDraggedQuestion(null);
  };

  const resetAssessmentForm = () => {
    setAssessmentForm({
      title: '',
      description: '',
      type: 'quiz',
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
  };

  const getTotalPoints = () => {
    return localQuestions.reduce((sum, q) => sum + q.points, 0);
  };

  const isModalOpen = showCreateModal || showDeleteModal || showDeleteQuestionModal || viewingHistoryQuestionId !== null;

  if (loading && !selectedAssessment) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assessments...</p>
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
      
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Assessments</h2>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  fetchAvailableCourses();
                }}
                className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Create assessment"
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
                  placeholder="Search assessments..."
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
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
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
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="date-newest">Date (Newest)</option>
                  <option value="date-oldest">Date (Oldest)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="questions-desc">Questions (Most)</option>
                  <option value="questions-asc">Questions (Least)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assessments List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {assessments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                    ? 'No assessments match your filters'
                    : 'No assessments yet. Create your first assessment!'}
                </div>
              ) : (
                assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAssessment?.id === assessment.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => fetchAssessment(assessment.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{assessment.title}</div>
                        <div className="text-xs text-gray-500">
                          {assessment.question_count || 0} questions • {assessment.type}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            assessment.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : assessment.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assessment.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssessmentToDelete(assessment);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete assessment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedAssessment ? (
            <div className="max-w-4xl mx-auto">
              {/* Assessment Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Assessment Title *</label>
                    <input
                      type="text"
                      value={assessmentForm.title}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Assessment title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea
                      value={assessmentForm.description}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="Assessment description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      <select
                        value={assessmentForm.type}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value as Assessment['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="exam">Exam</option>
                        <option value="assignment">Assignment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Status</label>
                      <select
                        value={assessmentForm.status}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, status: e.target.value as Assessment['status'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Passing Score (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={assessmentForm.passing_score}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, passing_score: parseFloat(e.target.value) || 70 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Time Limit (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={assessmentForm.time_limit_minutes || ''}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max Attempts</label>
                      <input
                        type="number"
                        min="1"
                        value={assessmentForm.max_attempts}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, max_attempts: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Course (Optional)</label>
                      <select
                        value={assessmentForm.course_id}
                        onChange={async (e) => {
                          const courseId = e.target.value;
                          setAssessmentForm({ ...assessmentForm, course_id: courseId, lesson_id: '' });
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
                      <label className="block text-xs text-gray-600 mb-1">Lesson (Optional)</label>
                      <select
                        value={assessmentForm.lesson_id}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, lesson_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={!assessmentForm.course_id}
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

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={assessmentForm.is_required}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, is_required: e.target.checked })}
                        className="rounded"
                      />
                      Required
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={assessmentForm.randomize_questions}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, randomize_questions: e.target.checked })}
                        className="rounded"
                      />
                      Randomize Questions
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={assessmentForm.show_results}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, show_results: e.target.checked })}
                        className="rounded"
                      />
                      Show Results
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveAssessment}
                      disabled={saving || !assessmentForm.title.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Assessment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Questions</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {localQuestions.length} question{localQuestions.length !== 1 ? 's' : ''} • {getTotalPoints()} total points
                    </p>
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>

                <div className="p-6">
                  {/* Question Form (Inline) */}
                  {showQuestionModal && (
                    <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                        </h3>
                        <button
                          onClick={() => {
                            setEditingQuestionId(null);
                            setShowQuestionModal(false);
                            setQuestionForm({
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
                            value={questionForm.question_text}
                            onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                            rows={3}
                            placeholder="Enter your question"
                            disabled={saving}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                            <select
                              value={questionForm.question_type}
                              onChange={(e) => {
                                const newType = e.target.value as Question['question_type'];
                                setQuestionForm({
                                  ...questionForm,
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
                              <option value="essay">Essay</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={questionForm.points}
                              onChange={(e) => setQuestionForm({ ...questionForm, points: parseFloat(e.target.value) || 1 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                              disabled={saving}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={questionForm.status}
                              onChange={(e) => setQuestionForm({ ...questionForm, status: e.target.value as 'draft' | 'published' })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                              disabled={saving}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </div>

                        {/* Multiple Choice Options */}
                        {questionForm.question_type === 'multiple_choice' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            <div className="space-y-2">
                              {questionForm.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="correct_answer"
                                    checked={questionForm.correct_answer === String(index) || questionForm.correct_answer === option}
                                    onChange={() => setQuestionForm({ ...questionForm, correct_answer: String(index) })}
                                    className="text-purple-600"
                                    disabled={saving}
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...questionForm.options];
                                      newOptions[index] = e.target.value;
                                      setQuestionForm({ ...questionForm, options: newOptions });
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                    disabled={saving}
                                  />
                                  <button
                                    onClick={() => {
                                      const newOptions = questionForm.options.filter((_, i) => i !== index);
                                      setQuestionForm({ ...questionForm, options: newOptions });
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    disabled={saving || questionForm.options.length <= 2}
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                              {questionForm.options.length < 6 && (
                                <button
                                  onClick={() => {
                                    setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] });
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
                        {questionForm.question_type === 'true_false' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correct_answer_tf"
                                  checked={questionForm.correct_answer === 'true'}
                                  onChange={() => setQuestionForm({ ...questionForm, correct_answer: 'true' })}
                                  className="text-purple-600"
                                  disabled={saving}
                                />
                                <span>True</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correct_answer_tf"
                                  checked={questionForm.correct_answer === 'false'}
                                  onChange={() => setQuestionForm({ ...questionForm, correct_answer: 'false' })}
                                  className="text-purple-600"
                                  disabled={saving}
                                />
                                <span>False</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Short Answer / Essay */}
                        {(questionForm.question_type === 'short_answer' || questionForm.question_type === 'essay') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expected Answer (for grading reference)
                            </label>
                            <textarea
                              value={questionForm.correct_answer}
                              onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
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
                            value={questionForm.explanation}
                            onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                            rows={2}
                            placeholder="Explanation shown after answering"
                            disabled={saving}
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setEditingQuestionId(null);
                              setShowQuestionModal(false);
                              setQuestionForm({
                                question_text: '',
                                question_type: 'multiple_choice',
                                options: ['', '', '', ''],
                                correct_answer: '',
                                points: 1,
                                explanation: '',
                                status: 'draft'
                              });
                            }}
                            disabled={saving}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveQuestion}
                            disabled={saving || !questionForm.question_text.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                {editingQuestionId ? 'Update Question' : 'Add Question'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {localQuestions.length === 0 && !showQuestionModal ? (
                    <div className="text-center py-12">
                      <FileQuestion size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No questions yet</p>
                      <button
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Add Your First Question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {localQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          draggable
                          onDragStart={() => handleQuestionDragStart(question.id)}
                          onDragOver={handleQuestionDragOver}
                          onDrop={() => handleQuestionDrop(question.id)}
                          className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <GripVertical size={20} className="text-gray-400 mt-1 cursor-move" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                      Q{index + 1}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {question.question_type.replace('_', ' ')}
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                      {question.points} pt{question.points !== 1 ? 's' : ''}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      question.status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {question.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">{question.question_text}</p>
                                  {question.question_type === 'multiple_choice' && question.options && (
                                    <div className="mt-2 space-y-1">
                                      {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center gap-2 text-sm">
                                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                            question.correct_answer === String(optIndex) || question.correct_answer === option
                                              ? 'bg-green-100 text-green-700 font-bold'
                                              : 'bg-gray-100 text-gray-600'
                                          }`}>
                                            {String.fromCharCode(65 + optIndex)}
                                          </span>
                                          <span className={question.correct_answer === String(optIndex) || question.correct_answer === option ? 'font-medium text-green-700' : 'text-gray-700'}>
                                            {option}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {question.explanation && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
                                      <strong>Explanation:</strong> {question.explanation}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleViewHistory(question.id)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="View history"
                                  >
                                    <History size={16} />
                                  </button>
                                  {question.status === 'published' ? (
                                    <button
                                      onClick={() => handleUnpublishQuestion(question.id)}
                                      className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                      title="Unpublish question"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublishQuestion(question.id)}
                                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                      title="Publish question"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleEditQuestion(question)}
                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                    title="Edit question"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setQuestionToDelete({ id: question.id, text: question.question_text });
                                      setShowDeleteQuestionModal(true);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete question"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
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
                <FileQuestion size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessment selected</h3>
              <p className="text-gray-500 mb-6">Select an assessment from the sidebar or create a new one</p>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  fetchAvailableCourses();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Create Assessment
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Assessment</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetAssessmentForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Assessment title"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={assessmentForm.description}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Assessment description"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={assessmentForm.type}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value as Assessment['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={assessmentForm.status}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, status: e.target.value as Assessment['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assessmentForm.passing_score}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, passing_score: parseFloat(e.target.value) || 70 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    value={assessmentForm.time_limit_minutes || ''}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="No limit"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
                  <input
                    type="number"
                    min="1"
                    value={assessmentForm.max_attempts}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, max_attempts: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course (Optional)</label>
                  <select
                    value={assessmentForm.course_id}
                    onChange={async (e) => {
                      const courseId = e.target.value;
                      setAssessmentForm({ ...assessmentForm, course_id: courseId, lesson_id: '' });
                      if (courseId) {
                        await fetchAvailableLessons(courseId);
                      } else {
                        setAvailableLessons([]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson (Optional)</label>
                  <select
                    value={assessmentForm.lesson_id}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, lesson_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving || !assessmentForm.course_id}
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

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={assessmentForm.is_required}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, is_required: e.target.checked })}
                    className="rounded"
                    disabled={saving}
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={assessmentForm.randomize_questions}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, randomize_questions: e.target.checked })}
                    className="rounded"
                    disabled={saving}
                  />
                  Randomize Questions
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={assessmentForm.show_results}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, show_results: e.target.checked })}
                    className="rounded"
                    disabled={saving}
                  />
                  Show Results
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetAssessmentForm();
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssessment}
                  disabled={saving || !assessmentForm.title.trim()}
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
                      Create Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assessment Modal */}
      {showDeleteModal && assessmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Assessment</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{assessmentToDelete.title}"</span>?
              </p>
              {assessmentToDelete.attempt_count && assessmentToDelete.attempt_count > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This assessment has <span className="font-semibold">{assessmentToDelete.attempt_count} attempt{assessmentToDelete.attempt_count !== 1 ? 's' : ''}</span>.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The assessment and all its questions will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAssessmentToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssessment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Assessment
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete Question Modal */}
      {showDeleteQuestionModal && questionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Question</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this question?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">{questionToDelete.text}</p>
              </div>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteQuestionModal(false);
                  setQuestionToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question History Modal */}
      {viewingHistoryQuestionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Question History</h2>
              </div>
              <button
                onClick={() => {
                  setViewingHistoryQuestionId(null);
                  setQuestionHistory([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {questionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No history available for this question</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questionHistory.map((entry, index) => (
                    <div key={entry.id} className="border-l-4 border-purple-300 pl-4 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              entry.change_type === 'created' ? 'bg-green-100 text-green-700' :
                              entry.change_type === 'updated' ? 'bg-blue-100 text-blue-700' :
                              entry.change_type === 'published' ? 'bg-purple-100 text-purple-700' :
                              entry.change_type === 'unpublished' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {entry.change_type.charAt(0).toUpperCase() + entry.change_type.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.created_at).toLocaleString()}
                            </span>
                          </div>
                          {entry.changed_by_name && (
                            <p className="text-sm text-gray-600">
                              by <span className="font-medium">{entry.changed_by_name}</span>
                            </p>
                          )}
                          {entry.change_summary && (
                            <p className="text-sm text-gray-700 mt-1">{entry.change_summary}</p>
                          )}
                        </div>
                      </div>
                      {entry.old_data && entry.new_data && (
                        <div className="mt-3 space-y-2 text-xs">
                          {Object.keys(JSON.parse(entry.new_data)).map((key) => {
                            const oldVal = JSON.parse(entry.old_data)[key];
                            const newVal = JSON.parse(entry.new_data)[key];
                            if (oldVal !== newVal) {
                              return (
                                <div key={key} className="bg-gray-50 rounded p-2">
                                  <div className="font-medium text-gray-700 mb-1">{key.replace('_', ' ')}</div>
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <div className="text-red-600 line-through">{String(oldVal || 'N/A')}</div>
                                      <div className="text-green-600 font-medium">{String(newVal || 'N/A')}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
