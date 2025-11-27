import React, { useState, useEffect, useRef } from 'react';
import { MainSidebar } from '../../components/MainSidebar';
import { LearningPathCard } from '../../components/LearningPathCard';
import { Search, Plus, MoreVertical, Image, ChevronDown } from 'lucide-react';

interface AdminLearningPageProps {}

export function AdminLearningPage({}: AdminLearningPageProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const learningPaths = [
    {
      id: '1',
      title: 'UI/UX Design Fundamentals',
      assignedCount: 45,
      category: 'Design',
      urgency: 'High',
      editedTime: '2 hours ago',
      completed: 75,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-purple-100 to-green-100'
    },
    {
      id: '2',
      title: 'Advanced React Development',
      assignedCount: 32,
      category: 'Development',
      urgency: 'Medium',
      editedTime: '1 day ago',
      completed: 60,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      id: '3',
      title: 'Project Management Essentials',
      assignedCount: 28,
      category: 'Management',
      urgency: 'High',
      editedTime: '3 days ago',
      completed: 45,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-orange-100 to-red-100'
    },
    {
      id: '4',
      title: 'Data Analytics for Beginners',
      assignedCount: 52,
      category: 'Analytics',
      urgency: 'Low',
      editedTime: '5 days ago',
      completed: 30,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-teal-100 to-cyan-100'
    },
    {
      id: '5',
      title: 'Customer Service Excellence',
      assignedCount: 38,
      category: 'Customer Service',
      urgency: 'Medium',
      editedTime: '1 week ago',
      completed: 90,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-pink-100 to-purple-100'
    },
    {
      id: '6',
      title: 'Leadership and Team Building',
      assignedCount: 25,
      category: 'Leadership',
      urgency: 'High',
      editedTime: '2 weeks ago',
      completed: 55,
      illustration: '/Screenshot_2025-11-27_105820.png',
      illustrationBg: 'bg-gradient-to-br from-yellow-100 to-orange-100'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <MainSidebar activePage="learning" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">
                  Learning Paths
                </h1>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>New</span>
                    <ChevronDown size={16} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          // Handle New action
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                        <span>New</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          // Handle Upload action
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Image size={16} />
                        <span>Upload</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          // Handle Filters action
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span>Filters</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-8 border-b border-gray-200">
                <button className="pb-3 text-sm text-gray-900 font-semibold border-b-2 border-gray-900">
                  All Paths
                </button>
                <button className="pb-3 text-sm text-gray-600 hover:text-gray-900">
                  Active
                </button>
                <button className="pb-3 text-sm text-gray-600 hover:text-gray-900">
                  Draft
                </button>
                <button className="pb-3 text-sm text-gray-600 hover:text-gray-900">
                  Archived
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search learning paths..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Export
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Learning Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  title={path.title}
                  assignedCount={path.assignedCount}
                  category={path.category}
                  urgency={path.urgency}
                  editedTime={path.editedTime}
                  completed={path.completed}
                  illustration={path.illustration}
                  illustrationBg={path.illustrationBg}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

