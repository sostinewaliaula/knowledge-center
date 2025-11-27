import { useState, useEffect } from 'react';
import { MainSidebar } from '../../components/MainSidebar';
import { UsersSidebar } from '../../components/UsersSidebar';
import { Search, Plus, MoreVertical, Filter, Download, UserPlus, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleName: string;
  status: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersPageProps {}

export function UsersPage({}: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUsers();
      setUsers(response.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar URL from user email or name
  const getAvatarUrl = (email: string, name: string) => {
    // Use a simple hash of the email to get consistent avatar
    const hash = email.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const imgNum = Math.abs(hash) % 70 + 1;
    return `https://i.pravatar.cc/150?img=${imgNum}`;
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

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
    const roleLower = role?.toLowerCase() || '';
    if (roleLower.includes('admin') || roleLower.includes('administrator')) {
      return 'bg-purple-100 text-purple-700';
    }
    if (roleLower.includes('instructor')) {
      return 'bg-blue-100 text-blue-700';
    }
    if (roleLower.includes('auditor')) {
      return 'bg-orange-100 text-orange-700';
    }
    if (roleLower.includes('learner')) {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-gray-100 text-gray-700';
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : (
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
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          {searchQuery ? 'No users found matching your search' : 'No users found'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img 
                                src={getAvatarUrl(user.email, user.name)} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=9333ea&color=fff`;
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
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
                            <span className="text-sm text-gray-500">{user.lastActive}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

