import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearningContent } from './pages/learner/LearningContent';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminLearningPage } from './pages/admin/AdminLearningPage';
import { AdminLearningContent } from './pages/admin/AdminLearningContent';
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { LandingPage } from './pages/marketing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

export type Page = 'landing' | 'learner' | 'learning' | 'reports' | 'login' | 'forgot-password';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/learner" element={<LearnerDashboard />} />
        <Route path="/learning" element={<AdminLearningPage />} />
        <Route path="/admin/content" element={<AdminLearningContent />} />
        <Route path="/learner/learning" element={<LearningContent />} />
        <Route path="/reports" element={<ReportsPage />} />
        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}