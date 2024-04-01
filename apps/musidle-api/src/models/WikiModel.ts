import { Document, Schema, model } from 'mongoose';

export interface IWikiModel extends Document {
  name: string;
  coverImage: { url: string; creator: string };
  description: string;
  notableAlbums: string[];
  popularSongs: string[];
  relatedArtists: string[];
  tags: string[];
}

const wikiSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    coverImage: { type: { url: String, creator: String }, required: false },
    description: { type: String, required: true },
    notableAlbums: { type: [], required: false },
    popularSongs: { type: [], required: false },
    relatedArtists: { type: [], required: false },
    tags: { type: [], required: false },
  },
  { versionKey: false },
);
const wikoModel = model<IWikiModel>('Wikis', wikiSchema, 'wikis');
export default wikoModel;
