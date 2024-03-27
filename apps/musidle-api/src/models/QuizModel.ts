import { Schema, model, Document } from 'mongoose';

export interface IQuizModel extends Document {
  question: string;
  answer: string;
  artistId: string;
  options: string[];
}

const quizSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    artistId: { type: String, required: true },
    options: { type: [String], required: true },
  },
  { versionKey: false },
);

const quizModel = model<IQuizModel>('Quizes', quizSchema);

export { quizModel };
