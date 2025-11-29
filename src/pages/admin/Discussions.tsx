import { useState } from 'react';
import { 
  MessageSquare,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Users,
  ThumbsUp,
  Flag,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Discussion {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  likes: number;
  lastActivity: string;
  pinned: boolean;
  locked: boolean;
  status: 'active' | 'archived';
}

interface DiscussionsProps {}

export function Discussions({}: DiscussionsProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Best practices for React state management',
      category: 'Technical',
      author: 'John Doe',
      replies: 24,
      views: 156,
      likes: 18,
      lastActivity: '2 hours ago',
      pinned: true,
      locked: false,
      status: 'active'
    },
    {
      id: '2',
      title: 'How to improve team collaboration?',
      category: 'General',
      author: 'Jane Smith',
      replies: 12,
      views: 89,
      likes: 9,
      lastActivity: '5 hours ago',
      pinned: false,
      locked: false,
      status: 'active'
    },
    {
      id: '3',
      title: 'Course completion strategies',
      category: 'Learning',
      author: 'Mike Johnson',
      replies: 8,
      views: 67,
      likes: 5,
      lastActivity: '1 day ago',
      pinned: false,
      locked: false,
      status: 'active'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'all' || discussion.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'Technical', 'General', 'Learning', 'Support'];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
              <p className="text-sm text-gray-500 mt-1">Manage forum discussions and community engagement</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                New Discussion
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredDiscussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions found</h3>
              <p className="text-gray-500 mb-6">Start a new discussion to engage your learners</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                New Discussion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className={`bg-white rounded-xl border-2 p-6 hover:shadow-md transition-all ${
                    discussion.pinned ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.pinned && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            Pinned
                          </span>
                        )}
                        {discussion.locked && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium flex items-center gap-1">
                            <Lock size={12} />
                            Locked
                          </span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {discussion.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>By {discussion.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {discussion.lastActivity}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-600">{discussion.replies} replies</span>
                        <span className="text-gray-600">{discussion.views} views</span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <ThumbsUp size={14} />
                          {discussion.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        {discussion.locked ? <Unlock size={16} /> : <Lock size={16} />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

