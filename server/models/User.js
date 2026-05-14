import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text for simplicity in this demo
  avatar: { type: String },
  bio: { type: String },
  followers: [String],
  following: [String]
});

export const User = mongoose.model('User', UserSchema);
