import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    UserPlus,
    X,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function UserGroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [groupMembers, setGroupMembers] = useState<any[]>([]);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [memberSearchQuery, setMemberSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchGroups();
    }, []);

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

    const fetchAvailableUsers = async () => {
        try {
            // In a real app, you might want to paginate this or search dynamically
            const data = await api.get('/users?limit=100');
            setAvailableUsers(data.users || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user-groups', formData);
            showSuccess('Group created successfully');
            setShowCreateModal(false);
            setFormData({ name: '', description: '' });
            fetchGroups();
        } catch (error) {
            showError('Failed to create group');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await api.delete(`/user-groups/${groupId}`);
            showSuccess('Group deleted successfully');
            fetchGroups();
        } catch (error) {
            showError('Failed to delete group');
        }
    };

    const handleManageMembers = (group) => {
        setSelectedGroup(group);
        fetchGroupMembers(group.id);
        fetchAvailableUsers();
        setShowMembersModal(true);
    };

    const handleAddMember = async (userId) => {
        try {
            await api.post(`/user-groups/${selectedGroup.id}/members`, { userId });
            showSuccess('Member added successfully');
            fetchGroupMembers(selectedGroup.id);
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

    const filteredAvailableUsers = availableUsers.filter(user =>
        !groupMembers.some(member => member.id === user.id) &&
        (user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    );

    const isModalOpen = showCreateModal || showMembersModal;

    return (
        <div className={`flex h-screen bg-gray-50 overflow-hidden ${isModalOpen ? 'relative' : ''}`}>
            <div className={isModalOpen ? 'blur-[2px] pointer-events-none select-none transition-all duration-300' : 'transition-all duration-300'}>
                <AdminSidebar />
            </div>

            <div className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300 ${isModalOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage departments and user groups</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus size={16} />
                                Create Group
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="relative">
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
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading groups...</p>
                            </div>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No groups found</h3>
                            <p className="text-gray-500 mb-4">Get started by creating a new user group.</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                Create Group
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <Users size={24} className="text-purple-600" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleManageMembers(group)}
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Manage Members"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGroup(group.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Group"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description || 'No description provided'}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <span>{group.member_count || 0} members</span>
                                        <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create User Group</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Engineering Department"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                                    placeholder="Describe the purpose of this group..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Members Modal */}
            {showMembersModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Manage Members</h2>
                                <p className="text-sm text-gray-500">{selectedGroup.name}</p>
                            </div>
                            <button
                                onClick={() => setShowMembersModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
                            {/* Add Member Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-700">Add New Member</h3>
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users to add..."
                                        value={memberSearchQuery}
                                        onChange={(e) => {
                                            setMemberSearchQuery(e.target.value);
                                            // searchUsers(e.target.value); // Assuming this was a typo in original code or missing function
                                        }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {memberSearchQuery && filteredAvailableUsers.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredAvailableUsers.map(user => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => {
                                                        handleAddMember(user.id);
                                                        setMemberSearchQuery('');
                                                    }}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                    <Plus size={16} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Current Members List */}
                            <div className="flex-1 overflow-y-auto">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Members ({groupMembers.length})</h3>
                                <div className="space-y-2">
                                    {groupMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">
                                                    {(member.name || member.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                title="Remove member"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {groupMembers.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">No members in this group yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
