import { model, Schema } from 'mongoose';
import { IUser } from '../@types/user';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    token: { type: String, required: true },
    activated: { type: Boolean, default: false },
    guild: {
      _id: { type: String, default: null },
      name: { type: String, default: null },
    },
  },
  { versionKey: false, timestamps: true },
);

const userModel = model<IUser>('Users', userSchema, 'userData');
export default userModel;
