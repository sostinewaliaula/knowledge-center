import { useState } from 'react';
import { Clock, FileText, Archive, Building2, ChevronDown, ChevronUp, Plus, Sparkles, ArrowUpRight } from 'lucide-react';

interface LearningContentSidebarProps {}

export function LearningContentSidebar({}: LearningContentSidebarProps) {
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const favorites = [
    { name: 'Figma Basic', icon: '🔵', color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { name: 'Folder NEW 2024', icon: '🟢', color: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Assignment 101', icon: '🟣', color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Quiz Figma', icon: '🟠', color: 'bg-orange-100', iconColor: 'text-orange-600' }
  ];

  const projects = [
    { name: 'Figma basic', icon: '🟣', color: 'bg-purple-100', active: false },
    { name: 'Fikri studio', icon: '🩷', color: 'bg-pink-100', active: true }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Learning Content</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
          <Clock size={18} className="text-gray-500" />
          <span>Recents</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
          <FileText size={18} className="text-gray-500" />
          <span>Shared Content</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
          <Archive size={18} className="text-gray-500" />
          <span>Archived</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
          <Building2 size={18} className="text-gray-500" />
          <span>Templates</span>
        </button>
      </div>

      {/* Favorites Section */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setFavoritesExpanded(!favoritesExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span>Favorites</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">3</span>
          </div>
          {favoritesExpanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {favoritesExpanded && (
          <div className="mt-2 space-y-1">
            {favorites.map((fav, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <div className={`w-6 h-6 ${fav.color} rounded flex items-center justify-center`}>
                  <span className="text-xs">{fav.icon}</span>
                </div>
                <span>{fav.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Projects</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">2</span>
          </div>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
            <Plus size={14} />
          </button>
        </div>
        
        {projectsExpanded && (
          <div className="mt-2 space-y-1">
            {projects.map((project, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  project.active 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${project.color} rounded`} />
                  {project.name === 'Figma basic' && (
                    <FileText size={14} className="text-gray-500" />
                  )}
                </div>
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Card */}
      <div className="mt-auto p-4">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center">
              <Sparkles size={24} className="text-purple-700" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">Get Trenning AI</h3>
            <p className="text-xs text-gray-700">Use AI in every action on Trenning webapp</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            <span>Try it now</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

