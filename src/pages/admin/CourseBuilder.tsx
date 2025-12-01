import { useState, useEffect, useRef } from 'react';
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
  Users,
  AlertCircle,
  Upload,
  Search,
  Filter,
  XCircle,
  ArrowUpDown,
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
  FileQuestion,
  Bell,
  Gift,
  Coffee,
  Utensils,
  Smile,
  ThumbsUp,
  Tag
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { ContentLibrarySelector } from '../../components/ContentLibrarySelector';
import { AssignmentSelector } from '../../components/AssignmentSelector';
import { AssessmentSelector } from '../../components/AssessmentSelector';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'text' | 'document' | 'quiz' | 'assignment' | 'assessment' | 'live_session';
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
  created_at?: string;
  updated_at?: string;
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
  const [showAssignmentSelector, setShowAssignmentSelector] = useState(false);
  const [selectedLessonForAssignment, setSelectedLessonForAssignment] = useState<string | null>(null);
  const [showAssessmentSelector, setShowAssessmentSelector] = useState(false);
  const [selectedLessonForAssessment, setSelectedLessonForAssessment] = useState<string | null>(null);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<{ moduleId: string; moduleTitle: string } | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{ lessonId: string; lessonTitle: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalCourse, setOriginalCourse] = useState<Course | null>(null);
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const [uploadingFile, setUploadingFile] = useState<{ lessonId: string } | null>(null);
  const [searchInput, setSearchInput] = useState(''); // What user types
  const [searchQuery, setSearchQuery] = useState(''); // Active search query (only set when Search is clicked)
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'date-newest' | 'date-oldest' | 'modified-newest' | 'modified-oldest' | 'status' | 'modules-asc' | 'modules-desc' | 'difficulty'>('title-asc');
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [newCourseCategoryId, setNewCourseCategoryId] = useState<string>('');
  const [newCourseTags, setNewCourseTags] = useState<Set<string>>(new Set());
  const [courseCategoryId, setCourseCategoryId] = useState<string>('');
  const [courseTags, setCourseTags] = useState<Set<string>>(new Set());
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editCourseCategoryId, setEditCourseCategoryId] = useState<string>('');
  const [editCourseTags, setEditCourseTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchTags();
  }, [statusFilter, difficultyFilter]);

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

  // Icon mapping function for categories (same as in Categories.tsx)
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

  // Sort courses when sortBy changes (without re-fetching)
  useEffect(() => {
    if (courses.length > 0) {
      const sorted = sortCourses([...courses], sortBy);
      // Check if order actually changed to prevent unnecessary updates
      const currentIds = courses.map(c => c.id).join(',');
      const sortedIds = sorted.map(c => c.id).join(',');
      if (currentIds !== sortedIds) {
        setCourses(sorted);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Resize title textarea when selectedCourse changes
  useEffect(() => {
    if (titleTextareaRef.current && selectedCourse?.title) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (titleTextareaRef.current) {
          titleTextareaRef.current.style.height = 'auto';
          titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [selectedCourse?.title, selectedCourse?.id]);

  const fetchCourses = async (searchOverride?: string) => {
    try {
      setLoading(true);
      const activeSearchQuery = searchOverride !== undefined ? searchOverride : searchQuery;
      const data = await api.getCourses(1, 100, activeSearchQuery, statusFilter !== 'all' ? statusFilter : 'all');
      
      console.log('Courses API response:', data);
      
      // Filter by difficulty if needed (since API doesn't support difficulty filter yet, we'll filter client-side)
      let filteredCourses = data.courses || [];
      if (difficultyFilter !== 'all') {
        filteredCourses = filteredCourses.filter((course: any) => course.difficulty_level === difficultyFilter);
      }
      
      // Don't fetch full course details for each course - just use the list data
      // Full details will be fetched when a course is selected
      const coursesWithEmptyModules = filteredCourses.map((course: any) => ({
        ...course,
        modules: course.modules || []
      }));
      
      // Sort courses
      const sortedCourses = sortCourses(coursesWithEmptyModules, sortBy);
      console.log('Sorted courses:', sortedCourses);
      setCourses(sortedCourses);
      
      // If current selected course is not in filtered results, clear selection
      if (selectedCourse && !sortedCourses.find((c: any) => c.id === selectedCourse.id)) {
        setSelectedCourse(null);
        setLocalModules([]);
        setHasUnsavedChanges(false);
      }
      
      // Don't auto-select first course - let user select manually
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      showError(err.message || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const sortCourses = (courses: Course[], sortOption: typeof sortBy): Course[] => {
    const sorted = [...courses];
    
    switch (sortOption) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'date-newest':
        return sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (dateA === 0 && dateB === 0) return 0;
          if (dateA === 0) return 1; // Put items without dates at the end
          if (dateB === 0) return -1;
          return dateB - dateA;
        });
      case 'date-oldest':
        return sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (dateA === 0 && dateB === 0) return 0;
          if (dateA === 0) return 1; // Put items without dates at the end
          if (dateB === 0) return -1;
          return dateA - dateB;
        });
      case 'modified-newest':
        return sorted.sort((a, b) => {
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
          if (dateA === 0 && dateB === 0) return 0;
          if (dateA === 0) return 1; // Put items without dates at the end
          if (dateB === 0) return -1;
          return dateB - dateA;
        });
      case 'modified-oldest':
        return sorted.sort((a, b) => {
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
          if (dateA === 0 && dateB === 0) return 0;
          if (dateA === 0) return 1; // Put items without dates at the end
          if (dateB === 0) return -1;
          return dateA - dateB;
        });
      case 'status':
        return sorted.sort((a, b) => {
          const statusOrder = { 'published': 1, 'draft': 2, 'archived': 3 };
          return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        });
      case 'modules-asc':
        return sorted.sort((a, b) => (a.modules?.length || 0) - (b.modules?.length || 0));
      case 'modules-desc':
        return sorted.sort((a, b) => (b.modules?.length || 0) - (a.modules?.length || 0));
      case 'difficulty':
        return sorted.sort((a, b) => {
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return (difficultyOrder[a.difficulty_level] || 99) - (difficultyOrder[b.difficulty_level] || 99);
        });
      default:
        return sorted;
    }
  };

  const fetchCourse = async (courseId: string) => {
    try {
      const course = await api.getCourse(courseId);
      setSelectedCourse(course);
      setOriginalCourse(JSON.parse(JSON.stringify(course))); // Deep copy for comparison
      setLocalModules(course.modules || []);
      setHasUnsavedChanges(false);
      setCourses(courses.map(c => c.id === courseId ? course : c));
      // Set category and tags for editing
      setCourseCategoryId(course.category_id || '');
      // Load course tags
      if (course.tags && Array.isArray(course.tags)) {
        setCourseTags(new Set(course.tags.map((tag: any) => tag.id)));
      } else {
        setCourseTags(new Set());
      }
      // Resize title textarea after course is loaded
      setTimeout(() => {
        if (titleTextareaRef.current) {
          titleTextareaRef.current.style.height = 'auto';
          titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
        }
      }, 100);
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
        category_id: newCourseCategoryId || null,
        status: 'draft',
        tags: Array.from(newCourseTags)
      });
      showSuccess('Course created successfully!');
      setNewCourseTitle('');
      setNewCourseDescription('');
      setNewCourseCategoryId('');
      setNewCourseTags(new Set());
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
      
      // Save course metadata
      await api.updateCourse(selectedCourse.id, {
        title: selectedCourse.title,
        description: selectedCourse.description,
        short_description: selectedCourse.short_description,
        status: selectedCourse.status,
        difficulty_level: selectedCourse.difficulty_level,
        category_id: courseCategoryId || null,
        tags: Array.from(courseTags)
      });

      // Save all modules (create new ones, update existing ones)
      for (let i = 0; i < localModules.length; i++) {
        const module = localModules[i];
        
        if (module.id.startsWith('temp-')) {
          // Create new module
          const newModule = await api.createModule(selectedCourse.id, {
            title: module.title,
            description: module.description,
            is_required: module.is_required
          });
          
          // Replace temp ID with real ID in local state
          const updatedModules = [...localModules];
          updatedModules[i] = { ...newModule, lessons: module.lessons || [] };
          setLocalModules(updatedModules);
          
          // Update selected course
          setSelectedCourse({
            ...selectedCourse,
            modules: updatedModules
          });
        } else {
          // Update existing module
          await api.updateModule(module.id, {
            title: module.title,
            description: module.description,
            is_required: module.is_required
          });
        }

        // Save lessons for this module
        if (module.lessons && module.lessons.length > 0) {
          const moduleId = module.id.startsWith('temp-') 
            ? localModules.find(m => m.title === module.title && !m.id.startsWith('temp-'))?.id || module.id
            : module.id;

          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            
            if (lesson.id.startsWith('temp-')) {
              // Create new lesson
              const newLesson = await api.createLesson(moduleId, {
                title: lesson.title,
                description: lesson.description,
                content_type: lesson.content_type,
                content_text: lesson.content_text,
                content_url: lesson.content_url,
                duration_minutes: lesson.duration_minutes,
                is_required: lesson.is_required,
                is_preview: lesson.is_preview
              });
              
              // Replace temp ID with real ID
              const updatedModules = [...localModules];
              if (updatedModules[i].lessons) {
                updatedModules[i].lessons = updatedModules[i].lessons.map(l =>
                  l.id === lesson.id ? newLesson : l
                );
              }
              setLocalModules(updatedModules);
              setSelectedCourse({
                ...selectedCourse,
                modules: updatedModules
              });
            } else {
              // Update existing lesson
              await api.updateLesson(lesson.id, {
                title: lesson.title,
                description: lesson.description,
                content_type: lesson.content_type,
                content_text: lesson.content_text,
                content_url: lesson.content_url,
                duration_minutes: lesson.duration_minutes,
                is_required: lesson.is_required,
                is_preview: lesson.is_preview
              });
            }
          }
        }
      }

      // Save module and lesson orders
      if (localModules.length > 0) {
        const moduleOrders = localModules
          .filter(m => !m.id.startsWith('temp-'))
          .map((module, index) => ({
            id: module.id,
            order_index: index
          }));
        
        if (moduleOrders.length > 0) {
          await api.reorderModules(selectedCourse.id, moduleOrders);
        }

        // Save lesson orders for each module
        for (const module of localModules.filter(m => !m.id.startsWith('temp-'))) {
          if (module.lessons && module.lessons.length > 0) {
            const lessonOrders = module.lessons
              .filter(l => !l.id.startsWith('temp-'))
              .map((lesson, index) => ({
                id: lesson.id,
                order_index: index
              }));
            
            if (lessonOrders.length > 0) {
              await api.reorderLessons(module.id, lessonOrders);
            }
          }
        }
      }

      showSuccess('Course saved successfully!');
      await fetchCourse(selectedCourse.id);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      showError(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      await api.updateCourse(selectedCourse.id, {
        status: 'published'
      });
      showSuccess('Course published successfully!');
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to publish course');
    } finally {
      setSaving(false);
    }
  };

  const unpublishCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      await api.updateCourse(selectedCourse.id, {
        status: 'draft'
      });
      showSuccess('Course unpublished successfully!');
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to unpublish course');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await api.deleteCourse(courseToDelete.id);
      showSuccess('Course deleted successfully!');
      if (selectedCourse?.id === courseToDelete.id) {
        setSelectedCourse(null);
      }
      setShowDeleteCourseModal(false);
      setCourseToDelete(null);
      await fetchCourses();
    } catch (err: any) {
      showError(err.message || 'Failed to delete course');
    }
  };

  const handleDeleteCourseClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteCourseModal(true);
  };

  const addModule = () => {
    if (!selectedCourse) return;

    // Add module locally without saving to backend
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: 'New Module',
      description: null,
      order_index: localModules.length,
      is_required: true,
      lessons: []
    };

    const updatedModules = [...localModules, newModule];
    setLocalModules(updatedModules);
    
    // Update selected course with new module
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });

    setHasUnsavedChanges(true);
    setExpandedModules(new Set([...expandedModules, newModule.id]));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    if (!selectedCourse) return;

    // Update module locally
    const updatedModules = localModules.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    );

    setLocalModules(updatedModules);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });

    setHasUnsavedChanges(true);
  };

  const deleteModule = async () => {
    if (!moduleToDelete) return;

    try {
      await api.deleteModule(moduleToDelete.moduleId);
      showSuccess('Module deleted successfully!');
      setShowDeleteModuleModal(false);
      setModuleToDelete(null);
      if (selectedCourse) {
        await fetchCourse(selectedCourse.id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete module');
    }
  };

  const handleDeleteModuleClick = (moduleId: string, moduleTitle: string) => {
    setModuleToDelete({ moduleId, moduleTitle });
    setShowDeleteModuleModal(true);
  };

  const addLesson = (moduleId: string) => {
    if (!selectedCourse) return;

    // Find the module
    const moduleIndex = localModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;

    // Add lesson locally
    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: 'New Lesson',
      description: null,
      content_type: 'text',
      content_text: null,
      content_url: null,
      duration_minutes: 0,
      order_index: localModules[moduleIndex].lessons?.length || 0,
      is_required: true,
      is_preview: false
    };

    const updatedModules = [...localModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: [...(updatedModules[moduleIndex].lessons || []), newLesson]
    };

    setLocalModules(updatedModules);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });

    setHasUnsavedChanges(true);
    setExpandedLessons(new Set([...expandedLessons, newLesson.id]));
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    if (!selectedCourse) return;

    // Update lesson locally
    const updatedModules = localModules.map(module => {
      if (module.lessons) {
        const updatedLessons = module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        );
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });

    setLocalModules(updatedModules);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });

    setHasUnsavedChanges(true);
  };

  const deleteLesson = async () => {
    if (!lessonToDelete || !selectedCourse) return;

    const lessonId = lessonToDelete.lessonId;

    // If it's a temporary lesson (not saved yet), just remove it locally
    if (lessonId.startsWith('temp-')) {
      const updatedModules = localModules.map(module => {
        if (module.lessons) {
          return {
            ...module,
            lessons: module.lessons.filter(l => l.id !== lessonId)
          };
        }
        return module;
      });

      setLocalModules(updatedModules);
      setSelectedCourse({
        ...selectedCourse,
        modules: updatedModules
      });
      setShowDeleteLessonModal(false);
      setLessonToDelete(null);
      setHasUnsavedChanges(true);
      return;
    }

    // Otherwise, delete from backend
    try {
      await api.deleteLesson(lessonId);
      showSuccess('Lesson deleted successfully!');
      setShowDeleteLessonModal(false);
      setLessonToDelete(null);
      await fetchCourse(selectedCourse.id);
    } catch (err: any) {
      showError(err.message || 'Failed to delete lesson');
    }
  };

  const handleDeleteLessonClick = (lessonId: string, lessonTitle: string) => {
    setLessonToDelete({ lessonId, lessonTitle });
    setShowDeleteLessonModal(true);
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
      case 'assessment':
        return <FileQuestion size={16} className="text-indigo-600" />;
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

  const handleAssignmentSelect = (assignment: any) => {
    if (!selectedLessonForAssignment || !selectedCourse) return;

    const assignmentUrl = `assignment:${assignment.id}`;
    updateLesson(selectedLessonForAssignment, { content_url: assignmentUrl });
    setShowAssignmentSelector(false);
    setSelectedLessonForAssignment(null);
  };

  const openAssignmentSelector = (lessonId: string) => {
    setSelectedLessonForAssignment(lessonId);
    setShowAssignmentSelector(true);
  };


  const handleAssessmentSelect = (assessment: any) => {
    if (!selectedLessonForAssessment || !selectedCourse) return;

    const assessmentUrl = `assessment:${assessment.id}`;
    updateLesson(selectedLessonForAssessment, { content_url: assessmentUrl });
    setShowAssessmentSelector(false);
    setSelectedLessonForAssessment(null);
  };

  const openAssessmentSelector = (lessonId: string) => {
    setSelectedLessonForAssessment(lessonId);
    setShowAssessmentSelector(true);
  };

  const handleFileUpload = async (lessonId: string, file: File) => {
    if (!selectedCourse) return;

    try {
      setUploadingFile({ lessonId });
      
      // Use filename as title
      const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      const description = `Uploaded for lesson in course: ${selectedCourse.title}`;

      // Upload to content library
      const response = await api.uploadContent(file, filenameWithoutExt, description, null, false);
      
      if (response.content && response.content.id) {
        // Automatically link the uploaded content to the lesson
        const contentUrl = `content-library:${response.content.id}`;
        updateLesson(lessonId, { content_url: contentUrl });
        showSuccess(`File uploaded and linked to lesson successfully!`);
      } else {
        showError('File uploaded but failed to link to lesson');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to upload file');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleModuleDrop = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    if (!draggedModule || !selectedCourse || draggedModule === targetModuleId) {
      setDraggedModule(null);
      return;
    }

    const modules = [...localModules];
    const draggedIndex = modules.findIndex(m => m.id === draggedModule);
    const targetIndex = modules.findIndex(m => m.id === targetModuleId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedModule(null);
      return;
    }

    // Reorder modules locally
    const [dragged] = modules.splice(draggedIndex, 1);
    modules.splice(targetIndex, 0, dragged);

    // Update order_index
    const reorderedModules = modules.map((module, index) => ({
      ...module,
      order_index: index
    }));

    setLocalModules(reorderedModules);
    setSelectedCourse({
      ...selectedCourse,
      modules: reorderedModules
    });

    setHasUnsavedChanges(true);
    setDraggedModule(null);
  };

  const handleLessonDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    setDraggedLesson({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleLessonDrop = (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!draggedLesson || !selectedCourse || 
        (draggedLesson.moduleId === targetModuleId && draggedLesson.lessonId === targetLessonId)) {
      setDraggedLesson(null);
      return;
    }

    const moduleIndex = localModules.findIndex(m => m.id === targetModuleId);
    if (moduleIndex === -1) {
      setDraggedLesson(null);
      return;
    }

    const module = localModules[moduleIndex];
    const lessons = [...(module.lessons || [])];
    const draggedIndex = lessons.findIndex(l => l.id === draggedLesson.lessonId);
    const targetIndex = lessons.findIndex(l => l.id === targetLessonId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedLesson(null);
      return;
    }

    // Reorder lessons locally
    const [dragged] = lessons.splice(draggedIndex, 1);
    lessons.splice(targetIndex, 0, dragged);

    // Update order_index
    const reorderedLessons = lessons.map((lesson, index) => ({
      ...lesson,
      order_index: index
    }));

    const updatedModules = [...localModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: reorderedLessons
    };

    setLocalModules(updatedModules);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });

    setHasUnsavedChanges(true);
    setDraggedLesson(null);
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

  const isModalOpen = showContentSelector || showDeleteCourseModal || showDeleteModuleModal || showDeleteLessonModal;

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
                <>
                  {hasUnsavedChanges && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
                    </div>
                  )}
                  <button
                    onClick={saveCourse}
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
                  {selectedCourse.status === 'draft' && (
                    <button
                      onClick={publishCourse}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before publishing' : 'Publish course'}
                    >
                      Publish
                    </button>
                  )}
                  {selectedCourse.status === 'published' && (
                    <button
                      onClick={unpublishCourse}
                      disabled={saving || hasUnsavedChanges}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasUnsavedChanges ? 'Save changes before unpublishing' : 'Unpublish course'}
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
          {/* Sidebar - Course List */}
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col relative">
            <div className="p-4 flex-1 overflow-y-auto">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">My Courses</h2>
              
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
                          fetchCourses();
                        }
                      }}
                      placeholder="Search courses..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery(searchInput);
                      fetchCourses();
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Search size={16} />
                    Search
                  </button>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchInput('');
                        setSearchQuery('');
                        fetchCourses(''); // Pass empty string to clear search immediately
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
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Filter size={14} />
                  <span>Filters</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as typeof difficultyFilter)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                >
                  <option value="all">All Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {(statusFilter !== 'all' || difficultyFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setDifficultyFilter('all');
                      fetchCourses();
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
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <ArrowUpDown size={14} />
                  <span>Sort By</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                >
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="date-newest">Date Created (Newest)</option>
                  <option value="date-oldest">Date Created (Oldest)</option>
                  <option value="modified-newest">Last Modified (Newest)</option>
                  <option value="modified-oldest">Last Modified (Oldest)</option>
                  <option value="status">Status</option>
                  <option value="modules-desc">Modules (Most)</option>
                  <option value="modules-asc">Modules (Least)</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
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
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newCourseCategoryId}
                      onChange={(e) => setNewCourseCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">No Category</option>
                      {categories.filter(cat => !cat.parent_id).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
                      {tags.length === 0 ? (
                        <span className="text-xs text-gray-500">No tags available. Create tags in Categories & Tags page.</span>
                      ) : (
                        tags.map((tag) => {
                          const isSelected = newCourseTags.has(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => {
                                const newTags = new Set(newCourseTags);
                                if (isSelected) {
                                  newTags.delete(tag.id);
                                } else {
                                  newTags.add(tag.id);
                                }
                                setNewCourseTags(newTags);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-md hover:from-purple-700 hover:to-green-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                              }`}
                            >
                              {tag.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
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
      setNewCourseCategoryId('');
      setNewCourseTags(new Set());
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Edit Course Form */}
              {editingCourseId && (() => {
                const courseToEdit = courses.find(c => c.id === editingCourseId);
                if (!courseToEdit) return null;
                return (
                  <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                    <input
                      type="text"
                      placeholder="Course Title *"
                      value={editCourseTitle}
                      onChange={(e) => setEditCourseTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={editCourseDescription}
                      onChange={(e) => setEditCourseDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                    />
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editCourseCategoryId}
                        onChange={(e) => setEditCourseCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">No Category</option>
                        {categories.filter(cat => !cat.parent_id).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
                        {tags.length === 0 ? (
                          <span className="text-xs text-gray-500">No tags available. Create tags in Categories & Tags page.</span>
                        ) : (
                          tags.map((tag) => {
                            const isSelected = editCourseTags.has(tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => {
                                  const newTags = new Set(editCourseTags);
                                  if (isSelected) {
                                    newTags.delete(tag.id);
                                  } else {
                                    newTags.add(tag.id);
                                  }
                                  setEditCourseTags(newTags);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-md hover:from-purple-700 hover:to-green-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                }`}
                              >
                                {tag.name}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!editCourseTitle.trim()) {
                            showError('Course title is required');
                            return;
                          }

                          try {
                            setSaving(true);
                            
                            // Update course details
                            await api.updateCourse(editingCourseId, {
                              title: editCourseTitle.trim(),
                              description: editCourseDescription.trim() || null,
                              category_id: editCourseCategoryId || null,
                              tags: Array.from(editCourseTags)
                            });

                            // Update local state
                            if (selectedCourse?.id === editingCourseId) {
                              setSelectedCourse({
                                ...selectedCourse,
                                title: editCourseTitle.trim(),
                                description: editCourseDescription.trim() || null,
                              });
                            }
                            setCourseCategoryId(editCourseCategoryId);
                            setCourseTags(new Set(editCourseTags));
                            
                            showSuccess('Course details updated successfully!');
                            setEditingCourseId(null);
                            
                            // Refresh courses list
                            await fetchCourses();
                          } catch (err: any) {
                            showError(err.message || 'Failed to update course details');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving || !editCourseTitle.trim()}
                        className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCourseId(null);
                          setEditCourseTitle('');
                          setEditCourseDescription('');
                          setEditCourseCategoryId('');
                          setEditCourseTags(new Set());
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
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg transition-colors cursor-pointer border-2 ${
                      selectedCourse?.id === course.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => fetchCourse(course.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{course.title}</div>
                        <div className="text-xs text-gray-500">
                          {course.modules?.length || 0} modules • {course.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            // If course is not selected, fetch it first to get full details
                            if (selectedCourse?.id !== course.id) {
                              await fetchCourse(course.id);
                            }
                            // Use current course data
                            const currentCourse = selectedCourse?.id === course.id ? selectedCourse : course;
                            setEditCourseTitle(currentCourse.title);
                            setEditCourseDescription(currentCourse.description || '');
                            setEditCourseCategoryId(courseCategoryId || currentCourse.category_id || '');
                            setEditCourseTags(new Set(courseTags));
                            setEditingCourseId(course.id);
                          }}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-purple-100 transition-colors group"
                          title="Edit Course Details"
                        >
                          <Edit size={14} className="text-gray-400 group-hover:text-purple-700 transition-colors" strokeWidth={2} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourseClick(course);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && !isCreatingCourse && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all' 
                      ? (() => {
                          const parts = [];
                          if (searchQuery) parts.push(`search "${searchQuery}"`);
                          if (statusFilter !== 'all') parts.push(`status filter`);
                          if (difficultyFilter !== 'all') parts.push(`difficulty filter`);
                          const filterText = parts.length > 1 
                            ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
                            : parts[0];
                          return `No courses match your ${filterText}. Try adjusting your search or filters, or clear them to see all courses.`;
                        })()
                      : 'No courses yet. Create your first course!'}
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
                  <textarea
                    ref={titleTextareaRef}
                    value={selectedCourse.title}
                    onChange={(e) => {
                      setSelectedCourse({ ...selectedCourse, title: e.target.value });
                      setHasUnsavedChanges(true);
                      // Auto-resize
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.max(target.scrollHeight, 48) + 'px';
                    }}
                    className="text-xl font-bold text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    placeholder="Course Title"
                    style={{ 
                      minHeight: '3rem',
                      lineHeight: '1.5',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                      overflow: 'hidden',
                      height: 'auto'
                    }}
                  />
                  <textarea
                    value={selectedCourse.description || ''}
                    onChange={(e) => {
                      setSelectedCourse({ ...selectedCourse, description: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Course description..."
                    className="w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    rows={3}
                  />
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Status</label>
                      <select
                        value={selectedCourse.status}
                        onChange={(e) => {
                          setSelectedCourse({ ...selectedCourse, status: e.target.value as Course['status'] });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Difficulty Level</label>
                      <select
                        value={selectedCourse.difficulty_level}
                        onChange={(e) => {
                          setSelectedCourse({ ...selectedCourse, difficulty_level: e.target.value as Course['difficulty_level'] });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs text-gray-600 mb-1">Category</label>
                    {courseCategoryId ? (
                      <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {(() => {
                          const selectedCategory = categories.find(cat => cat.id === courseCategoryId);
                          if (selectedCategory) {
                            return (
                              <>
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: (selectedCategory.color || '#3B82F6') + '20' }}
                                >
                                  {getCategoryIcon(selectedCategory.icon, selectedCategory.color)}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{selectedCategory.name}</div>
                                  {selectedCategory.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">{selectedCategory.description}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setCourseCategoryId('');
                                    setHasUnsavedChanges(true);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove category"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : (
                      <select
                        value={courseCategoryId}
                        onChange={(e) => {
                          setCourseCategoryId(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Category</option>
                        {categories.filter(cat => !cat.parent_id).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs text-gray-600 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[48px]">
                      {courseTags.size > 0 ? (
                        Array.from(courseTags).map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <div
                              key={tag.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-md flex items-center gap-2"
                            >
                              <span>{tag.name}</span>
                              <button
                                onClick={() => {
                                  const newTags = new Set(courseTags);
                                  newTags.delete(tag.id);
                                  setCourseTags(newTags);
                                  setHasUnsavedChanges(true);
                                }}
                                className="hover:bg-white/20 rounded p-0.5 transition-colors"
                                title="Remove tag"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-400 italic">No tags applied</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Modules</h2>
                    <button
                      onClick={addModule}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Module
                    </button>
                  </div>
                  <div className="p-6">
                    {localModules.length === 0 ? (
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
                        {localModules.map((module) => (
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
                                  className="flex-1 text-sm font-medium text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
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
                                onClick={() => handleDeleteModuleClick(module.id, module.title)}
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
                                            <span className="text-sm font-medium text-gray-700 break-words">{lesson.title}</span>
                                            {lesson.duration_minutes > 0 && (
                                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {lesson.duration_minutes} min
                                              </span>
                                            )}
                                          </button>
                                          <button
                                            onClick={() => handleDeleteLessonClick(lesson.id, lesson.title)}
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
                                              <option value="assessment">Assessment</option>
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
                                            {lesson.content_type === 'assignment' && (
                                              <div className="space-y-2">
                                                <div className="flex gap-2">
                                                  <input
                                                    type="text"
                                                    value={lesson.content_url?.startsWith('assignment:') 
                                                      ? `Assignment: ${lesson.content_url.replace('assignment:', '')}`
                                                      : ''}
                                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                    placeholder="No assignment selected"
                                                    readOnly
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => openAssignmentSelector(lesson.id)}
                                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors whitespace-nowrap"
                                                  >
                                                    Select Assignment
                                                  </button>
                                                  {lesson.content_url?.startsWith('assignment:') && (
                                                    <button
                                                      type="button"
                                                      onClick={() => updateLesson(lesson.id, { content_url: null })}
                                                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                                                      title="Clear assignment selection"
                                                    >
                                                      <X size={14} />
                                                    </button>
                                                  )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                  Select an assignment from your assignments library to link to this lesson
                                                </p>
                                              </div>
                                            )}
                                            {lesson.content_type === 'assessment' && (
                                              <div className="space-y-2">
                                                <div className="flex gap-2">
                                                  <input
                                                    type="text"
                                                    value={lesson.content_url?.startsWith('assessment:')
                                                      ? `Assessment: ${lesson.content_url.replace('assessment:', '')}`
                                                      : ''}
                                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                    placeholder="No assessment selected"
                                                    readOnly
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => openAssessmentSelector(lesson.id)}
                                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors whitespace-nowrap"
                                                  >
                                                    Select Assessment
                                                  </button>
                                                  {lesson.content_url?.startsWith('assessment:') && (
                                                    <button
                                                      type="button"
                                                      onClick={() => updateLesson(lesson.id, { content_url: null })}
                                                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                                                      title="Clear assessment selection"
                                                    >
                                                      <X size={14} />
                                                    </button>
                                                  )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                  Link an existing assessment (quiz/exam) to this lesson
                                                </p>
                                              </div>
                                            )}
                                            {(lesson.content_type === 'video' || lesson.content_type === 'document') && (
                                              <div className="space-y-2">
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
                                                  <label className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2">
                                                    <Upload size={14} />
                                                    Upload File
                                                    <input
                                                      type="file"
                                                      className="hidden"
                                                      onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                          handleFileUpload(lesson.id, file);
                                                        }
                                                        // Reset input so same file can be selected again
                                                        e.target.value = '';
                                                      }}
                                                      disabled={uploadingFile?.lessonId === lesson.id}
                                                      accept={lesson.content_type === 'video' ? 'video/*' : lesson.content_type === 'document' ? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md' : '*'}
                                                    />
                                                  </label>
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
                                                {uploadingFile?.lessonId === lesson.id && (
                                                  <div className="flex items-center gap-2 text-xs text-purple-600">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span>Uploading file to content library...</span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            <div className="flex items-center gap-4">
                                              <div className="flex items-center gap-2">
                                                <label className="text-xs text-gray-600 whitespace-nowrap">Duration (min):</label>
                                                <input
                                                  type="number"
                                                  value={lesson.duration_minutes}
                                                  onChange={(e) => updateLesson(lesson.id, { duration_minutes: parseInt(e.target.value) || 0 })}
                                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                  placeholder="0"
                                                  min="0"
                                                />
                                              </div>
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

      {/* Assignment Selector Modal */}
      {showAssignmentSelector && selectedLessonForAssignment && selectedCourse && (
        <AssignmentSelector
          isOpen={showAssignmentSelector}
          onClose={() => {
            setShowAssignmentSelector(false);
            setSelectedLessonForAssignment(null);
          }}
          onSelect={handleAssignmentSelect}
          courseId={selectedCourse.id}
          lessonId={selectedLessonForAssignment}
          title="Select Assignment"
        />
      )}

      {/* Assessment Selector Modal */}
      {showAssessmentSelector && selectedLessonForAssessment && selectedCourse && (
        <AssessmentSelector
          isOpen={showAssessmentSelector}
          onClose={() => {
            setShowAssessmentSelector(false);
            setSelectedLessonForAssessment(null);
          }}
          onSelect={handleAssessmentSelect}
          courseId={selectedCourse.id}
          lessonId={selectedLessonForAssessment}
          title="Select Assessment"
        />
      )}

      {/* Delete Course Modal */}
      {showDeleteCourseModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600">Delete Course</h2>
              <button
                onClick={() => {
                  setShowDeleteCourseModal(false);
                  setCourseToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to delete this course? This action cannot be undone.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{courseToDelete.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {courseToDelete.modules?.length || 0} modules • {courseToDelete.status}
                    </p>
                  </div>
                </div>
              </div>
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
                onClick={deleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Module Modal */}
      {showDeleteModuleModal && moduleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600">Delete Module</h2>
              <button
                onClick={() => {
                  setShowDeleteModuleModal(false);
                  setModuleToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to delete this module? All lessons in this module will also be deleted. This action cannot be undone.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{moduleToDelete.moduleTitle}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModuleModal(false);
                  setModuleToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteModule}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lesson Modal */}
      {showDeleteLessonModal && lessonToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600">Delete Lesson</h2>
              <button
                onClick={() => {
                  setShowDeleteLessonModal(false);
                  setLessonToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to delete this lesson? This action cannot be undone.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{lessonToDelete.lessonTitle}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteLessonModal(false);
                  setLessonToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteLesson}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
