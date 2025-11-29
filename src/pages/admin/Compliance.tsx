import { useState } from 'react';
import { 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Users,
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface ComplianceItem {
  id: string;
  title: string;
  category: string;
  required: number;
  completed: number;
  deadline: string;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  priority: 'high' | 'medium' | 'low';
}

interface ComplianceProps {}

export function Compliance({}: ComplianceProps) {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      title: 'Safety Training - Workplace Safety',
      category: 'Safety',
      required: 250,
      completed: 245,
      deadline: '2024-02-01',
      status: 'compliant',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Data Privacy & GDPR',
      category: 'Legal',
      required: 180,
      completed: 165,
      deadline: '2024-01-25',
      status: 'at-risk',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Anti-Harassment Training',
      category: 'HR',
      required: 200,
      completed: 200,
      deadline: '2024-01-20',
      status: 'compliant',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Cybersecurity Awareness',
      category: 'IT Security',
      required: 300,
      completed: 280,
      deadline: '2024-02-15',
      status: 'at-risk',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Code of Conduct',
      category: 'Legal',
      required: 150,
      completed: 120,
      deadline: '2024-01-18',
      status: 'non-compliant',
      priority: 'high'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const overallStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(i => i.status === 'compliant').length,
    atRisk: complianceItems.filter(i => i.status === 'at-risk').length,
    nonCompliant: complianceItems.filter(i => i.status === 'non-compliant').length
  };

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'non-compliant':
        return 'bg-red-100 text-red-700';
    }
  };

  const getPriorityColor = (priority: ComplianceItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCompletionRate = (item: ComplianceItem) => {
    return (item.completed / item.required) * 100;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
              <p className="text-sm text-gray-500 mt-1">Track and manage mandatory training compliance</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download size={16} />
                Export Report
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Shield size={16} />
                New Requirement
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
                placeholder="Search compliance requirements..."
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
              <option value="compliant">Compliant</option>
              <option value="at-risk">At Risk</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.compliant}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">At Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.atRisk}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Non-Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.nonCompliant}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compliance Requirements</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const completionRate = getCompletionRate(item);
                const daysUntilDeadline = Math.ceil((new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText size={14} />
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Due: {new Date(item.deadline).toLocaleDateString()}
                          </span>
                          {daysUntilDeadline > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {daysUntilDeadline} days left
                            </span>
                          )}
                          {daysUntilDeadline <= 0 && (
                            <span className="text-red-600 font-medium">Overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completion Progress</span>
                        <span className="font-medium text-gray-900">
                          {item.completed} / {item.required} ({Math.round(completionRate)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            completionRate >= 100 ? 'bg-green-500' :
                            completionRate >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(completionRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

