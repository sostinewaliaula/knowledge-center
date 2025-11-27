import { useState } from 'react';
import { Clock, FileText, Archive, Building2, ChevronDown, ChevronUp, Plus, Sparkles, ArrowUpRight } from 'lucide-react';

interface LearningContentSidebarProps {
  activeMenuItem?: 'recents' | 'shared' | 'archived' | 'templates' | string;
}

export function LearningContentSidebar({ activeMenuItem = 'recents' }: LearningContentSidebarProps) {
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string>(activeMenuItem);

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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 animate-fade-in">Learning Content</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform duration-300">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Main Navigation Links */}
        <div className="p-4 space-y-1">
        <button 
          onClick={() => setSelectedMenu('recents')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
            selectedMenu === 'recents'
              ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
              : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          <Clock size={18} className={`transition-all duration-300 ${selectedMenu === 'recents' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
          <span className="transition-all duration-300">Recents</span>
          {selectedMenu === 'recents' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
        </button>
        <button 
          onClick={() => setSelectedMenu('shared')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
            selectedMenu === 'shared'
              ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
              : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          <FileText size={18} className={`transition-all duration-300 ${selectedMenu === 'shared' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
          <span className="transition-all duration-300">Shared Content</span>
          {selectedMenu === 'shared' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
        </button>
        <button 
          onClick={() => setSelectedMenu('archived')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
            selectedMenu === 'archived'
              ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
              : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <Archive size={18} className={`transition-all duration-300 ${selectedMenu === 'archived' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
          <span className="transition-all duration-300">Archived</span>
          {selectedMenu === 'archived' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
        </button>
        <button 
          onClick={() => setSelectedMenu('templates')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
            selectedMenu === 'templates'
              ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
              : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
          }`}
          style={{ animationDelay: '0.25s' }}
        >
          <Building2 size={18} className={`transition-all duration-300 ${selectedMenu === 'templates' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
          <span className="transition-all duration-300">Templates</span>
          {selectedMenu === 'templates' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
        </button>
      </div>

      {/* Favorites Section */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setFavoritesExpanded(!favoritesExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
        >
          <div className="flex items-center gap-2">
            <span className="transition-colors duration-300 group-hover:text-purple-600">Favorites</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-purple-100 group-hover:text-purple-700">3</span>
          </div>
          {favoritesExpanded ? (
            <ChevronUp size={16} className="text-gray-500 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <ChevronDown size={16} className="text-gray-500 transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${favoritesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-2 space-y-1">
            {favorites.map((fav, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:translate-x-2 hover:scale-[1.02] group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-6 h-6 ${fav.color} rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <span className="text-xs">{fav.icon}</span>
                </div>
                <span className="transition-colors duration-300 group-hover:text-purple-600">{fav.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Projects</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">2</span>
          </div>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${projectsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-2 space-y-1">
            {projects.map((project, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
                  project.active 
                    ? 'bg-gradient-to-r from-purple-50 to-green-50 text-gray-900 border-l-4 border-purple-600 shadow-sm scale-[1.02]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:translate-x-2'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${project.color} rounded transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`} />
                  {project.name === 'Figma basic' && (
                    <FileText size={14} className="text-gray-500 transition-transform duration-300 group-hover:scale-110" />
                  )}
                </div>
                <span className={`transition-colors duration-300 ${project.active ? 'font-medium' : 'group-hover:text-purple-600'}`}>{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Promotional Card */}
        <div className="p-4 animate-fade-in-up">
          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-green-100 rounded-xl p-4 space-y-3 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-green-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-float">
                <Sparkles size={24} className="text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-purple-700">Get Trenning AI</h3>
              <p className="text-xs text-gray-700">Use AI in every action on Trenning webapp</p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group/btn">
              <span>Try it now</span>
              <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

