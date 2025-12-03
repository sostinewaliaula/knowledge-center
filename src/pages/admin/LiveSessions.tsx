import { useState, useEffect } from 'react';
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
  Filter,
  X,
  AlertCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name?: string;
  scheduled_at: string;
  duration_minutes: number;
  attendees_count?: number;
  max_attendees: number;
  platform: 'zoom' | 'teams' | 'google_meet' | 'custom';
  meeting_url: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  category: string;
}

export function LiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);

  // Form state
  const [newSession, setNewSession] = useState<Partial<LiveSession>>({
    id: '',
    title: '',
    description: '',
    instructor_id: '', // This should ideally be the current user or selected from a list
    scheduled_at: '',
    duration_minutes: 60,
    max_attendees: 50,
    platform: 'zoom',
    meeting_url: '',
    status: 'scheduled',
    category: 'General'
  });

  useEffect(() => {
    fetchSessions();
    fetchCurrentUser();
  }, [filterStatus]);

  const fetchCurrentUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id) {
        setNewSession(prev => ({ ...prev, instructor_id: storedUser.id }));
      } else {
        // Fallback: fetch first admin user
        // We don't have a direct "me" endpoint yet, so we'll search for the admin email
        // or just list users and pick the first admin.
        // Assuming the user is logged in as admin@caavagroup.com
        const usersData = await api.getUsers(1, 1, 'admin@caavagroup.com');
        if (usersData.users && usersData.users.length > 0) {
          setNewSession(prev => ({ ...prev, instructor_id: usersData.users[0].id }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch current user', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getLiveSessions(filterStatus === 'all' ? '' : filterStatus, searchQuery);
      setSessions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (session: LiveSession) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await api.deleteLiveSession(sessionToDelete.id);
      setSessions(sessions.filter(s => s.id !== sessionToDelete.id));
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (err: any) {
      alert('Failed to delete session: ' + err.message);
    }
  };

  const handleView = (session: LiveSession) => {
    setSelectedSession(session);
    setShowViewModal(true);
  };

  const handleEdit = (session: LiveSession) => {
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    let formattedDate = '';
    if (session.scheduled_at) {
      const date = new Date(session.scheduled_at);
      // Adjust to local time string format
      const offset = date.getTimezoneOffset() * 60000;
      formattedDate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    }

    setNewSession({
      id: session.id,
      title: session.title,
      description: session.description || '',
      instructor_id: session.instructor_id || newSession.instructor_id,
      scheduled_at: formattedDate,
      duration_minutes: session.duration_minutes,
      max_attendees: session.max_attendees,
      platform: session.platform,
      meeting_url: session.meeting_url || '',
      status: session.status,
      category: session.category || 'General'
    });
    setShowCreateModal(true);
  };

  const handleCopy = (session: LiveSession) => {
    setNewSession({
      title: `${session.title} (Copy)`,
      description: session.description || '',
      instructor_id: session.instructor_id,
      scheduled_at: '', // Clear date for copy
      duration_minutes: session.duration_minutes,
      max_attendees: session.max_attendees,
      platform: session.platform,
      meeting_url: session.meeting_url || '',
      status: 'scheduled',
      category: session.category || 'General'
    });
    setShowCreateModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!newSession.title || !newSession.scheduled_at) {
        alert('Please fill in all required fields');
        return;
      }

      // For now, hardcode instructor_id if not set (assuming admin is creating)
      // In a real app, we'd get this from auth context or a dropdown
      const sessionData = {
        ...newSession
      };

      if (!sessionData.instructor_id) {
        alert('Could not identify instructor. Please try again or re-login.');
        return;
      }

      if (newSession.id) {
        await api.updateLiveSession(newSession.id, sessionData);
      } else {
        await api.createLiveSession(sessionData);
      }

      setShowCreateModal(false);
      fetchSessions();
      // Reset form
      setNewSession({
        id: '',
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: 60,
        max_attendees: 50,
        platform: 'zoom',
        meeting_url: '',
        status: 'scheduled',
        category: 'General'
      });
    } catch (err: any) {
      alert('Failed to save session: ' + err.message);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.instructor_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSearch;
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
      case 'google_meet':
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <>
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
                        {sessions.reduce((sum, s) => sum + (s.attendees_count || 0), 0)}
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
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Video size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                  <p className="text-gray-500 mb-6">Schedule your first live session to get started</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                  >
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
                              {session.platform.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{session.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {session.instructor_name || 'Unknown Instructor'}
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
                            {new Date(session.scheduled_at).toLocaleDateString()} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Clock size={14} />
                            Duration
                          </span>
                          <span className="font-medium text-gray-900">{session.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Users size={14} />
                            Attendees
                          </span>
                          <span className="font-medium text-gray-900">
                            {session.attendees_count || 0} / {session.max_attendees}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                        <a
                          href={session.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <LinkIcon size={14} />
                          Join
                        </a>
                        <button
                          onClick={() => handleView(session)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(session)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleCopy(session)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(session)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{newSession.id ? 'Edit Session' : 'Schedule New Session'}</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scheduled At</label>
                    <input
                      type="datetime-local"
                      value={newSession.scheduled_at}
                      onChange={(e) => setNewSession({ ...newSession, scheduled_at: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                      <input
                        type="number"
                        value={newSession.duration_minutes}
                        onChange={(e) => setNewSession({ ...newSession, duration_minutes: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
                      <input
                        type="number"
                        value={newSession.max_attendees}
                        onChange={(e) => setNewSession({ ...newSession, max_attendees: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <select
                      value={newSession.platform}
                      onChange={(e) => setNewSession({ ...newSession, platform: e.target.value as any })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="zoom">Zoom</option>
                      <option value="teams">Teams</option>
                      <option value="google_meet">Google Meet</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meeting URL</label>
                    <input
                      type="url"
                      value={newSession.meeting_url}
                      onChange={(e) => setNewSession({ ...newSession, meeting_url: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={newSession.category}
                      onChange={(e) => setNewSession({ ...newSession, category: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    {newSession.id ? 'Update Session' : 'Create Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Session Modal */}
        {showDeleteModal && sessionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Session</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">"{sessionToDelete.title}"</span>?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. The session and all its data will be permanently deleted.
                </p>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSessionToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Session Modal */}
        {showViewModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedSession.title}</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedSession(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className={`px-2 py-1 rounded font-medium ${getStatusColor(selectedSession.status)}`}>
                    {selectedSession.status}
                  </span>
                  <span className={`px-2 py-1 rounded font-medium ${getPlatformColor(selectedSession.platform)}`}>
                    {selectedSession.platform.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>{selectedSession.category}</span>
                </div>

                {selectedSession.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-600">{selectedSession.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Date & Time</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(selectedSession.scheduled_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Clock size={16} />
                      <span>{new Date(selectedSession.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Details</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{selectedSession.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Users size={16} />
                      <span>Max {selectedSession.max_attendees} attendees</span>
                    </div>
                  </div>
                </div>

                {selectedSession.meeting_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Meeting Link</h4>
                    <a
                      href={selectedSession.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <LinkIcon size={16} />
                      {selectedSession.meeting_url}
                    </a>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedSession(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
