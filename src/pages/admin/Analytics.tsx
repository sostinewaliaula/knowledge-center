import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Award,
  Download,
  Filter,
  Calendar,
  Target,
  CheckCircle2
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface AnalyticsProps {}

export function Analytics({}: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    { label: 'Total Learners', value: '1,247', change: '+12%', trend: 'up' as const, icon: Users, color: 'text-blue-600' },
    { label: 'Active Courses', value: '48', change: '+5', trend: 'up' as const, icon: BookOpen, color: 'text-purple-600' },
    { label: 'Avg. Completion Rate', value: '78%', change: '+3%', trend: 'up' as const, icon: Target, color: 'text-green-600' },
    { label: 'Avg. Time Spent', value: '4.2h', change: '+0.5h', trend: 'up' as const, icon: Clock, color: 'text-orange-600' },
    { label: 'Certificates Issued', value: '892', change: '+45', trend: 'up' as const, icon: Award, color: 'text-yellow-600' },
    { label: 'Pass Rate', value: '85%', change: '+2%', trend: 'up' as const, icon: CheckCircle2, color: 'text-indigo-600' }
  ];

  const topCourses = [
    { title: 'Introduction to React', learners: 234, completion: 87, avgScore: 88, timeSpent: '12.5h' },
    { title: 'Project Management Basics', learners: 189, completion: 92, avgScore: 91, timeSpent: '8.3h' },
    { title: 'Data Analysis Fundamentals', learners: 156, completion: 78, avgScore: 82, timeSpent: '15.2h' },
    { title: 'Leadership Development', learners: 142, completion: 85, avgScore: 86, timeSpent: '10.8h' }
  ];

  const departmentStats = [
    { name: 'Engineering', learners: 342, completion: 82, avgScore: 87 },
    { name: 'Sales', learners: 189, completion: 75, avgScore: 81 },
    { name: 'Marketing', learners: 156, completion: 88, avgScore: 89 },
    { name: 'HR', learners: 98, completion: 90, avgScore: 92 },
    { name: 'Operations', learners: 234, completion: 79, avgScore: 84 }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-sm text-gray-500 mt-1">Comprehensive insights into your learning platform</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                    <metric.icon size={24} className={metric.color} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} />
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Course Performance Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Performance</h2>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{course.title}</span>
                      <span className="text-sm text-gray-600">{course.completion}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{course.learners} learners</span>
                      <span>Avg. Score: {course.avgScore}%</span>
                      <span>Time: {course.timeSpent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h2>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      <span className="text-sm text-gray-600">{dept.completion}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${dept.completion}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{dept.learners} learners</span>
                      <span>Avg. Score: {dept.avgScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Daily Active Users</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">892</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp size={14} />
                <span>+15% from last week</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Weekly Completion Rate</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">78%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp size={14} />
                <span>+3% from last week</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Avg. Session Duration</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">42m</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp size={14} />
                <span>+5m from last week</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

