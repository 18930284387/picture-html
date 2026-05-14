import express from 'express';
import Photo from '../models/Photo.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import upload from '../middleware/upload.js';
import { fileURLToPath } from 'url';
import path from 'path';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get('/photos', async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'name avatar email')
      .populate({
        path: 'commentsCount'
      })
      .sort({ createdAt: -1 });

    const photosWithCounts = await Promise.all(
      photos.map(async (photo) => {
        const commentsCount = await Comment.countDocuments({ photo: photo._id, parent: null });
        return {
          id: photo._id,
          url: photo.url,
          title: photo.title,
          author: photo.author.name,
          avatar: photo.author.avatar,
          authorId: photo.author._id,
          likes: photo.likes,
          commentsCount: commentsCount,
          tags: photo.tags,
          isLiked: false,
          privacy: photo.privacy,
          createdAt: photo.createdAt
        };
      })
    );

    res.json(photosWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('author', 'name avatar email');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comments = await Comment.find({ photo: photo._id, parent: null })
      .populate('user', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name avatar' }
      })
      .sort({ createdAt: 1 });

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      user: comment.user.name,
      avatar: comment.user.avatar,
      text: comment.text,
      likes: comment.likes,
      replies: (comment.replies || []).map(reply => ({
        id: reply._id,
        user: reply.user.name,
        avatar: reply.user.avatar,
        text: reply.text,
        likes: reply.likes,
        replies: []
      }))
    }));

    res.json({
      id: photo._id,
      url: photo.url,
      title: photo.title,
      author: photo.author.name,
      avatar: photo.author.avatar,
      authorId: photo.author._id,
      likes: photo.likes,
      comments: formattedComments,
      tags: photo.tags,
      isLiked: false,
      privacy: photo.privacy,
      createdAt: photo.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/photos', upload.single('image'), async (req, res) => {
  try {
    const { title, tags, authorId, privacy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let author;
    if (authorId) {
      author = await User.findById(authorId);
    }
    if (!author) {
      author = await User.findOne({ name: 'Alex Chen' });
      if (!author) {
        author = await User.create({
          name: 'Alex Chen',
          email: 'alex@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
          bio: 'Photography enthusiast from San Francisco'
        });
      }
    }

    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

    const photo = new Photo({
      title,
      url: imageUrl,
      author: author._id,
      tags: tagsArray,
      privacy: privacy || 'public'
    });

    const newPhoto = await photo.save();

    const populatedPhoto = await Photo.findById(newPhoto._id)
      .populate('author', 'name avatar email');

    res.status(201).json({
      id: populatedPhoto._id,
      url: populatedPhoto.url,
      title: populatedPhoto.title,
      author: populatedPhoto.author.name,
      avatar: populatedPhoto.author.avatar,
      authorId: populatedPhoto.author._id,
      likes: populatedPhoto.likes,
      comments: [],
      commentsCount: 0,
      tags: populatedPhoto.tags,
      isLiked: false,
      privacy: populatedPhoto.privacy,
      createdAt: populatedPhoto.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/photos/:id/like', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.likes += 1;
    await photo.save();

    res.json({ likes: photo.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/photos/:id/like', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.likes > 0) {
      photo.likes -= 1;
    }
    await photo.save();

    res.json({ likes: photo.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/photos/:id/comments', async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user) {
      user = await User.findOne({ name: 'Alex Chen' });
    }

    const comment = new Comment({
      user: user._id,
      photo: photo._id,
      text,
      parent: null
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      id: populatedComment._id,
      user: populatedComment.user.name,
      avatar: populatedComment.user.avatar,
      text: populatedComment.text,
      likes: populatedComment.likes,
      replies: []
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/comments/:id/replies', async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user) {
      user = await User.findOne({ name: 'Alex Chen' });
    }

    const reply = new Comment({
      user: user._id,
      photo: parentComment.photo,
      text,
      parent: parentComment._id
    });

    await reply.save();

    const populatedReply = await Comment.findById(reply._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      id: populatedReply._id,
      user: populatedReply.user.name,
      avatar: populatedReply.user.avatar,
      text: populatedReply.text,
      likes: populatedReply.likes,
      replies: []
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
