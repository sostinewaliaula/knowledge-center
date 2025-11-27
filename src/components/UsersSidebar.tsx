import { useState } from 'react';
import { Users, UserCheck, UserPlus, Shield, UsersRound, Clock, Settings, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface UsersSidebarProps {
  activeMenuItem?: 'all' | 'active' | 'pending' | 'roles' | 'teams' | 'activity' | 'settings' | string;
}

export function UsersSidebar({ activeMenuItem = 'all' }: UsersSidebarProps) {
  const [selectedMenu, setSelectedMenu] = useState<string>(activeMenuItem);
  const [teamsExpanded, setTeamsExpanded] = useState(true);

  const teams = [
    { name: 'Design Team', icon: '🎨', color: 'bg-purple-100', memberCount: 12, active: false },
    { name: 'Development', icon: '💻', color: 'bg-blue-100', memberCount: 8, active: true },
    { name: 'Marketing', icon: '📢', color: 'bg-green-100', memberCount: 5, active: false }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 animate-fade-in">Users</h2>
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
            onClick={() => setSelectedMenu('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'all'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <Users size={18} className={`transition-all duration-300 ${selectedMenu === 'all' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">All Users</span>
            {selectedMenu === 'all' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => setSelectedMenu('active')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'active'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.15s' }}
          >
            <UserCheck size={18} className={`transition-all duration-300 ${selectedMenu === 'active' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Active Users</span>
            {selectedMenu === 'active' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => setSelectedMenu('pending')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'pending'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            <UserPlus size={18} className={`transition-all duration-300 ${selectedMenu === 'pending' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Pending Invitations</span>
            {selectedMenu === 'pending' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => setSelectedMenu('roles')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'roles'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.25s' }}
          >
            <Shield size={18} className={`transition-all duration-300 ${selectedMenu === 'roles' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Roles & Permissions</span>
            {selectedMenu === 'roles' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => setSelectedMenu('activity')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'activity'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <Clock size={18} className={`transition-all duration-300 ${selectedMenu === 'activity' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Activity Log</span>
            {selectedMenu === 'activity' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
        </div>

        {/* Teams Section */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setTeamsExpanded(!teamsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-2">
              <UsersRound size={16} className="text-gray-600" />
              <span className="transition-colors duration-300 group-hover:text-purple-600">Teams</span>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-purple-100 group-hover:text-purple-700">3</span>
            </div>
            {teamsExpanded ? (
              <ChevronUp size={16} className="text-gray-500 transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <ChevronDown size={16} className="text-gray-500 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${teamsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-2 space-y-1">
              {teams.map((team, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
                    team.active 
                      ? 'bg-gradient-to-r from-purple-50 to-green-50 text-gray-900 border-l-4 border-purple-600 shadow-sm scale-[1.02]' 
                      : 'text-gray-700 hover:bg-gray-50 hover:translate-x-2'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${team.color} rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <span className="text-xs">{team.icon}</span>
                    </div>
                    <span className={`transition-colors duration-300 ${team.active ? 'font-medium' : 'group-hover:text-purple-600'}`}>{team.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors duration-300">{team.memberCount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="px-4 pb-2">
          <button 
            onClick={() => setSelectedMenu('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'settings'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.35s' }}
          >
            <Settings size={18} className={`transition-all duration-300 ${selectedMenu === 'settings' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">User Settings</span>
            {selectedMenu === 'settings' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

