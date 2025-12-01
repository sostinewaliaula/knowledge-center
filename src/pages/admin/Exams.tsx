import { useState, useEffect, useRef } from 'react';
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
  XCircle,
  FolderOpen,
  DollarSign,
  Building2,
  GraduationCap,
  Briefcase,
  Shield,
  Target,
  TrendingUp,
  Settings,
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
  Bell,
  Gift,
  Coffee,
  Utensils,
  Smile,
  ThumbsUp,
  Tag,
  Users,
  BookOpen,
  FileText,
  Video
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

interface Exam {
  id: string;
  title: string;
  description: string | null;
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

interface ExamsProps {}

export function Exams({}: ExamsProps) {
  const { showSuccess, showError } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-newest');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalExam, setOriginalExam] = useState<any>(null);
  const [creatingExam, setCreatingExam] = useState(false);
  
  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null);
  
  // Form states
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    passing_score: 70,
    time_limit_minutes: null as number | null,
    max_attempts: 1,
    is_required: true,
    randomize_questions: false,
    show_results: true,
    status: 'draft' as Exam['status'],
    course_id: '',
    lesson_id: ''
  });

  // Edit states
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editExamForm, setEditExamForm] = useState({
    title: '',
    description: '',
    passing_score: 70,
    time_limit_minutes: null as number | null,
    max_attempts: 1,
    is_required: true,
    randomize_questions: false,
    show_results: true,
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
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    fetchExams();
    fetchAvailableCourses();
  }, [filterStatus]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await api.getExams(1, 100, searchQuery, filterStatus !== 'all' ? filterStatus : 'all');
      let examsList = data.exams || [];
      
      // Apply sorting
      examsList = sortExams(examsList, sortBy);
      
      setExams(examsList);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
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

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data.tags || []);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
    }
  };

  // Icon mapping function for categories (same as in CourseBuilder)
  const getCategoryIcon = (iconName: string | null, color: string | null) => {
    if (!iconName) {
      return <FolderOpen size={20} style={{ color: color || '#3B82F6' }} />;
    }

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
      'Bell': Bell,
      'Gift': Gift,
      'Coffee': Coffee,
      'Utensils': Utensils,
      'Smile': Smile,
      'ThumbsUp': ThumbsUp,
      'FolderOpen': FolderOpen,
      'Tag': Tag
    };

    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent size={20} style={{ color: color || '#3B82F6' }} />;
    }

    if (iconName.length <= 2 && /[\u{1F300}-\u{1F9FF}]/u.test(iconName)) {
      return <span className="text-lg leading-none">{iconName}</span>;
    }

    return <FolderOpen size={20} style={{ color: color || '#3B82F6' }} />;
  };

  // Resize title textarea when selectedExam changes
  useEffect(() => {
    if (titleTextareaRef.current && selectedExam?.title) {
      setTimeout(() => {
        if (titleTextareaRef.current) {
          titleTextareaRef.current.style.height = 'auto';
          titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [selectedExam?.title, selectedExam?.id]);

  const fetchExam = async (id: string) => {
    try {
      setLoading(true);
      const exam = await api.getExam(id);
      setSelectedExam(exam);
      setLocalQuestions(exam.questions || []);
      
      // Set form values
      const formData = {
        title: exam.title,
        description: exam.description || '',
        passing_score: exam.passing_score,
        time_limit_minutes: exam.time_limit_minutes,
        max_attempts: exam.max_attempts,
        is_required: exam.is_required,
        randomize_questions: exam.randomize_questions,
        show_results: exam.show_results,
        status: exam.status,
        course_id: exam.course_id || '',
        lesson_id: exam.lesson_id || ''
      };
      
      setExamForm(formData);
      setOriginalExam(JSON.parse(JSON.stringify(formData))); // Deep copy
      setHasUnsavedChanges(false);
      
      // Fetch lessons if course is assigned
      if (exam.course_id) {
        await fetchAvailableLessons(exam.course_id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const sortExams = (exams: Exam[], sortBy: string): Exam[] => {
    const sorted = [...exams];
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

  const handleCreateExam = async () => {
    if (!examForm.title.trim()) {
      showError('Exam title is required');
      return;
    }

    try {
      setSaving(true);
      const exam = await api.createExam({
        title: examForm.title.trim(),
        description: examForm.description.trim() || null,
        passing_score: examForm.passing_score,
        time_limit_minutes: examForm.time_limit_minutes,
        max_attempts: examForm.max_attempts,
        is_required: examForm.is_required,
        randomize_questions: examForm.randomize_questions,
        show_results: examForm.show_results,
        status: examForm.status,
        course_id: examForm.course_id || null,
        lesson_id: examForm.lesson_id || null
      });
      
      showSuccess('Exam created successfully!');
      setCreatingExam(false);
      resetExamForm();
      await fetchExams();
      await fetchExam(exam.id);
    } catch (err: any) {
      showError(err.message || 'Failed to create exam');
    } finally {
      setSaving(false);
    }
  };

  // Check for unsaved changes
  useEffect(() => {
    if (!originalExam || !selectedExam) {
      setHasUnsavedChanges(false);
      return;
    }

    const hasChanges = 
      examForm.title !== originalExam.title ||
      examForm.description !== originalExam.description ||
      examForm.passing_score !== originalExam.passing_score ||
      examForm.time_limit_minutes !== originalExam.time_limit_minutes ||
      examForm.max_attempts !== originalExam.max_attempts ||
      examForm.is_required !== originalExam.is_required ||
      examForm.randomize_questions !== originalExam.randomize_questions ||
      examForm.show_results !== originalExam.show_results ||
      examForm.course_id !== originalExam.course_id ||
      examForm.lesson_id !== originalExam.lesson_id;

    setHasUnsavedChanges(hasChanges);
  }, [examForm, originalExam, selectedExam]);

  const handleSaveExam = async () => {
    if (!selectedExam) return;

    try {
      setSaving(true);
      await api.updateExam(selectedExam.id, {
        title: examForm.title.trim(),
        description: examForm.description.trim() || null,
        passing_score: examForm.passing_score,
        time_limit_minutes: examForm.time_limit_minutes,
        max_attempts: examForm.max_attempts,
        is_required: examForm.is_required,
        randomize_questions: examForm.randomize_questions,
        show_results: examForm.show_results,
        status: examForm.status,
        course_id: examForm.course_id || null,
        lesson_id: examForm.lesson_id || null
      });
      
      showSuccess('Exam saved successfully!');
      await fetchExam(selectedExam.id);
      await fetchExams();
    } catch (err: any) {
      showError(err.message || 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishExam = async () => {
    if (!selectedExam || hasUnsavedChanges) return;

    try {
      setSaving(true);
      await api.updateExam(selectedExam.id, {
        status: 'published'
      });
      showSuccess('Exam published successfully!');
      await fetchExam(selectedExam.id);
      await fetchExams();
    } catch (err: any) {
      showError(err.message || 'Failed to publish exam');
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublishExam = async () => {
    if (!selectedExam || hasUnsavedChanges) return;

    try {
      setSaving(true);
      await api.updateExam(selectedExam.id, {
        status: 'draft'
      });
      showSuccess('Exam unpublished successfully!');
      await fetchExam(selectedExam.id);
      await fetchExams();
    } catch (err: any) {
      showError(err.message || 'Failed to unpublish exam');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;

    try {
      await api.deleteExam(examToDelete.id);
      showSuccess('Exam deleted successfully!');
      if (selectedExam?.id === examToDelete.id) {
        setSelectedExam(null);
        setLocalQuestions([]);
      }
      setShowDeleteModal(false);
      setExamToDelete(null);
      await fetchExams();
    } catch (err: any) {
      showError(err.message || 'Failed to delete exam');
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
      const updatedQuestion = await api.publishExamQuestion(questionId);
      setLocalQuestions(localQuestions.map(q => q.id === questionId ? updatedQuestion : q));
      showSuccess('Question published successfully!');
      await fetchExam(selectedExam!.id);
    } catch (err: any) {
      showError(err.message || 'Failed to publish question');
    }
  };

  const handleUnpublishQuestion = async (questionId: string) => {
    try {
      const updatedQuestion = await api.unpublishExamQuestion(questionId);
      setLocalQuestions(localQuestions.map(q => q.id === questionId ? updatedQuestion : q));
      showSuccess('Question unpublished successfully!');
      await fetchExam(selectedExam!.id);
    } catch (err: any) {
      showError(err.message || 'Failed to unpublish question');
    }
  };

  const handleViewHistory = async (questionId: string) => {
    try {
      const history = await api.getExamQuestionHistory(questionId);
      setQuestionHistory(history);
      setViewingHistoryQuestionId(questionId);
    } catch (err: any) {
      showError(err.message || 'Failed to load question history');
    }
  };

  const handleSaveQuestion = async () => {
    if (!selectedExam || !questionForm.question_text.trim()) {
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
        const updatedQuestion = await api.updateExamQuestion(editingQuestionId, {
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
        const newQuestion = await api.createExamQuestion(selectedExam.id, {
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
      
      // Refresh exam to get updated question count
      await fetchExam(selectedExam.id);
    } catch (err: any) {
      showError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete || !selectedExam) return;

    try {
      await api.deleteExamQuestion(questionToDelete.id);
      showSuccess('Question deleted successfully!');
      setLocalQuestions(localQuestions.filter(q => q.id !== questionToDelete.id));
      setShowDeleteQuestionModal(false);
      setQuestionToDelete(null);
      await fetchExam(selectedExam.id);
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
    if (!draggedQuestion || !selectedExam || draggedQuestion === targetQuestionId) {
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
      await api.reorderExamQuestions(selectedExam.id, questionOrders);
      showSuccess('Questions reordered successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to reorder questions');
      // Revert on error
      await fetchExam(selectedExam.id);
    }

    setDraggedQuestion(null);
  };

  const resetExamForm = () => {
    setExamForm({
      title: '',
      description: '',
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

  const isModalOpen = showDeleteModal || showDeleteQuestionModal || viewingHistoryQuestionId !== null;

  if (loading && !selectedExam) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading exams...</p>
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
              <h2 className="text-sm font-semibold text-gray-700">Exams</h2>
              <button
                onClick={() => {
                  setCreatingExam(true);
                  resetExamForm();
                  fetchAvailableCourses();
                }}
                className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Create exam"
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
                  placeholder="Search exams..."
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

          {/* Exams List */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Create Exam Form (inline) */}
            {creatingExam && (
              <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                <input
                  type="text"
                  placeholder="Exam Title *"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                  disabled={saving}
                />
                <textarea
                  placeholder="Description (optional)"
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  disabled={saving}
                />
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Passing Score (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={examForm.passing_score}
                      onChange={(e) => setExamForm({ ...examForm, passing_score: parseFloat(e.target.value) || 70 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={examForm.time_limit_minutes || ''}
                      onChange={(e) => setExamForm({ ...examForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="No limit"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Attempts</label>
                    <input
                      type="number"
                      min="1"
                      value={examForm.max_attempts}
                      onChange={(e) => setExamForm({ ...examForm, max_attempts: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Course (Optional)</label>
                    <select
                      value={examForm.course_id}
                      onChange={async (e) => {
                        const courseId = e.target.value;
                        setExamForm({ ...examForm, course_id: courseId, lesson_id: '' });
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
                      value={examForm.lesson_id}
                      onChange={(e) => setExamForm({ ...examForm, lesson_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={saving || !examForm.course_id}
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
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={examForm.is_required}
                      onChange={(e) => setExamForm({ ...examForm, is_required: e.target.checked })}
                      className="rounded"
                      disabled={saving}
                    />
                    Required
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={examForm.randomize_questions}
                      onChange={(e) => setExamForm({ ...examForm, randomize_questions: e.target.checked })}
                      className="rounded"
                      disabled={saving}
                    />
                    Randomize Questions
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={examForm.show_results}
                      onChange={(e) => setExamForm({ ...examForm, show_results: e.target.checked })}
                      className="rounded"
                      disabled={saving}
                    />
                    Show Results
                  </label>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-200 mt-2">
                  <button
                    onClick={() => {
                      setCreatingExam(false);
                      resetExamForm();
                    }}
                    disabled={saving}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateExam}
                    disabled={saving || !examForm.title.trim()}
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
                        Create Exam
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Edit Exam Form */}
            {editingExamId && (() => {
              const examToEdit = exams.find(a => a.id === editingExamId);
              if (!examToEdit) return null;
              return (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Exam Title *"
                    value={editExamForm.title}
                    onChange={(e) => setEditExamForm({ ...editExamForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={editExamForm.description}
                    onChange={(e) => setEditExamForm({ ...editExamForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Passing Score (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editExamForm.passing_score}
                        onChange={(e) => setEditExamForm({ ...editExamForm, passing_score: parseFloat(e.target.value) || 70 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={editExamForm.time_limit_minutes || ''}
                        onChange={(e) => setEditExamForm({ ...editExamForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Max Attempts</label>
                      <input
                        type="number"
                        min="1"
                        value={editExamForm.max_attempts}
                        onChange={(e) => setEditExamForm({ ...editExamForm, max_attempts: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editExamForm.status}
                        onChange={(e) => setEditExamForm({ ...editExamForm, status: e.target.value as Exam['status'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Course (Optional)</label>
                      <select
                        value={editExamForm.course_id}
                        onChange={async (e) => {
                          const courseId = e.target.value;
                          setEditExamForm({ ...editExamForm, course_id: courseId, lesson_id: '' });
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
                        value={editExamForm.lesson_id}
                        onChange={(e) => setEditExamForm({ ...editExamForm, lesson_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={!editExamForm.course_id}
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
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={editExamForm.is_required}
                        onChange={(e) => setEditExamForm({ ...editExamForm, is_required: e.target.checked })}
                        className="rounded"
                      />
                      Required
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={editExamForm.randomize_questions}
                        onChange={(e) => setEditExamForm({ ...editExamForm, randomize_questions: e.target.checked })}
                        className="rounded"
                      />
                      Randomize Questions
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={editExamForm.show_results}
                        onChange={(e) => setEditExamForm({ ...editExamForm, show_results: e.target.checked })}
                        className="rounded"
                      />
                      Show Results
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!editExamForm.title.trim()) {
                          showError('Exam title is required');
                          return;
                        }

                        try {
                          setSaving(true);
                          
                          // Update exam details
                          await api.updateExam(editingExamId, {
                            title: editExamForm.title.trim(),
                            description: editExamForm.description.trim() || null,
                            passing_score: editExamForm.passing_score,
                            time_limit_minutes: editExamForm.time_limit_minutes,
                            max_attempts: editExamForm.max_attempts,
                            is_required: editExamForm.is_required,
                            randomize_questions: editExamForm.randomize_questions,
                            show_results: editExamForm.show_results,
                            course_id: editExamForm.course_id || null,
                            lesson_id: editExamForm.lesson_id || null
                          });

                          // Update local state
                          if (selectedExam?.id === editingExamId) {
                            setSelectedExam({
                              ...selectedExam,
                              title: editExamForm.title.trim(),
                              description: editExamForm.description.trim() || null,
                            });
                            setExamForm(editExamForm);
                          }
                          
                          showSuccess('Exam details updated successfully!');
                          setEditingExamId(null);
                          
                          // Refresh exams list
                          await fetchExams();
                        } catch (err: any) {
                          showError(err.message || 'Failed to update exam details');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving || !editExamForm.title.trim()}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingExamId(null);
                        setEditExamForm({
                          title: '',
                          description: '',
                          type: 'exam',
                          passing_score: 70,
                          time_limit_minutes: null,
                          max_attempts: 1,
                          is_required: false,
                          randomize_questions: false,
                          show_results: true,
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
              {exams.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {searchQuery || filterStatus !== 'all'
                    ? 'No exams match your filters'
                    : 'No exams yet. Create your first exam!'}
                </div>
              ) : (
                exams.map((exam) => (
                  <div
                    key={exam.id}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedExam?.id === exam.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => fetchExam(exam.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{exam.title}</div>
                        <div className="text-xs text-gray-500">
                          {exam.question_count || 0} questions • exam
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            exam.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : exam.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {exam.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            // If exam is not selected, fetch it first to get full details
                            if (selectedExam?.id !== exam.id) {
                              await fetchExam(exam.id);
                            }
                            // Use current exam data
                            const currentExam = selectedExam?.id === exam.id ? selectedExam : exam;
                            setEditExamForm({
                              title: currentExam.title,
                              description: currentExam.description || '',
                              passing_score: currentExam.passing_score,
                              time_limit_minutes: currentExam.time_limit_minutes,
                              max_attempts: currentExam.max_attempts,
                              is_required: currentExam.is_required,
                              randomize_questions: currentExam.randomize_questions,
                              show_results: currentExam.show_results,
                              course_id: currentExam.course_id || '',
                              lesson_id: currentExam.lesson_id || ''
                            });
                            if (currentExam.course_id) {
                              await fetchAvailableLessons(currentExam.course_id);
                            }
                            setEditingExamId(exam.id);
                          }}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-purple-100 transition-colors group"
                          title="Edit Exam Details"
                        >
                          <Edit size={14} className="text-gray-400 group-hover:text-purple-700 transition-colors" strokeWidth={2} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExamToDelete(exam);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete exam"
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
          {selectedExam && (
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Exam Builder</h1>
                  <p className="text-sm text-gray-500 mt-1">Create and manage your exams</p>
                </div>
                <div className="flex items-center gap-3">
                  {hasUnsavedChanges && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
                    </div>
                  )}
                  <button
                    onClick={handleSaveExam}
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
                  {selectedExam.status === 'draft' && (
                    <button
                      onClick={handlePublishExam}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before publishing' : 'Publish exam'}
                    >
                      <Send size={16} />
                      Publish
                    </button>
                  )}
                  {selectedExam.status === 'published' && (
                    <button
                      onClick={handleUnpublishExam}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before unpublishing' : 'Unpublish exam'}
                    >
                      <XCircle size={16} />
                      Unpublish
                    </button>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedExam ? (
              <div className="max-w-4xl mx-auto">
                {/* Exam Info */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-6 bg-gradient-to-br from-white to-gray-50/50">
                  <textarea
                    ref={titleTextareaRef}
                    value={examForm.title}
                    onChange={(e) => {
                      setExamForm({ ...examForm, title: e.target.value });
                      setHasUnsavedChanges(true);
                      // Auto-resize
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.max(target.scrollHeight, 48) + 'px';
                    }}
                    className="text-2xl font-bold bg-transparent text-gray-900 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 resize-none transition-all"
                    placeholder="Exam Title"
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
                    value={examForm.description}
                    onChange={(e) => {
                      setExamForm({ ...examForm, description: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Exam description..."
                    className="w-full text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 resize-none transition-all leading-relaxed"
                    rows={3}
                  />
                  <div className="mt-4 grid grid-cols-3 gap-x-8 gap-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize shadow-sm ${
                        selectedExam.status === 'published'
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : selectedExam.status === 'archived'
                          ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700'
                          : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700'
                      }`}>
                        {selectedExam.status === 'published' ? 'Published' : selectedExam.status === 'archived' ? 'Archived' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Passing Score</span>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                        {examForm.passing_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Limit</span>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold shadow-sm">
                        {examForm.time_limit_minutes ? `${examForm.time_limit_minutes} min` : 'No limit'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Attempts</span>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 rounded-lg text-sm font-semibold shadow-sm">
                        {examForm.max_attempts}
                      </span>
                    </div>
                    {examForm.course_id && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-lg text-sm font-medium shadow-sm max-w-xs truncate">
                          {(() => {
                            const course = availableCourses.find(c => c.id === examForm.course_id);
                            return course?.title || 'Unknown Course';
                          })()}
                        </span>
                      </div>
                    )}
                    {examForm.lesson_id && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 rounded-lg text-sm font-medium shadow-sm max-w-xs truncate">
                          {(() => {
                            const lesson = availableLessons.find(l => l.id === examForm.lesson_id);
                            return lesson ? `${lesson.module_title}: ${lesson.title}` : 'Unknown Lesson';
                          })()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</span>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                        examForm.is_required
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                      }`}>
                        {examForm.is_required ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Randomize</span>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                        examForm.randomize_questions
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                      }`}>
                        {examForm.randomize_questions ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Show Results</span>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                        examForm.show_results
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
                      }`}>
                        {examForm.show_results ? 'Yes' : 'No'}
                      </span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exam selected</h3>
              <p className="text-gray-500 mb-6">Select an exam from the sidebar or create a new one</p>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  fetchAvailableCourses();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Create Exam
              </button>
            </div>
          )}
        </main>
        </div>
        </div>
      </div>

      {/* Create Exam Modal (deprecated, kept for reference but not used) */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Exam</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetExamForm();
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
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Exam title"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Exam description"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={examForm.status}
                  onChange={(e) => setExamForm({ ...examForm, status: e.target.value as Exam['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examForm.passing_score}
                    onChange={(e) => setExamForm({ ...examForm, passing_score: parseFloat(e.target.value) || 70 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    value={examForm.time_limit_minutes || ''}
                    onChange={(e) => setExamForm({ ...examForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
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
                    value={examForm.max_attempts}
                    onChange={(e) => setExamForm({ ...examForm, max_attempts: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course (Optional)</label>
                  <select
                    value={examForm.course_id}
                    onChange={async (e) => {
                      const courseId = e.target.value;
                      setExamForm({ ...examForm, course_id: courseId, lesson_id: '' });
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
                    value={examForm.lesson_id}
                    onChange={(e) => setExamForm({ ...examForm, lesson_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={saving || !examForm.course_id}
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
                    checked={examForm.is_required}
                    onChange={(e) => setExamForm({ ...examForm, is_required: e.target.checked })}
                    className="rounded"
                    disabled={saving}
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={examForm.randomize_questions}
                    onChange={(e) => setExamForm({ ...examForm, randomize_questions: e.target.checked })}
                    className="rounded"
                    disabled={saving}
                  />
                  Randomize Questions
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={examForm.show_results}
                    onChange={(e) => setExamForm({ ...examForm, show_results: e.target.checked })}
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
                    resetExamForm();
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  disabled={saving || !examForm.title.trim()}
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
                      Create Exam
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Exam Modal */}
      {showDeleteModal && examToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Exam</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{examToDelete.title}"</span>?
              </p>
              {examToDelete.attempt_count && examToDelete.attempt_count > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This exam has <span className="font-semibold">{examToDelete.attempt_count} attempt{examToDelete.attempt_count !== 1 ? 's' : ''}</span>.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The exam and all its questions will be permanently deleted.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setExamToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExam}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Exam
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
                          {(() => {
                            // Handle both string and object formats
                            const oldData = typeof entry.old_data === 'string' 
                              ? JSON.parse(entry.old_data) 
                              : entry.old_data;
                            const newData = typeof entry.new_data === 'string' 
                              ? JSON.parse(entry.new_data) 
                              : entry.new_data;
                            
                            return Object.keys(newData).map((key) => {
                              const oldVal = oldData[key];
                              const newVal = newData[key];
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
                            });
                          })()}
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
    </>
  );
}
