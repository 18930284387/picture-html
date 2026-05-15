import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Settings,
  Camera,
  Grid3X3,
  Bookmark,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { useThemeStyles } from '../components/Layout';
import { usePhotos } from '../store';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { photos } = usePhotos();
  const styles = useThemeStyles();

  const [activeTab, setActiveTab] = useState<'posts' | 'favorites' | 'comments'>('posts');
  const userPhotos = photos.slice(0, 6);

  return (
    <div className={`min-h-screen ${styles.bg}`}>
      <header
        className={`${styles.cardBg} border-b ${styles.borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm`}
      >
        <button onClick={() => navigate('/')} className={`p-2 -mx-2 rounded-full ${styles.hoverBg}`}>
          <ChevronLeft className={`w-6 h-6 ${styles.textPrimary}`} />
        </button>
        <h1 className={`font-bold text-xl ${styles.textPrimary}`}>Profile</h1>
        <button onClick={() => navigate('/settings')} className={`p-2 -mx-2 rounded-full ${styles.hoverBg} transition-colors`}>
          <Settings className={`w-6 h-6 ${styles.textSecondary}`} />
        </button>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        <div className={`${styles.cardBg} rounded-3xl p-8 shadow-xl`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
              <h2 className={`text-3xl font-bold ${styles.textPrimary}`}>Alex Chen</h2>
              <p className={`text-lg mt-2 ${styles.textSecondary}`}>@alexchen</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-400 text-xs rounded-full font-semibold">
                  Pro Photographer
                </span>
              </div>
              <p className={`mt-4 text-lg leading-relaxed ${styles.textPrimary}`}>
                📸 Photography enthusiast from San Francisco. Capturing moments that matter. Available for collaborations.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                <span className={`text-sm flex items-center gap-2 ${styles.textSecondary}`}>
                  <span>📍</span> San Francisco, CA
                </span>
                <span className={`text-sm flex items-center gap-2 ${styles.textSecondary}`}>
                  <a href="#" className="text-teal-500 hover:text-teal-600 font-medium">alexchen.photo</a>
                </span>
                <span className={`text-sm flex items-center gap-2 ${styles.textSecondary}`}>
                  <span>📅</span> Joined March 2022
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-8 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    248
                  </p>
                  <p className={`text-sm font-medium ${styles.textSecondary} mt-1`}>Posts</p>
                </div>
                <div className={`w-px h-12 bg-gray-200 dark:bg-gray-700`} />
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    12.3K
                  </p>
                  <p className={`text-sm font-medium ${styles.textSecondary} mt-1`}>Followers</p>
                </div>
                <div className={`w-px h-12 bg-gray-200 dark:bg-gray-700`} />
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    891
                  </p>
                  <p className={`text-sm font-medium ${styles.textSecondary} mt-1`}>Following</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8">
                <button className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30">
                  ✉️ Message
                </button>
                <button
                  className={`flex-1 sm:flex-none px-8 py-3 border-2 ${styles.borderColor} ${styles.textPrimary} font-semibold rounded-2xl ${styles.hoverBg} transition-all`}
                >
                  Edit Profile
                </button>
                <button className={`px-4 py-3 border-2 ${styles.borderColor} rounded-2xl ${styles.hoverBg} transition-all`}>
                  <svg className={`w-5 h-5 ${styles.textSecondary}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-6 bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-3xl`}>
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {[
              { value: 'posts', icon: Grid3X3, label: 'Posts' },
              { value: 'favorites', icon: Bookmark, label: 'Saved' },
              { value: 'comments', icon: MessageCircle, label: 'Activity' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                className={`flex-1 py-5 flex items-center justify-center gap-2 ${
                  activeTab === tab.value ? 'text-teal-500 border-b-3 border-teal-500' : styles.textSecondary
                } transition-all duration-300`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="font-semibold hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate(`/photo/${photo.id}`)}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex items-center gap-6 text-white">
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <Heart className="w-5 h-5 fill-current" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <MessageCircle className="w-5 h-5" />
                          {photo.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {userPhotos.map((photo) => (
                  <div
                    key={photo.id + 's'}
                    className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate(`/photo/${photo.id}`)}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex items-center gap-6 text-white">
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <Heart className="w-5 h-5 fill-current" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <MessageCircle className="w-5 h-5" />
                          {photo.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userPhotos.slice(0, 3).concat(userPhotos.slice(0, 2)).map((photo, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate(`/photo/${photo.id}`)}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex items-center gap-6 text-white">
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <Heart className="w-5 h-5 fill-current" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center gap-2 font-semibold text-lg">
                          <MessageCircle className="w-5 h-5" />
                          {photo.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {[
                  'Your photo "Mountain Sunrise" received 12 new likes!',
                  'Sarah commented on your post: "Great shot!"',
                  'Michael started following you',
                  'Your photo was added to trending today!',
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-2xl ${
                      styles.cardBg.includes('gray-900') ? 'bg-gray-800' : 'bg-gray-50'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-base ${styles.textPrimary}`}>{text}</p>
                      <p className={`text-sm mt-1 ${styles.textSecondary}`}>{idx + 1} hour ago</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
