import { useState } from 'react';
import { 
  Bell,
  Plus,
  Settings,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  BookOpen,
  Send,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'in-app' | 'push';
  category: 'course' | 'assignment' | 'system' | 'announcement';
  recipients: number;
  sentAt: string;
  status: 'sent' | 'scheduled' | 'draft';
}

interface NotificationSettings {
  courseUpdates: boolean;
  assignmentReminders: boolean;
  systemAnnouncements: boolean;
  newContent: boolean;
  deadlineAlerts: boolean;
  completionCertificates: boolean;
}

interface NotificationsProps {}

export function Notifications({}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Course Available',
      message: 'A new course "Advanced React Patterns" is now available',
      type: 'email',
      category: 'course',
      recipients: 1247,
      sentAt: '2024-01-15T10:00:00',
      status: 'sent'
    },
    {
      id: '2',
      title: 'Assignment Deadline Reminder',
      message: 'Your assignment "Project Proposal" is due in 2 days',
      type: 'in-app',
      category: 'assignment',
      recipients: 342,
      sentAt: '2024-01-16T09:00:00',
      status: 'sent'
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on January 20th from 2-4 AM',
      type: 'email',
      category: 'system',
      recipients: 1247,
      sentAt: '2024-01-17T14:00:00',
      status: 'scheduled'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    courseUpdates: true,
    assignmentReminders: true,
    systemAnnouncements: true,
    newContent: false,
    deadlineAlerts: true,
    completionCertificates: true
  });

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'in-app':
        return <Bell size={16} className="text-purple-600" />;
      case 'push':
        return <MessageSquare size={16} className="text-green-600" />;
    }
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'course':
        return 'bg-blue-100 text-blue-700';
      case 'assignment':
        return 'bg-orange-100 text-orange-700';
      case 'system':
        return 'bg-gray-100 text-gray-700';
      case 'announcement':
        return 'bg-purple-100 text-purple-700';
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
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500 mt-1">Manage notifications and announcements</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Settings size={16} />
                Settings
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Send Notification
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notification Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => toggleSetting(key as keyof NotificationSettings)}
                        className="text-purple-600"
                      >
                        {value ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-gray-400" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Sent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter(n => n.status === 'sent').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter(n => n.status === 'scheduled').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Recipients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.reduce((sum, n) => sum + n.recipients, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(notification.type)}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(notification.category)}`}>
                              {notification.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              notification.status === 'sent' ? 'bg-green-100 text-green-700' :
                              notification.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{notification.recipients} recipients</span>
                            <span>•</span>
                            <span>{new Date(notification.sentAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

