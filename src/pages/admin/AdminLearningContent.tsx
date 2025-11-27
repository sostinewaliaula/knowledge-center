import { MainSidebar } from '../../components/MainSidebar';
import { LearningContentSidebar } from '../../components/LearningContentSidebar';
import { Header } from '../../components/Header';
import { FilterBar } from '../../components/FilterBar';
import { LearningPathCard } from '../../components/LearningPathCard';
import { HelpCircle } from 'lucide-react';

interface AdminLearningContentProps {}

export function AdminLearningContent({}: AdminLearningContentProps) {
  const learningPaths = [{
    title: 'Mastering UI/UX Design for Impactful Solutions',
    assignedCount: 21,
    category: 'UI/UX',
    urgency: 'Not Urgent',
    editedTime: '2h ago',
    completed: 50,
    illustration: "/Screenshot_2025-11-27_105820.png",
    illustrationBg: 'bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100'
  }, {
    title: 'Mastering UI Design for Impactful Experiences',
    assignedCount: 10,
    category: 'Fundamental',
    urgency: 'Not Urgent',
    editedTime: '2h ago',
    completed: 50,
    illustration: "/Screenshot_2025-11-27_105820.png",
    illustrationBg: 'bg-gradient-to-br from-cyan-200 via-blue-100 to-blue-200'
  }, {
    title: 'Where Innovation Meets Design',
    assignedCount: 5,
    category: 'Design',
    urgency: 'Not Urgent',
    editedTime: '2h ago',
    illustration: "/Screenshot_2025-11-27_105820.png",
    illustrationBg: 'bg-gradient-to-br from-purple-200 via-purple-100 to-indigo-200'
  }];
  
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <MainSidebar activePage="content" />
      <LearningContentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <FilterBar />
        <main className="flex-1 overflow-y-auto min-h-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
            {learningPaths.map((path, index) => (
              <LearningPathCard key={index} {...path} />
            ))}
          </div>
        </main>

        {/* Help Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50">
          <HelpCircle size={24} />
        </button>
      </div>
    </div>
  );
}

