import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  title: string;
  url: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  privacy: 'public' | 'followers' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    privacy: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
  },
  { timestamps: true }
);

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);