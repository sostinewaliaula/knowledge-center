import { Bookmark, Zap } from 'lucide-react';
import { LearnerNavbar } from '../../components/LearnerNavbar';

interface LearningContentProps {}

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

export function LearningContent({}: LearningContentProps) {
  return <div className="min-h-screen bg-[#f5f6fb]">
      <div className="bg-white min-h-screen shadow-sm">
        <LearnerNavbar activeNavItem="My Learning" favoritesCount={1} />

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

