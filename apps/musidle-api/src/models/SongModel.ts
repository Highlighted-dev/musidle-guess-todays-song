import { Schema, model } from 'mongoose';
import { ISong } from '../@types/song';

const songsSchema = new Schema<ISong>(
  {
    song_id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    key: { type: String, required: true },
  },
  { versionKey: false },
);
const songModel = model<ISong>('Songs', songsSchema, 'songs');
export default songModel;
