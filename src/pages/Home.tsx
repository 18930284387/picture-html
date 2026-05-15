import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Search } from 'lucide-react';
import { Navbar, BottomNav } from '../components/Navbar';
import { useThemeStyles } from '../components/Layout';
import { useFollowing, usePhotos, useDarkMode } from '../store';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useDarkMode();
  const { photos, toggleLike } = usePhotos();
  const { isFollowing, toggleFollow } = useFollowing();
  const styles = useThemeStyles();

  const filteredPhotos = photos.filter(
    (photo) => activeCategory !== 'follows' || photo.author !== 'Alex Chen'
  );

  return (
    <div className={`min-h-screen ${styles.bg} flex flex-col`}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`hidden md:flex flex-col w-72 ${styles.cardBg} border-r ${styles.borderColor} p-6 transition-transform duration-300`}
        />
        <main className="flex-1 overflow-auto pb-24 md:pb-6">
          <div
            className={`sm:hidden flex items-center gap-3 px-4 py-4 overflow-x-auto ${styles.cardBg} border-b ${styles.borderColor}`}
          >
            <div
              className={`flex items-center max-w-md flex-1 px-4 py-3 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Search className={`w-5 h-5 ${styles.textSecondary}`} />
              <input
                type="text"
                placeholder="Search..."
                className={`flex-1 bg-transparent ${styles.textPrimary} outline-none ml-3 text-base placeholder-gray-400`}
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className={`text-3xl font-bold ${styles.textPrimary} mb-2`}>
                {activeCategory === 'hot' ? '✨ For You' : activeCategory === 'trending' ? '🔥 Trending' : '👥 Following'}
              </h2>
              <p className={`text-lg ${styles.textSecondary}`}>
                {activeCategory === 'hot'
                  ? 'Discover amazing photos tailored for you'
                  : activeCategory === 'trending'
                  ? 'Popular photos from around the world'
                  : 'Latest posts from creators you follow'}
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`break-inside-avoid group ${styles.cardBg} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2`}
                  onClick={() => navigate(`/photo/${photo.id}`)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative aspect-auto overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <img src={photo.avatar} alt={photo.author} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-white font-semibold text-shadow">{photo.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollow(photo.author);
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shadow-lg transform hover:scale-110 ${
                              isFollowing[photo.author]
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                            }`}
                          >
                            {isFollowing[photo.author] ? '✓' : '+'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(photo.id);
                            }}
                            className="p-3 bg-white/90 rounded-full hover:bg-white transition-all shadow-lg transform hover:scale-110"
                          >
                            <Heart
                              className={`w-6 h-6 transition-all ${
                                photo.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-xl ${styles.textPrimary} truncate`}>{photo.title}</h3>
                        <p className={`text-sm font-medium ${styles.textSecondary} mt-1 flex items-center gap-1`}>
                          <span className="w-2 h-2 bg-teal-500 rounded-full" />
                          {photo.author}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {photo.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            >
                              #{tag}
                            </span>
                          ))}
                          {photo.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                              +{photo.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(photo.id);
                        }}
                        className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                          photo.isLiked ? 'bg-red-50 dark:bg-red-950/30' : styles.hoverBg
                        }`}
                      >
                        <Heart
                          className={`w-6 h-6 transition-all duration-300 ${
                            photo.isLiked ? 'fill-red-500 text-red-500 scale-110' : styles.textSecondary
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Heart className={`w-4 h-4 ${styles.textSecondary}`} />
                        <span className={`text-sm font-semibold ${styles.textSecondary}`}>
                          {photo.likes.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className={`w-4 h-4 ${styles.textSecondary}`} />
                        <span className={`text-sm font-semibold ${styles.textSecondary}`}>
                          {photo.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 py-8">
              <div
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700`}
              >
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <span className={`font-semibold ${styles.textSecondary}`}>Loading more amazing photos...</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
