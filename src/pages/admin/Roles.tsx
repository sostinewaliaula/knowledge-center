import { useState } from 'react';
import { 
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

interface RolesProps {}

export function Roles({}: RolesProps) {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access',
      userCount: 5,
      permissions: ['all'],
      isSystem: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'instructor',
      displayName: 'Instructor',
      description: 'Can create and manage courses',
      userCount: 12,
      permissions: ['courses.create', 'courses.edit', 'assessments.create'],
      isSystem: true,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'learner',
      displayName: 'Learner',
      description: 'Standard learner access',
      userCount: 1247,
      permissions: ['courses.view', 'assessments.take'],
      isSystem: true,
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'content_manager',
      displayName: 'Content Manager',
      description: 'Manages content library and categories',
      userCount: 8,
      permissions: ['content.manage', 'categories.manage'],
      isSystem: false,
      createdAt: '2024-01-10'
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = roles.filter(role =>
    role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const permissionCategories = [
    {
      name: 'Content Management',
      permissions: [
        { id: 'content.view', name: 'View Content' },
        { id: 'content.create', name: 'Create Content' },
        { id: 'content.edit', name: 'Edit Content' },
        { id: 'content.delete', name: 'Delete Content' }
      ]
    },
    {
      name: 'Course Management',
      permissions: [
        { id: 'courses.view', name: 'View Courses' },
        { id: 'courses.create', name: 'Create Courses' },
        { id: 'courses.edit', name: 'Edit Courses' },
        { id: 'courses.delete', name: 'Delete Courses' }
      ]
    },
    {
      name: 'User Management',
      permissions: [
        { id: 'users.view', name: 'View Users' },
        { id: 'users.create', name: 'Create Users' },
        { id: 'users.edit', name: 'Edit Users' },
        { id: 'users.delete', name: 'Delete Users' }
      ]
    },
    {
      name: 'Analytics',
      permissions: [
        { id: 'analytics.view', name: 'View Analytics' },
        { id: 'analytics.export', name: 'Export Reports' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
              <p className="text-sm text-gray-500 mt-1">Manage user roles and their permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Create Role
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
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Roles List */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Roles</h2>
              <div className="space-y-2">
                {filteredRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedRole?.id === role.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-300'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{role.displayName}</div>
                      {role.isSystem && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          System
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{role.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{role.userCount} users</span>
                      <span>•</span>
                      <span>{role.permissions.length === 1 && role.permissions[0] === 'all' ? 'All' : role.permissions.length} permissions</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Permissions Detail */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedRole ? (
              <div className="max-w-4xl">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRole.displayName}</h2>
                      <p className="text-gray-600">{selectedRole.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRole.isSystem ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                          System Role
                        </span>
                      ) : (
                        <>
                          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Users with this role</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedRole.userCount}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Permissions</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedRole.permissions.length === 1 && selectedRole.permissions[0] === 'all' ? 'All' : selectedRole.permissions.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                  {selectedRole.permissions.includes('all') ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">This role has all permissions</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {permissionCategories.map((category) => (
                        <div key={category.name}>
                          <h4 className="font-medium text-gray-900 mb-3">{category.name}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {category.permissions.map((permission) => {
                              const hasPermission = selectedRole.permissions.includes(permission.id);
                              return (
                                <div
                                  key={permission.id}
                                  className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                                    hasPermission
                                      ? 'bg-green-50 border-green-200'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <span className="text-sm text-gray-900">{permission.name}</span>
                                  {hasPermission ? (
                                    <CheckCircle2 size={18} className="text-green-600" />
                                  ) : (
                                    <XCircle size={18} className="text-gray-400" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Shield size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a role</h3>
                <p className="text-gray-500">Choose a role from the sidebar to view its permissions</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

