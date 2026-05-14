import express from 'express';
import { Photo } from '../models/Photo.js';

const router = express.Router();

// Get all photos
router.get('/', async (req, res) => {
  try {
    // Sort by id descending to show newest first
    const photos = await Photo.find().sort({ id: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a photo
router.post('/', async (req, res) => {
  const photo = new Photo({
    id: Date.now(),
    ...req.body
  });

  try {
    const newPhoto = await photo.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like/Unlike a photo
router.put('/:id/like', async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: Number(req.params.id) });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    photo.isLiked = !photo.isLiked;
    photo.likes = photo.isLiked ? photo.likes + 1 : photo.likes - 1;
    
    const updatedPhoto = await photo.save();
    res.json(updatedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a comment
router.post('/:id/comments', async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: Number(req.params.id) });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    const newComment = {
      id: Date.now(),
      ...req.body
    };

    photo.comments.push(newComment);
    const updatedPhoto = await photo.save();
    res.status(201).json(updatedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a reply to a comment
router.post('/:photoId/comments/:commentId/replies', async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: Number(req.params.photoId) });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    const comment = photo.comments.find(c => c.id === Number(req.params.commentId));
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const newReply = {
      id: Date.now(),
      ...req.body
    };

    comment.replies.push(newReply);
    const updatedPhoto = await photo.save();
    res.status(201).json(updatedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
