import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import photosRouter from './routes/photos.js';
import usersRouter from './routes/users.js';
import { Photo } from './models/Photo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // for image uploads

// Routes
app.use('/api/photos', photosRouter);
app.use('/api/users', usersRouter);

// Seed database with initial data if empty
const seedDatabase = async () => {
  const count = await Photo.countDocuments();
  if (count === 0) {
    console.log('Seeding initial data...');
    const initialPhotos = [
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
                likes: 8
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
    await Photo.insertMany(initialPhotos);
    console.log('Seeded initial data');
  }
};

// Start server
connectDB().then(() => {
  seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
