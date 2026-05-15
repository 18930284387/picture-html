import { create } from 'zustand';

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  replies: Comment[];
}

export interface Photo {
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

export const trendingTags = ['nature', 'urban', 'portrait', 'abstract', 'travel', 'food', 'animals', 'blackandwhite'];

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  currentUser: {
    name: string;
    bio: string;
    email: string;
    avatar: string;
  };
  updateCurrentUser: (user: Partial<AppState['currentUser']>) => void;
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'likes' | 'comments' | 'isLiked'>) => void;
  toggleLike: (photoId: number) => void;
  addComment: (photoId: number, comment: Omit<Comment, 'id' | 'likes' | 'replies'>) => void;
  addReply: (photoId: number, commentId: number, reply: Omit<Comment, 'id' | 'likes' | 'replies'>) => void;
  isFollowing: Record<string, boolean>;
  toggleFollow: (authorName: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  darkMode: false,
  toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),

  currentUser: {
    name: 'Alex Chen',
    bio: 'Photography enthusiast from San Francisco',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  updateCurrentUser: (user) => set(state => ({ currentUser: { ...state.currentUser, ...user } })),

  photos: initialPhotos,
  addPhoto: (photo) => set(state => ({
    photos: [{
      ...photo,
      id: Date.now(),
      likes: 0,
      comments: [],
      isLiked: false
    }, ...state.photos]
  })),
  toggleLike: (photoId) => set(state => ({
    photos: state.photos.map(p =>
      p.id === photoId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    )
  })),
  addComment: (photoId, comment) => set(state => ({
    photos: state.photos.map(p =>
      p.id === photoId
        ? {
            ...p,
            comments: [...p.comments, { ...comment, id: Date.now(), likes: 0, replies: [] }]
          }
        : p
    )
  })),
  addReply: (photoId, commentId, reply) => set(state => ({
    photos: state.photos.map(p => {
      if (p.id !== photoId) return p;

      const addReplyRecursive = (comments: Comment[]): Comment[] =>
        comments.map(c => {
          if (c.id === commentId) {
            return { ...c, replies: [...c.replies, { ...reply, id: Date.now(), likes: 0, replies: [] }] };
          }
          if (c.replies.length > 0) {
            return { ...c, replies: addReplyRecursive(c.replies) };
          }
          return c;
        });

      return { ...p, comments: addReplyRecursive(p.comments) };
    })
  })),

  isFollowing: {},
  toggleFollow: (authorName) => set(state => ({
    isFollowing: {
      ...state.isFollowing,
      [authorName]: !state.isFollowing[authorName]
    }
  }))
}));

export const useDarkMode = () => useStore(state => ({ darkMode: state.darkMode, toggleDarkMode: state.toggleDarkMode }));
export const useAuth = () => useStore(state => ({ isLoggedIn: state.isLoggedIn, setIsLoggedIn: state.setIsLoggedIn }));
export const useUser = () => useStore(state => ({ currentUser: state.currentUser, updateCurrentUser: state.updateCurrentUser }));
export const usePhotos = () => useStore(state => ({
  photos: state.photos,
  addPhoto: state.addPhoto,
  toggleLike: state.toggleLike,
  addComment: state.addComment,
  addReply: state.addReply
}));
export const useFollowing = () => useStore(state => ({ isFollowing: state.isFollowing, toggleFollow: state.toggleFollow }));
