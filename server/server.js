import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import Photo from './models/Photo.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelhub';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .populate('comments.replies.user', 'username avatar')
      .sort({ createdAt: -1 });

    const photosWithCounts = photos.map(photo => ({
      _id: photo._id,
      title: photo.title,
      url: photo.imageUrl,
      author: photo.author,
      likes: photo.likes.length,
      isLiked: false,
      comments: photo.comments,
      tags: photo.tags,
      createdAt: photo.createdAt
    }));

    res.json(photosWithCounts);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app.post('/api/photos', upload.single('image'), async (req, res) => {
  try {
    const { title, tags, authorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let author = await User.findById(authorId);
    if (!author) {
      author = await User.create({
        _id: authorId || new mongoose.Types.ObjectId(),
        username: 'Alex Chen',
        email: 'alex@example.com',
        password: 'hashed_password',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
      });
    }

    const photo = new Photo({
      title,
      imageUrl,
      author: author._id,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      likes: [],
      comments: []
    });

    await photo.save();

    const populatedPhoto = await Photo.findById(photo._id)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .populate('comments.replies.user', 'username avatar');

    const response = {
      _id: populatedPhoto._id,
      title: populatedPhoto.title,
      url: populatedPhoto.imageUrl,
      author: populatedPhoto.author,
      likes: 0,
      isLiked: false,
      comments: [],
      tags: populatedPhoto.tags,
      createdAt: populatedPhoto.createdAt
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app;
