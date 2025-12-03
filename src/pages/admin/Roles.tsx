import { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../utils/api';

interface Permission {
  id: string;
  key: string;
  name: string;
  description: string | null;
}

interface PermissionCategory {
  category: string;
  permissions: Permission[];
}

interface RoleSummary {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  user_count?: number;
  is_system_role?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

interface RoleDetail extends RoleSummary {
  permissions: string[];
}

const defaultRoleForm = {
  name: '',
  display_name: '',
  description: ''
};

export function Roles() {
  const { showSuccess, showError } = useToast();
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState<PermissionCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingRoleDetail, setLoadingRoleDetail] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);
  const [assignmentSet, setAssignmentSet] = useState<Set<string>>(new Set());
  const [permissionsDirty, setPermissionsDirty] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState(defaultRoleForm);
  const [newRoleErrors, setNewRoleErrors] = useState<Record<string, string>>({});
  const [savingRole, setSavingRole] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editRoleForm, setEditRoleForm] = useState(defaultRoleForm);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletingRole, setDeletingRole] = useState(false);

  useEffect(() => {
    fetchPermissionsCatalog();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      fetchRoleDetail(selectedRoleId);
    } else {
      setSelectedRole(null);
    }
  }, [selectedRoleId]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await api.getRoles();
      setRoles(data || []);
      if (!selectedRoleId && data?.length > 0) {
        setSelectedRoleId(data[0].id);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to load roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchRoleDetail = async (id: string) => {
    try {
      setLoadingRoleDetail(true);
      const role = await api.getRole(id);
      setSelectedRole(role);
      setAssignmentSet(new Set(role.permissions || []));
      setPermissionsDirty(false);
      setEditingRole(false);
      setEditRoleForm({
        name: role.name,
        display_name: role.display_name,
        description: role.description || ''
      });
    } catch (err: any) {
      showError(err.message || 'Failed to load role');
    } finally {
      setLoadingRoleDetail(false);
    }
  };

  const fetchPermissionsCatalog = async () => {
    try {
      const data = await api.getPermissions();
      setPermissionsCatalog(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load permissions');
    }
  };

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.display_name.toLowerCase().includes(q) ||
        role.description?.toLowerCase().includes(q) ||
        role.name.toLowerCase().includes(q)
    );
  }, [roles, searchQuery]);

  const stats = useMemo(() => {
    const totalUsers = roles.reduce((sum, role) => sum + (role.user_count || 0), 0);
    return [
      { label: 'Total Roles', value: roles.length.toString(), icon: Shield, bg: 'bg-purple-50', color: 'text-purple-700' },
      { label: 'System Roles', value: roles.filter((r) => r.is_system_role).length.toString(), icon: CheckCircle2, bg: 'bg-blue-50', color: 'text-blue-700' },
      { label: 'Custom Roles', value: roles.filter((r) => !r.is_system_role).length.toString(), icon: Users, bg: 'bg-green-50', color: 'text-green-700' },
      { label: 'Assigned Users', value: totalUsers.toString(), icon: Users, bg: 'bg-gray-50', color: 'text-gray-700' }
    ];
  }, [roles]);

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDeleteConfirmation('');
  };

  const togglePermission = (key: string) => {
    if (selectedRole?.is_system_role) return;
    setAssignmentSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setPermissionsDirty(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSavingPermissions(true);
    try {
      const keys = Array.from(assignmentSet);
      await api.updateRolePermissions(selectedRole.id, keys);
      showSuccess('Permissions updated successfully');
      setPermissionsDirty(false);
      setSelectedRole((prev) => (prev ? { ...prev, permissions: keys } : prev));
    } catch (err: any) {
      showError(err.message || 'Failed to update permissions');
    } finally {
      setSavingPermissions(false);
    }
  };

  const validateRoleForm = (form: typeof defaultRoleForm, isCreate = true) => {
    const errors: Record<string, string> = {};
    if (isCreate) {
      if (!form.name.trim()) {
        errors.name = 'Role key is required';
      } else if (!/^[a-z0-9_\-]+$/.test(form.name)) {
        errors.name = 'Use lowercase letters, numbers, - or _';
      }
    }
    if (!form.display_name.trim()) {
      errors.display_name = 'Display name is required';
    }
    return errors;
  };

  const handleCreateRole = async () => {
    const errors = validateRoleForm(newRoleForm, true);
    setNewRoleErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSavingRole(true);
      const payload = {
        name: newRoleForm.name.trim(),
        display_name: newRoleForm.display_name.trim(),
        description: newRoleForm.description.trim() || null
      };
      const role = await api.createRole(payload);
      setRoles((prev) => [...prev, role]);
      showSuccess('Role created successfully');
      setNewRoleForm(defaultRoleForm);
      setCreatingRole(false);
      setSelectedRoleId(role.id);
    } catch (err: any) {
      showError(err.message || 'Failed to create role');
    } finally {
      setSavingRole(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    const errors = validateRoleForm(editRoleForm, false);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSavingRole(true);
      const payload = {
        display_name: editRoleForm.display_name.trim(),
        description: editRoleForm.description.trim() || null
      };
      const updated = await api.updateRole(selectedRole.id, payload);
      showSuccess('Role updated successfully');
      setRoles((prev) =>
        prev.map((role) => (role.id === updated.id ? { ...role, ...updated } : role))
      );
      setSelectedRole((prev) => (prev ? { ...prev, ...updated } : prev));
      setEditingRole(false);
    } catch (err: any) {
      showError(err.message || 'Failed to update role');
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    if (deleteConfirmation !== selectedRole.display_name) {
      showError('Confirmation text does not match role name');
      return;
    }
    try {
      setDeletingRole(true);
      await api.deleteRole(selectedRole.id);
      showSuccess('Role deleted successfully');
      setRoles((prev) => prev.filter((role) => role.id !== selectedRole.id));
      setSelectedRoleId(null);
      setSelectedRole(null);
      setDeleteConfirmation('');
    } catch (err: any) {
      showError(err.message || 'Failed to delete role');
    } finally {
      setDeletingRole(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const allPermissionKeys = useMemo(
    () => permissionsCatalog.flatMap((category) => category.permissions.map((perm) => perm.key)),
    [permissionsCatalog]
  );

  const selectedHasAllPermissions =
    selectedRole && assignmentSet.size === allPermissionKeys.length && allPermissionKeys.length > 0;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage user roles, descriptions, and the access each role grants.
              </p>
            </div>
            <button
              onClick={() => {
                setCreatingRole((prev) => !prev);
                setNewRoleForm(defaultRoleForm);
                setNewRoleErrors({});
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} />
              {creatingRole ? 'Close' : 'Create Role'}
            </button>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={stat.color} size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <main className="flex-1 flex overflow-hidden">
          <aside className="w-96 max-w-sm bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              {creatingRole && (
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Create Role</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Role Key <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newRoleForm.name}
                        onChange={(e) =>
                          setNewRoleForm({
                            ...newRoleForm,
                            name: e.target.value.toLowerCase().replace(/\s+/g, '_')
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g. compliance_manager"
                      />
                      {newRoleErrors.name && <p className="text-xs text-red-600 mt-1">{newRoleErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Display Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newRoleForm.display_name}
                        onChange={(e) => setNewRoleForm({ ...newRoleForm, display_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Compliance Manager"
                      />
                      {newRoleErrors.display_name && (
                        <p className="text-xs text-red-600 mt-1">{newRoleErrors.display_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        value={newRoleForm.description}
                        onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                        placeholder="What is the purpose of this role?"
                      />
                    </div>
                    <button
                      onClick={handleCreateRole}
                      disabled={savingRole}
                      className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                      {savingRole ? 'Creating...' : 'Create Role'}
                    </button>
                  </div>
                </div>
              )}

              {loadingRoles ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-purple-600" size={24} />
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">No roles match your search.</div>
              ) : (
                filteredRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      selectedRoleId === role.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300 shadow-sm'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900 truncate">{role.display_name}</div>
                      {role.is_system_role ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium uppercase">
                          System
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium uppercase">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{role.description || 'No description'}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{role.user_count || 0} users</span>
                      <span>•</span>
                      <span>{role.name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="flex-1 overflow-y-auto p-6">
            {loadingRoleDetail ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-purple-600" size={32} />
              </div>
            ) : selectedRole ? (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedRole.display_name}</h2>
                        {selectedRole.is_system_role ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            System Role
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Key: {selectedRole.name}</p>

                      {editingRole ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
                            <input
                              type="text"
                              value={editRoleForm.display_name}
                              onChange={(e) => setEditRoleForm({ ...editRoleForm, display_name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {editErrors.display_name && (
                              <p className="text-xs text-red-600 mt-1">{editErrors.display_name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                            <textarea
                              value={editRoleForm.description}
                              onChange={(e) => setEditRoleForm({ ...editRoleForm, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                              placeholder="Describe what this role is intended for"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleUpdateRole}
                              disabled={savingRole}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                            >
                              {savingRole ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingRole(false);
                                setEditErrors({});
                                setEditRoleForm({
                                  name: selectedRole.name,
                                  display_name: selectedRole.display_name,
                                  description: selectedRole.description || ''
                                });
                              }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedRole.description || 'No description provided.'}
                          </p>
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => setEditingRole(true)}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2"
                            >
                              <Edit size={16} /> Edit Role
                            </button>
                            {!selectedRole.is_system_role && (
                              <button
                                onClick={() => setDeleteConfirmation('')}
                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2"
                              >
                                <Trash2 size={16} /> Delete Role
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                  <div className="space-y-4">
                    {permissionsCatalog.map((category) => (
                      <div key={category.category}>
                        <h4 className="text-md font-bold text-gray-900 mb-2">{category.category}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.permissions.map((permission) => (
                            <div key={permission.key} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`permission-${permission.key}`}
                                checked={assignmentSet.has(permission.key)}
                                onChange={() => togglePermission(permission.key)}
                                className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`permission-${permission.key}`} className="text-sm text-gray-700">
                                {permission.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSavePermissions}
                      disabled={savingPermissions}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                      {savingPermissions ? 'Saving...' : 'Save Permissions'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-sm">Select a role to view details.</div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

