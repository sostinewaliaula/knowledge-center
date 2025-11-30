import { useState, useEffect } from 'react';
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
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Loader2
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
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

  // Available courses and lessons
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);

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
      setShowCreateModal(false);
      resetForm();
      await fetchAssignments();
    } catch (err: any) {
      showError(err.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  // Update assignment
  const handleUpdateAssignment = async () => {
    if (!editingAssignment || !assignmentForm.title.trim()) {
      showError('Assignment title is required');
      return;
    }

    try {
      setSaving(true);
      await api.updateAssignment(editingAssignment.id, {
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

      showSuccess('Assignment updated successfully!');
      setShowEditModal(false);
      setEditingAssignment(null);
      resetForm();
      await fetchAssignments();
    } catch (err: any) {
      showError(err.message || 'Failed to update assignment');
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

  // Open edit modal
  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description || '',
      type: assignment.type,
      instructions: assignment.instructions || '',
      max_file_size_mb: assignment.max_file_size_mb,
      allowed_file_types: assignment.allowed_file_types,
      due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
      max_score: assignment.max_score,
      status: assignment.status,
      course_id: assignment.course_id || '',
      lesson_id: assignment.lesson_id || ''
    });
    if (assignment.course_id) {
      fetchAvailableLessons(assignment.course_id);
    }
    setShowEditModal(true);
  };

  // Filter and sort assignments
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

  const isModalOpen = showCreateModal || showEditModal || showDeleteModal;

  if (loading && assignments.length === 0) {
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
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and grade learner assignments</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setShowCreateModal(true);
                    fetchAvailableCourses();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus size={16} />
                  Create Assignment
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
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="file-upload">File Upload</option>
                <option value="text">Text</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Assignments</p>
                    <p className="text-xl font-bold text-gray-900">{assignments.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Grading</p>
                    <p className="text-xl font-bold text-gray-900">
                      {assignments.reduce((sum, a) => sum + (a.pending || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graded</p>
                    <p className="text-xl font-bold text-gray-900">
                      {assignments.reduce((sum, a) => sum + (a.graded || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-xl font-bold text-gray-900">
                      {assignments.filter(a => isOverdue(a.due_date) && a.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            {filteredAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
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
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAssignments.map((assignment) => {
                        const assignedTo = assignment.assigned_to || 0;
                        const submitted = assignment.submitted || 0;
                        const graded = assignment.graded || 0;
                        const submissionRate = assignedTo > 0 ? (submitted / assignedTo) * 100 : 0;
                        const gradingRate = submitted > 0 ? (graded / submitted) * 100 : 0;
                        
                        return (
                          <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <FileText size={18} className="text-purple-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                  <div className="text-xs text-gray-500">{assignment.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{assignment.course_title || 'No Course'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Submissions</span>
                                  <span className="font-medium text-gray-900">
                                    {submitted}/{assignedTo}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${submissionRate}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Graded</span>
                                  <span className="font-medium text-gray-900">
                                    {graded}/{submitted}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all"
                                    style={{ width: `${gradingRate}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                {assignment.due_date ? (
                                  <>
                                    <span className={`text-sm ${isOverdue(assignment.due_date) && assignment.status === 'active' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                      {new Date(assignment.due_date).toLocaleDateString()}
                                    </span>
                                    {isOverdue(assignment.due_date) && assignment.status === 'active' && (
                                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                        Overdue
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500">No due date</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => openEditModal(assignment)}
                                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                  title="Edit assignment"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setAssignmentToDelete(assignment);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete assignment"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
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

      {/* Edit Assignment Modal */}
      {showEditModal && editingAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAssignment(null);
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
                  setShowEditModal(false);
                  setEditingAssignment(null);
                  resetForm();
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAssignment}
                disabled={saving || !assignmentForm.title.trim()}
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
                    Save Changes
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
