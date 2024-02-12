import { Schema, model, Document } from 'mongoose';

export interface IImagesModel extends Document {
  url: string;
  name: string;
  description: string;
  type: string;
}

const imagesSchema: Schema = new Schema(
  {
    url: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String, required: true },
  },
  { versionKey: false },
);

const imagesModel = model<IImagesModel>('Image', imagesSchema);

export { imagesModel };
