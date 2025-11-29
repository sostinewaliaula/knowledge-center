import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  FileQuestion,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Copy,
  Settings
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  passingScore: number;
  attempts: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  totalQuestions: number;
  totalPoints: number;
}

interface AssessmentsProps {}

export function Assessments({}: AssessmentsProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      questions: [],
      timeLimit: 30,
      passingScore: 70,
      attempts: 3,
      status: 'published',
      createdAt: '2024-01-15',
      totalQuestions: 15,
      totalPoints: 100
    },
    {
      id: '2',
      title: 'JavaScript Advanced Concepts',
      description: 'Advanced JavaScript assessment',
      questions: [],
      timeLimit: 45,
      passingScore: 80,
      attempts: 2,
      status: 'draft',
      createdAt: '2024-01-14',
      totalQuestions: 20,
      totalPoints: 150
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assessment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessments & Quizzes</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage quizzes, tests, and assessments</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Create Assessment
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
                placeholder="Search assessments..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileQuestion size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
              <p className="text-gray-500 mb-6">Create your first assessment to get started</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                Create Assessment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{assessment.description}</p>
                    </div>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questions</span>
                      <span className="font-medium text-gray-900">{assessment.totalQuestions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time Limit</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <Clock size={14} />
                        {assessment.timeLimit} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Passing Score</span>
                      <span className="font-medium text-gray-900">{assessment.passingScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Attempts</span>
                      <span className="font-medium text-gray-900">{assessment.attempts}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assessment.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : assessment.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {assessment.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileQuestion size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                  <p className="text-xl font-bold text-gray-900">{assessments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-xl font-bold text-gray-900">
                    {assessments.filter(a => a.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-xl font-bold text-gray-900">
                    {assessments.filter(a => a.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-xl font-bold text-gray-900">78%</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

