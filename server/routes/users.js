import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100', // Default avatar
      bio: 'New user on PixelHub'
    });

    const savedUser = await user.save();
    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
