import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { useThemeStyles } from '../components/Layout';
import { usePhotos, useFollowing, useUser } from '../store';

export const PhotoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photos, toggleLike, addComment, addReply } = usePhotos();
  const { isFollowing, toggleFollow } = useFollowing();
  const { currentUser } = useUser();
  const styles = useThemeStyles();

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const photo = photos.find((p) => p.id === Number(id));

  if (!photo) {
    return (
      <div className={`min-h-screen ${styles.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${styles.textPrimary}`}>Photo not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(photo.id, {
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: newComment,
    });
    setNewComment('');
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return;
    addReply(photo.id, commentId, {
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: replyText,
    });
    setReplyText('');
    setReplyingTo(null);
  };

  const renderComments = (comments: any[], level = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={level > 0 ? 'mt-4 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : 'flex gap-4'}>
        {level === 0 && (
          <img
            src={comment.avatar}
            alt={comment.user}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
          />
        )}
        {level > 0 && (
          <img
            src={comment.avatar}
            alt={comment.user}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <div className={`${styles.cardBg.includes('gray-900') ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl px-5 py-3`}>
            <p className={`font-semibold text-sm ${styles.textPrimary}`}>{comment.user}</p>
            <p className={`mt-1.5 text-sm leading-relaxed ${styles.textPrimary}`}>{comment.text}</p>
          </div>
          <div className="flex items-center gap-6 mt-2.5 ml-3">
            <button className={`text-sm font-medium hover:text-teal-500 transition-colors ${styles.textSecondary}`}>
              <ThumbsUp className="w-4 h-4 inline mr-1" />
              {comment.likes}
            </button>
            {level === 0 && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className={`text-sm font-medium hover:text-teal-500 transition-colors ${styles.textSecondary}`}
              >
                Reply
              </button>
            )}
          </div>

          {comment.replies.length > 0 && renderComments(comment.replies, level + 1)}

          {replyingTo === comment.id && (
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className={`flex-1 px-4 py-2.5 rounded-full ${styles.inputBg} border ${styles.textPrimary} text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                className="p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className={`min-h-screen ${styles.bg} flex flex-col`}>
      <header
        className={`${styles.cardBg} border-b ${styles.borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-10`}
      >
        <button onClick={() => navigate('/')} className={`p-2 -mx-2 rounded-full ${styles.hoverBg}`}>
          <ChevronLeft className={`w-6 h-6 ${styles.textPrimary}`} />
        </button>
        <h1 className={`font-semibold ${styles.textPrimary}`}>{photo.title}</h1>
        <button className={`p-2 -mx-2 rounded-full ${styles.hoverBg}`}>
          <Share2 className={`w-5 h-5 ${styles.textSecondary}`} />
        </button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="relative bg-black aspect-video">
          <img src={photo.url} alt={photo.title} className="w-full h-full object-contain" />
        </div>

        <div className={`p-4 ${styles.cardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={photo.avatar}
                alt={photo.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div>
                <p className={`font-semibold ${styles.textPrimary}`}>{photo.author}</p>
                <p className={`text-sm ${styles.textSecondary}`}>Photographer</p>
              </div>
            </div>
            <button
              onClick={() => toggleFollow(photo.author)}
              className={`px-5 py-2 font-medium rounded-full text-sm transition-all shadow-md ${
                isFollowing[photo.author]
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
              }`}
            >
              {isFollowing[photo.author] ? '✓ Following' : '+ Follow'}
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800 mt-4">
            <div className="flex items-center gap-8">
              <button onClick={() => toggleLike(photo.id)} className="flex items-center gap-2">
                <Heart
                  className={`w-7 h-7 transition-all ${
                    photo.isLiked ? 'fill-red-500 text-red-500 scale-110' : styles.textSecondary
                  }`}
                />
                <span className={`font-medium ${styles.textSecondary}`}>{photo.likes.toLocaleString()}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle className={`w-7 h-7 ${styles.textSecondary}`} />
                <span className={`font-medium ${styles.textSecondary}`}>{photo.comments.length}</span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <p className={`text-lg ${styles.textPrimary}`}>{photo.title}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {photo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-400 text-sm rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-2 p-4 ${styles.cardBg}`}>
          <h3 className={`font-semibold text-lg ${styles.textPrimary} mb-6 flex items-center gap-2`}>
            <MessageCircle className="w-5 h-5" />
            Comments ({photo.comments.length})
          </h3>

          <div className="space-y-6">{renderComments(photo.comments)}</div>

          {photo.comments.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className={`w-16 h-16 mx-auto ${styles.textSecondary} opacity-20 mb-4`} />
              <p className={`text-lg ${styles.textSecondary}`}>No comments yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.cardBg} border-t ${styles.borderColor} px-4 py-3`}>
        <div className="flex gap-3 items-center">
          <img
            src={currentUser.avatar}
            alt="You"
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={`flex-1 px-4 py-2.5 rounded-full ${styles.inputBg} border ${styles.textPrimary} outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
