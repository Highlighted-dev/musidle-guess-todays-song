import { Schema, model } from 'mongoose';

interface ICategoryModel {
  category: string;
}

const categorySchema = new Schema<ICategoryModel>(
  {
    category: { type: String, required: true },
  },
  { versionKey: false },
);
const categoryModel = model<ICategoryModel>('Categories', categorySchema, 'categories');
export default categoryModel;
