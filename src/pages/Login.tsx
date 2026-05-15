import React, { useState } from 'react';
import { Camera, User, Mail, Lock, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useDarkMode } from '../store';

export const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { setIsLoggedIn } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const bg = darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';

  const handleSubmit = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4`}>
      <div className={`w-full max-w-md ${cardBg} rounded-3xl shadow-2xl p-8`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>
            {authMode === 'login' ? 'Welcome Back' : 'Join PixelHub'}
          </h1>
          <p className={`mt-2 ${textSecondary}`}>
            {authMode === 'login' ? 'Sign in to continue' : 'Create your account today'}
          </p>
        </div>

        <div className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Full Name</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                />
              </div>
            </div>
          )}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Email</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
              />
            </div>
          </div>
          {authMode === 'register' && (
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                />
              </div>
            </div>
          )}
          {authMode === 'login' && (
            <div className="flex justify-end">
              <button className="text-sm text-teal-500 hover:text-teal-600">Forgot Password?</button>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${borderColor}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} ${textSecondary}`}>or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className={`flex items-center justify-center py-3 px-4 ${inputBg} rounded-xl border ${hoverBg} transition-all`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className={`flex items-center justify-center py-3 px-4 ${inputBg} rounded-xl border ${hoverBg} transition-all`}>
              <svg className={`w-5 h-5 ${textPrimary}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
            <button className={`flex items-center justify-center py-3 px-4 ${inputBg} rounded-xl border ${hoverBg} transition-all`}>
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>

        <p className={`mt-8 text-center ${textSecondary}`}>
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-teal-500 font-semibold hover:text-teal-400"
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <button
          onClick={toggleDarkMode}
          className={`absolute top-4 right-4 p-3 rounded-full ${hoverBg} transition-all`}
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
