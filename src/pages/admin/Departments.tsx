import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Users,
  BookOpen,
  TrendingUp,
  Settings,
  X,
  Save,
  Loader,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

interface Department {
  id: string;
  name: string;
  description: string;
  manager_id: string | null;
  manager_name: string | null;
  parent_id: string | null;
  employee_count: number;
  course_count: number;
  completionRate: number;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'courses' | 'settings'>('overview');
  const [members, setMembers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    manager_id: '',
    parent_id: ''
  });

  // Edit Form State (for Settings tab)
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    manager_id: '',
    parent_id: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  // Update edit form when selected department changes
  useEffect(() => {
    if (selectedDept) {
      setEditFormData({
        name: selectedDept.name,
        description: selectedDept.description || '',
        manager_id: selectedDept.manager_id || '',
        parent_id: selectedDept.parent_id || ''
      });

      setActiveTab('overview'); // Reset to overview on selection change
      fetchMembers(selectedDept.id);
      fetchCourses(selectedDept.id);
    }
  }, [selectedDept]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/departments');
      setDepartments(data.departments || []);
    } catch (error) {
      showError('Failed to fetch departments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users?limit=100');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };


  const fetchMembers = async (deptId: string) => {
    try {
      const data = await api.get(`/departments/${deptId}/members`);
      setMembers(data || []);
    } catch (error) {
      console.error('Failed to fetch members', error);
    }
  };

  const fetchCourses = async (deptId: string) => {
    try {
      const data = await api.get(`/departments/${deptId}/courses`);
      setCourses(data || []);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newDept = await api.post('/departments', createFormData);
      showSuccess('Department created successfully');
      setShowCreateModal(false);
      setCreateFormData({ name: '', description: '', manager_id: '', parent_id: '' });
      await fetchDepartments();

      // Select the new department (optimistic find or fetch result)
      // Since fetchDepartments updates state asynchronously, we might need to rely on the response
      // But for now, let's just let the user select it or find it in the list.
      // Better yet, try to find it in the refreshed list if possible, or just set it if API returns full object
      if (newDept && newDept.id) {
        // We need the full object with stats to select it properly, which the create response might not have fully populated (e.g. counts)
        // So we'll just refresh the list.
      }
    } catch (error) {
      showError('Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;

    setSaving(true);
    try {
      await api.put(`/departments/${selectedDept.id}`, editFormData);
      showSuccess('Department updated successfully');

      // Update local state
      const updatedDept = { ...selectedDept, ...editFormData };
      // We might need to update manager_name if manager_id changed, but that requires looking up the user.
      // Simplest is to re-fetch or just update the fields we know.
      if (editFormData.manager_id) {
        const manager = users.find(u => u.id === editFormData.manager_id);
        updatedDept.manager_name = manager ? manager.name : null;
      } else {
        updatedDept.manager_name = null;
      }

      setSelectedDept(updatedDept);
      setDepartments(departments.map(d => d.id === selectedDept.id ? updatedDept : d));
    } catch (error) {
      showError('Failed to update department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      showSuccess('Department deleted successfully');
      if (selectedDept?.id === id) {
        setSelectedDept(null);
      }
      fetchDepartments();
    } catch (error) {
      showError('Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your organization structure</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Department
              </button>
              {selectedDept && (
                <button
                  onClick={() => handleDelete(selectedDept.id)}
                  className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Department
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Department List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Inline Create Form */}
              {showCreateModal && (
                <div className="p-4 border-b border-gray-100 bg-purple-50">
                  <form onSubmit={handleCreate}>
                    <div className="mb-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Department Name"
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        placeholder="Description (optional)"
                        value={createFormData.description}
                        onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-16"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false);
                          setCreateFormData({ name: '', description: '', manager_id: '', parent_id: '' });
                        }}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-3 py-1 bg-purple-600 text-white rounded-md text-xs font-medium hover:bg-purple-700 disabled:opacity-50"
                      >
                        {saving ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Building2 className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">No departments found</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredDepartments.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept)}
                      className={`w-full text-left p-3 rounded-lg transition-colors border-2 flex items-center justify-between group ${selectedDept?.id === dept.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                        : 'hover:bg-gray-50 border-transparent'
                        }`}
                    >
                      <div className="min-w-0">
                        <h3 className={`font-medium truncate ${selectedDept?.id === dept.id ? 'text-purple-900' : 'text-gray-900'}`}>
                          {dept.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {dept.employee_count} employees
                        </p>
                      </div>
                      <ChevronRight size={16} className={`text-gray-400 ${selectedDept?.id === dept.id ? 'text-purple-500' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            {selectedDept ? (
              <>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="text-purple-600" size={24} />
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h1>
                    </div>
                    <p className="text-gray-500 max-w-2xl">{selectedDept.description || 'No description provided'}</p>
                    {selectedDept.manager_name && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Head:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{selectedDept.manager_name}</span>
                      </div>
                    )}
                  </div>

                </header>

                {/* Tabs */}
                <div className="bg-white border-b border-gray-200 px-8">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <LayoutDashboard size={18} />
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Settings size={18} />
                      Settings
                    </button>
                    <button
                      onClick={() => setActiveTab('members')}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'members'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Users size={18} />
                      Members
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {members.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'courses'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <BookOpen size={18} />
                      Courses
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {courses.length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  {activeTab === 'overview' && (
                    <div className="max-w-4xl space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                            <Users className="text-blue-500" size={20} />
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{selectedDept.employee_count}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
                            <BookOpen className="text-purple-500" size={20} />
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{selectedDept.course_count}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                            <TrendingUp className="text-green-500" size={20} />
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{selectedDept.completionRate}%</p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${selectedDept.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Placeholder for future content like "Recent Activity" or "Top Performers" */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
                        <p>More detailed analytics and member lists coming soon.</p>
                      </div>
                    </div>
                  )}



                  {activeTab === 'members' && (
                    <div className="max-w-4xl">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {members.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  No members found in this department
                                </td>
                              </tr>
                            ) : (
                              members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">
                                        {member.name.charAt(0)}
                                      </div>
                                      <span className="font-medium text-gray-900">{member.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.role === 'manager'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-gray-100 text-gray-700'
                                      }`}>
                                      {member.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(member.joined_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'courses' && (
                    <div className="max-w-4xl">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {courses.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  No courses assigned to this department
                                </td>
                              </tr>
                            ) : (
                              courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <BookOpen size={16} />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{course.title}</p>
                                        <p className="text-xs text-gray-500">{course.instructor_name}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{course.category_name || '-'}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {course.due_date ? new Date(course.due_date).toLocaleDateString() : '-'}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.priority === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : course.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                      }`}>
                                      {course.priority || 'Normal'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Department Settings</h3>
                        <form onSubmit={handleUpdate} className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
                            <select
                              value={editFormData.manager_id}
                              onChange={(e) => setEditFormData({ ...editFormData, manager_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Select a manager...</option>
                              {users.map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                            <select
                              value={editFormData.parent_id}
                              onChange={(e) => setEditFormData({ ...editFormData, parent_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">None (Top Level)</option>
                              {departments
                                .filter(d => d.id !== selectedDept.id)
                                .map(dept => (
                                  <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="flex justify-end pt-4">
                            <button
                              type="submit"
                              disabled={saving}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                            >
                              {saving ? (
                                <>
                                  <Loader size={16} className="animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={16} />
                                  Save Changes
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Department Selected</h3>
                <p className="max-w-sm text-center mt-2">Select a department from the sidebar to view details and manage settings.</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
