import { useState } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Trash2, 
  Edit, 
  BookOpen,
  GraduationCap,
  ChevronRight,
  GripVertical,
  Search
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Course {
  id: string;
  title: string;
  modules: number;
  duration: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  status: 'draft' | 'published';
}

interface LearningPathCreatorProps {}

export function LearningPathCreator({}: LearningPathCreatorProps) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Full Stack Developer Path',
      description: 'Complete path to become a full stack developer',
      courses: [
        { id: 'c1', title: 'HTML & CSS Fundamentals', modules: 8, duration: '4 weeks' },
        { id: 'c2', title: 'JavaScript Basics', modules: 12, duration: '6 weeks' },
        { id: 'c3', title: 'React Advanced', modules: 15, duration: '8 weeks' }
      ],
      status: 'draft'
    }
  ]);

  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(learningPaths[0]);
  const [isCreatingPath, setIsCreatingPath] = useState(false);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDescription, setNewPathDescription] = useState('');
  const [availableCourses] = useState<Course[]>([
    { id: 'c1', title: 'HTML & CSS Fundamentals', modules: 8, duration: '4 weeks' },
    { id: 'c2', title: 'JavaScript Basics', modules: 12, duration: '6 weeks' },
    { id: 'c3', title: 'React Advanced', modules: 15, duration: '8 weeks' },
    { id: 'c4', title: 'Node.js Backend', modules: 10, duration: '5 weeks' },
    { id: 'c5', title: 'Database Design', modules: 7, duration: '3 weeks' }
  ]);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createNewPath = () => {
    if (!newPathTitle.trim()) return;

    const newPath: LearningPath = {
      id: `lp${Date.now()}`,
      title: newPathTitle,
      description: newPathDescription,
      courses: [],
      status: 'draft'
    };

    setLearningPaths([...learningPaths, newPath]);
    setSelectedPath(newPath);
    setNewPathTitle('');
    setNewPathDescription('');
    setIsCreatingPath(false);
  };

  const addCourseToPath = (course: Course) => {
    if (!selectedPath) return;
    
    const updatedPath = {
      ...selectedPath,
      courses: [...selectedPath.courses, course]
    };

    setSelectedPath(updatedPath);
    setLearningPaths(learningPaths.map(lp => lp.id === selectedPath.id ? updatedPath : lp));
    setShowCourseSelector(false);
    setSearchQuery('');
  };

  const removeCourseFromPath = (courseId: string) => {
    if (!selectedPath) return;
    
    const updatedPath = {
      ...selectedPath,
      courses: selectedPath.courses.filter(c => c.id !== courseId)
    };

    setSelectedPath(updatedPath);
    setLearningPaths(learningPaths.map(lp => lp.id === selectedPath.id ? updatedPath : lp));
  };

  const savePath = () => {
    if (!selectedPath) return;
    setLearningPaths(learningPaths.map(lp => lp.id === selectedPath.id ? selectedPath : lp));
    // TODO: Save to backend
    alert('Learning path saved successfully!');
  };

  const filteredCourses = availableCourses.filter(course => {
    const isInPath = selectedPath?.courses.some(c => c.id === course.id);
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return !isInPath && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Path Creator</h1>
              <p className="text-sm text-gray-500 mt-1">Create structured learning journeys for your learners</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingPath(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                New Path
              </button>
              {selectedPath && (
                <button
                  onClick={savePath}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Save size={16} />
                  Save Path
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Learning Paths List */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Learning Paths</h2>
              {isCreatingPath ? (
                <div className="mb-4 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <input
                    type="text"
                    placeholder="Path Title"
                    value={newPathTitle}
                    onChange={(e) => setNewPathTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newPathDescription}
                    onChange={(e) => setNewPathDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createNewPath}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingPath(false);
                        setNewPathTitle('');
                        setNewPathDescription('');
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
              
              <div className="space-y-2">
                {learningPaths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(path)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPath?.id === path.id
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-300'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{path.title}</div>
                    <div className="text-xs text-gray-500">
                      {path.courses.length} courses • {path.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selectedPath ? (
              <div className="max-w-4xl mx-auto">
                {/* Path Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <input
                    type="text"
                    value={selectedPath.title}
                    onChange={(e) => {
                      const updated = { ...selectedPath, title: e.target.value };
                      setSelectedPath(updated);
                      setLearningPaths(learningPaths.map(lp => lp.id === selectedPath.id ? updated : lp));
                    }}
                    className="text-2xl font-bold text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                  />
                  <textarea
                    value={selectedPath.description}
                    onChange={(e) => {
                      const updated = { ...selectedPath, description: e.target.value };
                      setSelectedPath(updated);
                      setLearningPaths(learningPaths.map(lp => lp.id === selectedPath.id ? updated : lp));
                    }}
                    placeholder="Learning path description..."
                    className="w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    rows={3}
                  />
                </div>

                {/* Courses in Path */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Courses in Path</h2>
                    <button
                      onClick={() => setShowCourseSelector(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Course
                    </button>
                  </div>
                  <div className="p-6">
                    {selectedPath.courses.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No courses in this path yet</p>
                        <button
                          onClick={() => setShowCourseSelector(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Add Your First Course
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPath.courses.map((course, index) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-700">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{course.title}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span>{course.modules} modules</span>
                                <span>•</span>
                                <span>{course.duration}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCourseFromPath(course.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
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
                  <GraduationCap size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning path selected</h3>
                <p className="text-gray-500 mb-6">Select a path from the sidebar or create a new one</p>
                <button
                  onClick={() => setIsCreatingPath(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create New Path
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Course Selector Modal */}
        {showCourseSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Course to Add</h3>
                <button
                  onClick={() => {
                    setShowCourseSelector(false);
                    setSearchQuery('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No available courses found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => addCourseToPath(course)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>{course.modules} modules</span>
                              <span>•</span>
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

