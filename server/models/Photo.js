import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  privacy: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

photoSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'photo',
  count: true
});

photoSchema.set('toJSON', { virtuals: true });
photoSchema.set('toObject', { virtuals: true });

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;
