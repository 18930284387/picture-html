import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  photo: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  parentComment: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    photo: { type: Schema.Types.ObjectId, ref: 'Photo', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);