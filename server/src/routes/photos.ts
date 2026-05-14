import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Photo } from '../models/Photo.js';
import { Comment } from '../models/Comment.js';
import { User } from '../models/User.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
    }
  },
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    const photoIds = photos.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { photo: { $in: photoIds } } },
      { $group: { _id: '$photo', count: { $sum: 1 } } },
    ]);
    const commentCountMap = new Map(
      commentCounts.map((c) => [c._id.toString(), c.count])
    );

    const result = photos.map((photo) => ({
      _id: photo._id,
      title: photo.title,
      url: photo.url,
      author: photo.author,
      tags: photo.tags,
      likes: photo.likes.length,
      commentsCount: commentCountMap.get(photo._id.toString()) || 0,
      privacy: photo.privacy,
      createdAt: photo.createdAt,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, tags, privacy } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Image file is required' });
      return;
    }

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    let defaultUser = await User.findOne();
    if (!defaultUser) {
      defaultUser = await User.create({
        name: 'Alex Chen',
        email: 'alex@example.com',
        password: 'default123',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
        bio: 'Photography enthusiast from San Francisco',
      });
    }

    const imageUrl = `/uploads/${file.filename}`;

    const tagList = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const photo = await Photo.create({
      title,
      url: imageUrl,
      author: defaultUser._id,
      tags: tagList,
      likes: [],
      privacy: privacy || 'public',
    });

    const populated = await Photo.findById(photo._id)
      .populate('author', 'name avatar')
      .lean();

    res.status(201).json({
      _id: populated!._id,
      title: populated!.title,
      url: populated!.url,
      author: populated!.author,
      tags: populated!.tags,
      likes: 0,
      commentsCount: 0,
      privacy: populated!.privacy,
      createdAt: populated!.createdAt,
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;