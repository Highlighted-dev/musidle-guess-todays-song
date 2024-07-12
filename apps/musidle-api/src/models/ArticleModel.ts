import { Schema, model, Document } from 'mongoose';

export interface IArticleModel extends Document {
  title: string;
  content: any;
  author: {
    id: string;
    name: string;
  };
}

const articleSchema: Schema = new Schema(
  {
    title: { type: String },
    content: { type: Schema.Types.Mixed },
    author: {
      type: {
        id: { type: String, required: true },
        name: { type: String, required: true },
      },
      required: true,
    },
  },
  { versionKey: false },
);

const articleModel = model<IArticleModel>('Article', articleSchema);

export { articleModel };
