import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Search,
    Plus,
    Users,
    User,
    Calendar,
    CheckCircle2,
    X,
    Filter,
    MoreVertical,
    Trash2
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function CourseAssignments() {
    const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'assignments'
    const [courses, setCourses] = useState<any[]>([]);
    const [learningPaths, setLearningPaths] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [selectedPath, setSelectedPath] = useState<any>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignType, setAssignType] = useState('user'); // 'user' or 'group'
    const [targetId, setTargetId] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [dueDate, setDueDate] = useState('');
    const { showToast } = useToast();

    const showSuccess = (message: string) => showToast(message, 'success');
    const showError = (message: string) => showToast(message, 'error');

    useEffect(() => {
        if (activeTab === 'courses') {
            fetchCourses();
        } else if (activeTab === 'learning-paths') {
            fetchLearningPaths();
        } else {
            fetchAssignments();
        }
    }, [activeTab]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await api.getCourses(1, 100, searchQuery, 'published');
            setCourses(data.courses || []);
        } catch (error) {
            showError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchLearningPaths = async () => {
        try {
            setLoading(true);
            const data = await api.getLearningPaths(1, 100, searchQuery, 'published');
            setLearningPaths(data.paths || []);
        } catch (error) {
            showError('Failed to fetch learning paths');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            // Placeholder for fetching assignments
            setLoading(false);
        } catch (error) {
            showError('Failed to fetch assignments');
            setLoading(false);
        }
    };

    const fetchSelectionData = async () => {
        try {
            const [usersData, groupsData] = await Promise.all([
                api.getUsers(1, 100),
                api.getUserGroups(1, 100)
            ]);
            setUsers(usersData.users || []);
            setGroups(groupsData.groups || []);
        } catch (error) {
            console.error(error);
            showError('Failed to load users/groups');
        }
    };

    const handleOpenAssignModal = (item, type = 'course') => {
        if (type === 'course') {
            setSelectedCourse(item);
            setSelectedPath(null);
        } else {
            setSelectedPath(item);
            setSelectedCourse(null);
        }
        fetchSelectionData();
        setShowAssignModal(true);
        setTargetId('');
        setDueDate('');
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!targetId) {
            showError('Please select a user or group');
            return;
        }

        try {
            if (selectedCourse) {
                await api.createCourseAssignment({
                    course_id: selectedCourse.id,
                    user_id: assignType === 'user' ? targetId : null,
                    group_id: assignType === 'group' ? targetId : null,
                    due_date: dueDate || null
                });
                showSuccess('Course assigned successfully');
            } else if (selectedPath) {
                await api.assignLearningPath({
                    learning_path_id: selectedPath.id,
                    user_id: assignType === 'user' ? targetId : null,
                    group_id: assignType === 'group' ? targetId : null,
                    due_date: dueDate || null
                });
                showSuccess('Learning Path assigned successfully');
            }
            setShowAssignModal(false);
        } catch (error) {
            showError(error.message || 'Failed to assign');
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPaths = learningPaths.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isModalOpen = showAssignModal;

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
                            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                            <p className="text-sm text-gray-500 mt-1">Assign courses and learning paths to users or departments</p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="bg-white border-b border-gray-200 px-6">
                    <div className="flex gap-6">
                        <button
                            className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'courses'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('courses')}
                        >
                            Assign by Course
                        </button>
                        <button
                            className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'learning-paths'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('learning-paths')}
                        >
                            Assign by Learning Path
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'courses' ? 'courses' : 'learning paths'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Course List */}
                    {activeTab === 'courses' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-50 rounded-lg">
                                                        <BookOpen className="text-purple-600" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{course.title}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-xs">{course.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {course.category_name || 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-700' :
                                                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenAssignModal(course, 'course')}
                                                    className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCourses.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No courses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Learning Path List */}
                    {activeTab === 'learning-paths' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Learning Path</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPaths.map((path) => (
                                        <tr key={path.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <BookOpen className="text-blue-600" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{path.title}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-xs">{path.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {path.category_name || 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${path.status === 'published' ? 'bg-green-100 text-green-700' :
                                                    path.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {path.status.charAt(0).toUpperCase() + path.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenAssignModal(path, 'learning-path')}
                                                    className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPaths.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No learning paths found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* Assign Modal */}
            {showAssignModal && (selectedCourse || selectedPath) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Assign {selectedCourse ? 'Course' : 'Learning Path'}
                            </h2>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <p className="text-sm text-purple-700 mb-1 font-medium">
                                    Selected {selectedCourse ? 'Course' : 'Learning Path'}
                                </p>
                                <p className="font-bold text-gray-900">
                                    {selectedCourse ? selectedCourse.title : selectedPath.title}
                                </p>
                            </div>

                            <form onSubmit={handleAssign}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Assign To</label>
                                    <div className="flex gap-4 mb-4">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${assignType === 'user' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="assignType"
                                                value="user"
                                                checked={assignType === 'user'}
                                                onChange={(e) => {
                                                    setAssignType(e.target.value);
                                                    setTargetId('');
                                                }}
                                                className="hidden"
                                            />
                                            <User size={18} />
                                            <span className="font-medium">Individual User</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${assignType === 'group' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="assignType"
                                                value="group"
                                                checked={assignType === 'group'}
                                                onChange={(e) => {
                                                    setAssignType(e.target.value);
                                                    setTargetId('');
                                                }}
                                                className="hidden"
                                            />
                                            <Users size={18} />
                                            <span className="font-medium">Group / Dept</span>
                                        </label>
                                    </div>

                                    {assignType === 'user' ? (
                                        <select
                                            required
                                            value={targetId}
                                            onChange={(e) => setTargetId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            required
                                            value={targetId}
                                            onChange={(e) => setTargetId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Group</option>
                                            {groups.map(group => (
                                                <option key={group.id} value={group.id}>{group.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="datetime-local"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssignModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                                    >
                                        Assign {selectedCourse ? 'Course' : 'Learning Path'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
