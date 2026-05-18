import { Comment } from './models/Comment.js';
import { Photo } from './models/Photo.js';
import { User } from './models/User.js';

const seedUsers = [
  {
    email: 'alex@example.com',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Photography enthusiast from San Francisco'
  },
  {
    email: 'sarah@example.com',
    name: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Landscape lover'
  },
  {
    email: 'yuki@example.com',
    name: 'Yuki Tanaka',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Tokyo street photographer'
  },
  {
    email: 'maria@example.com',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Travel storyteller'
  },
  {
    email: 'david@example.com',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Cityscape explorer'
  },
  {
    email: 'emma@example.com',
    name: 'Emma Green',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Forest hiker and photographer'
  },
  {
    email: 'lars@example.com',
    name: 'Lars Olsen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Northern sky chaser'
  },
  {
    email: 'chris@example.com',
    name: 'Chris Wong',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Color and light seeker'
  },
  {
    email: 'jenny@example.com',
    name: 'Jenny Liu',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=100&h=100',
    bio: 'Portrait artist'
  }
];

const seedPhotos = [
  {
    title: 'Mountain Sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400&h=600',
    authorEmail: 'alex@example.com',
    tags: ['nature', 'mountains', 'sunrise'],
    likesCount: 342,
    privacy: 'public'
  },
  {
    title: 'Tokyo Nights',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=500',
    authorEmail: 'yuki@example.com',
    tags: ['urban', 'japan', 'night'],
    likesCount: 567,
    privacy: 'public'
  },
  {
    title: 'Tropical Beach',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400',
    authorEmail: 'maria@example.com',
    tags: ['beach', 'tropical', 'ocean'],
    likesCount: 891,
    privacy: 'public'
  },
  {
    title: 'City Lights',
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=400&h=550',
    authorEmail: 'david@example.com',
    tags: ['city', 'architecture', 'urban'],
    likesCount: 234,
    privacy: 'public'
  },
  {
    title: 'Forest Path',
    imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c036bc0a9a?auto=format&fit=crop&q=80&w=400&h=650',
    authorEmail: 'emma@example.com',
    tags: ['forest', 'nature', 'hiking'],
    likesCount: 1234,
    privacy: 'public'
  },
  {
    title: 'Aurora Dreams',
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=400&h=450',
    authorEmail: 'lars@example.com',
    tags: ['aurora', 'night', 'northern'],
    likesCount: 2341,
    privacy: 'public'
  },
  {
    title: 'Autumn Colors',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400&h=500',
    authorEmail: 'chris@example.com',
    tags: ['autumn', 'forest', 'colors'],
    likesCount: 456,
    privacy: 'public'
  },
  {
    title: 'Portrait Study',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=600',
    authorEmail: 'jenny@example.com',
    tags: ['portrait', 'people', 'bw'],
    likesCount: 789,
    privacy: 'public'
  }
];

const seedComments = [
  {
    tempId: 'comment-1',
    photoTitle: 'Mountain Sunrise',
    authorEmail: 'sarah@example.com',
    content: 'Absolutely stunning! The colors are incredible.',
    likesCount: 24,
    parentTempId: null
  },
  {
    tempId: 'comment-2',
    photoTitle: 'Mountain Sunrise',
    authorEmail: 'alex@example.com',
    content: 'Thank you! Shot at golden hour.',
    likesCount: 8,
    parentTempId: 'comment-1'
  }
];

export async function seedDatabase() {
  const existingPhotos = await Photo.countDocuments();

  if (existingPhotos > 0) {
    return;
  }

  const userMap = new Map();

  for (const userData of seedUsers) {
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    userMap.set(userData.email, user);
  }

  const photoMap = new Map();

  for (const photoData of seedPhotos) {
    const photo = await Photo.create({
      title: photoData.title,
      imageUrl: photoData.imageUrl,
      author: userMap.get(photoData.authorEmail)._id,
      tags: photoData.tags,
      likesCount: photoData.likesCount,
      privacy: photoData.privacy
    });

    photoMap.set(photoData.title, photo);
  }

  const commentMap = new Map();

  for (const commentData of seedComments) {
    const comment = await Comment.create({
      photo: photoMap.get(commentData.photoTitle)._id,
      author: userMap.get(commentData.authorEmail)._id,
      content: commentData.content,
      likesCount: commentData.likesCount,
      parentComment: commentData.parentTempId ? commentMap.get(commentData.parentTempId)?._id ?? null : null
    });

    commentMap.set(commentData.tempId, comment);
  }
}
