import { useState } from 'react';
import { 
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Mail,
  Calendar
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  courseCount: number;
  createdAt: string;
  createdBy: string;
}

interface UserGroupsProps {}

export function UserGroups({}: UserGroupsProps) {
  const [groups, setGroups] = useState<UserGroup[]>([
    {
      id: '1',
      name: 'Engineering Team',
      description: 'All engineering department members',
      memberCount: 45,
      courseCount: 12,
      createdAt: '2024-01-15',
      createdBy: 'Admin'
    },
    {
      id: '2',
      name: 'New Hires 2024',
      description: 'Employees hired in 2024',
      memberCount: 23,
      courseCount: 5,
      createdAt: '2024-01-10',
      createdBy: 'Admin'
    },
    {
      id: '3',
      name: 'Management Team',
      description: 'Leadership and management staff',
      memberCount: 15,
      courseCount: 8,
      createdAt: '2024-01-08',
      createdBy: 'Admin'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
              <p className="text-sm text-gray-500 mt-1">Organize users into groups for easier management</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Create Group
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-500 mb-6">Create your first user group to get started</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                Create Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                      <Users size={24} className="text-purple-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Members</span>
                      <span className="font-medium text-gray-900">{group.memberCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Courses</span>
                      <span className="font-medium text-gray-900">{group.courseCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">{new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <UserPlus size={14} />
                      Manage
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <Mail size={14} />
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <Settings size={14} />
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

