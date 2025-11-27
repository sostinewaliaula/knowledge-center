import React from 'react';
import { Bell, Bookmark, ChevronDown, MessageCircle, Search, Sparkles, Zap } from 'lucide-react';

type Page = 'learning' | 'reports' | 'learner';

interface LearningContentProps {
  onNavigate?: (page: Page) => void;
}

const continueLearning = [{
  id: 1,
  title: 'Creating Engaging Learning Journeys: UI/UX Best Practices',
  materials: 12,
  progress: 80,
  recommendation: {
    prefix: 'Advance your learning with',
    linkLabel: 'Mastering UI Design for Impactful Solutions'
  },
  image: '/Screenshot_2025-11-27_105820.png'
}, {
  id: 2,
  title: 'The Art of Blending Aesthetics and Functionality in UI/UX Design',
  materials: 12,
  progress: 30,
  recommendation: {
    prefix: 'Next, you can dive into',
    linkLabel: 'Advanced techniques commonly used in UI/UX Design'
  },
  image: '/Screenshot_2025-11-27_105820.png'
}];

export function LearningContent({
  onNavigate
}: LearningContentProps) {
  return <div className="min-h-screen bg-[#f5f6fb]">
      <div className="bg-white min-h-screen shadow-sm">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-10 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  t
                </div>
                <span className="text-xl font-semibold text-gray-900">trenning</span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-gray-600">
                {['Home', 'My Learning', 'Catalog', 'Favorites'].map(item => {
                const isActive = item === 'My Learning';
                return <button key={item} onClick={() => {
                    if (item === 'Home') {
                      onNavigate?.('learner');
                    } else if (item === 'My Learning') {
                      onNavigate?.('learning');
                    }
                  }} className={`pb-2 transition-colors ${isActive ? 'text-gray-900 font-semibold border-b-2 border-gray-900' : 'hover:text-gray-900'}`}>
                    {item}
                    {item === 'Favorites' && <span className="ml-1 text-xs rounded-full bg-gray-200 px-2 py-0.5 text-gray-600">
                        1
                      </span>}
                  </button>;
              })}
              </nav>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button className="flex items-center gap-2 rounded-full border border-[#c9b4ff] px-5 py-2 text-sm font-semibold text-[#5e37fb] bg-white shadow-[0_10px_20px_rgba(94,55,251,0.15)]">
                <Sparkles size={16} />
                Ask AI
              </button>
              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden shadow-sm w-full lg:w-72">
                <Search size={18} className="ml-4 text-gray-400" />
                <input placeholder="Search..." className="w-full px-3 py-2 text-sm focus:outline-none" />
              </div>
              <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900">
                <MessageCircle size={18} />
              </button>
              <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1.5">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=15" alt="Adit Irwan" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Adit Irwan</div>
                  <div className="text-xs text-gray-500">Jr UI/UX Designer</div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-10 pb-12 bg-gray-50">
          <section className="py-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Continue Learning
              </h2>
              <button className="relative group inline-flex items-center gap-2 text-sm font-semibold text-[#6c48ff]">
                <span>View all</span>
                <span className="h-[2px] w-8 bg-[#6c48ff] rounded-full" />
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {continueLearning.map(course => <div key={course.id} className="bg-white rounded-[24px] border border-gray-200 shadow-[0_20px_40px_rgba(15,23,42,0.05)] p-5 flex flex-col gap-4">
                  <div className="flex gap-5 flex-col md:flex-row">
                    <div className="relative w-full md:w-40 h-36 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-gray-900 shadow-sm flex items-center gap-1">
                        <Bookmark size={12} />
                        {course.materials} Materials
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00a3ff]">
                        <div className="w-4 h-4 rounded-full bg-[#e0f2ff] flex items-center justify-center text-[#00a3ff] text-[10px] font-bold">
                          C
                        </div>
                        Course
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        {course.title}
                      </h3>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold text-gray-900">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-[#10b981]" style={{
                        width: `${course.progress}%`
                      }} />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <button className="mt-2 inline-flex items-center justify-center px-5 py-2 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 hover:border-gray-400">
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#f4f0ff] rounded-2xl px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#6c48ff]">
                      <Sparkles size={16} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {course.recommendation.prefix}{' '}
                      <button className="text-[#6c48ff] font-semibold hover:underline">
                        {course.recommendation.linkLabel}
                      </button>
                    </p>
                  </div>
                </div>)}
            </div>
          </section>
        </main>
      </div>
    </div>;
}

