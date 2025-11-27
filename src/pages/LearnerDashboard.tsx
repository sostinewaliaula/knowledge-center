import React from 'react';
import { Bell, Bookmark, ChevronDown, MessageCircle, Search, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';

type DashboardPage = 'learning' | 'reports' | 'learner';

interface LearnerDashboardProps {
  onNavigate?: (page: DashboardPage) => void;
}

const summaryCards = [{
  label: 'Point',
  value: '100',
  icon: Star,
  accent: 'bg-amber-100 text-amber-600'
}, {
  label: 'Badges',
  value: '32',
  icon: ShieldCheck,
  accent: 'bg-indigo-100 text-indigo-600'
}, {
  label: 'Certificates',
  value: '12',
  icon: Bookmark,
  accent: 'bg-emerald-100 text-emerald-600'
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
  color: 'bg-sky-400'
}, {
  title: 'Creating Engaging Learning Journeys: UI/UX Best Practices in LMS Design',
  type: 'Page',
  progress: 15,
  hours: 15,
  color: 'bg-orange-400'
}, {
  title: 'Other task',
  type: '',
  progress: 5,
  hours: 4,
  color: 'bg-gray-400'
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
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <section className="space-y-8 pt-8">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Good morning, Adit 👋
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Welcome to Trenning, check your priority learning.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {summaryCards.map(card => <div key={card.label} className="p-5 rounded-2xl bg-white border border-gray-100 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="text-sm text-gray-500">{card.label}</div>
                        <div className="text-2xl font-semibold text-gray-900 mt-1">
                          {card.value}
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.accent}`}>
                        <card.icon size={20} />
                      </div>
                    </div>)}
                </div>

                <div className="rounded-2xl border border-lime-100 bg-lime-50 p-6">
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-white px-3 py-1 rounded-full shadow-sm">
                    New
                  </span>
                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-gray-900 font-semibold">
                        Feature Discussion
                      </div>
                      <p className="text-sm text-gray-600 mt-2 max-w-lg">
                        The learning content are a new feature in "Feature Discussion" can be explain the material problem chat.
                      </p>
                    </div>
                    <button className="inline-flex items-center text-sm font-semibold text-gray-900">
                      Go to detail →
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          In progress learning content
                        </h2>
                      </div>
                      <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">
                        View all
                      </button>
                    </div>
                    <div className="space-y-4">
                      {inProgressCourses.map(course => <div key={course.title} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 bg-gray-50 md:flex-row md:items-center">
                          <div className="flex flex-1 items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-sm flex items-center justify-center">
                              <img src={course.illustration} alt={course.title} className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div>
                              <span className="inline-flex text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                                Course
                              </span>
                              <h3 className="text-sm font-semibold text-gray-900 mt-2">
                                {course.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Content • {course.materials} Material
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                            <div>
                              Completion{' '}
                              <span className={`font-semibold ${course.completionColor}`}>
                                {course.completion}
                              </span>
                            </div>
                            <div>
                              Deadline{' '}
                              <span className={`font-semibold ${course.deadlineColor}`}>
                                {course.deadline}
                              </span>
                            </div>
                          </div>
                          <button className="px-5 py-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold">
                            {course.action}
                          </button>
                        </div>)}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          New enrollment
                        </h2>
                      </div>
                      <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">
                        View all
                      </button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {newEnrollments.map(course => <div key={course.title} className="rounded-2xl border border-gray-100 p-4 bg-gray-50 flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                              <div className="w-2 h-2 rounded-full bg-indigo-500" />
                              {course.materials} materials
                            </span>
                            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                              <div className="w-2 h-2 rounded-full bg-lime-500" />
                              Course
                            </span>
                          </div>
                          <img src={course.illustration} alt={course.title} className="w-full h-32 object-cover rounded-xl bg-white" />
                          <h3 className="text-sm font-semibold text-gray-900 flex-1">
                            {course.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {course.tags.map(tag => <span key={tag} className="px-2 py-1 bg-white rounded-full border border-gray-200">
                                {tag}
                              </span>)}
                          </div>
                          <div className="text-xs font-semibold text-gray-400">
                            {course.status}
                          </div>
                        </div>)}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Most view contents
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {mostViewed.map(item => <div key={item.title} className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {item.type && <span className={`text-xs font-semibold text-gray-600 ${item.type === 'Course' ? 'text-sky-600' : item.type === 'Page' ? 'text-orange-500' : ''}`}>
                                  {item.type}
                                </span>}
                              <span className="font-semibold text-gray-900">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.progress}% ({item.hours} hrs)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{
                            width: `${item.progress}%`
                          }} />
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

