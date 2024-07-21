import { model, Schema } from 'mongoose';
import { IUser } from '../@types/user';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    guild: {
      _id: { type: String, default: null },
      name: { type: String, default: null },
    },
    settings: {
      volume: { type: Number, default: 0.25 },
    },
    stats: {
      correctAnswers: { type: Number, default: 0 },
      wrongAnswers: { type: Number, default: 0 },
      totalAnswers: { type: Number, default: 0 },
      totalGames: { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 },
    },
  },
  { versionKey: false, timestamps: true },
);

const userModel = model<IUser>('Users', userSchema, 'users');
export default userModel;
