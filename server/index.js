import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { Comment } from './models/Comment.js';
import { Photo } from './models/Photo.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const uploadsDir = path.join(appRoot, 'uploads');
const port = Number(process.env.PORT || 3001);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pixelhub';
const currentUserEmail = 'alex@example.com';
const fallbackAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100';

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    callback(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
      return;
    }

    callback(new Error('仅支持图片文件上传'));
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

function formatComment(commentNode) {
  return {
    id: commentNode._id.toString(),
    user: commentNode.author?.name || 'Unknown User',
    avatar: commentNode.author?.avatar || fallbackAvatar,
    text: commentNode.content,
    likes: commentNode.likesCount || 0,
    replies: []
  };
}

function buildCommentTree(commentDocuments) {
  const commentMap = new Map();
  const rootComments = [];

  for (const comment of commentDocuments) {
    commentMap.set(comment._id.toString(), formatComment(comment));
  }

  for (const comment of commentDocuments) {
    const currentComment = commentMap.get(comment._id.toString());
    const parentId = comment.parentComment ? comment.parentComment.toString() : null;

    if (parentId && commentMap.has(parentId)) {
      commentMap.get(parentId).replies.push(currentComment);
    } else {
      rootComments.push(currentComment);
    }
  }

  return rootComments;
}

function mapPhotoResponse(photo, commentDocuments) {
  const comments = buildCommentTree(commentDocuments);

  return {
    id: photo._id.toString(),
    url: photo.imageUrl,
    title: photo.title,
    author: photo.author?.name || 'Unknown User',
    avatar: photo.author?.avatar || fallbackAvatar,
    likes: photo.likesCount || 0,
    comments,
    commentsCount: commentDocuments.length,
    tags: photo.tags || [],
    isLiked: false,
    privacy: photo.privacy,
    createdAt: photo.createdAt
  };
}

function normalizeTags(tagsValue) {
  if (Array.isArray(tagsValue)) {
    return tagsValue
      .flatMap((item) => String(item).split(','))
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return String(tagsValue || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function ensureCurrentUser() {
  let currentUser = await User.findOne({ email: currentUserEmail });

  if (!currentUser) {
    currentUser = await User.create({
      email: currentUserEmail,
      name: 'Alex Chen',
      avatar: fallbackAvatar,
      bio: 'Photography enthusiast from San Francisco'
    });
  }

  return currentUser;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/photos', async (_req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    const photoIds = photos.map((photo) => photo._id);
    const comments = photoIds.length
      ? await Comment.find({ photo: { $in: photoIds } })
          .populate('author', 'name avatar')
          .sort({ createdAt: 1 })
          .lean()
      : [];

    const commentsByPhotoId = new Map();

    for (const comment of comments) {
      const photoId = comment.photo.toString();
      const photoComments = commentsByPhotoId.get(photoId) || [];
      photoComments.push(comment);
      commentsByPhotoId.set(photoId, photoComments);
    }

    const response = photos.map((photo) => {
      const photoComments = commentsByPhotoId.get(photo._id.toString()) || [];
      return mapPhotoResponse(photo, photoComments);
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/api/photos', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: '请上传图片文件' });
      return;
    }

    const title = String(req.body.title || '').trim();
    const privacy = ['public', 'followers', 'private'].includes(req.body.privacy)
      ? req.body.privacy
      : 'public';

    if (!title) {
      res.status(400).json({ message: '标题不能为空' });
      return;
    }

    const currentUser = await ensureCurrentUser();
    const tags = normalizeTags(req.body.tags);
    const imageUrl = `/uploads/${req.file.filename}`;

    const photo = await Photo.create({
      title,
      imageUrl,
      author: currentUser._id,
      tags,
      privacy,
      likesCount: 0
    });

    const createdPhoto = await Photo.findById(photo._id)
      .populate('author', 'name avatar')
      .lean();

    res.status(201).json(mapPhotoResponse(createdPhoto, []));
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({
    message: error.message || '服务器内部错误'
  });
});

async function startServer() {
  await mongoose.connect(mongoUri);
  await seedDatabase();
  await ensureCurrentUser();

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
