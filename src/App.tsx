import React, { useState } from 'react';
import { LearningContent } from './pages/LearningContent';
import { ReportsPage } from './pages/ReportsPage';
import { LearnerDashboard } from './pages/LearnerDashboard';
type Page = 'learning' | 'reports' | 'learner';
export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('learner');
  return <>
      {currentPage === 'learner' ? <LearnerDashboard onNavigate={setCurrentPage} /> : currentPage === 'learning' ? <LearningContent onNavigate={setCurrentPage} /> : <ReportsPage onNavigate={setCurrentPage} />}
    </>;
}