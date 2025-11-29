import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Assignment {
  id: string;
  title: string;
  course: string;
  assignedTo: number;
  submitted: number;
  pending: number;
  graded: number;
  dueDate: string;
  status: 'active' | 'closed' | 'draft';
  type: 'file-upload' | 'text' | 'quiz';
}

interface AssignmentsProps {}

export function Assignments({}: AssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Project Proposal Document',
      course: 'Project Management Basics',
      assignedTo: 45,
      submitted: 32,
      pending: 13,
      graded: 28,
      dueDate: '2024-01-25',
      status: 'active',
      type: 'file-upload'
    },
    {
      id: '2',
      title: 'Case Study Analysis',
      course: 'Business Strategy',
      assignedTo: 28,
      submitted: 25,
      pending: 3,
      graded: 22,
      dueDate: '2024-01-20',
      status: 'active',
      type: 'text'
    },
    {
      id: '3',
      title: 'Weekly Reflection',
      course: 'Leadership Development',
      assignedTo: 15,
      submitted: 15,
      pending: 0,
      graded: 12,
      dueDate: '2024-01-18',
      status: 'closed',
      type: 'text'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and grade learner assignments</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download size={16} />
                Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
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
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
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
                    {assignments.reduce((sum, a) => sum + a.pending, 0)}
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
                    {assignments.reduce((sum, a) => sum + a.graded, 0)}
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
                    {assignments.filter(a => isOverdue(a.dueDate) && a.status === 'active').length}
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
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
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
                      const submissionRate = (assignment.submitted / assignment.assignedTo) * 100;
                      const gradingRate = (assignment.graded / assignment.submitted) * 100;
                      
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
                            <div className="text-sm text-gray-900">{assignment.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Submissions</span>
                                <span className="font-medium text-gray-900">
                                  {assignment.submitted}/{assignment.assignedTo}
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
                                  {assignment.graded}/{assignment.submitted}
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
                              <span className={`text-sm ${isOverdue(assignment.dueDate) && assignment.status === 'active' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              {isOverdue(assignment.dueDate) && assignment.status === 'active' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  Overdue
                                </span>
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
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
  );
}

