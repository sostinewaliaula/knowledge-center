import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearningContent } from './pages/learner/LearningContent';
import { ReportsPage } from './pages/admin/ReportsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { LandingPage } from './pages/marketing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
// New Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ContentLibrary } from './pages/admin/ContentLibrary';
import { CourseBuilder } from './pages/admin/CourseBuilder';
import { LearningPathCreator } from './pages/admin/LearningPathCreator';
import { Assessments } from './pages/admin/Assessments';
import { Assignments } from './pages/admin/Assignments';
import { Analytics } from './pages/admin/Analytics';
import { Compliance } from './pages/admin/Compliance';
import { Gamification } from './pages/admin/Gamification';
import { LiveSessions } from './pages/admin/LiveSessions';
import { Discussions } from './pages/admin/Discussions';
import { Notifications } from './pages/admin/Notifications';
import { Categories } from './pages/admin/Categories';
import { Templates } from './pages/admin/Templates';
import { UserGroups } from './pages/admin/UserGroups';
import { Departments } from './pages/admin/Departments';
import { Roles } from './pages/admin/Roles';
import { UserImport } from './pages/admin/UserImport';

export type Page = 'landing' | 'learner' | 'learning' | 'reports' | 'login' | 'forgot-password';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/learner" element={<LearnerDashboard />} />
        <Route path="/learner/learning" element={<LearningContent />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/content-library" element={<ContentLibrary />} />
        <Route path="/admin/course-builder" element={<CourseBuilder />} />
        <Route path="/admin/learning-paths" element={<LearningPathCreator />} />
        <Route path="/admin/assessments" element={<Assessments />} />
        <Route path="/admin/assignments" element={<Assignments />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/compliance" element={<Compliance />} />
        <Route path="/admin/gamification" element={<Gamification />} />
        <Route path="/admin/live-sessions" element={<LiveSessions />} />
        <Route path="/admin/discussions" element={<Discussions />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/templates" element={<Templates />} />
        <Route path="/admin/user-groups" element={<UserGroups />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/roles" element={<Roles />} />
        <Route path="/admin/user-import" element={<UserImport />} />
        <Route path="/reports" element={<ReportsPage />} />
        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}