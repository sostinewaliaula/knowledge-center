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
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';
// New Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ContentLibrary } from './pages/admin/ContentLibrary';
import { CourseBuilder } from './pages/admin/CourseBuilder';
import { LearningPathCreator } from './pages/admin/LearningPathCreator';
import { Assessments } from './pages/admin/Assessments';
import { Assignments } from './pages/admin/Assignments';
import { Exams } from './pages/admin/Exams';
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

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Protected Learner Routes */}
        <Route path="/learner" element={
          <ProtectedRoute>
            <LearnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/learner/learning" element={
          <ProtectedRoute>
            <LearningContent />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes - Only accessible by admins */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/content-library" element={
          <ProtectedRoute requiredRole="admin">
            <ContentLibrary />
          </ProtectedRoute>
        } />
        <Route path="/admin/course-builder" element={
          <ProtectedRoute requiredRole="admin">
            <CourseBuilder />
          </ProtectedRoute>
        } />
        <Route path="/admin/learning-paths" element={
          <ProtectedRoute requiredRole="admin">
            <LearningPathCreator />
          </ProtectedRoute>
        } />
        <Route path="/admin/assessments" element={
          <ProtectedRoute requiredRole="admin">
            <Assessments />
          </ProtectedRoute>
        } />
        <Route path="/admin/assignments" element={
          <ProtectedRoute requiredRole="admin">
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/admin/exams" element={
          <ProtectedRoute requiredRole="admin">
            <Exams />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute requiredRole="admin">
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/compliance" element={
          <ProtectedRoute requiredRole="admin">
            <Compliance />
          </ProtectedRoute>
        } />
        <Route path="/admin/gamification" element={
          <ProtectedRoute requiredRole="admin">
            <Gamification />
          </ProtectedRoute>
        } />
        <Route path="/admin/live-sessions" element={
          <ProtectedRoute requiredRole="admin">
            <LiveSessions />
          </ProtectedRoute>
        } />
        <Route path="/admin/discussions" element={
          <ProtectedRoute requiredRole="admin">
            <Discussions />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute requiredRole="admin">
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute requiredRole="admin">
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/admin/templates" element={
          <ProtectedRoute requiredRole="admin">
            <Templates />
          </ProtectedRoute>
        } />
        <Route path="/admin/user-groups" element={
          <ProtectedRoute requiredRole="admin">
            <UserGroups />
          </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute requiredRole="admin">
            <Departments />
          </ProtectedRoute>
        } />
        <Route path="/admin/roles" element={
          <ProtectedRoute requiredRole="admin">
            <Roles />
          </ProtectedRoute>
        } />
        <Route path="/admin/user-import" element={
          <ProtectedRoute requiredRole="admin">
            <UserImport />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute requiredRole="admin">
            <ReportsPage />
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}