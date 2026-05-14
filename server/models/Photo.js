import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

photoSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

photoSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

photoSchema.set('toJSON', { virtuals: true });
photoSchema.set('toObject', { virtuals: true });

export default mongoose.model('Photo', photoSchema);
