import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  user: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

const CommentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  user: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  replies: [ReplySchema]
});

const PhotoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  avatar: { type: String },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
  tags: [String],
  isLiked: { type: Boolean, default: false } // Note: In a real app, this would be computed based on the logged-in user
});

export const Photo = mongoose.model('Photo', PhotoSchema);
