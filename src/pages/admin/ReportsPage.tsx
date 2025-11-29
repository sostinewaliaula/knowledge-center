import { useState } from 'react';
import { 
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Mail,
  Search
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Report {
  id: string;
  title: string;
  type: 'course' | 'user' | 'compliance' | 'engagement';
  generatedAt: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  size: string;
}

interface ReportsProps {}

export function ReportsPage({}: ReportsProps) {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Course Completion Report - Q1 2024',
      type: 'course',
      generatedAt: '2024-01-15T10:30:00',
      generatedBy: 'Admin',
      format: 'pdf',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'User Activity Report',
      type: 'user',
      generatedAt: '2024-01-14T14:20:00',
      generatedBy: 'Admin',
      format: 'excel',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Compliance Status Report',
      type: 'compliance',
      generatedAt: '2024-01-13T09:15:00',
      generatedBy: 'Admin',
      format: 'pdf',
      size: '3.1 MB'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Reports', value: '24', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'This Month', value: '8', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Generated Today', value: '3', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' }
  ];

  const quickReports = [
    { name: 'Course Completion', type: 'course', icon: BookOpen },
    { name: 'User Progress', type: 'user', icon: Users },
    { name: 'Compliance Status', type: 'compliance', icon: CheckCircle2 },
    { name: 'Engagement Metrics', type: 'engagement', icon: TrendingUp }
  ];

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'user':
        return <Users size={20} className="text-purple-600" />;
      case 'compliance':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'engagement':
        return <TrendingUp size={20} className="text-orange-600" />;
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-700';
      case 'user':
        return 'bg-purple-100 text-purple-700';
      case 'compliance':
        return 'bg-green-100 text-green-700';
      case 'engagement':
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-500 mt-1">Generate and manage learning reports</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <BarChart3 size={16} />
                Generate Report
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
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="course">Course</option>
              <option value="user">User</option>
              <option value="compliance">Compliance</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Reports */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h2>
                <div className="space-y-3">
                  {quickReports.map((report, index) => (
                    <button
                      key={index}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <report.icon size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{report.name}</div>
                          <div className="text-xs text-gray-500">Generate now</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No reports found</p>
                    </div>
                  ) : (
                    filteredReports.map((report) => (
                      <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(report.type).replace('text-', 'bg-').replace('-700', '-50')}`}>
                              {getTypeIcon(report.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                                  {report.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{report.format.toUpperCase()}</span>
                                <span>•</span>
                                <span>{report.size}</span>
                                <span>•</span>
                                <span>{new Date(report.generatedAt).toLocaleString()}</span>
                                <span>•</span>
                                <span>By {report.generatedBy}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                              <Download size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                              <Mail size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
