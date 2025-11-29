import { useState } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Eye, 
  Trash2, 
  Edit, 
  FileText, 
  Video, 
  Image,
  ChevronDown,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Module {
  id: string;
  title: string;
  type: 'content' | 'video' | 'quiz' | 'assignment';
  content?: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
  status: 'draft' | 'published';
}

interface CourseBuilderProps {}

export function CourseBuilder({}: CourseBuilderProps) {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the fundamentals of UI/UX design',
      modules: [
        { id: 'm1', title: 'Introduction to UI/UX', type: 'content', order: 1 },
        { id: 'm2', title: 'Design Principles', type: 'content', order: 2 },
        { id: 'm3', title: 'User Research', type: 'video', order: 3 }
      ],
      status: 'draft'
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const addModule = () => {
    if (!selectedCourse) return;
    
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: 'New Module',
      type: 'content',
      order: selectedCourse.modules.length + 1
    };

    const updatedCourse = {
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    };

    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    setExpandedModules(new Set([...expandedModules, newModule.id]));
  };

  const deleteModule = (moduleId: string) => {
    if (!selectedCourse) return;
    
    const updatedCourse = {
      ...selectedCourse,
      modules: selectedCourse.modules.filter(m => m.id !== moduleId)
    };

    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    if (!selectedCourse) return;
    
    const updatedCourse = {
      ...selectedCourse,
      modules: selectedCourse.modules.map(m => 
        m.id === moduleId ? { ...m, ...updates } : m
      )
    };

    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
  };

  const createNewCourse = () => {
    if (!newCourseTitle.trim()) return;

    const newCourse: Course = {
      id: `c${Date.now()}`,
      title: newCourseTitle,
      description: newCourseDescription,
      modules: [],
      status: 'draft'
    };

    setCourses([...courses, newCourse]);
    setSelectedCourse(newCourse);
    setNewCourseTitle('');
    setNewCourseDescription('');
    setIsCreatingCourse(false);
  };

  const saveCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.map(c => c.id === selectedCourse.id ? selectedCourse : c));
    // TODO: Save to backend
    alert('Course saved successfully!');
  };

  const getModuleIcon = (type: Module['type']) => {
    switch (type) {
      case 'content':
        return <FileText size={16} className="text-blue-600" />;
      case 'video':
        return <Video size={16} className="text-purple-600" />;
      case 'quiz':
        return <FileText size={16} className="text-green-600" />;
      case 'assignment':
        return <FileText size={16} className="text-orange-600" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Builder</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage your courses</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingCourse(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                New Course
              </button>
              {selectedCourse && (
                <button
                  onClick={saveCourse}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Save size={16} />
                  Save Course
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Course List */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">My Courses</h2>
              {isCreatingCourse ? (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createNewCourse}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingCourse(false);
                        setNewCourseTitle('');
                        setNewCourseDescription('');
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
              
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCourse?.id === course.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-300'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{course.title}</div>
                    <div className="text-xs text-gray-500">
                      {course.modules.length} modules • {course.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedCourse ? (
              <div className="max-w-4xl mx-auto">
                {/* Course Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) => {
                      const updated = { ...selectedCourse, title: e.target.value };
                      setSelectedCourse(updated);
                      setCourses(courses.map(c => c.id === selectedCourse.id ? updated : c));
                    }}
                    className="text-2xl font-bold text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                  />
                  <textarea
                    value={selectedCourse.description}
                    onChange={(e) => {
                      const updated = { ...selectedCourse, description: e.target.value };
                      setSelectedCourse(updated);
                      setCourses(courses.map(c => c.id === selectedCourse.id ? updated : c));
                    }}
                    placeholder="Course description..."
                    className="w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    rows={3}
                  />
                </div>

                {/* Modules */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
                    <button
                      onClick={addModule}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Module
                    </button>
                  </div>
                  <div className="p-6">
                    {selectedCourse.modules.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No modules yet</p>
                        <button
                          onClick={addModule}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Add Your First Module
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedCourse.modules.map((module) => (
                          <div
                            key={module.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="flex items-center gap-2 p-3 bg-gray-50">
                              <GripVertical size={16} className="text-gray-400 cursor-move" />
                              <button
                                onClick={() => toggleModule(module.id)}
                                className="flex-1 flex items-center gap-2 text-left"
                              >
                                {expandedModules.has(module.id) ? (
                                  <ChevronDown size={16} className="text-gray-400" />
                                ) : (
                                  <ChevronRight size={16} className="text-gray-400" />
                                )}
                                {getModuleIcon(module.type)}
                                <input
                                  type="text"
                                  value={module.title}
                                  onChange={(e) => updateModule(module.id, { title: e.target.value })}
                                  className="flex-1 font-medium text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </button>
                              <select
                                value={module.type}
                                onChange={(e) => updateModule(module.id, { type: e.target.value as Module['type'] })}
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="content">Content</option>
                                <option value="video">Video</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                              </select>
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {expandedModules.has(module.id) && (
                              <div className="p-4 bg-white">
                                <textarea
                                  placeholder="Module content..."
                                  value={module.content || ''}
                                  onChange={(e) => updateModule(module.id, { content: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                  rows={4}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No course selected</h3>
                <p className="text-gray-500 mb-6">Select a course from the sidebar or create a new one</p>
                <button
                  onClick={() => setIsCreatingCourse(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create New Course
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

