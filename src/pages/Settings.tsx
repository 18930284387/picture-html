import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Settings as SettingsIcon,
  Camera,
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Share2,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useThemeStyles } from '../components/Layout';
import { useAuth, useDarkMode, useUser } from '../store';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { setIsLoggedIn } = useAuth();
  const { currentUser, updateCurrentUser } = useUser();
  const styles = useThemeStyles();

  const [settingsName, setSettingsName] = useState(currentUser.name);
  const [settingsBio, setSettingsBio] = useState(currentUser.bio);
  const [settingsEmail, setSettingsEmail] = useState(currentUser.email);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${styles.bg} flex flex-col`}>
      <header
        className={`${styles.cardBg} border-b ${styles.borderColor} px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm`}
      >
        <button onClick={() => navigate('/profile')} className={`p-2 -mx-2 rounded-full ${styles.hoverBg}`}>
          <ChevronLeft className={`w-6 h-6 ${styles.textPrimary}`} />
        </button>
        <h1 className={`font-bold text-xl ${styles.textPrimary}`}>Settings</h1>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <div className={`${styles.cardBg} rounded-3xl p-6 shadow-xl`}>
            <h2 className={`text-lg font-bold ${styles.textPrimary} mb-6 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              Profile Settings
            </h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-2xl"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md">
                  Change Photo
                </button>
              </div>
              <div>
                <label className={`block text-sm font-semibold ${styles.textSecondary} mb-2`}>Display Name</label>
                <input
                  type="text"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl ${styles.inputBg} border ${styles.textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${styles.textSecondary} mb-2`}>Email Address</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl ${styles.inputBg} border ${styles.textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${styles.textSecondary} mb-2`}>Bio</label>
                <textarea
                  value={settingsBio}
                  onChange={(e) => setSettingsBio(e.target.value)}
                  rows={4}
                  className={`w-full px-5 py-4 rounded-2xl ${styles.inputBg} border ${styles.textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none`}
                />
              </div>
            </div>
          </div>

          <div className={`${styles.cardBg} rounded-3xl p-6 shadow-xl`}>
            <h2 className={`text-lg font-bold ${styles.textPrimary} mb-6 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              Preferences
            </h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                    {darkMode ? (
                      <Moon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${styles.textPrimary}`}>Dark Mode</p>
                    <p className={`text-sm ${styles.textSecondary}`}>Switch between light and dark themes</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                    darkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${
                      darkMode ? 'left-9' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${styles.textPrimary}`}>Push Notifications</p>
                    <p className={`text-sm ${styles.textSecondary}`}>Receive alerts for likes and comments</p>
                  </div>
                </div>
                <button className="relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner bg-gradient-to-r from-teal-500 to-cyan-500">
                  <div className="absolute top-1 left-9 w-6 h-6 rounded-full bg-white shadow-md transition-all" />
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.cardBg} rounded-3xl p-6 shadow-xl`}>
            <h2 className={`text-lg font-bold ${styles.textPrimary} mb-6 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              Account
            </h2>
            <div className="space-y-4">
              <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${styles.hoverBg} transition-colors`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-lg ${styles.textPrimary}`}>Change Password</p>
                  <p className={`text-sm ${styles.textSecondary}`}>Update your login credentials</p>
                </div>
                <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${styles.textSecondary}`} />
              </button>
              <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${styles.hoverBg} transition-colors`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-lg ${styles.textPrimary}`}>Privacy Settings</p>
                  <p className={`text-sm ${styles.textSecondary}`}>Manage who can see your content</p>
                </div>
                <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${styles.textSecondary}`} />
              </button>
              <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${styles.hoverBg} transition-colors`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-lg ${styles.textPrimary}`}>Connected Accounts</p>
                  <p className={`text-sm ${styles.textSecondary}`}>Link social media accounts</p>
                </div>
                <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${styles.textSecondary}`} />
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-6 p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center justify-center gap-3 font-semibold text-lg"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
            </div>
          </div>

          <div className={`${styles.cardBg} rounded-3xl p-6 shadow-xl text-center`}>
            <h3 className={`font-bold text-lg ${styles.textPrimary}`}>PixelHub</h3>
            <p className={`text-sm ${styles.textSecondary} mt-2`}>Version 3.0.2</p>
            <p className={`text-xs ${styles.textSecondary} mt-1`}>Built with ❤️ for photographers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
