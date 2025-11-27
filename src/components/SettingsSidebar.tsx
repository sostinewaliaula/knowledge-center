import { useState, useEffect } from 'react';
import { Settings, Users, BookOpen, Bell, Shield, Palette, Database, Globe, Mail, Lock } from 'lucide-react';

interface SettingsSidebarProps {
  activeMenuItem?: 'general' | 'users' | 'content' | 'notifications' | 'security' | 'appearance' | 'integrations' | 'email' | string;
  onMenuChange?: (menu: string) => void;
}

export function SettingsSidebar({ activeMenuItem = 'general', onMenuChange }: SettingsSidebarProps) {
  const [selectedMenu, setSelectedMenu] = useState<string>(activeMenuItem);

  // Sync with prop changes
  useEffect(() => {
    setSelectedMenu(activeMenuItem);
  }, [activeMenuItem]);

  // Update parent component when menu changes
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    onMenuChange?.(menu);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 animate-fade-in">Settings</h2>
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
            onClick={() => handleMenuClick('general')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'general'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <Settings size={18} className={`transition-all duration-300 ${selectedMenu === 'general' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">General</span>
            {selectedMenu === 'general' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'users'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.15s' }}
          >
            <Users size={18} className={`transition-all duration-300 ${selectedMenu === 'users' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">User Management</span>
            {selectedMenu === 'users' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('content')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'content'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            <BookOpen size={18} className={`transition-all duration-300 ${selectedMenu === 'content' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Learning Content</span>
            {selectedMenu === 'content' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'notifications'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.25s' }}
          >
            <Bell size={18} className={`transition-all duration-300 ${selectedMenu === 'notifications' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Notifications</span>
            {selectedMenu === 'notifications' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'security'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <Shield size={18} className={`transition-all duration-300 ${selectedMenu === 'security' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Security</span>
            {selectedMenu === 'security' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('appearance')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'appearance'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.35s' }}
          >
            <Palette size={18} className={`transition-all duration-300 ${selectedMenu === 'appearance' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Appearance</span>
            {selectedMenu === 'appearance' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('email')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'email'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.4s' }}
          >
            <Mail size={18} className={`transition-all duration-300 ${selectedMenu === 'email' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Email Settings</span>
            {selectedMenu === 'email' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
          <button 
            onClick={() => handleMenuClick('integrations')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
              selectedMenu === 'integrations'
                ? 'bg-gradient-to-r from-purple-50 to-green-50 text-purple-700 font-medium border-l-4 border-purple-600 shadow-sm scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
            }`}
            style={{ animationDelay: '0.45s' }}
          >
            <Globe size={18} className={`transition-all duration-300 ${selectedMenu === 'integrations' ? 'text-purple-600 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
            <span className="transition-all duration-300">Integrations</span>
            {selectedMenu === 'integrations' && <span className="ml-auto text-purple-600 animate-fade-in">→</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

