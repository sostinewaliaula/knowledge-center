import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  Download,
  Filter,
  Calendar,
  Target,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronRight,
  Activity,
  MessageSquare,
  Eye,
  Video,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface AnalyticsProps {}

export function Analytics({}: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'learners']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const analyticsCategories = [
    { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
    { id: 'learners', label: 'Learner Analytics', icon: Users },
    { id: 'courses', label: 'Course Analytics', icon: BookOpen },
    { id: 'content', label: 'Content Analytics', icon: FileText },
    { id: 'engagement', label: 'Engagement Metrics', icon: Activity },
    { id: 'assessments', label: 'Assessment Analytics', icon: Target },
    { id: 'completion', label: 'Completion Reports', icon: CheckCircle2 },
    { id: 'time', label: 'Time & Attendance', icon: Clock },
    { id: 'social', label: 'Social Learning', icon: MessageSquare }
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
              <p className="text-sm text-gray-500 mt-1">Comprehensive insights and analytics for your LMS</p>
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
                <option value="custom">Custom Range</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Calendar size={16} />
                Schedule Report
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Analytics Categories Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Analytics Categories</h2>
              <nav className="space-y-1">
                {analyticsCategories.map((category) => {
                  const Icon = category.icon;
                  const isExpanded = expandedSections.has(category.id);
                  return (
                    <div key={category.id}>
                      <button
                        onClick={() => toggleSection(category.id)}
                        className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors ${
                          isExpanded
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="flex-1 text-left">{category.label}</span>
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Overview Section */}
              {expandedSections.has('overview') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BarChart3 size={20} className="text-purple-600" />
                      Overview & Key Performance Indicators
                    </h2>
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <Users size={24} className="text-blue-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded flex items-center gap-1">
                            <TrendingUp size={12} />
                            +12%
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mb-1">Total Learners</p>
                        <p className="text-3xl font-bold text-blue-900">1,247</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <BookOpen size={24} className="text-purple-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded flex items-center gap-1">
                            <TrendingUp size={12} />
                            +5
                          </span>
                        </div>
                        <p className="text-sm text-purple-700 mb-1">Active Courses</p>
                        <p className="text-3xl font-bold text-purple-900">48</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <Target size={24} className="text-green-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded flex items-center gap-1">
                            <TrendingUp size={12} />
                            +3%
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-1">Completion Rate</p>
                        <p className="text-3xl font-bold text-green-900">78%</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <Clock size={24} className="text-orange-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded flex items-center gap-1">
                            <TrendingUp size={12} />
                            +0.5h
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 mb-1">Avg. Time Spent</p>
                        <p className="text-3xl font-bold text-orange-900">4.2h</p>
                      </div>
                    </div>

                    {/* Additional Overview Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <Award size={20} className="text-yellow-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+45</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Certificates Issued</p>
                        <p className="text-2xl font-bold text-gray-900">892</p>
                      </div>
                      
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <CheckCircle2 size={20} className="text-green-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+2%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                        <p className="text-2xl font-bold text-gray-900">85%</p>
                      </div>
                      
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <Activity size={20} className="text-blue-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+15%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Daily Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">892</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learner Analytics Section */}
              {expandedSections.has('learners') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Users size={20} className="text-blue-600" />
                      Learner Analytics
                    </h2>
                    
                    {/* Learner Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 mb-1">Active Learners</p>
                        <p className="text-2xl font-bold text-blue-900">1,124</p>
                        <p className="text-xs text-blue-600 mt-1">89% of total</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 mb-1">New This Month</p>
                        <p className="text-2xl font-bold text-green-900">+156</p>
                        <p className="text-xs text-green-600 mt-1">+14% growth</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700 mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold text-purple-900">78%</p>
                        <p className="text-xs text-purple-600 mt-1">Above average</p>
                      </div>
                    </div>

                    {/* Learner Activity Chart Placeholder */}
                    <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-6">
                      <div className="text-center text-gray-500">
                        <Activity size={48} className="mx-auto mb-2 text-gray-400" />
                        <p>Learner Activity Chart</p>
                        <p className="text-xs mt-1">Daily active users over time</p>
                      </div>
                    </div>

                    {/* Learner Demographics */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Learner Demographics</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Learners</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Score</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Spent</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {[
                              { dept: 'Engineering', learners: 342, completion: 82, score: 87, time: '12.5h' },
                              { dept: 'Sales', learners: 189, completion: 75, score: 81, time: '8.3h' },
                              { dept: 'Marketing', learners: 156, completion: 88, score: 89, time: '10.2h' },
                              { dept: 'HR', learners: 98, completion: 90, score: 92, time: '9.1h' },
                              { dept: 'Operations', learners: 234, completion: 79, score: 84, time: '11.8h' }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.dept}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{row.learners}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${row.completion}%` }} />
                                    </div>
                                    <span>{row.completion}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{row.score}%</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{row.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Analytics Section */}
              {expandedSections.has('courses') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BookOpen size={20} className="text-purple-600" />
                      Course Analytics
                    </h2>
                    
                    {/* Course Performance Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 mb-1">Total Courses</p>
                        <p className="text-2xl font-bold text-blue-900">48</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 mb-1">Published</p>
                        <p className="text-2xl font-bold text-green-900">42</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700 mb-1">In Draft</p>
                        <p className="text-2xl font-bold text-yellow-900">6</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700 mb-1">Avg. Rating</p>
                        <p className="text-2xl font-bold text-purple-900">4.7★</p>
                      </div>
                    </div>

                    {/* Top Performing Courses */}
                    <div className="space-y-4">
                      <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Top Performing Courses</h3>
                          <span className="text-xs text-gray-500">By completion rate</span>
                        </div>
                        <div className="space-y-4">
                          {[
                            { title: 'Introduction to React', learners: 234, completion: 87, rating: 4.8, views: 1245, timeSpent: '12.5h' },
                            { title: 'Project Management Basics', learners: 189, completion: 92, rating: 4.9, views: 987, timeSpent: '8.3h' },
                            { title: 'Data Analysis Fundamentals', learners: 156, completion: 78, rating: 4.6, views: 756, timeSpent: '15.2h' },
                            { title: 'Leadership Development', learners: 142, completion: 85, rating: 4.7, views: 623, timeSpent: '10.8h' }
                          ].map((course, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-purple-700">{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 mb-1">{course.title}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{course.learners} learners</span>
                                  <span>•</span>
                                  <span>{course.views} views</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    {course.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-gray-900 mb-1">{course.completion}%</p>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full"
                                    style={{ width: `${course.completion}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{course.timeSpent}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Analytics Section */}
              {expandedSections.has('content') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <FileText size={20} className="text-green-600" />
                      Content Analytics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Total Content</p>
                        <p className="text-2xl font-bold text-gray-900">1,856</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Downloads</p>
                        <p className="text-2xl font-bold text-gray-900">8,432</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Views</p>
                        <p className="text-2xl font-bold text-gray-900">24,156</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
                        <p className="text-2xl font-bold text-gray-900">4.6★</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Metrics Section */}
              {expandedSections.has('engagement') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Activity size={20} className="text-orange-600" />
                      Engagement Metrics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <Users size={24} className="text-blue-600" />
                          <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <p className="text-sm text-blue-700 mb-1">Daily Active Users</p>
                        <p className="text-3xl font-bold text-blue-900">892</p>
                        <p className="text-xs text-blue-600 mt-2">+15% from last week</p>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <Clock size={24} className="text-purple-600" />
                          <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <p className="text-sm text-purple-700 mb-1">Avg. Session Duration</p>
                        <p className="text-3xl font-bold text-purple-900">42m</p>
                        <p className="text-xs text-purple-600 mt-2">+5m from last week</p>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <MessageSquare size={24} className="text-green-600" />
                          <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <p className="text-sm text-green-700 mb-1">Discussion Posts</p>
                        <p className="text-3xl font-bold text-green-900">1,234</p>
                        <p className="text-xs text-green-600 mt-2">+23% from last week</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment Analytics Section */}
              {expandedSections.has('assessments') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Target size={20} className="text-red-600" />
                      Assessment Analytics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700 mb-1">Total Assessments</p>
                        <p className="text-2xl font-bold text-red-900">124</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 mb-1">Avg. Score</p>
                        <p className="text-2xl font-bold text-green-900">78%</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 mb-1">Pass Rate</p>
                        <p className="text-2xl font-bold text-blue-900">85%</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700 mb-1">Total Attempts</p>
                        <p className="text-2xl font-bold text-purple-900">3,456</p>
                      </div>
                    </div>

                    {/* Assessment Performance Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Assessment Performance</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Score</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time (min)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {[
                              { name: 'React Fundamentals Quiz', attempts: 234, avgScore: 82, passRate: 88, time: 25 },
                              { name: 'JavaScript Assessment', attempts: 189, avgScore: 75, passRate: 81, time: 30 },
                              { name: 'Project Management Test', attempts: 156, avgScore: 89, passRate: 92, time: 45 }
                            ].map((assessment, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{assessment.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{assessment.attempts}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <span>{assessment.avgScore}%</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${assessment.avgScore}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{assessment.passRate}%</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{assessment.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Reports Section */}
              {expandedSections.has('completion') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      Completion Reports
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { course: 'Introduction to React', enrolled: 234, completed: 203, inProgress: 28, notStarted: 3 },
                        { course: 'Project Management Basics', enrolled: 189, completed: 174, inProgress: 12, notStarted: 3 },
                        { course: 'Data Analysis Fundamentals', enrolled: 156, completed: 122, inProgress: 30, notStarted: 4 }
                      ].map((item, idx) => {
                        const completionRate = (item.completed / item.enrolled) * 100;
                        return (
                          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900">{item.course}</h3>
                              <span className="text-sm font-medium text-gray-700">{Math.round(completionRate)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                              <div 
                                className="bg-green-500 h-3 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Completed</p>
                                <p className="font-semibold text-green-700">{item.completed}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">In Progress</p>
                                <p className="font-semibold text-yellow-700">{item.inProgress}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Not Started</p>
                                <p className="font-semibold text-gray-700">{item.notStarted}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Time & Attendance Section */}
              {expandedSections.has('time') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Clock size={20} className="text-indigo-600" />
                      Time & Attendance Analytics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                        <p className="text-sm text-indigo-700 mb-1">Total Learning Hours</p>
                        <p className="text-3xl font-bold text-indigo-900">5,234h</p>
                        <p className="text-xs text-indigo-600 mt-2">This month</p>
                      </div>
                      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                        <p className="text-sm text-indigo-700 mb-1">Avg. Hours/Learner</p>
                        <p className="text-3xl font-bold text-indigo-900">4.2h</p>
                        <p className="text-xs text-indigo-600 mt-2">Per week</p>
                      </div>
                      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                        <p className="text-sm text-indigo-700 mb-1">Peak Hours</p>
                        <p className="text-3xl font-bold text-indigo-900">10-12 AM</p>
                        <p className="text-xs text-indigo-600 mt-2">Most active time</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Learning Section */}
              {expandedSections.has('social') && (
                <div className="mb-6 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <MessageSquare size={20} className="text-teal-600" />
                      Social Learning Analytics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Discussion Posts</p>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Comments</p>
                        <p className="text-2xl font-bold text-gray-900">5,678</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Likes/Reactions</p>
                        <p className="text-2xl font-bold text-gray-900">8,901</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Active Forums</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Report Builder Section */}
              {(expandedSections.has('overview') || expandedSections.has('learners') || expandedSections.has('courses')) && (
                <div className="mt-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        Quick Report Generator
                      </h2>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                        <Download size={16} />
                        Generate Report
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                        <FileText size={24} className="text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900 mb-1">PDF Report</p>
                        <p className="text-xs text-gray-500">Export analytics as PDF</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                        <FileText size={24} className="text-green-600 mb-2" />
                        <p className="font-medium text-gray-900 mb-1">Excel Export</p>
                        <p className="text-xs text-gray-500">Export data to Excel</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                        <FileText size={24} className="text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900 mb-1">CSV Export</p>
                        <p className="text-xs text-gray-500">Export raw data as CSV</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other sections */}
              {expandedSections.size === 0 && (
                <div className="text-center py-12">
                  <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an analytics category from the sidebar to view insights</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

