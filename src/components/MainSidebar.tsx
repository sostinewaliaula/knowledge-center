import { useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, User, PieChart, ClipboardCheck, Settings, Plus, Zap, MessageSquare } from 'lucide-react';

interface MainSidebarProps {
  activePage?: 'home' | 'search' | 'reports' | 'learning' | 'profile' | 'analytics' | 'tasks' | 'content';
}

export function MainSidebar({ activePage = 'learning' }: MainSidebarProps) {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <aside className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 h-screen">
      {/* Logo - Purple team/network icon */}
      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="7" r="3.5" fill="white" />
          <circle cx="15" cy="7" r="3.5" fill="white" />
          <circle cx="12" cy="13" r="2.5" fill="white" opacity="0.9" />
        </svg>
      </div>

      {/* Main Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        <button 
          onClick={() => handleNavigation('/admin')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'home' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Home size={20} />
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'search' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Search size={20} />
        </button>
        <button 
          onClick={() => handleNavigation('/reports')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'reports' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 3v18" />
            <path d="M7 13l3-3 3 3 4-4" />
          </svg>
        </button>
        <button 
          onClick={() => handleNavigation('/admin/content')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'content' || activePage === 'learning' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <BookOpen size={20} />
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'profile' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <User size={20} />
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'analytics' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <PieChart size={20} />
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activePage === 'tasks' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <ClipboardCheck size={20} />
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-2">
        {/* New/Add Button - Purple */}
        <button className="w-12 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
          <Plus size={20} />
        </button>
        
        {/* Quick Action - Orange with lightning */}
        <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
          <Zap size={18} className="text-white" />
        </button>
        
        {/* Notifications/Activity */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        </button>
        
        {/* Settings */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-700">
          <Settings size={20} />
        </button>
        
        {/* User Initials - Yellow with RF */}
        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">RF</span>
        </div>
      </div>
    </aside>
  );
}

