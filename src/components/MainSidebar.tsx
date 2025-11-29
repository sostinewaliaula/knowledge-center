import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, User, PieChart, ClipboardCheck, Settings, Plus, Zap, MessageSquare } from 'lucide-react';

interface MainSidebarProps {
  activePage?: 'home' | 'search' | 'reports' | 'learning' | 'profile' | 'analytics' | 'tasks' | 'content' | 'users' | 'settings';
}

export function MainSidebar({ activePage }: MainSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-detect active page from route
  const getActivePage = () => {
    if (activePage) return activePage;
    const path = location.pathname;
    if (path === '/reports') return 'reports';
    if (path === '/admin/content-library' || path === '/admin/course-builder' || path === '/admin/learning-paths' || path.includes('/admin/content')) return 'content';
    if (path === '/admin/users' || path.includes('/admin/users')) return 'users';
    if (path === '/admin/settings' || path.includes('/admin/settings')) return 'settings';
    if (path === '/learning' || path.includes('/learning')) return 'learning';
    if (path === '/admin' || (path.startsWith('/admin') && path === '/admin')) return 'home';
    return 'home';
  };
  
  const currentActivePage = getActivePage();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <aside className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center h-screen overflow-hidden animate-slide-in-left">
      {/* Logo - Purple/Green gradient team/network icon */}
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-green-600 rounded-lg flex items-center justify-center mt-1.5 mb-1.5 cursor-pointer hover:from-purple-700 hover:to-green-700 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-lg group flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
          <circle cx="9" cy="7" r="3.5" fill="white" />
          <circle cx="15" cy="7" r="3.5" fill="white" />
          <circle cx="12" cy="13" r="2.5" fill="white" opacity="0.9" />
        </svg>
      </div>

      {/* Main Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-0.5 min-h-0 overflow-y-auto w-full px-1">
        <button 
          onClick={() => handleNavigation('/admin')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'home' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          <Home size={14} className={`transition-transform duration-300 ${currentActivePage === 'home' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'search' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          <Search size={14} className={`transition-transform duration-300 ${currentActivePage === 'search' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
        <button 
          onClick={() => handleNavigation('/reports')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'reports' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${currentActivePage === 'reports' ? 'scale-110' : 'group-hover:scale-110'}`}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 3v18" />
            <path d="M7 13l3-3 3 3 4-4" />
          </svg>
        </button>
        <button 
          onClick={() => handleNavigation('/admin/content-library')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'content' || currentActivePage === 'learning' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105 animate-pulse-glow' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.25s' }}
        >
          <BookOpen size={14} className={`transition-transform duration-300 ${currentActivePage === 'content' || currentActivePage === 'learning' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
        <button 
          onClick={() => handleNavigation('/admin/users')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'users' || currentActivePage === 'profile'
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.3s' }}
        >
          <User size={14} className={`transition-transform duration-300 ${currentActivePage === 'users' || currentActivePage === 'profile' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'analytics' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.35s' }}
        >
          <PieChart size={14} className={`transition-transform duration-300 ${currentActivePage === 'analytics' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'tasks' 
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-100 text-gray-700 hover:scale-110'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          <ClipboardCheck size={14} className={`transition-transform duration-300 ${currentActivePage === 'tasks' ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-0.5 mt-auto pb-1.5 flex-shrink-0">
        {/* New/Add Button - Purple/Green gradient */}
        <button className="w-9 h-7 bg-gradient-to-br from-purple-600 to-green-600 text-white rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 group">
          <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        {/* Quick Action - Orange with lightning */}
        <button className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 hover:scale-110 active:scale-95 group">
          <Zap size={12} className="text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
        
        {/* Notifications/Activity */}
        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform duration-300">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        </button>
        
        {/* Settings */}
        <button 
          onClick={() => handleNavigation('/admin/settings')}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 group flex-shrink-0 ${
            currentActivePage === 'settings'
              ? 'bg-gradient-to-br from-purple-100 to-green-100 text-purple-700 shadow-md scale-105' 
              : 'hover:bg-gray-200 text-gray-700 hover:scale-110'
          }`}
        >
          <Settings size={14} className={`transition-transform duration-300 ${currentActivePage === 'settings' ? 'scale-110' : 'group-hover:rotate-90'}`} />
        </button>
        
        {/* User Initials - Yellow with RF */}
        <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer hover:shadow-md">
          <span className="text-[9px] font-bold text-gray-900">RF</span>
        </div>
      </div>
    </aside>
  );
}

