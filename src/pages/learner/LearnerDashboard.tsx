import React from 'react';
import { ArrowRight, Bell, Bookmark, ChevronDown, Circle, Clock3, FileText, Info, MessageCircle, Search, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';

type DashboardPage = 'learning' | 'reports' | 'learner';

interface LearnerDashboardProps {
  onNavigate?: (page: DashboardPage) => void;
}

const summaryCards = [{
  label: 'Point',
  value: '100',
  icon: Star,
  iconColor: 'text-[#ffb200]',
  iconBg: 'bg-[#fff6df]'
}, {
  label: 'Badges',
  value: '32',
  icon: ShieldCheck,
  iconColor: 'text-[#5b4bff]',
  iconBg: 'bg-[#f1edff]'
}, {
  label: 'Certificates',
  value: '12',
  icon: Bookmark,
  iconColor: 'text-[#08c98f]',
  iconBg: 'bg-[#e1fbf2]'
}];

const inProgressCourses = [{
  title: 'Mastering UI/UX Design: A Guide for Designers',
  materials: 5,
  completion: '-',
  deadline: '1 Day',
  action: 'Start',
  illustration: '/Screenshot_2025-11-27_105820.png',
  completionColor: 'text-gray-900',
  deadlineColor: 'text-emerald-600'
}, {
  title: 'Creating Engaging Learning Journeys in LMS',
  materials: 12,
  completion: '64%',
  completionPercent: 64,
  deadline: '12 hrs',
  action: 'Continue',
  illustration: '/Screenshot_2025-11-27_105820.png',
  completionColor: 'text-emerald-600',
  deadlineColor: 'text-rose-500'
}];

const newEnrollments = [{
  title: 'Enhancing Learning Engagement Through Thoughtful UI/UX',
  materials: 10,
  tags: ['Prototyping', 'Not Urgent'],
  status: 'Not Started',
  illustration: '/Screenshot_2025-11-27_105820.png'
}, {
  title: 'UI/UX 101 - For Beginner to be great and good Designer',
  materials: 5,
  tags: ['Prototyping', 'Not Urgent'],
  status: 'Not Started',
  illustration: '/Screenshot_2025-11-27_105820.png'
}, {
  title: 'Mastering UI Design for Impactful Experiences',
  materials: 12,
  tags: ['Prototyping', 'Not Urgent'],
  status: 'Not Started',
  illustration: '/Screenshot_2025-11-27_105820.png'
}];

const mostViewed = [{
  title: 'Mobile & Desktop Screen Pattern',
  type: 'Course',
  progress: 80,
  hours: 25,
  color: '#6ee7b7',
  pillBg: 'bg-[#e0f2ff]',
  pillColor: 'text-[#0ea5e9]'
}, {
  title: 'Creating Engaging Learning Journeys: UI/UX Best Practices in LMS Design',
  type: 'Page',
  progress: 15,
  hours: 15,
  color: '#86efac',
  pillBg: 'bg-[#ffe8d1]',
  pillColor: 'text-[#fb923c]'
}, {
  title: 'Other task',
  type: 'Other task',
  progress: 5,
  hours: 4,
  color: '#bbf7d0',
  pillBg: 'bg-gray-200',
  pillColor: 'text-gray-600'
}];

const reviewItems = [{
  title: 'The Art of Blending Aesthetics and Functional Design',
  type: 'Quiz',
  detail: '15 Question',
  iconBg: 'bg-[#fef3c7]',
  iconColor: 'text-[#f97316]',
  badgeColor: 'text-[#f97316]',
  badgeBg: 'bg-[#fff5e7]'
}, {
  title: 'Designing Intuitive User Interfaces',
  type: 'Quiz',
  detail: '10 Question',
  iconBg: 'bg-[#fef3c7]',
  iconColor: 'text-[#f97316]',
  badgeColor: 'text-[#f97316]',
  badgeBg: 'bg-[#fff5e7]'
}, {
  title: 'Mobile & Desktop Screen Pattern',
  type: 'Assignment',
  detail: '',
  iconBg: 'bg-[#e0e7ff]',
  iconColor: 'text-[#4f46e5]',
  badgeColor: 'text-[#4f46e5]',
  badgeBg: 'bg-[#eef2ff]'
}, {
  title: 'Optimizing User Experience in Education Apps',
  type: 'Assignment',
  detail: '',
  iconBg: 'bg-[#e0e7ff]',
  iconColor: 'text-[#4f46e5]',
  badgeColor: 'text-[#4f46e5]',
  badgeBg: 'bg-[#eef2ff]'
}];

const leaderboard = [{
  name: 'Arif Brata',
  role: 'Jr UI/UX Designer',
  points: 100,
  rank: 1,
  avatar: 'https://i.pravatar.cc/100?img=11'
}, {
  name: 'Adit Irwan',
  role: 'Jr UI/UX Designer',
  points: 80,
  rank: 2,
  avatar: 'https://i.pravatar.cc/100?img=12'
}, {
  name: 'Friza Dipa',
  role: 'Jr Animation',
  points: 60,
  rank: 3,
  avatar: 'https://i.pravatar.cc/100?img=13'
}];

export function LearnerDashboard({}: LearnerDashboardProps) {
  const navigate = useNavigate();
  const progressGoal = 0.2;
  const circumference = 2 * Math.PI * 32;
  const goalStroke = circumference * (1 - progressGoal);

  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <div className="bg-white min-h-screen shadow-sm">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-10 py-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5e37fb] flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-xl font-semibold text-gray-900">Trenning</span>
                </div>
                <button className="flex items-center gap-2 rounded-full border border-[#c9b4ff] px-5 py-2 text-sm font-semibold text-[#5e37fb] bg-white shadow-[0_10px_20px_rgba(94,55,251,0.15)]">
                  <Sparkles size={16} />
                  Ask AI
                </button>
                <div className="flex items-center rounded-full border border-gray-200 overflow-hidden shadow-sm">
                  <input placeholder="Search..." className="px-4 py-2.5 text-sm focus:outline-none w-64" />
                  <button className="h-full px-4 py-2 bg-[#5e37fb] text-white flex items-center justify-center">
                    <Search size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900">
                  <MessageCircle size={18} />
                </button>
                <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 relative">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                </button>
                <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#35b7ff] text-white flex items-center justify-center font-semibold">
                    AI
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Adit Irwan</div>
                    <div className="text-xs text-gray-500">Jr UI/UX Designer</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-8 text-sm text-gray-500">
              {['Home', 'My Learning', 'Catalog', 'Favorites'].map(item => {
              const isActive = item === 'Home';
              return <button key={item} onClick={item === 'My Learning' ? () => navigate('/learning') : undefined} className={`pb-2 transition-colors ${isActive ? 'text-gray-900 font-semibold border-b-2 border-gray-900' : 'hover:text-gray-900'}`}>
                  {item}
                  {item === 'Favorites' && <span className="ml-1 text-xs rounded-full bg-gray-200 px-2 py-0.5 text-gray-600">
                      1
                    </span>}
                </button>;
            })}
            </nav>
          </div>
        </header>

        <div className="px-10 pb-10 bg-gray-50">
          <div className="space-y-8 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900">
                  Good morning, Adit 👋
                </h1>
                <p className="text-lg text-gray-500 mt-1">
                  Welcome to Trenning, check your priority learning.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 w-full justify-between lg:justify-end">
                {summaryCards.map(card => <div key={card.label} className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white px-5 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] min-w-[170px] flex-1 sm:flex-none">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                      <card.icon size={20} className={card.iconColor} />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-semibold text-gray-900 leading-tight">
                        {card.value}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        {card.label}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#dffff2] border border-[#b1f5d7] px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-[0_15px_35px_rgba(5,150,105,0.15)]">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center text-sm font-semibold text-white bg-[#0ab37b] px-4 py-1 rounded-full shadow-sm">
                  New
                </span>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Feature Discussion
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    The learning content are a new feature in <span className="font-semibold text-gray-900">“Feature Discussion”</span> can be explain the material problem chat.
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 border-b border-gray-900 pb-0.5 self-start lg:self-auto">
                Go to detail
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <section className="space-y-10">
              {/* sections as previously defined */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

