import { Document } from 'mongoose';
export interface IArticle extends Document {
  title: string;
  content: any;
  author: {
    id: string;
    name: string;
  };
}
