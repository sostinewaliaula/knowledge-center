/**
 * Authentication utilities
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role_name: string;
  role_display_name?: string;
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getCurrentUser();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string | string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRole = user.role_name || user.role;
  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Logout user
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
};

