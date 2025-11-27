import React from 'react';
import { Bell, Bookmark, ChevronDown, Circle, Clock3, FileText, Info, MessageCircle, Search, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';

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
  detail: '15 Question'
}, {
  title: 'Designing Intuitive User Interfaces',
  type: 'Quiz',
  detail: '10 Question'
}, {
  title: 'Mobile & Desktop Screen Pattern',
  type: 'Assignment',
  detail: ''
}, {
  title: 'Optimizing User Experience in Education Apps',
  type: 'Assignment',
  detail: ''
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

export function LearnerDashboard({
  onNavigate
}: LearnerDashboardProps) {
  const progressGoal = 0.2;
  const circumference = 2 * Math.PI * 32;
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
              return <button key={item} onClick={item === 'My Learning' ? () => onNavigate?.('learning') : undefined} className={`pb-2 transition-colors ${isActive ? 'text-gray-900 font-semibold border-b-2 border-gray-900' : 'hover:text-gray-900'}`}>
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
                <div className="space-y-8">
                  <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          In progress learning content
                        </h2>
                        <Info size={18} className="text-gray-400" />
                      </div>
                      <button className="relative group inline-flex items-center gap-2 text-sm font-semibold text-[#6c48ff]">
                        <span>View all</span>
                        <span className="transform transition-transform group-hover:translate-x-1">
                          →
                        </span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#6c48ff] rounded-full opacity-70" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {inProgressCourses.map(course => <div key={course.title} className="flex items-center gap-4 py-4">
                          <div className="flex items-center gap-3 w-[35%] min-w-[240px]">
                            <div className="w-20 h-14 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
                              <img src={course.illustration} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00a3ff]">
                                <div className="w-4 h-4 rounded-full bg-[#e0f2ff] flex items-center justify-center text-[#00a3ff] text-[10px] font-bold">
                                  C
                                </div>
                                Course
                              </span>
                              <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[170px]">
                                {course.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center w-[45%] text-sm text-gray-500 gap-6">
                            <div className="flex-1 min-w-[110px]">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                                Content
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-900 font-semibold mt-1 text-sm">
                                <FileText size={14} className="text-gray-400" />
                                {course.materials} Material
                              </div>
                            </div>
                            <div className="flex-1 min-w-[110px]">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                                Completion
                              </div>
                              {course.completionPercent !== undefined ? <div className="flex items-center gap-1.5 mt-1">
                                  <div className="relative w-7 h-7">
                                    <svg className="w-full h-full -rotate-90">
                                      <circle cx="14" cy="14" r="12" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                      <circle cx="14" cy="14" r="12" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${2 * Math.PI * 12 * (course.completionPercent / 100)} ${2 * Math.PI * 12}`} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-[11px] font-semibold text-gray-900">
                                        {course.completion}
                                      </span>
                                    </div>
                                  </div>
                                </div> : <div className="text-sm font-semibold text-gray-900 mt-1">
                                  {course.completion}
                                </div>}
                            </div>
                            <div className="flex-1 min-w-[110px]">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                                Deadline
                              </div>
                              <div className={`flex items-center gap-1.5 mt-1 font-semibold ${course.deadlineColor}`}>
                                <Clock3 size={14} />
                                {course.deadline}
                              </div>
                            </div>
                          </div>
                          <button className="ml-auto px-5 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 hover:border-gray-400">
                            {course.action}
                          </button>
                        </div>)}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          New enrollment
                        </h2>
                        <Info size={18} className="text-gray-400" />
                      </div>
                      <button className="relative group inline-flex items-center gap-2 text-sm font-semibold text-[#6c48ff]">
                        <span>View all</span>
                        <span className="transform transition-transform group-hover:translate-x-1">
                          →
                        </span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#6c48ff] rounded-full opacity-70" />
                      </button>
                    </div>
                    <div className="grid gap-5 lg:grid-cols-3">
                      {newEnrollments.map(course => <div key={course.title} className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] flex flex-col gap-4">
                          <div className="relative w-full h-36 rounded-[16px] overflow-hidden border border-gray-100 bg-gray-50">
                            <img src={course.illustration} alt={course.title} className="w-full h-full object-cover" />
                            <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold text-white bg-gray-900/80 rounded-full backdrop-blur">
                              {course.materials} materials
                            </span>
                          </div>
                          <div className="space-y-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00a3ff]">
                              <div className="w-4 h-4 rounded-full bg-[#e0f2ff] flex items-center justify-center text-[#00a3ff] text-[10px] font-bold">
                                C
                              </div>
                              Course
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 leading-5">
                              {course.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            {course.tags.map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                {tag}
                              </span>)}
                          </div>
                          <div className="text-xs font-semibold text-gray-400">
                            {course.status}
                          </div>
                        </div>)}
                    </div>
                    <div className="mt-6 h-1.5 bg-gray-100 rounded-full relative overflow-hidden">
                      <span className="absolute left-0 w-1/3 h-full bg-gray-300 rounded-full" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Most view contents
                        </h2>
                        <Info size={18} className="text-gray-400" />
                      </div>
                      <button className="relative group inline-flex items-center gap-2 text-sm font-semibold text-[#6c48ff]">
                        <span>View all</span>
                        <span className="transform transition-transform group-hover:translate-x-1">
                          →
                        </span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#6c48ff] rounded-full opacity-70" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {mostViewed.map(item => <div key={item.title} className="flex items-center gap-2 rounded-xl border border-gray-100 px-2.5 py-1.5 bg-white">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.pillBg}`}>
                              <Circle size={12} className={item.pillColor} />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full">
                              <div className="font-semibold text-[13px] text-gray-900 truncate">
                                {item.title}
                              </div>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-gray-200 ${item.pillColor}`}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-[170px] justify-end">
                            <div className="relative w-32 h-3 rounded-full bg-gray-100 overflow-hidden">
                              <div className="absolute inset-y-0 right-0 rounded-full flex items-center justify-end px-1.5 text-[10px] font-semibold text-gray-700" style={{
                            width: `${item.progress}%`,
                            background: item.color
                          }}>
                                {item.progress}% ({item.hours} hrs)
                              </div>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        To be reviewed
                      </h2>
                      <span className="text-xs text-gray-500">Last 7 Day</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {reviewItems.map(item => <div key={item.title} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-gray-500">
                              {item.type}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 mt-1">
                              {item.title}
                            </h3>
                            {item.detail && <p className="text-xs text-gray-500 mt-1">
                                {item.detail}
                              </p>}
                          </div>
                          <button className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500">
                            →
                          </button>
                        </div>)}
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-6 pt-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="text-sm text-gray-500">Learning content</div>
                    <div className="text-3xl font-semibold text-gray-900 mt-2">
                      120
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="text-sm text-gray-500">Learning time</div>
                    <div className="text-3xl font-semibold text-gray-900 mt-2">
                      44
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Goals
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Daily Goal: 6/30 learning
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-indigo-600">
                      See Detail
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="32" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle cx="48" cy="48" r="32" fill="none" stroke="#4ade80" strokeWidth="8" strokeDasharray={`${circumference * progressGoal} ${circumference}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col rotate-90">
                        <span className="text-2xl font-semibold text-gray-900">
                          6
                        </span>
                        <span className="text-xs text-gray-500">/30</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-gray-600">Completed today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                        <span className="text-gray-600">Remaining</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        Your Longest streak: 1 Day (28 Sep 23 - 4 Okt 23)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Leaderboard
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Top designers this week
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-indigo-600">
                      See All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {leaderboard.map(user => <div key={user.rank} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              {user.points}pts
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {user.role}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-400">
                          #{user.rank}
                        </span>
                      </div>)}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Keep the momentum
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Stay consistent to maintain your learning streak.
                  </p>
                  <button className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                    Resume learning
                  </button>
                </div>
              </aside>
            </div>
        </div>
      </div>
    </div>
  );
}

