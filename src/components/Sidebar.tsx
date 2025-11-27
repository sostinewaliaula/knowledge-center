import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Image, BookOpen, Users, Clock, Settings, Plus, Zap, MessageSquare, ChevronLeft, ChevronDown, Trophy, UserCircle } from 'lucide-react';

interface SidebarProps {
  activePage?: 'learning' | 'reports' | 'content';
}

export function Sidebar({
  activePage = 'learning'
}: SidebarProps) {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
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
          <button 
            onClick={() => handleNavigation('/admin/content')} 
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'content' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-700'}`}
          >
            <Image size={20} />
          </button>
          <button onClick={() => handleNavigation('/learning')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'learning' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-700'}`}>
            <BookOpen size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Users size={20} />
          </button>
          <button onClick={() => handleNavigation('/reports')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'reports' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-700'}`}>
            <Clock size={20} />
          </button>
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Sidebar Content */}
      <div className="w-64 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Learning</h2>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              All
            </button>
            <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
              Active
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">Quick Actions</span>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Plus size={16} />
              <span>New Course</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Image size={16} />
              <span>Upload Content</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">Filters</span>
            <button className="text-xs text-indigo-600 hover:text-indigo-700">
              Clear
            </button>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Category</span>
              <ChevronDown size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Status</span>
              <ChevronDown size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Date</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Recent</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                <div className="font-medium">Course {i}</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              AI
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Adit Irwan</div>
              <div className="text-xs text-gray-500">Jr UI/UX Designer</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </aside>;
}
