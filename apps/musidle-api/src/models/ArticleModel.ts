import { Schema, model, Document } from 'mongoose';

export interface IArticleModel extends Document {
  title: string;
  content: any;
  author: {
    _id: string;
    username: string;
  };
}

const articleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    author: { type: Object, required: true },
  },
  { versionKey: false },
);

const articleModel = model<IArticleModel>('Article', articleSchema);

export { articleModel };
