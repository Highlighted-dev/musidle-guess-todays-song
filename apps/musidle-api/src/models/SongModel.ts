import { Schema, model } from 'mongoose';

interface ISongModel {
  song_id: string;
  category: string;
  value: string;
  key: string;
}

const songsSchema = new Schema<ISongModel>(
  {
    song_id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    key: { type: String, required: true },
  },
  { versionKey: false },
);
const songModel = model<ISongModel>('Songs', songsSchema, 'songs');
export default songModel;
