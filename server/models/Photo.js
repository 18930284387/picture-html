import mongoose from 'mongoose'

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
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Photo', photoSchema)
