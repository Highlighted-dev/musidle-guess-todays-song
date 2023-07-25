import { Schema, model } from 'mongoose';

interface IAnswersModel {
  song_id: string;
  value: string;
  key: string;
}

const answersSchema = new Schema<IAnswersModel>(
  {
    song_id: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    key: { type: String, required: true },
  },
  { versionKey: false },
);
const answersModel = model<IAnswersModel>('Answers', answersSchema, 'answers');
export default answersModel;
