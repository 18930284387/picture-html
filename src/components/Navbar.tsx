import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Menu,
  X,
  Home,
  Compass,
  Users,
  Search,
  Bell,
  Plus,
  Heart,
  User as UserIcon,
} from 'lucide-react';
import { useThemeStyles } from './Layout';
import { useAuth, useDarkMode, useFollowing, usePhotos, trendingTags } from '../store';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useDarkMode();
  const { isLoggedIn } = useAuth();
  const { isFollowing, toggleFollow } = useFollowing();
  const { photos, toggleLike } = usePhotos();
  const styles = useThemeStyles();

  return (
    <>
      <header
        className={`${styles.cardBg} border-b ${styles.borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 -mx-2 rounded-full ${styles.hoverBg} md:hidden transition-colors`}
          >
            <Menu className={`w-6 h-6 ${styles.textSecondary}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent hidden sm:block">
              PixelHub
            </span>
          </div>
        </div>

        <div
          className={`hidden sm:flex items-center max-w-xl w-full mx-6 px-5 py-3 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          } transition-all focus-within:ring-2 focus-within:ring-teal-500 shadow-sm`}
        >
          <Search className={`w-5 h-5 ${styles.textSecondary}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos, users, tags..."
            className={`flex-1 bg-transparent ${styles.textPrimary} outline-none ml-3 text-base placeholder-gray-400`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className={`hidden sm:flex p-3 rounded-full ${styles.hoverBg} relative transition-all`}>
            <Bell className={`w-6 h-6 ${styles.textSecondary}`} />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30 transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/profile')} className="ml-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow"
            />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`hidden md:flex flex-col w-72 ${styles.cardBg} border-r ${styles.borderColor} p-6 transition-transform duration-300`}
        >
          <div className="flex-1">
            <nav className="space-y-2">
              {[
                { id: 'hot', icon: Home, label: 'For You', desc: 'Discover amazing content' },
                { id: 'trending', icon: Compass, label: 'Trending', desc: 'Popular right now' },
                { id: 'follows', icon: Users, label: 'Following', desc: 'From creators you follow' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                    activeCategory === item.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30'
                      : `${styles.textSecondary} ${styles.hoverBg}`
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      activeCategory === item.id
                        ? 'bg-white/20'
                        : darkMode
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p
                      className={`font-semibold text-lg ${
                        activeCategory === item.id ? 'text-white' : styles.textPrimary
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-sm opacity-80 ${
                        activeCategory === item.id ? 'text-white' : styles.textSecondary
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold tracking-wider uppercase ${styles.textSecondary}`}>
                  <span>🔥 Hottest Tags</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className={`px-4 py-2 text-sm rounded-2xl font-medium transition-all transform hover:scale-105 active:scale-95 ${
                      darkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-300 hover:from-gray-700 hover:to-gray-600 border border-gray-600'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 border border-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-700'
                : 'bg-gradient-to-br from-gray-50 to-gray-100'
            } rounded-3xl p-6 border border-gray-200 dark:border-gray-600`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h4 className={`font-bold ${styles.textPrimary}`}>Upgrade to Pro</h4>
                <p className={`text-xs ${styles.textSecondary}`}>Unlock premium features</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-2xl hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg">
              Get Started
            </button>
          </div>
        </aside>

        {showSidebar && (
          <div className="md:hidden fixed inset-0 z-30">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSidebar(false)}
            />
            <div className={`relative w-80 ${styles.cardBg} h-full p-6 shadow-2xl animate-slide-in`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    PixelHub
                  </span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className={`p-2 rounded-full ${styles.hoverBg}`}
                >
                  <X className={`w-6 h-6 ${styles.textSecondary}`} />
                </button>
              </div>
              <nav className="space-y-3">
                {[
                  { id: 'hot', icon: Home, label: 'For You' },
                  { id: 'trending', icon: Compass, label: 'Trending' },
                  { id: 'follows', icon: Users, label: 'Following' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveCategory(item.id);
                      setShowSidebar(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      activeCategory === item.id
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : `${styles.textSecondary} ${styles.hoverBg}`
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-semibold text-lg">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-8">
                <h3 className={`text-sm font-bold tracking-wider uppercase ${styles.textSecondary} mb-4`}>
                  Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-2 text-sm rounded-full ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const styles = useThemeStyles();

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Compass, path: '/', label: 'Explore' },
    {
      icon: Plus,
      path: '/upload',
      isSpecial: true,
      label: 'Create',
    },
    { icon: Heart, path: '/profile', label: 'Likes' },
    { icon: UserIcon, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 ${styles.cardBg} border-t ${styles.borderColor} px-2 py-3 z-10 shadow-2xl`}
    >
      <div className="flex justify-around items-end">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 p-2 relative transition-all duration-300 ${
              item.isSpecial
                ? 'absolute -top-6 left-1/2 -translate-x-1/2'
                : item.path === '/'
                ? 'text-teal-500'
                : styles.textSecondary
            }`}
          >
            {item.isSpecial ? (
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/40 border-4 border-white dark:border-gray-900 transform hover:scale-110 active:scale-95 transition-all">
                <item.icon className="w-7 h-7 text-white" />
              </div>
            ) : (
              <>
                <item.icon
                  className={`w-7 h-7 transition-transform duration-300 ${
                    item.path === '/' ? 'scale-110' : ''
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    item.path === '/' ? 'text-teal-500' : styles.textSecondary
                  }`}
                >
                  {item.label}
                </span>
                {item.path === '/' && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-teal-500 rounded-full" />
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
