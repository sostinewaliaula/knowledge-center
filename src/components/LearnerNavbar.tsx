import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Bell, ChevronDown, MessageCircle, Search, Sparkles } from 'lucide-react';

interface LearnerNavbarProps {
  activeNavItem?: 'Home' | 'My Learning' | 'Catalog' | 'Favorites';
  favoritesCount?: number;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export function LearnerNavbar({
  activeNavItem = 'Home',
  favoritesCount = 0,
  userName = 'Adit Irwan',
  userRole = 'Jr UI/UX Designer',
  userInitials = 'AI'
}: LearnerNavbarProps) {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (item: string) => {
    switch (item) {
      case 'My Learning':
        navigate('/learner/learning');
        break;
      case 'Home':
        navigate('/learner');
        break;
      case 'Catalog':
        // Add catalog route when available
        break;
      case 'Favorites':
        // Add favorites route when available
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Main Header - Ends after first row */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-10 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Section: Logo, Brand, Ask AI, Search */}
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              {/* Logo and Brand Name */}
              <div className="flex items-center gap-2">
                <img 
                  src="/assets/CcT2K1dC8NCSuB6a.png" 
                  alt="Knowledge Center Logo" 
                  className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%239433ff"/><text x="32" y="42" font-size="24" fill="white" text-anchor="middle" font-weight="bold">KC</text></svg>';
                  }}
                />
                <div>
                  <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
                    Knowledge Center
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    TQ Academy
                  </div>
                </div>
              </div>

              {/* Ask AI Button */}
              <button className="flex items-center gap-2 rounded-full border border-purple-200 px-5 py-2 text-sm font-semibold text-purple-600 bg-white hover:bg-purple-50 transition-colors shadow-sm">
                <Sparkles size={16} />
                Ask AI
              </button>

              {/* Search Bar */}
              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden shadow-sm bg-white">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="px-4 py-2.5 text-sm focus:outline-none w-64 lg:w-80" 
                />
                <button className="h-full px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white flex items-center justify-center hover:from-purple-700 hover:to-green-700 transition-all">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Section: Messages, Notifications, User Profile */}
            <div className="flex items-center gap-3">
              {/* Messages Icon */}
              <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <MessageCircle size={18} strokeWidth={2} />
              </button>

              {/* Notifications Icon */}
              <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative">
                <Bell size={18} strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{userName}</div>
                  <div className="text-xs text-gray-500">{userRole}</div>
                </div>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Navigation Menu - Completely detached */}
      <div className="sticky top-[73px] z-20 px-10 pt-4 pb-2">
        <nav className="inline-flex items-center gap-2 bg-white rounded-full px-2 py-2 shadow-xl border border-gray-100/50 backdrop-blur-sm">
          {['Home', 'My Learning', 'Catalog', 'Favorites'].map(item => {
            const isActive = item === activeNavItem;
            return (
              <button 
                key={item} 
                onClick={() => handleNavClick(item)} 
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item}
                  {item === 'Favorites' && favoritesCount > 0 && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white backdrop-blur-sm' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {favoritesCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all duration-300 hover:from-purple-700 hover:to-green-700 hover:scale-110 hover:shadow-xl ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </>
  );
}

