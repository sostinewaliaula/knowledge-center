import { useState } from 'react';
import { 
  Calendar,
  Video,
  Plus,
  Clock,
  Users,
  MapPin,
  Link as LinkIcon,
  Edit,
  Trash2,
  Copy,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  attendees: number;
  maxAttendees: number;
  platform: 'zoom' | 'teams' | 'google-meet' | 'custom';
  meetingLink: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  category: string;
}

interface LiveSessionsProps {}

export function LiveSessions({}: LiveSessionsProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: '1',
      title: 'Advanced React Patterns Workshop',
      description: 'Deep dive into advanced React patterns and best practices',
      instructor: 'John Doe',
      date: '2024-01-25',
      time: '14:00',
      duration: 90,
      attendees: 45,
      maxAttendees: 100,
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
      category: 'Technical'
    },
    {
      id: '2',
      title: 'Leadership Development Session',
      description: 'Building effective leadership skills',
      instructor: 'Jane Smith',
      date: '2024-01-20',
      time: '10:00',
      duration: 60,
      attendees: 0,
      maxAttendees: 50,
      platform: 'teams',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      status: 'completed',
      category: 'Soft Skills'
    },
    {
      id: '3',
      title: 'Data Analysis Fundamentals',
      description: 'Introduction to data analysis techniques',
      instructor: 'Mike Johnson',
      date: '2024-01-22',
      time: '15:30',
      duration: 120,
      attendees: 28,
      maxAttendees: 30,
      platform: 'google-meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      status: 'live',
      category: 'Technical'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: LiveSession['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'live':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  const getPlatformColor = (platform: LiveSession['platform']) => {
    switch (platform) {
      case 'zoom':
        return 'bg-blue-100 text-blue-700';
      case 'teams':
        return 'bg-purple-100 text-purple-700';
      case 'google-meet':
        return 'bg-green-100 text-green-700';
      case 'custom':
        return 'bg-gray-100 text-gray-700';
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
              <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
              <p className="text-sm text-gray-500 mt-1">Schedule and manage live training sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Schedule Session
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
                placeholder="Search sessions..."
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
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-xl font-bold text-gray-900">{sessions.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live Now</p>
                  <p className="text-xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === 'live').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Attendees</p>
                  <p className="text-xl font-bold text-gray-900">
                    {sessions.reduce((sum, s) => sum + s.attendees, 0)}
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
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Video size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 mb-6">Schedule your first live session to get started</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                Schedule Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(session.platform)}`}>
                          {session.platform}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{session.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {session.instructor}
                        </span>
                        <span>•</span>
                        <span>{session.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        Date & Time
                      </span>
                      <span className="font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString()} at {session.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock size={14} />
                        Duration
                      </span>
                      <span className="font-medium text-gray-900">{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users size={14} />
                        Attendees
                      </span>
                      <span className="font-medium text-gray-900">
                        {session.attendees} / {session.maxAttendees}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1">
                      <LinkIcon size={14} />
                      Join
                    </button>
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
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

