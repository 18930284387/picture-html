import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    privacy: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const Photo = mongoose.models.Photo || mongoose.model('Photo', photoSchema);
