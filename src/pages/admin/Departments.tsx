import { useState } from 'react';
import { 
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  TrendingUp,
  Settings
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  employeeCount: number;
  courseCount: number;
  completionRate: number;
  createdAt: string;
}

interface DepartmentsProps {}

export function Departments({}: DepartmentsProps) {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      description: 'Software development and technical teams',
      head: 'John Doe',
      employeeCount: 125,
      courseCount: 24,
      completionRate: 87,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sales',
      description: 'Sales and business development',
      head: 'Jane Smith',
      employeeCount: 45,
      courseCount: 12,
      completionRate: 75,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Marketing',
      description: 'Marketing and communications',
      head: 'Mike Johnson',
      employeeCount: 32,
      courseCount: 15,
      completionRate: 92,
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      name: 'Human Resources',
      description: 'HR and talent management',
      head: 'Sarah Wilson',
      employeeCount: 18,
      courseCount: 8,
      completionRate: 95,
      createdAt: '2024-01-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-sm text-gray-500 mt-1">Manage organizational departments and their learning programs</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                Add Department
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
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredDepartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
              <p className="text-gray-500 mb-6">Add your first department to get started</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                Add Department
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            Head: {dept.head}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Employees</div>
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">{dept.employeeCount}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Courses</div>
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">{dept.courseCount}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
                            <div className="flex items-center gap-2">
                              <TrendingUp size={16} className="text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">{dept.completionRate}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Created</div>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(dept.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Overall Progress</span>
                            <span className="font-medium text-gray-900">{dept.completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${dept.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Settings size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

