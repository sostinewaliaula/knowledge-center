import { useState, useEffect } from 'react';
import { X, Search, FileText, Check, Loader2, Calendar } from 'lucide-react';
import { api } from '../utils/api';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  passing_score: number;
  question_count?: number;
  course_title?: string | null;
  lesson_title?: string | null;
}

interface ExamSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exam: Exam) => void;
  courseId?: string | null;
  lessonId?: string | null;
  title?: string;
}

export function ExamSelector({
  isOpen,
  onClose,
  onSelect,
  courseId = null,
  lessonId = null,
  title = 'Select Exam'
}: ExamSelectorProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchExams();
    }
  }, [isOpen, searchQuery, filterStatus, courseId, lessonId]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      let list: Exam[] = [];

      if (courseId) {
        list = await api.getExamsByCourse(courseId);
      } else if (lessonId) {
        list = await api.getExamsByLesson(lessonId);
      } else {
        const result = await api.getExams(1, 100, searchQuery, filterStatus);
        list = result.exams || [];
      }

      if (!courseId && !lessonId) {
        if (searchQuery) {
          list = list.filter(e =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        if (filterStatus !== 'all') {
          list = list.filter(e => e.status === filterStatus);
        }
      }

      setExams(list);
    } catch (err: any) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (exam: Exam) => {
    onSelect(exam);
    onClose();
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
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
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {!courseId && !lessonId && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="text-purple-600 animate-spin" />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {courseId || lessonId
                  ? 'No exams found for this course/lesson'
                  : 'No exams found'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => handleSelect(exam)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-purple-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
                      </div>
                      {exam.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {exam.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Passing: {exam.passing_score}%
                        </span>
                        {typeof exam.question_count === 'number' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                            <Calendar size={12} />
                            {exam.question_count} questions
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


