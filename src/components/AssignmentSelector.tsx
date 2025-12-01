import { useState, useEffect } from 'react';
import { X, Search, FileText, Check, Loader2, Calendar, Clock } from 'lucide-react';
import { api } from '../utils/api';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  type: 'file-upload' | 'text' | 'quiz';
  status: 'draft' | 'active' | 'closed';
  due_date: string | null;
  max_score: number;
  course_title?: string | null;
  lesson_title?: string | null;
}

interface AssignmentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assignment: Assignment) => void;
  courseId?: string | null;
  lessonId?: string | null;
  title?: string;
}

export function AssignmentSelector({
  isOpen,
  onClose,
  onSelect,
  courseId = null,
  lessonId = null,
  title = 'Select Assignment'
}: AssignmentSelectorProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchAssignments();
    }
  }, [isOpen, searchQuery, filterStatus, filterType, courseId, lessonId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      let assignmentsList: Assignment[] = [];

      // Prefer course-level assignments when a course is known.
      // Most assignments will be linked to a course and not yet to a specific lesson.
      if (courseId) {
        assignmentsList = await api.getAssignmentsByCourse(courseId);
      }
      // If no courseId (rare case), but lessonId is provided, fetch by lesson
      else if (lessonId) {
        assignmentsList = await api.getAssignmentsByLesson(lessonId);
      }
      // Otherwise, fetch all assignments
      else {
        const result = await api.getAssignments(1, 100, searchQuery, filterStatus, filterType);
        assignmentsList = result.assignments || [];
      }

      // Apply filters if not using course/lesson specific endpoints
      if (!courseId && !lessonId) {
        if (searchQuery) {
          assignmentsList = assignmentsList.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        if (filterStatus !== 'all') {
          assignmentsList = assignmentsList.filter(a => a.status === filterStatus);
        }
        if (filterType !== 'all') {
          assignmentsList = assignmentsList.filter(a => a.type === filterType);
        }
      }

      setAssignments(assignmentsList);
    } catch (err: any) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (assignment: Assignment) => {
    onSelect(assignment);
    onClose();
  };

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

  const getTypeLabel = (type: Assignment['type']) => {
    switch (type) {
      case 'file-upload':
        return 'File Upload';
      case 'text':
        return 'Text';
      case 'quiz':
        return 'Quiz';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {!courseId && !lessonId && (
              <>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  <option value="file-upload">File Upload</option>
                  <option value="text">Text</option>
                  <option value="quiz">Quiz</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="text-purple-600 animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {courseId || lessonId
                  ? 'No assignments found for this course/lesson'
                  : 'No assignments found'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => handleSelect(assignment)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-purple-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
                      </div>
                      {assignment.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {getTypeLabel(assignment.type)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          Max Score: {assignment.max_score}
                        </span>
                        {assignment.due_date && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            <Calendar size={12} />
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check size={20} className="text-purple-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

