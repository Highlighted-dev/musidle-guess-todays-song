import { Schema, model } from 'mongoose';
import { ISong } from '../@types/songs';

const songsSchema = new Schema<ISong>(
  {
    songId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    artist: { type: String },
    wasInDaily: { type: Boolean, default: false },
    key: { type: String, required: true },
  },
  { versionKey: false },
);
const songModel = model<ISong>('Songs', songsSchema, 'songs');
export default songModel;
