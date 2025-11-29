import { useState } from 'react';
import { 
  Award,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Settings
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: number;
  criteria: string;
}

interface Leaderboard {
  id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  participants: number;
  active: boolean;
}

interface GamificationProps {}

export function Gamification({}: GamificationProps) {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      color: 'bg-blue-100',
      earned: 342,
      criteria: 'Complete 1 course'
    },
    {
      id: '2',
      name: 'Knowledge Seeker',
      description: 'Complete 5 courses',
      icon: '📚',
      color: 'bg-purple-100',
      earned: 189,
      criteria: 'Complete 5 courses'
    },
    {
      id: '3',
      name: 'Master Learner',
      description: 'Complete 10 courses',
      icon: '🏆',
      color: 'bg-yellow-100',
      earned: 78,
      criteria: 'Complete 10 courses'
    },
    {
      id: '4',
      name: 'Perfect Score',
      description: 'Score 100% on any assessment',
      icon: '⭐',
      color: 'bg-green-100',
      earned: 156,
      criteria: 'Score 100% on assessment'
    }
  ]);

  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([
    { id: '1', title: 'Top Learners', period: 'monthly', participants: 1247, active: true },
    { id: '2', title: 'Course Completion', period: 'all-time', participants: 892, active: true },
    { id: '3', title: 'Quiz Champions', period: 'weekly', participants: 456, active: false }
  ]);

  const stats = [
    { label: 'Total Badges', value: '24', icon: Award, color: 'text-purple-600' },
    { label: 'Badges Earned', value: '3,456', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Active Leaderboards', value: '3', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Points Distributed', value: '125,890', icon: Star, color: 'text-orange-600' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gamification</h1>
              <p className="text-sm text-gray-500 mt-1">Manage badges, points, and leaderboards</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Plus size={16} />
                New Badge
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                New Leaderboard
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Badges */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Badges</h2>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-16 h-16 ${badge.color} rounded-lg flex items-center justify-center text-3xl`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Criteria: {badge.criteria}</span>
                        <span>•</span>
                        <span>{badge.earned} earned</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboards */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Leaderboards</h2>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {leaderboards.map((leaderboard) => (
                  <div key={leaderboard.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{leaderboard.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="capitalize">{leaderboard.period}</span>
                          <span>•</span>
                          <span>{leaderboard.participants} participants</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        leaderboard.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {leaderboard.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        View
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Points System */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Points System</h2>
                <p className="text-sm text-gray-500 mt-1">Configure how learners earn points</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Star size={20} className="text-yellow-500" />
                  <span className="font-medium text-gray-900">Course Completion</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">+50 pts</p>
                <p className="text-sm text-gray-500 mt-1">Per course completed</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Target size={20} className="text-green-500" />
                  <span className="font-medium text-gray-900">Assessment Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">+10 pts</p>
                <p className="text-sm text-gray-500 mt-1">Per 10% score</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy size={20} className="text-purple-500" />
                  <span className="font-medium text-gray-900">Perfect Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">+100 pts</p>
                <p className="text-sm text-gray-500 mt-1">Bonus for 100%</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

