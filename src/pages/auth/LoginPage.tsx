import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Moon, Sun } from 'lucide-react';
import { api } from '../../utils/api';

interface LoginPageProps {}

export function LoginPage({}: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email, password);
      
      // Store token and user info
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Navigate to learner dashboard on successful login
      navigate('/learner');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Login Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-100 dark:border-purple-800/50 shadow-[0_30px_60px_rgba(139,92,246,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-6 space-y-4 relative">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img 
                src="/assets/CcT2K1dC8NCSuB6a.png" 
                alt="Knowledge Center Logo" 
                className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%239433ff"/><text x="40" y="52" font-size="30" fill="white" text-anchor="middle" font-weight="bold">KC</text></svg>'; 
                }} 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-400 dark:to-green-400 bg-clip-text text-transparent">
                Knowledge Center
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">TQ Academy</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Welcome back
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Sign in to access your learning dashboard
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={14} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                  placeholder="you@caavagroup.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={14} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-2 border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 cursor-pointer"
                />
                <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                    onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-500 dark:to-green-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 dark:hover:from-purple-600 dark:hover:to-green-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                    onClick={() => navigate('/')}
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Contact your administrator
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-1 border-t border-gray-200 dark:border-gray-700">
            <button
                    onClick={() => navigate('/')}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-1"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

