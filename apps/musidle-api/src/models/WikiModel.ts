import { Document, Schema, model } from 'mongoose';

export interface IWikiModel extends Document {
  name: string;
  coverImage: {
    url: string;
    copyright: {
      creatorUrl: string;
      creatorName: string;
      licenseName: string;
      licenseUrl: string;
      serviceName: string;
    };
  };
  description: string;
  shortDescription: string;
  notableAlbums: string[];
  popularSongs: string[];
  relatedArtists: string[];
  tags: string[];
}

const wikiSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    coverImage: {
      type: {
        url: { type: String, required: true },
        copyright: {
          type: {
            creatorUrl: { type: String, required: true },
            creatorName: { type: String, required: true },
            licenseName: { type: String, required: true },
            licenseUrl: { type: String, required: true },
            serviceName: { type: String, required: true },
          },
          required: false,
        },
      },
    },
    description: { type: String },
    shortDescription: { type: String },
    notableAlbums: { type: [], required: false },
    popularSongs: { type: [], required: false },
    relatedArtists: { type: [], required: false },
    tags: { type: [], required: false },
  },
  { versionKey: false },
);
const wikoModel = model<IWikiModel>('Wikis', wikiSchema, 'wikis');
export default wikoModel;
