import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Users,
  ClipboardList,
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  Eye,
  Download
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface AdminDashboardProps {}

export function AdminDashboard({}: AdminDashboardProps) {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Total Learners',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/users'
    },
    {
      label: 'Active Courses',
      value: '48',
      change: '+5',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/course-builder'
    },
    {
      label: 'Learning Paths',
      value: '23',
      change: '+3',
      changeType: 'positive' as const,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/learning-paths'
    },
    {
      label: 'Content Items',
      value: '1,856',
      change: '+124',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/content-library'
    },
    {
      label: 'Pending Assignments',
      value: '342',
      change: '-18',
      changeType: 'negative' as const,
      icon: ClipboardList,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/admin/assignments'
    },
    {
      label: 'Certificates Issued',
      value: '892',
      change: '+45',
      changeType: 'positive' as const,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/admin/gamification'
    }
  ];

  const recentActivity = [
    { type: 'course', action: 'New course created', title: 'Advanced React Patterns', user: 'John Doe', time: '2 hours ago', icon: BookOpen, color: 'text-blue-600' },
    { type: 'user', action: 'New user registered', title: 'Sarah Wilson', user: 'System', time: '3 hours ago', icon: Users, color: 'text-green-600' },
    { type: 'completion', action: 'Course completed', title: 'UI/UX Fundamentals', user: 'Mike Johnson', time: '5 hours ago', icon: CheckCircle2, color: 'text-purple-600' },
    { type: 'assignment', action: 'Assignment submitted', title: 'Project Proposal', user: 'Emily Chen', time: '6 hours ago', icon: ClipboardList, color: 'text-orange-600' },
    { type: 'path', action: 'Learning path started', title: 'Full Stack Developer', user: 'David Lee', time: '1 day ago', icon: GraduationCap, color: 'text-indigo-600' }
  ];

  const upcomingDeadlines = [
    { title: 'Safety Training Compliance', learners: 45, deadline: '3 days', priority: 'high' as const },
    { title: 'Quarterly Assessment', learners: 120, deadline: '5 days', priority: 'medium' as const },
    { title: 'Leadership Development', learners: 23, deadline: '1 week', priority: 'low' as const }
  ];

  const topCourses = [
    { title: 'Introduction to React', learners: 234, completion: 87, rating: 4.8 },
    { title: 'Project Management Basics', learners: 189, completion: 92, rating: 4.9 },
    { title: 'Data Analysis Fundamentals', learners: 156, completion: 78, rating: 4.6 }
  ];

  const complianceStatus = {
    total: 1250,
    compliant: 1120,
    atRisk: 95,
    nonCompliant: 35
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download size={16} />
                Export Report
              </button>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <BarChart3 size={16} />
                View Analytics
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <button
                key={index}
                onClick={() => navigate(stat.link)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                  <span>View details</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Compliance Status */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Compliance Status</h2>
                <button 
                  onClick={() => navigate('/admin/compliance')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Compliant</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {complianceStatus.compliant} / {complianceStatus.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${(complianceStatus.compliant / complianceStatus.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={18} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">At Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{complianceStatus.atRisk}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={18} className="text-red-600" />
                      <span className="text-sm font-medium text-red-900">Non-Compliant</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">{complianceStatus.nonCompliant}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                <button 
                  onClick={() => navigate('/admin/compliance')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {upcomingDeadlines.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>{item.learners} learners</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                      <activity.icon size={18} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Courses</h2>
                <button 
                  onClick={() => navigate('/admin/analytics')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span>{course.learners} learners</span>
                      <span>•</span>
                      <span>{course.completion}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
