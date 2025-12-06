import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Trash2,
    X,
    Settings,
    ChevronRight,
    Save
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function UserGroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [groupMembers, setGroupMembers] = useState<any[]>([]);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('members'); // 'members' or 'settings'
    const [saving, setSaving] = useState(false);

    // Form state for creating group
    const [createFormData, setCreateFormData] = useState({
        name: '',
        description: ''
    });

    // Form state for editing group
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: ''
    });

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchGroupMembers(selectedGroup.id);
            setEditFormData({
                name: selectedGroup.name,
                description: selectedGroup.description || ''
            });
        }
    }, [selectedGroup]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const data = await api.get('/user-groups');
            setGroups(data.groups || []);
        } catch (error) {
            showError('Failed to fetch user groups');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupMembers = async (groupId) => {
        try {
            const data = await api.get(`/user-groups/${groupId}/members`);
            setGroupMembers(data || []);
        } catch (error) {
            showError('Failed to fetch group members');
        }
    };

    const fetchAvailableUsers = async (search = '') => {
        try {
            // Fetch users with search query
            const data = await api.get(`/users?limit=20&search=${encodeURIComponent(search)}`);
            setAvailableUsers(data.users || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Load available users when searching for members
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAvailableUsers(memberSearchQuery);
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [memberSearchQuery]);

    const filteredAvailableUsers = availableUsers.filter(user =>
        !groupMembers.some(member => member.id === user.id)
    );

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const group = await api.post('/user-groups', createFormData);
            showSuccess('Group created successfully');
            setShowCreateForm(false);
            setCreateFormData({ name: '', description: '' });
            await fetchGroups();
            // Select the newly created group
            const newGroups = await api.get('/user-groups');
            const createdGroup = newGroups.groups.find(g => g.name === createFormData.name); // Fallback if API doesn't return it
            if (createdGroup) setSelectedGroup(createdGroup);
        } catch (error) {
            showError('Failed to create group');
        }
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        if (!selectedGroup) return;

        try {
            setSaving(true);
            await api.put(`/user-groups/${selectedGroup.id}`, editFormData);
            showSuccess('Group updated successfully');

            // Update local state
            const updatedGroup = { ...selectedGroup, ...editFormData };
            setSelectedGroup(updatedGroup);
            setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
        } catch (error) {
            showError('Failed to update group');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await api.delete(`/user-groups/${groupId}`);
            showSuccess('Group deleted successfully');
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(null);
            }
            fetchGroups();
        } catch (error) {
            showError('Failed to delete group');
        }
    };

    const handleAddMember = async (userId) => {
        try {
            await api.post(`/user-groups/${selectedGroup.id}/members`, { userId });
            showSuccess('Member added successfully');
            fetchGroupMembers(selectedGroup.id);
            setMemberSearchQuery(''); // Clear search to close dropdown
        } catch (error) {
            showError('Failed to add member');
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            await api.delete(`/user-groups/${selectedGroup.id}/members/${userId}`);
            showSuccess('Member removed successfully');
            fetchGroupMembers(selectedGroup.id);
        } catch (error) {
            showError('Failed to remove member');
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Admin Sidebar (Navigation) */}
            <AdminSidebar />

            {/* Main Layout Container */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Global Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage user groups and memberships</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                New Group
                            </button>
                            {selectedGroup && (
                                <button
                                    onClick={() => handleDeleteGroup(selectedGroup.id)}
                                    className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete Group
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar: Group List */}
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Inline Create Form */}
                            {showCreateForm && (
                                <div className="p-4 border-b border-gray-100 bg-purple-50">
                                    <form onSubmit={handleCreateGroup}>
                                        <div className="mb-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Group Name"
                                                value={createFormData.name}
                                                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateForm(false);
                                                    setCreateFormData({ name: '', description: '' });
                                                }}
                                                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1 bg-purple-600 text-white rounded-md text-xs font-medium hover:bg-purple-700"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : filteredGroups.length === 0 && !showCreateForm ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Users className="mx-auto mb-2 opacity-50" size={32} />
                                    <p className="text-sm">No groups found</p>
                                </div>
                            ) : (
                                <div className="space-y-2 p-2">
                                    {filteredGroups.map(group => (
                                        <button
                                            key={group.id}
                                            onClick={() => setSelectedGroup(group)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors border-2 flex items-center justify-between group ${selectedGroup?.id === group.id
                                                ? 'bg-gradient-to-r from-purple-50 to-green-50 border-purple-300'
                                                : 'hover:bg-gray-50 border-transparent'
                                                }`}
                                        >
                                            <div className="min-w-0">
                                                <h3 className={`font-medium truncate ${selectedGroup?.id === group.id ? 'text-purple-900' : 'text-gray-900'}`}>
                                                    {group.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {group.member_count || 0} members
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className={`text-gray-400 ${selectedGroup?.id === group.id ? 'text-purple-500' : 'opacity-0 group-hover:opacity-100'}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                        {selectedGroup ? (
                            <>
                                {/* Header */}
                                <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Users className="text-purple-600" size={24} />
                                            </div>
                                            <h1 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h1>
                                        </div>
                                        <p className="text-gray-500 max-w-2xl">{selectedGroup.description || 'No description provided'}</p>
                                    </div>

                                </header>

                                {/* Tabs */}
                                <div className="bg-white border-b border-gray-200 px-8">
                                    <div className="flex gap-6">
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
                                                {groupMembers.length}
                                            </span>
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
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-8">
                                    {activeTab === 'members' && (
                                        <div className="max-w-4xl">
                                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                                                    <h3 className="font-medium text-gray-900">Add Members</h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="text"
                                                            placeholder="Search users to add..."
                                                            value={memberSearchQuery}
                                                            onChange={(e) => setMemberSearchQuery(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        />
                                                        {memberSearchQuery && filteredAvailableUsers.length > 0 && (
                                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                                {filteredAvailableUsers.map(user => (
                                                                    <button
                                                                        key={user.id}
                                                                        onClick={() => handleAddMember(user.id)}
                                                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group border-b border-gray-50 last:border-0"
                                                                    >
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <span className="text-xs font-medium">Add</span>
                                                                            <Plus size={16} />
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {groupMembers.map(member => (
                                                            <tr key={member.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">
                                                                            {(member.name || member.email).charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <span className="font-medium text-gray-900">{member.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                                        {member.role || 'User'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <button
                                                                        onClick={() => handleRemoveMember(member.id)}
                                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                                        title="Remove member"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {groupMembers.length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                                    <Users className="mx-auto mb-3 text-gray-300" size={48} />
                                                                    <p>No members in this group yet</p>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'settings' && (
                                        <div className="max-w-2xl">
                                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-6">Group Settings</h3>
                                                <form onSubmit={handleUpdateGroup} className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
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
                                                    <div className="flex justify-end pt-4">
                                                        <button
                                                            type="submit"
                                                            disabled={saving}
                                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {saving ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                                    <Users size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No Group Selected</h3>
                                <p className="max-w-sm text-center mt-2">Select a group from the sidebar to view details, manage members, and edit settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
