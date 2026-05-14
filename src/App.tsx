import React, { useState, useRef } from 'react';
import {
  Home,
  Compass,
  Heart,
  User,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  Mail,
  Upload,
  MessageCircle,
  Share2,
  Trash2,
  EyeOff,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronLeft,
  Send,
  ThumbsUp,
  Camera,
  Lock,
  Globe,
  Users,
  Bookmark,
  Grid3X3,
  ChevronDown
} from 'lucide-react';

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

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  replies: Comment[];
}

const initialPhotos: Photo[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400&h=600',
    title: 'Mountain Sunrise',
    author: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 342,
    comments: [
      {
        id: 1,
        user: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
        text: 'Absolutely stunning! The colors are incredible.',
        likes: 24,
        replies: [
          {
            id: 2,
            user: 'Alex Chen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
            text: 'Thank you! Shot at golden hour.',
            likes: 8,
            replies: []
          }
        ]
      }
    ],
    tags: ['nature', 'mountains', 'sunrise'],
    isLiked: false
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=500',
    title: 'Tokyo Nights',
    author: 'Yuki Tanaka',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 567,
    comments: [],
    tags: ['urban', 'japan', 'night'],
    isLiked: true
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400',
    title: 'Tropical Beach',
    author: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 891,
    comments: [],
    tags: ['beach', 'tropical', 'ocean'],
    isLiked: false
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=400&h=550',
    title: 'City Lights',
    author: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 234,
    comments: [],
    tags: ['city', 'architecture', 'urban'],
    isLiked: false
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc0a9a?auto=format&fit=crop&q=80&w=400&h=650',
    title: 'Forest Path',
    author: 'Emma Green',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 1234,
    comments: [],
    tags: ['forest', 'nature', 'hiking'],
    isLiked: true
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=400&h=450',
    title: 'Aurora Dreams',
    author: 'Lars Olsen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 2341,
    comments: [],
    tags: ['aurora', 'night', 'northern'],
    isLiked: false
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400&h=500',
    title: 'Autumn Colors',
    author: 'Chris Wong',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 456,
    comments: [],
    tags: ['autumn', 'forest', 'colors'],
    isLiked: false
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=600',
    title: 'Portrait Study',
    author: 'Jenny Liu',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=100&h=100',
    likes: 789,
    comments: [],
    tags: ['portrait', 'people', 'bw'],
    isLiked: true
  }
];

const trendingTags = ['nature', 'urban', 'portrait', 'abstract', 'travel', 'food', 'animals', 'blackandwhite'];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [activeTab, setActiveTab] = useState<'posts' | 'favorites' | 'comments'>('posts');
  const [isFollowing, setIsFollowing] = useState<{ [key: string]: boolean }>({});

  const toggleFollow = (authorName: string) => {
    setIsFollowing(prev => ({
      ...prev,
      [authorName]: !prev[authorName]
    }));
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('hot');
  
  const [uploadDrag, setUploadDrag] = useState(false);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadPrivacy, setUploadPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  
  const [settingsName, setSettingsName] = useState('Alex Chen');
  const [settingsBio, setSettingsBio] = useState('Photography enthusiast from San Francisco');
  const [settingsEmail, setSettingsEmail] = useState('alex@example.com');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    setLoginError('');
    if (!loginEmail.includes('@')) {
      setLoginError('Email must contain @ character');
      return;
    }
    
    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long');
      return;
    }
    
    let typeCount = 0;
    if (/[0-9]/.test(loginPassword)) typeCount++;
    if (/[a-zA-Z]/.test(loginPassword)) typeCount++;
    if (/[^a-zA-Z0-9]/.test(loginPassword)) typeCount++;
    
    if (typeCount < 2) {
      setLoginError('Password must contain at least two types of characters: numbers, letters, or special characters');
      return;
    }

    setIsLoggedIn(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (photoId: number) => {
    setPhotos(photos.map(p => {
      if (p.id === photoId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        isLiked: !selectedPhoto.isLiked,
        likes: selectedPhoto.isLiked ? selectedPhoto.likes - 1 : selectedPhoto.likes + 1
      });
    }
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedPhoto) return;
    const comment: Comment = {
      id: Date.now(),
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      text: newComment,
      likes: 0,
      replies: []
    };
    const updatedPhoto = { ...selectedPhoto, comments: [...selectedPhoto.comments, comment] };
    setSelectedPhoto(updatedPhoto);
    setPhotos(photos.map(p => p.id === selectedPhoto.id ? updatedPhoto : p));
    setNewComment('');
  };

  const addReply = (commentId: number) => {
    if (!replyText.trim() || !selectedPhoto) return;
    const reply: Comment = {
      id: Date.now(),
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      text: replyText,
      likes: 0,
      replies: []
    };
    const updatedComments = selectedPhoto.comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, reply] };
      }
      return c;
    });
    const updatedPhoto = { ...selectedPhoto, comments: updatedComments };
    setSelectedPhoto(updatedPhoto);
    setPhotos(photos.map(p => p.id === selectedPhoto.id ? updatedPhoto : p));
    setReplyText('');
    setReplyingTo(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!uploadPreview || !uploadTitle) return;
    const newPhoto: Photo = {
      id: Date.now(),
      url: uploadPreview,
      title: uploadTitle,
      author: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      likes: 0,
      comments: [],
      tags: uploadTags.split(',').map(t => t.trim()),
      isLiked: false
    };
    setPhotos([newPhoto, ...photos]);
    setUploadPreview('');
    setUploadTitle('');
    setUploadTags('');
    setCurrentPage('home');
  };

  const filteredPhotos = photos.filter(photo =>
    activeCategory !== 'follows' || photo.author !== 'Alex Chen'
  );
 
  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'} flex items-center justify-center p-4`}>
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
            {loginError && (
              <div className="text-red-500 text-sm font-medium text-center">
                {loginError}
              </div>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25"
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
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute top-4 right-4 p-3 rounded-full ${hoverBg} transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  if (selectedPhoto) {
    return (
      <div className={`min-h-screen ${bg} flex flex-col`}>
        <header className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-10`}>
          <button onClick={() => setSelectedPhoto(null)} className={`p-2 -mx-2 rounded-full ${hoverBg}`}>
            <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
          </button>
          <h1 className={`font-semibold ${textPrimary}`}>{selectedPhoto.title}</h1>
          <button className={`p-2 -mx-2 rounded-full ${hoverBg}`}>
            <Share2 className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="relative bg-black aspect-video">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className={`p-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedPhoto.avatar} alt={selectedPhoto.author} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                <div>
                  <p className={`font-semibold ${textPrimary}`}>{selectedPhoto.author}</p>
                  <p className={`text-sm ${textSecondary}`}>Photographer</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(selectedPhoto.author);
                }}
                className={`px-5 py-2 font-medium rounded-full text-sm transition-all shadow-md ${
                  isFollowing[selectedPhoto.author]
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
                }`}
              >
                {isFollowing[selectedPhoto.author] ? '✓ Following' : '+ Follow'}
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800 mt-4">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-7 h-7 transition-all ${selectedPhoto.isLiked ? 'fill-red-500 text-red-500 scale-110' : textSecondary}`} />
                  <span className={`font-medium ${textSecondary}`}>{selectedPhoto.likes.toLocaleString()}</span>
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className={`w-7 h-7 ${textSecondary}`} />
                  <span className={`font-medium ${textSecondary}`}>{selectedPhoto.comments.length}</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <p className={`text-lg ${textPrimary}`}>{selectedPhoto.title}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedPhoto.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-400 text-sm rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-2 p-4 ${cardBg}`}>
            <h3 className={`font-semibold text-lg ${textPrimary} mb-6 flex items-center gap-2`}>
              <MessageCircle className="w-5 h-5" />
              Comments ({selectedPhoto.comments.length})
            </h3>

            <div className="space-y-6">
              {selectedPhoto.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0" />
                  <div className="flex-1">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl px-5 py-3`}>
                      <p className={`font-semibold text-sm ${textPrimary}`}>{comment.user}</p>
                      <p className={`mt-1.5 text-sm leading-relaxed ${textPrimary}`}>{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-6 mt-2.5 ml-3">
                      <button className={`text-sm font-medium hover:text-teal-500 transition-colors ${textSecondary}`}>
                        <ThumbsUp className="w-4 h-4 inline mr-1" />
                        {comment.likes}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={`text-sm font-medium hover:text-teal-500 transition-colors ${textSecondary}`}
                      >
                        Reply
                      </button>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-3">
                            <img src={reply.avatar} alt={reply.user} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl px-4 py-2 flex-1`}>
                              <p className={`font-semibold text-sm ${textPrimary}`}>{reply.user}</p>
                              <p className={`text-sm ${textPrimary}`}>{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === comment.id && (
                      <div className="flex gap-3 mt-3">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className={`flex-1 px-4 py-2.5 rounded-full ${inputBg} border ${textPrimary} text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                        />
                        <button
                          onClick={() => addReply(comment.id)}
                          className="p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md"
                        >
                          <Send className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedPhoto.comments.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className={`w-16 h-16 mx-auto ${textSecondary} opacity-20 mb-4`} />
                <p className={`text-lg ${textSecondary}`}>No comments yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>

        <div className={`${cardBg} border-t ${borderColor} px-4 py-3`}>
          <div className="flex gap-3 items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
              alt="You"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-1 px-4 py-2.5 rounded-full ${inputBg} border ${textPrimary} outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className={`p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'upload') {
    return (
      <div className={`min-h-screen ${bg} flex flex-col`}>
        <header className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center gap-3 sticky top-0 z-10`}>
          <button onClick={() => setCurrentPage('home')} className={`p-2 -mx-2 rounded-full ${hoverBg}`}>
            <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
          </button>
          <h1 className={`font-bold text-xl ${textPrimary}`}>Create Post</h1>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className={`max-w-2xl mx-auto ${cardBg} rounded-3xl overflow-hidden shadow-xl`}>
            <div
              onDragOver={e => { e.preventDefault(); setUploadDrag(true); }}
              onDragLeave={() => setUploadDrag(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square border-2 border-dashed ${
                uploadDrag ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30' : borderColor
              } flex items-center justify-center cursor-pointer transition-all duration-300 ${uploadPreview ? 'p-0' : 'p-8'}`}
            >
              {uploadPreview ? (
                <div className="relative group w-full h-full">
                  <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadPreview(''); }}
                      className="p-3 bg-white/95 rounded-full shadow-lg transform hover:scale-110 transition-all"
                    >
                      <Trash2 className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center px-4">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'} flex items-center justify-center shadow-inner`}>
                    <Upload className={`w-12 h-12 ${textSecondary}`} />
                  </div>
                  <p className={`text-xl font-semibold ${textPrimary} mb-2`}>Drag and drop your image here</p>
                  <p className={`text-base ${textSecondary}`}>or click to browse your files</p>
                  <p className={`text-sm ${textSecondary} mt-2`}>Supports: JPG, PNG, GIF (Max 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Give your photo a title..."
                  className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                  Tags <span className={`font-normal ${textSecondary}`}>(separate with commas)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={e => setUploadTags(e.target.value)}
                    placeholder="nature, travel, sunset..."
                    className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pb-12 transition-all`}
                  />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className={`text-xs ${textSecondary}`}>
                      Popular: {trendingTags.slice(0, 5).map(tag => (
                        <button
                          key={tag}
                          onClick={() => setUploadTags(prev => prev ? prev + ', ' + tag : tag)}
                          className="ml-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>Privacy Settings</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'public', icon: Globe, label: 'Public', desc: 'Visible to all' },
                    { value: 'followers', icon: Users, label: 'Followers', desc: 'Only followers' },
                    { value: 'private', icon: EyeOff, label: 'Private', desc: 'Only you' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUploadPrivacy(option.value as any)}
                      className={`px-5 py-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                        uploadPrivacy === option.value
                          ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 shadow-md'
                          : `${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                      }`}
                    >
                      <option.icon className={`w-7 h-7 ${uploadPrivacy === option.value ? 'text-teal-500' : textSecondary}`} />
                      <span className={`font-semibold ${uploadPrivacy === option.value ? 'text-teal-600 dark:text-teal-400' : textPrimary}`}>{option.label}</span>
                      <span className={`text-xs ${textSecondary}`}>{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!uploadPreview || !uploadTitle.trim()}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-xl shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Share Your Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'profile') {
    const userPhotos = photos.slice(0, 6);
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm`}>
          <button onClick={() => setCurrentPage('home')} className={`p-2 -mx-2 rounded-full ${hoverBg}`}>
            <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
          </button>
          <h1 className={`font-bold text-xl ${textPrimary}`}>Profile</h1>
          <button onClick={() => setCurrentPage('settings')} className={`p-2 -mx-2 rounded-full ${hoverBg} transition-colors`}>
            <Settings className={`w-6 h-6 ${textSecondary}`} />
          </button>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          <div className={`${cardBg} rounded-3xl p-8 shadow-xl`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <h2 className={`text-3xl font-bold ${textPrimary}`}>Alex Chen</h2>
                <p className={`text-lg mt-2 ${textSecondary}`}>@alexchen</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-400 text-xs rounded-full font-semibold">
                    Pro Photographer
                  </span>
                </div>
                <p className={`mt-4 text-lg leading-relaxed ${textPrimary}`}>
                  📸 Photography enthusiast from San Francisco. 
                  Capturing moments that matter. Available for collaborations.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                  <span className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                    <span>📍</span> San Francisco, CA
                  </span>
                  <span className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                    <a href="#" className="text-teal-500 hover:text-teal-600 font-medium">alexchen.photo</a>
                  </span>
                  <span className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                    <span>📅</span> Joined March 2022
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-8 mt-6">
                  <div className="text-center">
                    <p className={`text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent`}>248</p>
                    <p className={`text-sm font-medium ${textSecondary} mt-1`}>Posts</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className={`text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent`}>12.3K</p>
                    <p className={`text-sm font-medium ${textSecondary} mt-1`}>Followers</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className={`text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent`}>891</p>
                    <p className={`text-sm font-medium ${textSecondary} mt-1`}>Following</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8">
                  <button className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30">
                    ✉️ Message
                  </button>
                  <button className={`flex-1 sm:flex-none px-8 py-3 border-2 ${borderColor} ${textPrimary} font-semibold rounded-2xl ${hoverBg} transition-all`}>
                    Edit Profile
                  </button>
                  <button className={`px-4 py-3 border-2 ${borderColor} rounded-2xl ${hoverBg} transition-all`}>
                    <Share2 className={`w-5 h-5 ${textSecondary}`} />
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
                { value: 'comments', icon: MessageCircle, label: 'Activity' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as typeof activeTab)}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 ${
                    activeTab === tab.value
                      ? 'text-teal-500 border-b-3 border-teal-500'
                      : textSecondary
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
                  {userPhotos.map(photo => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => setSelectedPhoto(photo)}
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
                  {userPhotos.map(photo => (
                    <div
                      key={photo.id + 's'}
                      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => setSelectedPhoto(photo)}
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
                      onClick={() => setSelectedPhoto(photo)}
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
                    'Your photo was added to trending today!'
                  ].map((text, idx) => (
                    <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-md transition-shadow`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-base ${textPrimary}`}>{text}</p>
                        <p className={`text-sm mt-1 ${textSecondary}`}>{idx + 1} hour ago</p>
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
  }

  if (currentPage === 'settings') {
    return (
      <div className={`min-h-screen ${bg} flex flex-col`}>
        <header className={`${cardBg} border-b ${borderColor} px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm`}>
          <button onClick={() => setCurrentPage('profile')} className={`p-2 -mx-2 rounded-full ${hoverBg}`}>
            <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
          </button>
          <h1 className={`font-bold text-xl ${textPrimary}`}>Settings</h1>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className={`${cardBg} rounded-3xl p-6 shadow-xl`}>
              <h2 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                Profile Settings
              </h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md">
                    Change Photo
                  </button>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Display Name</label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={e => setSettingsName(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Email Address</label>
                  <input
                    type="email"
                    value={settingsEmail}
                    onChange={e => setSettingsEmail(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Bio</label>
                  <textarea
                    value={settingsBio}
                    onChange={e => setSettingsBio(e.target.value)}
                    rows={4}
                    className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-3xl p-6 shadow-xl`}>
              <h2 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Preferences
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                      {darkMode ? <Moon className="w-6 h-6 text-amber-600 dark:text-amber-400" /> : <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <div>
                      <p className={`font-semibold text-lg ${textPrimary}`}>Dark Mode</p>
                      <p className={`text-sm ${textSecondary}`}>Switch between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                      darkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${
                      darkMode ? 'left-9' : 'left-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className={`font-semibold text-lg ${textPrimary}`}>Push Notifications</p>
                      <p className={`text-sm ${textSecondary}`}>Receive alerts for likes and comments</p>
                    </div>
                  </div>
                  <button className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner bg-gradient-to-r from-teal-500 to-cyan-500`}>
                    <div className="absolute top-1 left-9 w-6 h-6 rounded-full bg-white shadow-md transition-all" />
                  </button>
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-3xl p-6 shadow-xl`}>
              <h2 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                Account
              </h2>
              <div className="space-y-4">
                <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${hoverBg} transition-colors`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-lg ${textPrimary}`}>Change Password</p>
                    <p className={`text-sm ${textSecondary}`}>Update your login credentials</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${textSecondary}`} />
                </button>
                <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${hoverBg} transition-colors`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-lg ${textPrimary}`}>Privacy Settings</p>
                    <p className={`text-sm ${textSecondary}`}>Manage who can see your content</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${textSecondary}`} />
                </button>
                <button className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 ${hoverBg} transition-colors`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-lg ${textPrimary}`}>Connected Accounts</p>
                    <p className={`text-sm ${textSecondary}`}>Link social media accounts</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 transform rotate-[-90deg] ${textSecondary}`} />
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentPage('home');
                  }}
                  className="w-full mt-6 p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className={`${cardBg} rounded-3xl p-6 shadow-xl text-center`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>PixelHub</h3>
              <p className={`text-sm ${textSecondary} mt-2`}>Version 3.0.2</p>
              <p className={`text-xs ${textSecondary} mt-1`}>Built with ❤️ for photographers</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      <header className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSidebar(!showSidebar)} className={`p-2 -mx-2 rounded-full ${hoverBg} md:hidden transition-colors`}>
            <Menu className={`w-6 h-6 ${textSecondary}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-extrabold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent hidden sm:block`}>
              PixelHub
            </span>
          </div>
        </div>

        <div className={`hidden sm:flex items-center max-w-xl w-full mx-6 px-5 py-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-all focus-within:ring-2 focus-within:ring-teal-500 shadow-sm`}>
          <Search className={`w-5 h-5 ${textSecondary}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search photos, users, tags..."
            className={`flex-1 bg-transparent ${textPrimary} outline-none ml-3 text-base placeholder-gray-400`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className={`hidden sm:flex p-3 rounded-full ${hoverBg} relative transition-all`}>
            <Bell className={`w-6 h-6 ${textSecondary}`} />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
          </button>
          <button
            onClick={() => setCurrentPage('upload')}
            className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30 transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrentPage('profile')} className="ml-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow"
            />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`hidden md:flex flex-col w-72 ${cardBg} border-r ${borderColor} p-6 transition-transform duration-300`}>
          <div className="flex-1">
            <nav className="space-y-2">
              {[
                { id: 'hot', icon: Home, label: 'For You', desc: 'Discover amazing content' },
                { id: 'trending', icon: Compass, label: 'Trending', desc: 'Popular right now' },
                { id: 'follows', icon: Users, label: 'Following', desc: 'From creators you follow' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                    activeCategory === item.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30'
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeCategory === item.id ? 'bg-white/20' : darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-semibold text-lg ${activeCategory === item.id ? 'text-white' : textPrimary}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm opacity-80 ${activeCategory === item.id ? 'text-white' : textSecondary}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold tracking-wider uppercase ${textSecondary}`}>
                  <span>🔥 Hottest Tags</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {trendingTags.map(tag => (
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

          <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-3xl p-6 border border-gray-200 dark:border-gray-600`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h4 className={`font-bold ${textPrimary}`}>Upgrade to Pro</h4>
                <p className={`text-xs ${textSecondary}`}>Unlock premium features</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-2xl hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg">
              Get Started
            </button>
          </div>
        </aside>

        {showSidebar && (
          <div className="md:hidden fixed inset-0 z-30">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
            <div className={`relative w-80 ${cardBg} h-full p-6 shadow-2xl animate-slide-in`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-extrabold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent`}>
                    PixelHub
                  </span>
                </div>
                <button onClick={() => setShowSidebar(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>
              <nav className="space-y-3">
                {[
                  { id: 'hot', icon: Home, label: 'For You' },
                  { id: 'trending', icon: Compass, label: 'Trending' },
                  { id: 'follows', icon: Users, label: 'Following' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveCategory(item.id); setShowSidebar(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      activeCategory === item.id
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-semibold text-lg">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-8">
                <h3 className={`text-sm font-bold tracking-wider uppercase ${textSecondary} mb-4`}>Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.slice(0, 8).map(tag => (
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

        <main className="flex-1 overflow-auto pb-24 md:pb-6">
          <div className={`sm:hidden flex items-center gap-3 px-4 py-4 overflow-x-auto ${cardBg} border-b ${borderColor}`}>
            <div className={`flex items-center max-w-md flex-1 px-4 py-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Search className={`w-5 h-5 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search..."
                className={`flex-1 bg-transparent ${textPrimary} outline-none ml-3 text-base placeholder-gray-400`}
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>
                {activeCategory === 'hot' ? '✨ For You' : activeCategory === 'trending' ? '🔥 Trending' : '👥 Following'}
              </h2>
              <p className={`text-lg ${textSecondary}`}>
                {activeCategory === 'hot' ? 'Discover amazing photos tailored for you' :
                 activeCategory === 'trending' ? 'Popular photos from around the world' :
                 'Latest posts from creators you follow'}
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`break-inside-avoid group ${cardBg} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2`}
                  onClick={() => setSelectedPhoto(photo)}
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
                            onClick={(e) => { e.stopPropagation(); toggleFollow(photo.author); }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shadow-lg transform hover:scale-110 ${
                              isFollowing[photo.author]
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                            }`}
                          >
                            {isFollowing[photo.author] ? '✓' : '+'}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
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
                        onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
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
              ))}
            </div>

            <div className="text-center mt-12 py-8">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <span className={`font-semibold ${textSecondary}`}>Loading more amazing photos...</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${cardBg} border-t ${borderColor} px-2 py-3 z-10 shadow-2xl`}>
        <div className="flex justify-around items-end">
          {[
            { icon: Home, page: 'home', label: 'Home' },
            { icon: Compass, page: 'explore', label: 'Explore' },
            {
              icon: Plus,
              page: 'upload',
              isSpecial: true,
              label: 'Create'
            },
            { icon: Heart, page: 'favorites', label: 'Likes' },
            { icon: User, page: 'profile', label: 'Profile' }
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`flex flex-col items-center gap-1 p-2 relative transition-all duration-300 ${
                item.page === 'upload'
                  ? 'absolute -top-6 left-1/2 -translate-x-1/2'
                  : currentPage === item.page
                  ? 'text-teal-500'
                  : textSecondary
              }`}
            >
              {item.isSpecial ? (
                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/40 border-4 border-white dark:border-gray-900 transform hover:scale-110 active:scale-95 transition-all">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
              ) : (
                <>
                  <item.icon className={`w-7 h-7 transition-transform duration-300 ${currentPage === item.page ? 'scale-110' : ''}`} />
                  <span className={`text-xs font-semibold ${currentPage === item.page ? 'text-teal-500' : textSecondary}`}>
                    {item.label}
                  </span>
                  {currentPage === item.page && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-teal-500 rounded-full" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
