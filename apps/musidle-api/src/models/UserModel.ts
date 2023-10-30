import { model, Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  token: string;
  activated: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    token: { type: String, required: true },
    activated: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

const userModel = model<IUser>('Users', userSchema, 'userData');
export default userModel;
