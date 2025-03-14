import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  slug: string;
  userId: mongoose.Types.ObjectId | null;
  visits: number;
  createdAt: Date;
  lastVisited: Date | null;
}

const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  visits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastVisited: {
    type: Date,
    default: null,
  },
});

export default mongoose.model<IUrl>('Url', urlSchema);
