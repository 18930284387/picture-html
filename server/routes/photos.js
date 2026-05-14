import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../models/Photo.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find({ privacy: 'public' })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    const photosWithCounts = await Promise.all(
      photos.map(async (photo) => {
        const commentCount = await Comment.countDocuments({ photo: photo._id });
        return {
          ...photo.toObject(),
          commentCount,
          isLiked: false
        };
      })
    );

    res.json(photosWithCounts);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, tags, privacy } = req.body;

    let user = await User.findOne({ username: 'Alex Chen' });
    if (!user) {
      user = new User({
        username: 'Alex Chen',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
        bio: 'Photography enthusiast from San Francisco'
      });
      await user.save();
    }

    const photo = new Photo({
      url: `/uploads/${req.file.filename}`,
      title: title,
      author: user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      privacy: privacy || 'public'
    });

    await photo.save();
    await photo.populate('author', 'username avatar');

    const result = {
      ...photo.toObject(),
      commentCount: 0,
      isLiked: false
    };

    res.status(201).json(result);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

export default router;
