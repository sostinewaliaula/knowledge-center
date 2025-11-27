import React from 'react';
import { Home, Search, Image, BookOpen, Users, Clock, Settings, Plus, Zap, MessageSquare, ChevronLeft, ChevronDown, Trophy, UserCircle } from 'lucide-react';
type Page = 'learning' | 'reports' | 'learner';
interface SidebarProps {
  activePage?: 'learning' | 'reports';
  onNavigate?: (page: Page) => void;
}
export function Sidebar({
  activePage = 'learning',
  onNavigate
}: SidebarProps) {
  const handleNavigation = (page: Page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  return <aside className="flex h-screen bg-white border-r border-gray-200">
      {/* Left Icon Bar */}
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        {/* Logo */}
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
          <div className="w-6 h-6 bg-white rounded" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'
        }} />
        </div>

        {/* Main Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Home size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Image size={20} />
          </button>
          <button onClick={() => handleNavigation('learning')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'learning' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-700'}`}>
            <BookOpen size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Users size={20} />
          </button>
          <button onClick={() => handleNavigation('reports')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'reports' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-700'}`}>
            <Clock size={20} />
          </button>
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-2">
          <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700">
            <Plus size={20} />
          </button>
          <button className="w-10 h-10 bg-yellow-400 text-white rounded-lg flex items-center justify-center hover:bg-yellow-500">
            <Zap size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <MessageSquare size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Settings size={20} />
          </button>
          <button className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-900">
            RF
          </button>
        </div>
      </div>

      {/* Right Content Panel - Dynamic based on active page */}
      <div className="w-52 bg-white flex flex-col">
        {activePage === 'learning' ? <>
            {/* Learning Content Sidebar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">
                  Learning content
                </h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>

            {/* Content Type Buttons */}
            <div className="px-3 py-4 space-y-1 border-b border-gray-200">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <div className="w-5 h-5 bg-cyan-500 rounded flex-shrink-0" />
                <span>Course</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <div className="w-5 h-5 bg-orange-500 rounded flex-shrink-0" />
                <span>Page</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <div className="w-5 h-5 bg-indigo-500 rounded flex-shrink-0" />
                <span>Assignment</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">
                <div className="w-5 h-5 bg-yellow-500 rounded flex-shrink-0" />
                <span>Quiz</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <div className="w-5 h-5 bg-pink-500 rounded flex-shrink-0" />
                <span>Learning Path</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {/* Favorites Section */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Favorites
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      3
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                <div className="space-y-1 mt-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-cyan-500 rounded flex-shrink-0" />
                    <span>Figma Basic</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-teal-500 rounded flex-shrink-0" />
                    <span>Folder NEW 2024</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-indigo-500 rounded flex-shrink-0" />
                    <span>Assignment 101</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-orange-500 rounded flex-shrink-0" />
                    <span>Quiz Figma</span>
                  </button>
                </div>
              </div>

              {/* Projects Section */}
              <div>
                <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Projects
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      2
                    </span>
                  </div>
                  <Plus size={16} className="text-gray-400" />
                </button>
                <div className="space-y-1 mt-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-indigo-500 rounded flex-shrink-0" />
                    <span>Figma basic</span>
                    <BookOpen size={14} className="ml-auto text-gray-400" />
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">
                    <div className="w-5 h-5 bg-pink-500 rounded flex-shrink-0" />
                    <span>Fikri studio</span>
                  </button>
                </div>
              </div>
            </div>
          </> : <>
            {/* Reports Sidebar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">Reports</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>

            {/* Report Categories */}
            <div className="px-3 py-4 space-y-1 border-b border-gray-200">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <UserCircle size={16} />
                <span>Learners</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <Trophy size={16} />
                <span>Leaderboards</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                <Users size={16} />
                <span>Users</span>
              </button>
            </div>

            {/* Learning Content Section */}
            <div className="px-3 py-4">
              <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  Learning content
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                  <div className="w-5 h-5 bg-cyan-500 rounded flex-shrink-0" />
                  <span>Course</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                  <div className="w-5 h-5 bg-orange-500 rounded flex-shrink-0" />
                  <span>Page</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                  <div className="w-5 h-5 bg-indigo-500 rounded flex-shrink-0" />
                  <span>Assignment</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm">
                  <div className="w-5 h-5 bg-yellow-500 rounded flex-shrink-0" />
                  <span>Quiz</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
                  <div className="w-5 h-5 bg-pink-500 rounded flex-shrink-0" />
                  <span>Learning Path</span>
                </button>
              </div>
            </div>
          </>}

        {/* Promotion Card - Always visible at bottom */}
        <div className="p-3 border-t border-gray-200 mt-auto">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <div className="text-xl">✨</div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  Get Trenning AI
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Use AI in every action on Trenning webapp
                </p>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-1">
              Try it now
              <span className="text-xs">↗</span>
            </button>
          </div>
        </div>
      </div>
    </aside>;
}