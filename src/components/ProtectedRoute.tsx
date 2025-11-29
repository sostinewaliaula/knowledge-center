import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login'
}) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');

  // If no token, redirect to login
  if (!token || !userStr) {
    return <Navigate to={redirectTo} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = user.role_name || user.role;

    // If role is required, check if user has it
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have required role, redirect based on their actual role
        if (userRole === 'admin') {
          return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/learner" replace />;
      }
    }

    // User is authenticated and has required role (if any)
    return <>{children}</>;
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to={redirectTo} replace />;
  }
};

