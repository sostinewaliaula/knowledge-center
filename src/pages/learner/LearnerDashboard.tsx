import { ArrowRight, Bookmark, Clock3, FileText, GraduationCap, Info, Medal, ShieldCheck, Star, Zap } from 'lucide-react';
import { LearnerNavbar } from '../../components/LearnerNavbar';

type DashboardPage = 'learning' | 'reports' | 'learner';

interface LearnerDashboardProps {
  onNavigate?: (page: DashboardPage) => void;
}

const summaryCards = [{
  label: 'Point',
  value: '100',
  icon: Star,
  iconColor: 'text-yellow-500',
  iconBg: 'bg-transparent'
}, {
  label: 'Badges',
  value: '32',
  icon: Medal,
  iconColor: 'text-yellow-500',
  iconBg: 'bg-transparent'
}, {
  label: 'Certificates',
  value: '12',
  icon: GraduationCap,
  iconColor: 'text-yellow-500',
  iconBg: 'bg-transparent'
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
  const progressGoal = 0.2;
  const circumference = 2 * Math.PI * 32;
  const goalStroke = circumference * (1 - progressGoal);

  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <div className="bg-white min-h-screen shadow-sm">
        <LearnerNavbar activeNavItem="Home" favoritesCount={1} />

        <div className="px-10 pb-10 bg-white">
          <div className="space-y-8 py-10">
            {/* Top Section: Greeting and Stats */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Left: Greeting */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Good morning, Adit 👋
                </h1>
                <p className="text-base text-gray-600 mt-2">
                  Welcome to Trenning, check your priority learning.
                </p>
              </div>

              {/* Right: Stats Cards */}
              <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-between lg:justify-end">
                {summaryCards.map(card => (
                  <div key={card.label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 min-w-[140px] flex-1 sm:flex-none">
                    <div className={`w-9 h-9 flex items-center justify-center ${card.iconBg}`}>
                      <card.icon size={22} className={card.iconColor} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900 leading-tight">
                        {card.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {card.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Announcement Banner */}
            <div className="rounded-2xl bg-green-50 border border-green-100 px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-2">
                  <span className="inline-flex items-center text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full flex-shrink-0">
                    New
                  </span>
                  <div className="text-lg font-bold text-gray-900">
                    Feature Discussion
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  The learning content are a new feature in <span className="font-semibold text-gray-900">"Feature Discussion"</span> can be explain the material problem chat.
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 border-b border-gray-900 pb-0.5 self-start lg:self-auto hover:opacity-80 transition-opacity whitespace-nowrap">
                Go to detail
                <span className="text-base">→</span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <section className="space-y-10">
              {/* In Progress Courses */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">In progress learning content</h2>
                    <Info size={18} className="text-gray-400" />
                  </div>
                  <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    View all
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {inProgressCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-4 border border-gray-100 rounded-2xl px-4 py-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={course.illustration} alt={course.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <ShieldCheck size={14} className="text-green-500" />
                          </span>
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FileText size={14} className="text-blue-500" />
                            Course
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 text-sm text-gray-500 flex-1">
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-gray-400">Content</div>
                          <div className="flex items-center gap-1 text-gray-900">
                            <FileText size={14} />
                            {course.materials} Material
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-gray-400">Completion</div>
                          {course.completionPercent ? (
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                              <svg width="24" height="24" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831"
                                  fill="none"
                                  stroke="#22c55e"
                                  strokeWidth="3"
                                  strokeDasharray={`${course.completionPercent}, 100`}
                                />
                              </svg>
                              {course.completion}
                            </div>
                          ) : (
                            <div className="text-gray-400">-</div>
                          )}
                        </div>
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-gray-400">Deadline</div>
                          <div
                            className={`flex items-center gap-1 font-semibold ${
                              course.deadlineColor?.includes('rose') ? 'text-red-500' : 'text-gray-900'
                            }`}
                          >
                            <Clock3 size={14} />
                            {course.deadline}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                          {course.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Enrollments */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">New enrollment</h2>
                    <Info size={16} className="text-gray-400" />
                  </div>
                  <button className="text-sm font-semibold text-purple-600 underline hover:text-purple-700 transition-colors">
                    View all
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {newEnrollments.map((course, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                      {/* Thumbnail */}
                      <div className="h-32 bg-gray-100 relative overflow-hidden">
                        <img src={course.illustration} alt={course.title} className="w-full h-full object-cover" />
                        {/* Materials Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-semibold bg-gray-700 text-white rounded">
                            {course.materials} materials
                          </span>
                        </div>
                      </div>
                      
                      {/* Course Details */}
                      <div className="p-3">
                        {/* Course Type */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText size={14} className="text-blue-500" />
                          <span className="text-xs text-blue-500">Course</span>
                        </div>
                        
                        {/* Course Title */}
                        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {course.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Status */}
                        <div className="text-xs text-gray-600 font-medium">
                          {course.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Viewed */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Most view contents</h2>
                  <Info size={18} className="text-gray-400" />
                </div>
                <div className="space-y-3">
                  {mostViewed.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-4 border border-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-4 flex-1 min-w-[220px]">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: item.color + '33' }}
                        >
                          <FileText size={18} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-900 line-clamp-1">{item.title}</span>
                            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${item.pillBg} ${item.pillColor}`}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 flex-shrink-0 text-sm font-semibold text-gray-900">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {item.progress}% ({item.hours} hrs)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews & Assignments */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Reviews & Assignments</h2>
                  <button className="text-sm font-semibold text-[#5e37fb] flex items-center gap-1">
                    View All
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {reviewItems.map((item, index) => (
                    <div key={index} className="p-4 rounded-[18px] border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                          {item.type === 'Quiz' ? (
                            <FileText size={20} className={item.iconColor} />
                          ) : (
                            <FileText size={20} className={item.iconColor} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.badgeBg} ${item.badgeColor}`}>
                              {item.type}
                            </span>
                            {item.detail && (
                              <span className="text-xs text-gray-500">{item.detail}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Progress Goal */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Goal</h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90" width="128" height="128">
                      <circle
                        cx="64"
                        cy="64"
                        r="32"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="32"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={goalStroke}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#5e37fb" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">20%</div>
                        <div className="text-xs text-gray-500">Goal</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Keep learning to reach your goal!
                  </p>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
                  <button className="text-sm font-semibold text-[#5e37fb]">View All</button>
                </div>
                <div className="space-y-3">
                  {leaderboard.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                        {person.rank}
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">{person.name}</div>
                        <div className="text-xs text-gray-500">{person.role}</div>
                      </div>
                      <div className="flex-shrink-0 text-sm font-semibold text-[#5e37fb]">
                        {person.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#5e37fb] to-[#22c55e] rounded-[24px] p-6 text-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Zap size={18} />
                    <span className="text-sm font-medium">Start Learning</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Bookmark size={18} />
                    <span className="text-sm font-medium">View Bookmarks</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Info size={18} />
                    <span className="text-sm font-medium">Get Help</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

