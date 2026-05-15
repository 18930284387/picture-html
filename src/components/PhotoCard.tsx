import React from 'react';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  replies: Comment[];
}

interface Photo {
  id: number;
  url: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  isLiked: boolean;
}

interface PhotoCardProps {
  photo: Photo;
  darkMode: boolean;
  isFollowing: boolean;
  onSelect: (photo: Photo) => void;
  onLike: (photoId: number) => void;
  onFollow: (authorName: string) => void;
  onDelete: (photoId: number) => void;
  index?: number;
}

const CURRENT_USER = 'Alex Chen';

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  darkMode,
  isFollowing,
  onSelect,
  onLike,
  onFollow,
  onDelete,
  index = 0
}) => {
  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';
  const isCurrentUser = photo.author === CURRENT_USER;

  return (
    <div
      key={photo.id}
      className={`break-inside-avoid group ${cardBg} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 relative`}
      onClick={() => onSelect(photo)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {isCurrentUser && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
          className="absolute top-4 right-4 z-10 p-3 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-lg transform hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
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
              {!isCurrentUser && (
                <button
                  onClick={(e) => { e.stopPropagation(); onFollow(photo.author); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shadow-lg transform hover:scale-110 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  }`}
                >
                  {isFollowing ? '✓' : '+'}
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onLike(photo.id); }}
                className="p-3 bg-white/90 rounded-full hover:bg-white transition-all shadow-lg transform hover:scale-110"
              >
                <Heart className={`w-6 h-6 transition-all ${photo.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-xl ${textPrimary} truncate`}>{photo.title}</h3>
            <p className={`text-sm font-medium ${textSecondary} mt-1 flex items-center gap-1`}>
              <span className="w-2 h-2 bg-teal-500 rounded-full" />
              {photo.author}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {photo.tags.slice(0, 3).map(tag => (
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
            onClick={(e) => { e.stopPropagation(); onLike(photo.id); }}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${photo.isLiked ? 'bg-red-50 dark:bg-red-950/30' : hoverBg}`}
          >
            <Heart className={`w-6 h-6 transition-all duration-300 ${photo.isLiked ? 'fill-red-500 text-red-500 scale-110' : textSecondary}`} />
          </button>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-sm font-semibold ${textSecondary}`}>{photo.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-sm font-semibold ${textSecondary}`}>{photo.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
