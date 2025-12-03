import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Users,
  BarChart3,
  Bell,
  Award,
  Calendar,
  MessageSquare,
  Settings,
  Shield,
  Upload,
  ClipboardList,
  Target,
  Zap,
  Search,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  collapsed?: boolean;
}

import { useSettings } from '../contexts/SettingsContext';

// ... (inside component)
export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['content', 'users', 'evaluations']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      children: [
        { label: 'Content Library', path: '/admin/content-library', icon: Upload },
        { label: 'Course Builder', path: '/admin/course-builder', icon: BookOpen },
        { label: 'Learning Paths', path: '/admin/learning-paths', icon: GraduationCap },
        { label: 'Categories & Tags', path: '/admin/categories', icon: FolderOpen },
        { label: 'Templates', path: '/admin/templates', icon: FileQuestion }
      ]
    },
    {
      id: 'evaluations',
      label: 'Evaluations',
      icon: ClipboardList,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      children: [
        { label: 'Assessments', path: '/admin/assessments', icon: ClipboardList },
        { label: 'Assignments', path: '/admin/assignments', icon: FileQuestion },
        { label: 'Exams', path: '/admin/exams', icon: GraduationCap }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      children: [
        { label: 'All Users', path: '/admin/users', icon: Users },
        { label: 'User Groups', path: '/admin/user-groups', icon: Users },
        { label: 'Departments', path: '/admin/departments', icon: Users },
        { label: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
        { label: 'Bulk Import', path: '/admin/user-import', icon: Upload }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: Shield,
      path: '/admin/compliance',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'gamification',
      label: 'Gamification',
      icon: Award,
      path: '/admin/gamification',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'sessions',
      label: 'Live Sessions',
      icon: Calendar,
      path: '/admin/live-sessions',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'discussions',
      label: 'Discussions',
      icon: MessageSquare,
      path: '/admin/discussions',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // ...

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300`}>
      {/* Logo */}
      <div className={`${collapsed ? 'px-2' : 'px-6'} py-4 border-b border-gray-200 flex items-center justify-between`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img
              src={settings?.general?.companyLogo || "/assets/CcT2K1dC8NCSuB6a.png"}
              alt="Knowledge Center Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%239433ff"/><text x="32" y="42" font-size="24" fill="white" text-anchor="middle" font-weight="bold">KC</text></svg>'; }}
            />
            <div>
              <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
                {settings?.general?.siteName || 'Knowledge Center'}
              </div>
              <div className="text-[10px] text-gray-500 leading-tight">
                {settings?.general?.siteSubtitle || 'TQ Academy'}
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <img
              src={settings?.general?.companyLogo || "/assets/CcT2K1dC8NCSuB6a.png"}
              alt="KC"
              className="w-10 h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%239433ff"/><text x="32" y="42" font-size="24" fill="white" text-anchor="middle" font-weight="bold">KC</text></svg>'; }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedSections.has(item.id);
            const active = isActive(item.path || '');
            // Check if any child is active for collapsible sections
            const hasActiveChild = hasChildren && item.children?.some(child => isActive(child.path));

            if (hasChildren) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full ${collapsed ? 'px-2 justify-center' : 'px-4'} py-2.5 flex items-center gap-3 rounded-lg transition-colors ${(active || hasActiveChild) ? `${item.bgColor} ${item.color}` : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <item.icon size={20} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                  {!collapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.children!.map((child) => {
                        const childActive = isActive(child.path);
                        return (
                          <button
                            key={child.path}
                            onClick={() => navigate(child.path)}
                            className={`w-full px-3 py-2 flex items-center gap-3 rounded-lg text-sm transition-colors ${childActive
                              ? 'bg-purple-50 text-purple-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            <child.icon size={16} />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path || '/admin')}
                className={`w-full ${collapsed ? 'px-2 justify-center' : 'px-4'} py-2.5 flex items-center gap-3 rounded-lg transition-colors ${active ? `${item.bgColor} ${item.color}` : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className={`${collapsed ? 'px-2' : 'px-4'} py-4 border-t border-gray-200 space-y-2`}>
        <button
          className={`w-full ${collapsed ? 'px-2 justify-center' : 'px-4'} py-2.5 flex items-center gap-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors`}
          title={collapsed ? 'Help & Support' : undefined}
        >
          <HelpCircle size={20} />
          {!collapsed && <span className="font-medium">Help & Support</span>}
        </button>
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 flex items-center gap-3`}>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

