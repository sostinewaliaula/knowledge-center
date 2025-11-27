import { MainSidebar } from '../../components/MainSidebar';
import { UsersSidebar } from '../../components/UsersSidebar';
import { Search, Plus, MoreVertical, Filter, Download, UserPlus } from 'lucide-react';

interface UsersPageProps {}

export function UsersPage({}: UsersPageProps) {
  const users = [
    {
      id: '1',
      name: 'Adit Irwan',
      email: 'adit@caavagroup.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastActive: '2 hours ago',
      team: 'Design Team'
    },
    {
      id: '2',
      name: 'Arif Brata',
      email: 'arif@caavagroup.com',
      role: 'Learner',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastActive: '1 day ago',
      team: 'Development'
    },
    {
      id: '3',
      name: 'Bagus Yuli',
      email: 'bagus@caavagroup.com',
      role: 'Instructor',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastActive: '3 hours ago',
      team: 'Marketing'
    },
    {
      id: '4',
      name: 'Beni Neon',
      email: 'beni@caavagroup.com',
      role: 'Learner',
      status: 'Pending',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastActive: 'Never',
      team: 'Design Team'
    },
    {
      id: '5',
      name: 'Brian Domoni',
      email: 'brian@caavagroup.com',
      role: 'Auditor',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastActive: '5 hours ago',
      team: 'Development'
    },
    {
      id: '6',
      name: 'Depe Prada',
      email: 'depe@caavagroup.com',
      role: 'Learner',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=6',
      lastActive: '30 minutes ago',
      team: 'Marketing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Instructor':
        return 'bg-blue-100 text-blue-700';
      case 'Auditor':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <MainSidebar activePage="users" />
      <UsersSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage users, roles, and permissions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
              <UserPlus size={16} />
              <span>Invite User</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0 p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{user.team}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{user.lastActive}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

