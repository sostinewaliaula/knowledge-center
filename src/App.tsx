import React, { useState } from 'react';
import { LearningContent } from './pages/learner/LearningContent';
import { ReportsPage } from './pages/admin/ReportsPage';
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { LandingPage } from './pages/marketing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';

export type Page = 'landing' | 'learner' | 'learning' | 'reports' | 'login';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  if (currentPage === 'landing') {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'learner') {
    return <LearnerDashboard onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'learning') {
    return <LearningContent onNavigate={setCurrentPage} />;
  }

  return <ReportsPage onNavigate={setCurrentPage} />;
}