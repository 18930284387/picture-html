import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    avatar: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', userSchema)
