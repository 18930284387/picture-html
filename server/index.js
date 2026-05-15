import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import multer from 'multer'
import Comment from './models/Comment.js'
import Photo from './models/Photo.js'
import User from './models/User.js'

const PORT = Number(process.env.PORT || 3001)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pixelhub'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')

fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir)
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`
    callback(null, filename)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true)
      return
    }

    callback(new Error('Only image files are allowed'))
  }
})

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

const seedUsers = [
  {
    key: 'alex',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Photography enthusiast from San Francisco'
  },
  {
    key: 'yuki',
    name: 'Yuki Tanaka',
    email: 'yuki@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Urban photographer and traveler'
  },
  {
    key: 'maria',
    name: 'Maria Santos',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Capturing beaches and warm light'
  },
  {
    key: 'sarah',
    name: 'Sarah M.',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Landscape lover and storyteller'
  }
]

const seedPhotos = [
  {
    key: 'mountain-sunrise',
    title: 'Mountain Sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400&h=600',
    author: 'alex',
    likes: ['yuki', 'maria', 'sarah'],
    tags: ['nature', 'mountains', 'sunrise'],
    privacy: 'public'
  },
  {
    key: 'tokyo-nights',
    title: 'Tokyo Nights',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=500',
    author: 'yuki',
    likes: ['alex', 'maria'],
    tags: ['urban', 'japan', 'night'],
    privacy: 'public'
  },
  {
    key: 'tropical-beach',
    title: 'Tropical Beach',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400',
    author: 'maria',
    likes: ['alex', 'yuki', 'sarah'],
    tags: ['beach', 'tropical', 'ocean'],
    privacy: 'public'
  }
]

function parseTags(input) {
  if (Array.isArray(input)) {
    return input
      .flatMap(value => String(value).split(','))
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean)
  }

  if (typeof input === 'string') {
    const normalized = input.trim()

    if (!normalized) {
      return []
    }

    try {
      const parsed = JSON.parse(normalized)
      if (Array.isArray(parsed)) {
        return parsed.map(tag => String(tag).trim().toLowerCase()).filter(Boolean)
      }
    } catch {
    }

    return normalized
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean)
  }

  return []
}

function serializeUser(user) {
  if (!user) {
    return {
      id: '',
      name: 'Unknown User',
      avatar: ''
    }
  }

  return {
    id: user._id.toString(),
    name: user.name,
    avatar: user.avatar
  }
}

async function getSerializedPhotos(filter = {}) {
  const photos = await Photo.find(filter)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .lean()

  if (photos.length === 0) {
    return []
  }

  const photoIds = photos.map(photo => photo._id)
  const comments = await Comment.find({ photo: { $in: photoIds } })
    .populate('author', 'name avatar')
    .sort({ createdAt: 1 })
    .lean()

  const rootCommentsByPhoto = new Map()
  const repliesByParent = new Map()
  const commentsCountByPhoto = new Map()

  for (const comment of comments) {
    const photoId = comment.photo.toString()
    commentsCountByPhoto.set(photoId, (commentsCountByPhoto.get(photoId) || 0) + 1)

    if (comment.parentComment) {
      const parentId = comment.parentComment.toString()
      const siblings = repliesByParent.get(parentId) || []
      siblings.push(comment)
      repliesByParent.set(parentId, siblings)
      continue
    }

    const roots = rootCommentsByPhoto.get(photoId) || []
    roots.push(comment)
    rootCommentsByPhoto.set(photoId, roots)
  }

  const serializeComment = comment => ({
    id: comment._id.toString(),
    content: comment.content,
    likes: comment.likes.length,
    author: serializeUser(comment.author),
    replies: (repliesByParent.get(comment._id.toString()) || []).map(serializeComment)
  })

  return photos.map(photo => {
    const photoId = photo._id.toString()

    return {
      id: photoId,
      title: photo.title,
      imageUrl: photo.imageUrl,
      tags: photo.tags,
      privacy: photo.privacy,
      likes: photo.likes.length,
      commentsCount: commentsCountByPhoto.get(photoId) || 0,
      author: serializeUser(photo.author),
      comments: (rootCommentsByPhoto.get(photoId) || []).map(serializeComment),
      createdAt: photo.createdAt
    }
  })
}

async function getDefaultUploadUser() {
  const existing = await User.findOne({ email: 'alex@example.com' })

  if (existing) {
    return existing
  }

  return User.create({
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Photography enthusiast from San Francisco'
  })
}

async function ensureSeedData() {
  const photoCount = await Photo.countDocuments()
  if (photoCount > 0) {
    return
  }

  const usersByKey = {}
  for (const user of seedUsers) {
    const savedUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    )

    usersByKey[user.key] = savedUser
  }

  const photosByKey = {}
  for (const photo of seedPhotos) {
    const createdPhoto = await Photo.create({
      title: photo.title,
      imageUrl: photo.imageUrl,
      tags: photo.tags,
      privacy: photo.privacy,
      author: usersByKey[photo.author]._id,
      likes: photo.likes.map(key => usersByKey[key]._id)
    })

    photosByKey[photo.key] = createdPhoto
  }

  const firstComment = await Comment.create({
    photo: photosByKey['mountain-sunrise']._id,
    author: usersByKey.sarah._id,
    content: 'Absolutely stunning! The colors are incredible.',
    likes: [usersByKey.alex._id, usersByKey.maria._id]
  })

  await Comment.create({
    photo: photosByKey['mountain-sunrise']._id,
    author: usersByKey.alex._id,
    content: 'Thank you! Shot at golden hour.',
    likes: [usersByKey.sarah._id],
    parentComment: firstComment._id
  })

  await Comment.create({
    photo: photosByKey['tokyo-nights']._id,
    author: usersByKey.alex._id,
    content: 'The neon reflections look amazing.',
    likes: [usersByKey.yuki._id]
  })
}

app.get('/api/photos', async (_req, res, next) => {
  try {
    const data = await getSerializedPhotos()
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

app.post('/api/photos', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Image file is required' })
      return
    }

    const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''

    if (!title) {
      res.status(400).json({ message: 'Title is required' })
      return
    }

    const author = await getDefaultUploadUser()
    const photo = await Photo.create({
      title,
      imageUrl: `/uploads/${req.file.filename}`,
      tags: parseTags(req.body.tags),
      privacy: typeof req.body.privacy === 'string' ? req.body.privacy : 'public',
      author: author._id,
      likes: []
    })

    const [data] = await getSerializedPhotos({ _id: photo._id })
    res.status(201).json({ data })
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message })
    return
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message })
    return
  }

  res.status(500).json({ message: 'Unexpected server error' })
})

async function start() {
  await mongoose.connect(MONGODB_URI)
  await ensureSeedData()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch(error => {
  console.error('Failed to start server', error)
  process.exit(1)
})
