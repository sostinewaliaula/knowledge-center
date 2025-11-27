import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Moon, Sun, CheckCircle } from 'lucide-react';
import { sendOtp, verifyOtp, resetPassword } from '../../utils/api';

interface ForgotPasswordPageProps {}

type Step = 'email' | 'otp' | 'new-password' | 'success';

export function ForgotPasswordPage({}: ForgotPasswordPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.forgotPassword(email);
      setOtpSent(true);
      setStep('otp');
      // In development, show OTP in console
      if (response.otp) {
        console.log('OTP (dev only):', response.otp);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      await api.verifyOTP(email, otpValue);
      setStep('new-password');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const otpValue = otp.join('');

    try {
      await api.resetPassword(email, otpValue, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError('');
    setLoading(true);
    setOtp(['', '', '', '', '', '']);

    try {
      const response = await api.forgotPassword(email);
      // In development, show OTP in console
      if (response.otp) {
        console.log('OTP (dev only):', response.otp);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Forgot Password Card */}
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
                {step === 'email' && 'Forgot Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'new-password' && 'Reset Password'}
                {step === 'success' && 'Password Reset'}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {step === 'email' && 'Enter your email to receive a verification code'}
                {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
                {step === 'new-password' && 'Create a new password for your account'}
                {step === 'success' && 'Your password has been reset successfully'}
              </p>
            </div>
          </div>

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
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

              {error && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-500 dark:to-green-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 dark:hover:from-purple-600 dark:hover:to-green-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  {error}
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-500 dark:to-green-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 dark:hover:from-purple-600 dark:hover:to-green-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'new-password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-500 dark:to-green-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 dark:hover:from-purple-600 dark:hover:to-green-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-green-100 dark:from-purple-900/30 dark:to-green-900/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Password Reset Successful!
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Your password has been reset. You can now log in with your new password.
                </p>
              </div>
              <button
                    onClick={() => navigate('/login')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 dark:from-purple-500 dark:to-green-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 dark:hover:from-purple-600 dark:hover:to-green-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                Go to Login
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          )}

          {/* Back to Login */}
          {step !== 'success' && (
            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                    onClick={() => navigate('/login')}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

