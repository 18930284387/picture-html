const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Photo = require('./models/Photo');
const Comment = require('./models/Comment');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelhub')
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase(); // Seed some initial data if empty
  })
  .catch(err => console.error('MongoDB connection error:', err));

// GET /api/photos
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Attach comments count for each photo
    const photosWithDetails = await Promise.all(photos.map(async (photo) => {
      const commentsCount = await Comment.countDocuments({ photo: photo._id });
      // The frontend expects the author to be a string and avatar to be a string.
      // So we map the populated author object.
      // also frontend expects `id` instead of `_id`.
      return {
        id: photo._id,
        url: photo.url,
        title: photo.title,
        author: photo.author ? photo.author.name : 'Unknown',
        avatar: photo.author ? photo.author.avatar : '',
        likes: photo.likes,
        comments: [], // Frontend requires an array or we can just pass an empty array to avoid undefined errors
        commentsCount,
        tags: photo.tags,
        isLiked: false
      };
    }));

    res.json(photosWithDetails);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/photos
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  try {
    const { title, tags } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    // Default user for now
    let user = await User.findOne();
    if (!user) {
      user = await User.create({ name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100' });
    }

    const photoUrl = `http://localhost:5000/uploads/${file.filename}`;

    const newPhoto = new Photo({
      url: photoUrl,
      title: title || 'Untitled',
      author: user._id,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
    });

    await newPhoto.save();
    
    // Return populated photo to immediately update frontend
    const populatedPhoto = await Photo.findById(newPhoto._id).populate('author', 'name avatar').lean();
    
    res.status(201).json({
      id: populatedPhoto._id,
      url: populatedPhoto.url,
      title: populatedPhoto.title,
      author: populatedPhoto.author.name,
      avatar: populatedPhoto.author.avatar,
      likes: populatedPhoto.likes,
      comments: [],
      tags: populatedPhoto.tags,
      isLiked: false
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper to seed initial data
async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding initial user...');
    const user = await User.create({
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
    });
    
    const photoCount = await Photo.countDocuments();
    if (photoCount === 0) {
      console.log('Seeding initial photos...');
      await Photo.create([
        {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400&h=600',
          title: 'Mountain Sunrise',
          author: user._id,
          likes: 342,
          tags: ['nature', 'mountains', 'sunrise']
        },
        {
          url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=500',
          title: 'Tokyo Nights',
          author: user._id,
          likes: 567,
          tags: ['urban', 'japan', 'night']
        }
      ]);
    }
  }
}
